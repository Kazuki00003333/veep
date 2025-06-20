"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit, Trash2, Calendar as CalendarIcon } from "lucide-react"
import { keywordCategories, keywordTemplates } from "@/lib/dummy-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { Checkbox } from "@/components/ui/checkbox"

export default function KeywordsPage() {
  const [categories, setCategories] = useState(keywordCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])
  const [templateFilter, setTemplateFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [latentTypeFilter, setLatentTypeFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'category' | 'keyword', categoryIndex: number, keywordIndex?: number } | null>(null)
  const [formData, setFormData] = useState({
    category: "",
    level: "medium",
    latentType: "潜在",
    notificationDelay: "0",
    keywords: "",
    notificationType: "delay", // "delay" | "calendar" | "weekday"
    selectedDates: [] as Date[],
    selectedWeekdays: [] as number[], // 0=日曜日, 1=月曜日, ...
    customNotificationText: ""
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [currentLevelFilter, setCurrentLevelFilter] = useState("all")
  const [currentLatentTypeFilter, setCurrentLatentTypeFilter] = useState("all")

  const handleAddCategory = () => {
    setEditingCategory(null)
    setFormData({
      category: "",
      level: "medium",
      latentType: "潜在",
      notificationDelay: "0",
      keywords: "",
      notificationType: "delay",
      selectedDates: [],
      selectedWeekdays: [],
      customNotificationText: ""
    })
    setIsDialogOpen(true)
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setFormData({
      category: category.category,
      level: category.level,
      latentType: category.latentType,
      notificationDelay: category.notificationDelay?.toString() || "0",
      keywords: category.keywords?.join("\n") || "",
      notificationType: category.notificationType || "delay",
      selectedDates: category.selectedDates ? category.selectedDates.map((date: string) => new Date(date)) : [],
      selectedWeekdays: category.selectedWeekdays || [],
      customNotificationText: category.customNotificationText || ""
    })
    setIsDialogOpen(true)
  }

  const handleDeleteCategory = (index: number) => {
    setDeleteTarget({ type: 'category', categoryIndex: index })
    setDeleteDialogOpen(true)
  }

  const handleDeleteKeyword = (categoryIndex: number, keywordIndex: number) => {
    setDeleteTarget({ type: 'keyword', categoryIndex, keywordIndex })
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = () => {
    if (!deleteTarget) return

    if (deleteTarget.type === 'category') {
      setCategories((prev) => prev.filter((_, i) => i !== deleteTarget.categoryIndex))
    } else if (deleteTarget.type === 'keyword' && deleteTarget.keywordIndex !== undefined) {
      setCategories((prev) => {
        const newCategories = [...prev]
        newCategories[deleteTarget.categoryIndex] = {
          ...newCategories[deleteTarget.categoryIndex],
          keywords: newCategories[deleteTarget.categoryIndex].keywords.filter((_, i) => i !== deleteTarget.keywordIndex)
        }
        return newCategories
      })
    }

    setDeleteDialogOpen(false)
    setDeleteTarget(null)
  }

  const filteredTemplates = keywordTemplates.filter((template) => {
    const categoryMatch = templateFilter === "all" || template.usage === templateFilter
    const levelMatch = levelFilter === "all" || template.level === levelFilter
    const latentTypeMatch = latentTypeFilter === "all" || template.latentType === latentTypeFilter
    return categoryMatch && levelMatch && latentTypeMatch
  })

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplates((prev) =>
      prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId],
    )
  }

  const handleTemplateButtonSelect = (templateId: string) => {
    setSelectedTemplates((prev) =>
      prev.includes(templateId) ? prev.filter((id) => id !== templateId) : [...prev, templateId],
    )
  }

  const handleApplyTemplates = () => {
    const newCategories = keywordTemplates
      .filter((template) => selectedTemplates.includes(template.id))
      .map((template) => ({
        category: template.category,
        keywords: template.keywords,
        level: template.level,
        latentType: template.latentType,
        notificationDelay: template.notificationDelay || 0,
      }))

    setCategories((prev) => [...prev, ...newCategories])
    setSelectedTemplates([])
  }

  const handleFilterChange = (filterType: 'category' | 'level', value: string) => {
    if (filterType === 'category') {
      setTemplateFilter(value)
    } else {
      setLevelFilter(value)
    }
    // フィルター変更時に選択をクリア
    setSelectedTemplates([])
  }

  const getTemplateUsageBadge = (usage: string) => {
    const colors: { [key: string]: string } = {
      "営業プロセス": "bg-blue-100 text-blue-800",
      "クライアント対応": "bg-red-100 text-red-800",
      "契約・商談": "bg-green-100 text-green-800",
      "サポート・技術": "bg-purple-100 text-purple-800",
      "プロジェクト管理": "bg-orange-100 text-orange-800",
      "コミュニケーション": "bg-teal-100 text-teal-800",
      "競合・市場": "bg-pink-100 text-pink-800",
      "営業活動": "bg-indigo-100 text-indigo-800",
      "サポート・教育": "bg-cyan-100 text-cyan-800",
      "緊急対応": "bg-red-100 text-red-800",
      "品質管理": "bg-yellow-100 text-yellow-800",
      "戦略・計画": "bg-gray-100 text-gray-800",
      "法務・規制": "bg-purple-100 text-purple-800",
      "効果測定": "bg-green-100 text-green-800",
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[usage] || "bg-gray-100 text-gray-800"}`}>
        {usage}
      </span>
    )
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

  const handleSaveCategory = () => {
    const newCategory = {
      category: formData.category,
      level: formData.level,
      latentType: formData.latentType,
      notificationDelay: parseInt(formData.notificationDelay),
      keywords: formData.keywords.split('\n').filter(k => k.trim() !== ''),
      notificationType: formData.notificationType,
      selectedDates: formData.selectedDates.map(date => date.toISOString()),
      selectedWeekdays: formData.selectedWeekdays,
      customNotificationText: formData.customNotificationText
    }

    if (editingCategory) {
      // 編集モード
      setCategories(prev => prev.map(cat => 
        cat === editingCategory ? newCategory : cat
      ))
    } else {
      // 新規追加モード
      setCategories(prev => [...prev, newCategory])
    }

    setIsDialogOpen(false)
    setEditingCategory(null)
  }

  const getNotificationDisplay = (category: any) => {
    if (category.notificationType === "calendar" && category.selectedDates?.length > 0) {
      return `指定日: ${category.selectedDates.length}日`
    } else if (category.notificationType === "weekday" && category.selectedWeekdays?.length > 0) {
      const weekdays = ["日", "月", "火", "水", "木", "金", "土"]
      const selectedDays = category.selectedWeekdays.map((day: number) => weekdays[day]).join(", ")
      return `毎週${selectedDays}`
    } else {
      return category.notificationDelay === 0 ? "即座に通知" : `${category.notificationDelay}日後に通知`
    }
  }

  const filteredCategories = categories.filter((category: any) => {
    const searchMatch = searchQuery === "" || 
      category.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.keywords.some((keyword: string) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const levelMatch = currentLevelFilter === "all" || category.level === currentLevelFilter
    const latentTypeMatch = currentLatentTypeFilter === "all" || category.latentType === currentLatentTypeFilter
    
    return searchMatch && levelMatch && latentTypeMatch
  })

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">キーワード設定</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">監視対象のキーワードとアラートレベルを管理できます</p>
        
        {/* 潜在・顕在の説明 */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-800 dark:text-blue-200 flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                潜在リスク
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                まだ問題として表面化していないが、将来的にトラブルになる可能性があるキーワード。
                例：「検討中です」「確認が取れ次第」「少々お待ちください」
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-red-800 dark:text-red-200 flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                顕在リスク
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-red-700 dark:text-red-300">
                既に問題が発生している、または明確なトラブルの兆候を示すキーワード。
                例：「問題があります」「満足できません」「解約を検討しています」
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList>
          <TabsTrigger value="current">現在の設定</TabsTrigger>
          <TabsTrigger value="templates">テンプレート選択</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <Button onClick={handleAddCategory}>
                <Plus className="h-4 w-4 mr-2" />
                新しいカテゴリを追加
              </Button>
            </div>
            
            {/* 検索・フィルター */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search" className="text-sm font-medium">検索</Label>
                    <Input
                      id="search"
                      placeholder="カテゴリ名やキーワードで検索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-level-filter" className="text-sm font-medium">優先度</Label>
                    <Select value={currentLevelFilter} onValueChange={setCurrentLevelFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="すべての優先度" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべての優先度</SelectItem>
                        <SelectItem value="high">高優先度</SelectItem>
                        <SelectItem value="medium">中優先度</SelectItem>
                        <SelectItem value="low">低優先度</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current-latent-filter" className="text-sm font-medium">リスクタイプ</Label>
                    <Select value={currentLatentTypeFilter} onValueChange={setCurrentLatentTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="すべてのリスクタイプ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべてのリスクタイプ</SelectItem>
                        <SelectItem value="潜在">潜在リスク</SelectItem>
                        <SelectItem value="顕在">顕在リスク</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">結果</Label>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {filteredCategories.length}件のカテゴリ
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                      <CardDescription>{category.keywords.length}個のキーワード</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getLevelBadge(category.level)}
                      <Badge variant="outline" className="text-xs">
                        {category.latentType || "未分類"}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {getNotificationDisplay(category)}
                      </Badge>
                      <Button variant="ghost" size="sm" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(index)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.keywords.map((keyword, keywordIndex) => (
                      <div
                        key={keywordIndex}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                      >
                        <span className="text-sm">{keyword}</span>
                        <Button variant="ghost" size="sm" onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteKeyword(index, keywordIndex)
                        }}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery || currentLevelFilter !== "all" || currentLatentTypeFilter !== "all" 
                  ? "条件に一致するカテゴリが見つかりませんでした"
                  : "カテゴリが設定されていません"
                }
              </div>
              {searchQuery || currentLevelFilter !== "all" || currentLatentTypeFilter !== "all" ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("")
                    setCurrentLevelFilter("all")
                    setCurrentLatentTypeFilter("all")
                  }}
                >
                  フィルターをクリア
                </Button>
              ) : (
                <Button onClick={handleAddCategory}>
                  <Plus className="h-4 w-4 mr-2" />
                  最初のカテゴリを追加
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>テンプレートから選択</CardTitle>
                  <CardDescription>50種類のテンプレートから簡単にキーワードカテゴリを追加できます</CardDescription>
                </div>
                <div className="flex items-center space-x-4">
                  <Select value={templateFilter} onValueChange={(value) => handleFilterChange('category', value)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="カテゴリで絞り込み" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべてのカテゴリ</SelectItem>
                      <SelectItem value="新規開拓">新規開拓</SelectItem>
                      <SelectItem value="提案活動">提案活動</SelectItem>
                      <SelectItem value="商談・交渉">商談・交渉</SelectItem>
                      <SelectItem value="既存顧客管理">既存顧客管理</SelectItem>
                      <SelectItem value="営業プロセス管理">営業プロセス管理</SelectItem>
                      <SelectItem value="顧客対応">顧客対応</SelectItem>
                      <SelectItem value="市場分析">市場分析</SelectItem>
                      <SelectItem value="チーム管理">チーム管理</SelectItem>
                      <SelectItem value="その他">その他</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={levelFilter} onValueChange={(value) => handleFilterChange('level', value)}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="優先度で絞り込み" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべての優先度</SelectItem>
                      <SelectItem value="high">高優先度</SelectItem>
                      <SelectItem value="medium">中優先度</SelectItem>
                      <SelectItem value="low">低優先度</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={latentTypeFilter} onValueChange={setLatentTypeFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="リスクタイプで絞り込み" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべてのリスクタイプ</SelectItem>
                      <SelectItem value="潜在">潜在リスク（予防的対応）</SelectItem>
                      <SelectItem value="顕在">顕在リスク（緊急対応）</SelectItem>
                    </SelectContent>
                  </Select>
                  {selectedTemplates.length > 0 && (
                    <Button onClick={handleApplyTemplates}>
                      選択したテンプレートを適用 ({selectedTemplates.length}件)
                    </Button>
                  )}
                </div>
              </div>
              
              {/* リスクタイプの説明 */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-blue-800 dark:text-blue-200">潜在リスク</div>
                    <div className="text-xs text-blue-600 dark:text-blue-300">予防的対応が必要なキーワード</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-red-800 dark:text-red-200">顕在リスク</div>
                    <div className="text-xs text-red-600 dark:text-red-300">緊急対応が必要なキーワード</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      selectedTemplates.includes(template.id)
                        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => handleTemplateButtonSelect(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{template.category}</h4>
                          <div className="flex items-center space-x-2">
                            {getLevelBadge(template.level)}
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${
                                template.latentType === "潜在" 
                                  ? "border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300" 
                                  : "border-red-300 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-300"
                              }`}
                            >
                              {template.latentType}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {template.notificationDelay === 0 ? "即座に通知" : `${template.notificationDelay}日後に通知`}
                            </Badge>
                            <Button
                              variant={selectedTemplates.includes(template.id) ? "default" : "outline"}
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTemplateButtonSelect(template.id)
                              }}
                            >
                              {selectedTemplates.includes(template.id) ? "選択中" : "選択"}
                            </Button>
                          </div>
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-400">{template.description}</p>

                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500">キーワード例:</div>
                          <div className="flex flex-wrap gap-1">
                            {template.keywords.slice(0, 3).map((keyword, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                {keyword}
                              </span>
                            ))}
                            {template.keywords.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                                +{template.keywords.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          {getTemplateUsageBadge(template.usage)}
                          <span className="text-xs text-gray-500">{template.id}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  条件に一致するテンプレートが見つかりませんでした
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "カテゴリを編集" : "新しいカテゴリを追加"}</DialogTitle>
            <DialogDescription>キーワードカテゴリの詳細を設定してください</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category-name" className="text-right">
                カテゴリ名
              </Label>
              <Input id="category-name" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="alert-level" className="text-right">
                アラートレベル
              </Label>
              <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="latent-type" className="text-right">
                分類
              </Label>
              <Select value={formData.latentType} onValueChange={(value) => setFormData({ ...formData, latentType: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="潜在">潜在キーワード</SelectItem>
                  <SelectItem value="顕在">顕在キーワード</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notification-type" className="text-right">
                通知タイプ
              </Label>
              <Select value={formData.notificationType} onValueChange={(value) => setFormData({ ...formData, notificationType: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delay">遅延通知</SelectItem>
                  <SelectItem value="calendar">カレンダー通知</SelectItem>
                  <SelectItem value="weekday">曜日通知</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.notificationType === "delay" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notification-delay" className="text-right">
                  通知遅延
                </Label>
                <Select value={formData.notificationDelay} onValueChange={(value) => setFormData({ ...formData, notificationDelay: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">即座に通知</SelectItem>
                    <SelectItem value="1">1日後に通知</SelectItem>
                    <SelectItem value="2">2日後に通知</SelectItem>
                    <SelectItem value="3">3日後に通知</SelectItem>
                    <SelectItem value="7">1週間後に通知</SelectItem>
                    <SelectItem value="14">2週間後に通知</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.notificationType === "calendar" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="selected-dates" className="text-right">
                  通知日を選択
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal h-auto p-2`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.selectedDates.length > 0 ? (
                          <span>{formData.selectedDates.length}日選択済み</span>
                        ) : (
                          <span>日付を選択してください</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="multiple"
                        selected={formData.selectedDates}
                        onSelect={(dates) => setFormData({ ...formData, selectedDates: dates || [] })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}

            {formData.notificationType === "weekday" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="selected-weekdays" className="text-right">
                  通知曜日
                </Label>
                <div className="col-span-3 space-y-2">
                  {["日", "月", "火", "水", "木", "金", "土"].map((day, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`weekday-${index}`}
                        checked={formData.selectedWeekdays.includes(index)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              selectedWeekdays: [...formData.selectedWeekdays, index]
                            })
                          } else {
                            setFormData({
                              ...formData,
                              selectedWeekdays: formData.selectedWeekdays.filter(d => d !== index)
                            })
                          }
                        }}
                      />
                      <Label htmlFor={`weekday-${index}`} className="text-sm font-normal">
                        毎週{day}曜日
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="keywords" className="text-right">
                キーワード
              </Label>
              <Textarea
                id="keywords"
                placeholder="キーワードを改行で区切って入力してください"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="custom-notification-text" className="text-right">
                カスタム通知テキスト
              </Label>
              <Textarea
                id="custom-notification-text"
                placeholder="カスタム通知テキストを入力してください（オプション）"
                value={formData.customNotificationText}
                onChange={(e) => setFormData({ ...formData, customNotificationText: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveCategory}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>削除の確認</DialogTitle>
            <DialogDescription>
              {deleteTarget?.type === 'category' 
                ? `カテゴリ「${categories[deleteTarget.categoryIndex]?.category}」を削除しますか？この操作は元に戻せません。`
                : `キーワード「${deleteTarget && categories[deleteTarget.categoryIndex]?.keywords[deleteTarget.keywordIndex || 0]}」を削除しますか？`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              削除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
