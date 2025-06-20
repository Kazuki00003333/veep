"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download } from "lucide-react"
import { alertsData } from "@/lib/dummy-data"
import Link from "next/link"

export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")

  const filteredAlerts = alertsData.filter((alert) => {
    const matchesSearch =
      alert.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.person.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter
    const matchesLevel = levelFilter === "all" || alert.level === levelFilter

    return matchesSearch && matchesStatus && matchesLevel
  })

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="destructive" className="bg-red-500 hover:bg-red-600">未対応</Badge>
      case "in_progress":
        return <Badge variant="secondary" className="bg-orange-500 hover:bg-orange-600 text-white">対応中</Badge>
      case "resolved":
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">解決済み</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">アラート一覧</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">発生したアラートの詳細情報と対応状況を管理できます</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>アラート管理</CardTitle>
          <CardDescription>キーワード検出によるアラート一覧</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="キーワード、部署名、担当者名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="対応状況" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての状況</SelectItem>
                <SelectItem value="pending">未対応</SelectItem>
                <SelectItem value="in_progress">対応中</SelectItem>
                <SelectItem value="resolved">解決済み</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="注意レベル" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのレベル</SelectItem>
                <SelectItem value="high">高</SelectItem>
                <SelectItem value="medium">中</SelectItem>
                <SelectItem value="low">低</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              エクスポート
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>発生日時</TableHead>
                  <TableHead>キーワード</TableHead>
                  <TableHead>監視対象部署</TableHead>
                  <TableHead>対象者名</TableHead>
                  <TableHead>注意レベル</TableHead>
                  <TableHead>対応ステータス</TableHead>
                  <TableHead>アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.id}</TableCell>
                    <TableCell>{alert.datetime}</TableCell>
                    <TableCell className="max-w-xs truncate">{alert.keyword}</TableCell>
                    <TableCell>{alert.department}</TableCell>
                    <TableCell>{alert.person}</TableCell>
                    <TableCell>{getLevelBadge(alert.level)}</TableCell>
                    <TableCell>{getStatusBadge(alert.status)}</TableCell>
                    <TableCell>
                      <Link href={`/alerts/${alert.id}`}>
                        <Button variant="outline" size="sm">
                          詳細
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAlerts.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              条件に一致するアラートが見つかりませんでした
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}