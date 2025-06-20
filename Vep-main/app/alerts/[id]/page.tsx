"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Clock,
  AlertTriangle,
  User,
  Building2,
  Calendar,
  Tag,
  CheckCircle,
  Pause,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { alertsData, alertDetailData } from "@/lib/dummy-data"

export default function AlertDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [status, setStatus] = useState("pending")
  const [note, setNote] = useState("")
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const alertId = params?.id as string
  const alert = alertsData.find((a) => a.id === alertId)
  const detailData = alertDetailData[alertId]

  useEffect(() => {
    try {
      console.log("Alert ID:", alertId)
      console.log("Found alert:", alert)
      console.log("Detail data:", detailData)

      if (alert) {
        if (status === "pending" && alert.status !== "pending") {
          setStatus(alert.status)
        }
      }
      setIsLoading(false)
    } catch (err) {
      console.error("Error in AlertDetailPage:", err)
      setError(err instanceof Error ? err.message : "不明なエラーが発生しました")
      setIsLoading(false)
    }
  }, [alertId, alert, detailData, status])

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">読み込み中...</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">アラート情報を取得しています</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">エラーが発生しました</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
        </div>
      </div>
    )
  }

  if (!alert || !detailData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">アラートが見つかりません</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">ID: {alertId}</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
        </div>
      </div>
    )
  }

  const highlightKeywords = (text: string, keywords: string[]) => {
    let highlightedText = text
    keywords.forEach((keyword) => {
      const regex = new RegExp(`(${keyword})`, "gi")
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-red-200 dark:bg-red-800 px-1 rounded font-medium">$1</mark>',
      )
    })
    return highlightedText
  }

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case "gmail":
        return <Mail className="h-4 w-4 text-red-500" />
      case "chat":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">
            <Pause className="h-3 w-3 mr-1" />
            未対応
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="secondary" className="bg-orange-500 hover:bg-orange-600 text-white">
            <Clock className="h-3 w-3 mr-1" />
            対応中
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            解決済み
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "high":
        return <Badge variant="destructive">高</Badge>
      case "medium":
        return <Badge variant="secondary">中</Badge>
      case "low":
        return <Badge variant="outline">低</Badge>
      default:
        return <Badge variant="outline">{level}</Badge>
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          アラート一覧に戻る
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">アラート詳細</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">ID: {alert?.id || alertId}</p>
          </div>
          <div className="flex items-center space-x-2">
            {alert && getLevelBadge(alert.level)}
            {getStatusBadge(status)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alert Summary */}
          <Collapsible open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                      アラート概要
                    </CardTitle>
                    {isSummaryOpen ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <div className="space-y-6">
                    {/* 自社情報セクション */}
                    <div>
                      <div className="flex items-center mb-3">
                        <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                        <h3 className="text-lg font-semibold text-blue-600">自社情報</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">対象者</div>
                          <div className="flex items-center font-medium">
                            <User className="h-4 w-4 mr-2" />
                            {alert?.person || "不明"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">部署</div>
                          <div className="flex items-center font-medium">
                            <Building2 className="h-4 w-4 mr-2" />
                            {alert?.department || "不明"}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">検出キーワード</div>
                          <div className="font-medium">{alert?.keyword || "不明"}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">発生日時</div>
                          <div className="font-medium">{alert?.datetime || "不明"}</div>
                        </div>
                      </div>
                    </div>

                    {/* クライアント情報セクション */}
                    {alert && (alert.customerName || alert.customerCompany || alert.customerEmail) && (
                      <div>
                        <div className="flex items-center mb-3">
                          <User className="h-4 w-4 mr-2 text-green-600" />
                          <h3 className="text-lg font-semibold text-green-600">クライアント情報</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          {alert.customerName && (
                            <div>
                              <div className="text-sm font-medium text-gray-500 mb-1">顧客名</div>
                              <div className="font-medium">{alert.customerName}</div>
                            </div>
                          )}
                          {alert.customerCompany && (
                            <div>
                              <div className="text-sm font-medium text-gray-500 mb-1">会社名</div>
                              <div className="font-medium">{alert.customerCompany}</div>
                            </div>
                          )}
                          {alert.customerEmail && (
                            <div className="col-span-2">
                              <div className="text-sm font-medium text-gray-500 mb-1">メールアドレス</div>
                              <div className="font-medium">{alert.customerEmail}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Detection Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                検出詳細
              </CardTitle>
              <CardDescription>キーワードが検出されたツールとタイミング</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {detailData?.detections?.map((detection: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {getToolIcon(detection.tool)}
                    <div className="flex-1">
                      <div className="font-medium">{detection.toolName}</div>
                      <div className="text-sm text-gray-500">{detection.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{detection.timestamp}</div>
                      <div className="text-xs text-gray-500">検出</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Message History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                メッセージ履歴
              </CardTitle>
              <CardDescription>前後の文脈を含むメッセージのやり取り</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {detailData?.messages?.map((message: any, index: number) => (
                  <div key={index} className="space-y-3">
                    <div className={`flex ${message.sender === "self" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] ${message.sender === "self" ? "order-2" : "order-1"}`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.name} />
                            <AvatarFallback>{message.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{message.name}</span>
                          <span className="text-xs text-gray-500">{message.timestamp}</span>
                          {getToolIcon(message.tool)}
                        </div>
                        <div
                          className={`p-3 rounded-lg ${
                            message.sender === "self" ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-700"
                          } ${message.isAlert ? "ring-2 ring-red-500" : ""}`}
                          dangerouslySetInnerHTML={{
                            __html: message.isAlert
                              ? highlightKeywords(message.content, [alert?.keyword || ""])
                              : message.content,
                          }}
                        />
                        {message.isAlert && (
                          <div className="mt-2 flex items-center text-xs text-red-600 dark:text-red-400">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            アラートキーワード検出
                          </div>
                        )}
                      </div>
                    </div>
                    {index < (detailData?.messages?.length || 0) - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Action Panel */}
          <Card>
            <CardHeader>
              <CardTitle>対応アクション</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">ステータス変更</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">未対応</SelectItem>
                    <SelectItem value="in_progress">対応中</SelectItem>
                    <SelectItem value="resolved">解決済み</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">対応メモ</label>
                <Textarea
                  placeholder="対応内容や備考を入力してください..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Button className="w-full" onClick={() => {
                  setStatus("resolved");
                  const target = alertsData.find((a) => a.id === alertId);
                  if (target) target.status = "resolved";
                }}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  対応完了
                </Button>
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  担当者に転送
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  フォローアップ設定
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Information */}
          <Card>
            <CardHeader>
              <CardTitle>関連情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">類似アラート</div>
                <div className="text-sm">過去30日間: 3件</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">対象者の他のアラート</div>
                <div className="text-sm">今月: 2件</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">部署全体のアラート</div>
                <div className="text-sm">今週: 8件</div>
              </div>
              <Separator />
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">推奨アクション</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  • 48時間以内にフォローアップ
                  <br />• 上長への報告を検討
                  <br />• クライアント満足度確認
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
