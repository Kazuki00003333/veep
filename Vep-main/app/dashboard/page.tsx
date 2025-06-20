"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Users, Bell, TrendingUp, BarChart3, PieChart } from "lucide-react"
import { RecentAlerts } from "@/components/recent-alerts"
import { SalesPersonChart } from "@/components/sales-person-chart"
import { DepartmentChart } from "@/components/department-chart"
import { TimeSeriesChart } from "@/components/time-series-chart"
import { ReportExport } from "@/components/report-export"
import { salesPersonAlertData, departmentAlertData, timeSeriesData } from "@/lib/dummy-data"
import { SalesPersonFilter } from "@/components/sales-person-filter"

type Period = "weekly" | "monthly" | "quarterly" | "yearly"

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("weekly")
  const [departmentChartType, setDepartmentChartType] = useState<"bar" | "pie">("bar")
  const [salesPersonSearchTerm, setSalesPersonSearchTerm] = useState("")

  const periodLabels = {
    weekly: "週次",
    monthly: "月次",
    quarterly: "四半期",
    yearly: "年次",
  }

  const handleExport = (format: "pdf" | "excel" | "csv") => {
    // レポート出力処理
    console.log(`Exporting ${selectedPeriod} report as ${format}`)
  }

  const handleSalesPersonSearch = (searchTerm: string) => {
    setSalesPersonSearchTerm(searchTerm)
  }

  // 検索条件に一致する営業担当者数
  const filteredSalesPersonCount = salesPersonSearchTerm
    ? salesPersonAlertData[selectedPeriod].filter(
        (person) =>
          person.name.toLowerCase().includes(salesPersonSearchTerm.toLowerCase()) ||
          person.department.toLowerCase().includes(salesPersonSearchTerm.toLowerCase()),
      ).length
    : salesPersonAlertData[selectedPeriod].length

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ダッシュボード</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              営業トラブルアラートの概要と最新の状況を確認できます
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {/* 期間切り替えボタン */}
            <div className="flex space-x-2">
              {(Object.keys(periodLabels) as Period[]).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                >
                  {periodLabels[period]}
                </Button>
              ))}
            </div>
            <ReportExport period={selectedPeriod} onExport={handleExport} />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日のアラート</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">+3</span> 昨日より
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">未対応アラート</CardTitle>
            <Bell className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-500">要対応</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">監視対象者</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">アクティブユーザー</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">解決率</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+5%</span> 先月より
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 時系列チャート */}
        <Card>
          <CardHeader>
            <CardTitle>アラート推移（{periodLabels[selectedPeriod]}）</CardTitle>
            <CardDescription>期間別のアラート発生状況</CardDescription>
          </CardHeader>
          <CardContent>
            <TimeSeriesChart data={timeSeriesData[selectedPeriod]} period={selectedPeriod} />
          </CardContent>
        </Card>

        {/* 最新アラート */}
        <Card>
          <CardHeader>
            <CardTitle>最新アラート</CardTitle>
            <CardDescription>直近のアラート一覧</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentAlerts />
          </CardContent>
        </Card>
      </div>

      {/* 詳細分析タブ */}
      <Tabs defaultValue="sales-person" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sales-person">営業担当者別</TabsTrigger>
          <TabsTrigger value="department">部門別</TabsTrigger>
        </TabsList>

        <TabsContent value="sales-person">
          <SalesPersonFilter
            salesPersons={salesPersonAlertData[selectedPeriod]}
            onSearch={handleSalesPersonSearch}
            searchTerm={salesPersonSearchTerm}
          />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  営業担当者別アラート分析（{periodLabels[selectedPeriod]}）
                </div>
                <div className="text-sm text-gray-500">
                  {salesPersonSearchTerm
                    ? `${filteredSalesPersonCount}名を表示中`
                    : `全${salesPersonAlertData[selectedPeriod].length}名を表示中`}
                </div>
              </CardTitle>
              <CardDescription>各営業担当者のアラート発生状況と対応実績</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesPersonChart
                data={salesPersonAlertData[selectedPeriod]}
                period={selectedPeriod}
                searchTerm={salesPersonSearchTerm}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2" />
                    部門別アラート分析（{periodLabels[selectedPeriod]}）
                  </CardTitle>
                  <CardDescription>部門ごとのアラート発生状況と対応実績</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant={departmentChartType === "bar" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDepartmentChartType("bar")}
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    棒グラフ
                  </Button>
                  <Button
                    variant={departmentChartType === "pie" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDepartmentChartType("pie")}
                  >
                    <PieChart className="h-4 w-4 mr-1" />
                    円グラフ
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DepartmentChart
                data={departmentAlertData[selectedPeriod]}
                period={selectedPeriod}
                chartType={departmentChartType}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* サマリー統計 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">期間サマリー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">総アラート数:</span>
                <span className="font-medium">
                  {salesPersonAlertData[selectedPeriod].reduce((sum, person) => sum + person.alerts, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">解決済み:</span>
                <span className="font-medium text-green-600">
                  {salesPersonAlertData[selectedPeriod].reduce((sum, person) => sum + person.resolved, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">未対応:</span>
                <span className="font-medium text-orange-600">
                  {salesPersonAlertData[selectedPeriod].reduce((sum, person) => sum + person.pending, 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">トップパフォーマー</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {salesPersonAlertData[selectedPeriod]
                .filter((person) =>
                  salesPersonSearchTerm
                    ? person.name.toLowerCase().includes(salesPersonSearchTerm.toLowerCase()) ||
                      person.department.toLowerCase().includes(salesPersonSearchTerm.toLowerCase())
                    : true,
                )
                .sort((a, b) => b.resolved / b.alerts - a.resolved / a.alerts)
                .slice(0, 3)
                .map((person, index) => (
                  <div key={person.name} className="flex justify-between items-center">
                    <span className="text-sm">
                      {index + 1}. {person.name}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      {Math.round((person.resolved / person.alerts) * 100)}%
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">要注意部門</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {departmentAlertData[selectedPeriod]
                .sort((a, b) => b.pending / b.alerts - a.pending / a.alerts)
                .map((dept, index) => (
                  <div key={dept.name} className="flex justify-between items-center">
                    <span className="text-sm">{dept.name}</span>
                    <span className="text-sm font-medium text-orange-600">未対応: {dept.pending}件</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
