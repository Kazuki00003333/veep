import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock } from "lucide-react"

const recentAlerts = [
  {
    id: 1,
    keyword: "お見積りが完成次第",
    department: "営業部",
    person: "佐藤一郎",
    level: "high",
    time: "10分前",
  },
  {
    id: 2,
    keyword: "資料はまだでしょうか",
    department: "インサイドセールス",
    person: "田中花子",
    level: "medium",
    time: "25分前",
  },
  {
    id: 3,
    keyword: "返事がない",
    department: "AM部",
    person: "山田太郎",
    level: "high",
    time: "1時間前",
  },
]

export function RecentAlerts() {
  return (
    <div className="space-y-4">
      {recentAlerts.map((alert) => (
        <div key={alert.id} className="flex items-center space-x-4 p-3 rounded-lg border">
          <AlertTriangle className={`h-4 w-4 ${alert.level === "high" ? "text-red-500" : "text-orange-500"}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{alert.keyword}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {alert.department} - {alert.person}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={alert.level === "high" ? "destructive" : "secondary"}>
              {alert.level === "high" ? "高" : "中"}
            </Badge>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {alert.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
