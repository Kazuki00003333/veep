"use client"

import { Button } from "@/components/ui/button"
import { Download, FileText, Table } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ReportExportProps {
  period: string
  onExport: (format: "pdf" | "excel" | "csv") => void
}

export function ReportExport({ period, onExport }: ReportExportProps) {
  const handleExport = (format: "pdf" | "excel" | "csv") => {
    // 実際の実装では、ここでレポート生成APIを呼び出す
    console.log(`Exporting ${period} report as ${format}`)
    onExport(format)

    // ダミーのダウンロード処理
    const filename = `sales-alert-report-${period}-${new Date().toISOString().split("T")[0]}.${format === "excel" ? "xlsx" : format}`
    const element = document.createElement("a")
    element.href = "#"
    element.download = filename
    element.click()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          レポート出力
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="h-4 w-4 mr-2" />
          PDF形式
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")}>
          <Table className="h-4 w-4 mr-2" />
          Excel形式
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileText className="h-4 w-4 mr-2" />
          CSV形式
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
