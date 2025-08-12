"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import ReportDetailPage from "@/components/report-detail-page"
import type { ConsolidatedUnit } from "@/lib/excel-parser"

interface CustomerInfo {
  customerName: string
  propertyName: string
  address: string
  city: string
  state: string
  zip: string
  date: string
  unitType: string
}

export default function ReportPage() {
  const router = useRouter()
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null)
  const [consolidatedData, setConsolidatedData] = useState<ConsolidatedUnit[]>([])
  const [toiletCount, setToiletCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = () => {
      try {
        // Load customer info
        const storedCustomerInfo = localStorage.getItem("customerInfo")
        if (storedCustomerInfo) {
          setCustomerInfo(JSON.parse(storedCustomerInfo))
        }

        // Load consolidated data
        const storedConsolidatedData = localStorage.getItem("consolidatedData")
        console.log("Report: Raw localStorage consolidatedData:", storedConsolidatedData?.substring(0, 200))

        if (storedConsolidatedData) {
          const parsedData = JSON.parse(storedConsolidatedData)
          console.log("Report: Parsed consolidated data:", parsedData.length, "units")
          console.log("Report: First unit:", parsedData[0])

          setConsolidatedData(parsedData)
        } else {
          console.log("Report: No consolidated data found in localStorage")
        }

        // Load toilet count
        const storedToiletCount = localStorage.getItem("toiletCount")
        if (storedToiletCount) {
          setToiletCount(JSON.parse(storedToiletCount))
        }
      } catch (error) {
        console.error("Error loading report data:", error)
      } finally {
        setLoading(false)
      }
    }

    setTimeout(loadData, 100)
  }, [])

  useEffect(() => {
    if (consolidatedData.length > 0) {
      console.log("Report: ConsolidatedData state updated with", consolidatedData.length, "units")
      console.log("Report: About to pass to ReportDetailPage:", {
        dataLength: consolidatedData.length,
        firstUnit: consolidatedData[0],
        isArray: Array.isArray(consolidatedData),
      })
    }
  }, [consolidatedData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!customerInfo || consolidatedData.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">No Data Found</h2>
            <p className="mb-4">No installation data found. Please go back and upload a file.</p>
            <Button onClick={() => router.push("/")}>Back to Upload</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <Button variant="outline" onClick={() => router.push("/")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Upload
        </Button>
        <h1 className="text-2xl font-bold">Installation Report</h1>
        <div className="w-32"></div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid grid-cols-1">
          <TabsTrigger value="details">Detail Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <ReportDetailPage consolidatedData={consolidatedData} isPreview={true} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
