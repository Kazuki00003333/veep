"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Plus, Search, UserCheck, UserX, Shield } from "lucide-react"

const accountsData = [
  {
    id: "ACC-001",
    name: "佐藤一郎",
    email: "sato@company.com",
    role: "manager",
    department: "営業部",
    status: "active",
    lastLogin: "2024-01-15 09:30",
    permissions: ["alerts_view", "alerts_manage", "users_manage"],
  },
  {
    id: "ACC-002",
    name: "田中花子",
    email: "tanaka@company.com",
    role: "user",
    department: "営業部",
    status: "active",
    lastLogin: "2024-01-15 08:45",
    permissions: ["alerts_view"],
  },
  {
    id: "ACC-003",
    name: "山田太郎",
    email: "yamada@company.com",
    role: "user",
    department: "インサイドセールス",
    status: "active",
    lastLogin: "2024-01-14 17:20",
    permissions: ["alerts_view"],
  },
  {
    id: "ACC-004",
    name: "鈴木次郎",
    email: "suzuki@company.com",
    role: "admin",
    department: "IT部",
    status: "active",
    lastLogin: "2024-01-15 10:15",
    permissions: ["alerts_view", "alerts_manage", "users_manage", "system_admin"],
  },
  {
    id: "ACC-005",
    name: "高橋美咲",
    email: "takahashi@company.com",
    role: "user",
    department: "AM部",
    status: "inactive",
    lastLogin: "2024-01-10 14:30",
    permissions: ["alerts_view"],
  },
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(accountsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAccount, setEditingAccount] = useState<any>(null)

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || account.role === roleFilter
    const matchesStatus = statusFilter === "all" || account.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">管理者</Badge>
      case "manager":
        return <Badge variant="default">マネージャー</Badge>
      case "user":
        return <Badge variant="secondary">ユーザー</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            <UserCheck className="h-3 w-3 mr-1" />
            アクティブ
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="secondary">
            <UserX className="h-3 w-3 mr-1" />
            非アクティブ
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleAddAccount = () => {
    setEditingAccount(null)
    setIsDialogOpen(true)
  }

  const handleEditAccount = (account: any) => {
    setEditingAccount(account)
    setIsDialogOpen(true)
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">アカウント管理</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">ユーザーアカウントの作成・管理と権限設定を行えます</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>ユーザーアカウント</CardTitle>
              <CardDescription>システムユーザーの管理</CardDescription>
            </div>
            <Button onClick={handleAddAccount}>
              <Plus className="h-4 w-4 mr-2" />
              新規アカウント作成
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="名前、メールアドレス、部署で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="役割" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべての役割</SelectItem>
                <SelectItem value="admin">管理者</SelectItem>
                <SelectItem value="manager">マネージャー</SelectItem>
                <SelectItem value="user">ユーザー</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="ステータス" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのステータス</SelectItem>
                <SelectItem value="active">アクティブ</SelectItem>
                <SelectItem value="inactive">非アクティブ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ユーザー</TableHead>
                  <TableHead>メールアドレス</TableHead>
                  <TableHead>役割</TableHead>
                  <TableHead>部署</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>最終ログイン</TableHead>
                  <TableHead>アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={account.name} />
                          <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{account.name}</div>
                          <div className="text-sm text-gray-500">{account.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{account.email}</TableCell>
                    <TableCell>{getRoleBadge(account.role)}</TableCell>
                    <TableCell>{account.department}</TableCell>
                    <TableCell>{getStatusBadge(account.status)}</TableCell>
                    <TableCell className="text-sm">{account.lastLogin}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditAccount(account)}>
                          編集
                        </Button>
                        <Button variant="outline" size="sm">
                          <Shield className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              条件に一致するアカウントが見つかりませんでした
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Account Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingAccount ? "アカウントを編集" : "新規アカウント作成"}</DialogTitle>
            <DialogDescription>ユーザーアカウントの詳細情報を入力してください</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user-name" className="text-right">
                名前
              </Label>
              <Input id="user-name" defaultValue={editingAccount?.name || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user-email" className="text-right">
                メール
              </Label>
              <Input id="user-email" type="email" defaultValue={editingAccount?.email || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user-role" className="text-right">
                役割
              </Label>
              <Select defaultValue={editingAccount?.role || "user"}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">ユーザー</SelectItem>
                  <SelectItem value="manager">マネージャー</SelectItem>
                  <SelectItem value="admin">管理者</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user-department" className="text-right">
                部署
              </Label>
              <Input id="user-department" defaultValue={editingAccount?.department || ""} className="col-span-3" />
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
