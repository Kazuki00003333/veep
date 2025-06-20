"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Users, Settings, UserPlus } from "lucide-react"

const groupsData = [
  {
    id: "GRP-001",
    name: "営業部",
    description: "法人営業チーム",
    members: [
      { name: "佐藤一郎", role: "マネージャー", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "田中花子", role: "営業", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "山田太郎", role: "営業", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    alertCount: 8,
    status: "active",
  },
  {
    id: "GRP-002",
    name: "インサイドセールス",
    description: "インサイドセールスチーム",
    members: [
      { name: "鈴木次郎", role: "リーダー", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "高橋美咲", role: "セールス", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "田中花子", role: "セールス", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    alertCount: 3,
    status: "active",
  },
  {
    id: "GRP-003",
    name: "アカウントマネジメント",
    description: "CS・AMチーム",
    members: [
      { name: "伊藤健一", role: "AMマネージャー", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "渡辺雅子", role: "CS", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "加藤直樹", role: "AM", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    alertCount: 5,
    status: "active",
  },
]

export default function GroupsPage() {
  const [groups, setGroups] = useState(groupsData)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<any>(null)

  const handleAddGroup = () => {
    setEditingGroup(null)
    setIsDialogOpen(true)
  }

  const handleEditGroup = (group: any) => {
    setEditingGroup(group)
    setIsDialogOpen(true)
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">グループ管理</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          部署やチーム単位でのグループ管理とアラート監視を設定できます
        </p>
      </div>

      <div className="mb-6">
        <Button onClick={handleAddGroup}>
          <Plus className="h-4 w-4 mr-2" />
          新しいグループを作成
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    {group.name}
                  </CardTitle>
                  <CardDescription>{group.description}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => handleEditGroup(group)}>
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">アクティブアラート</span>
                  <Badge variant={group.alertCount > 5 ? "destructive" : "secondary"}>{group.alertCount}件</Badge>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">メンバー</span>
                    <span className="text-xs text-gray-500">{group.members.length}名</span>
                  </div>
                  <div className="space-y-2">
                    {group.members.slice(0, 3).map((member, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                    ))}
                    {group.members.length > 3 && (
                      <div className="text-xs text-gray-500 pl-8">他{group.members.length - 3}名</div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 h-8">
                    <UserPlus className="h-3 w-3 mr-1" />
                    メンバー追加
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-8">
                    詳細表示
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Group Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingGroup ? "グループを編集" : "新しいグループを作成"}</DialogTitle>
            <DialogDescription>グループの詳細情報を入力してください</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group-name" className="text-right">
                グループ名
              </Label>
              <Input id="group-name" defaultValue={editingGroup?.name || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group-description" className="text-right">
                説明
              </Label>
              <Textarea
                id="group-description"
                defaultValue={editingGroup?.description || ""}
                className="col-span-3"
                placeholder="グループの説明を入力してください"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => setIsDialogOpen(false)}>
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
