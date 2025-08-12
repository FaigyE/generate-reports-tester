"use client"
import { useState, useEffect } from "react"
import { getAeratorDescription } from "@/lib/utils/aerator-helpers"
import type { ConsolidatedUnit } from "@/lib/excel-parser"

interface ReportDetailPageProps {
  consolidatedData?: ConsolidatedUnit[]
  isPreview?: boolean
}

export default function ReportDetailPage({ consolidatedData = [], isPreview = true }: ReportDetailPageProps) {
  const [notes, setNotes] = useState<Record<string, string>>({})

  // Load notes from localStorage
  useEffect(() => {
    try {
      const storedNotes = localStorage.getItem("unifiedNotes")
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes))
      }
    } catch (error) {
      console.error("Error loading notes:", error)
    }
  }, [])

  useEffect(() => {
    console.log("ReportDetailPage: Received consolidated data:", consolidatedData.length, "units")
    if (consolidatedData.length > 0) {
      console.log("ReportDetailPage: First unit sample:", {
        unit: consolidatedData[0].unit,
        kitchenCount: consolidatedData[0].kitchenAeratorCount,
        kitchenType: typeof consolidatedData[0].kitchenAeratorCount,
        bathroomCount: consolidatedData[0].bathroomAeratorCount,
        bathroomType: typeof consolidatedData[0].bathroomAeratorCount,
        showerCount: consolidatedData[0].showerHeadCount,
        showerType: typeof consolidatedData[0].showerHeadCount,
      })
    }
  }, [consolidatedData])

  const sortedData = [...consolidatedData].sort((a, b) => {
    const unitA = String(a.unit || "")
    const unitB = String(b.unit || "")

    const numA = Number.parseInt(unitA)
    const numB = Number.parseInt(unitB)

    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB
    }

    return unitA.localeCompare(unitB, undefined, { numeric: true, sensitivity: "base" })
  })

  // Always show all aerator columns like in Foxcroft report
  const hasKitchenAerators = true
  const hasBathroomAerators = true
  const hasShowers = true
  const hasNotes = true

  return (
    <div className="report-page min-h-[1056px] relative">
      <div className="mb-8">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-29%20115501-BD1uw5tVq9PtVYW6Z6FKM1i8in6GeV.png"
          alt="GreenLight Logo"
          className="h-24"
          crossOrigin="anonymous"
        />
      </div>

      <div className="mb-16">
        <h2 className="text-xl font-bold mb-6">Detailed Unit Information</h2>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left py-2 px-2 border-b">Unit</th>
              {hasKitchenAerators && (
                <>
                  <th className="text-left py-2 px-2 border-b">Kitchen Installed</th>
                </>
              )}
              {hasBathroomAerators && (
                <>
                  <th className="text-left py-2 px-2 border-b">Bathroom Installed</th>
                </>
              )}
              {hasShowers && (
                <>
                  <th className="text-left py-2 px-2 border-b">Shower Installed</th>
                </>
              )}
              <th className="text-left py-2 px-2 border-b">Toilet Installed</th>
              {hasNotes && <th className="text-left py-2 px-2 border-b">Notes</th>}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item, index) => {
              const kitchenCount = Number(item.kitchenAeratorCount) || 0
              const bathroomCount = Number(item.bathroomAeratorCount) || 0
              const showerCount = Number(item.showerHeadCount) || 0

              const kitchenAerator = getAeratorDescription(kitchenCount, "kitchen")
              const bathroomAerator = getAeratorDescription(bathroomCount, "bathroom")
              const shower = getAeratorDescription(showerCount, "shower")

              const unitNotes = String(notes[String(item.unit)] || "")

              return (
                <tr key={index}>
                  <td className="py-2 px-2 border-b">{String(item.unit)}</td>
                  {hasKitchenAerators && (
                    <td className="py-2 px-2 border-b text-center">
                      {kitchenAerator === "No Touch." ? "No Touch." : kitchenAerator}
                    </td>
                  )}
                  {hasBathroomAerators && (
                    <td className="py-2 px-2 border-b text-center">
                      {bathroomAerator === "No Touch." ? "No Touch." : bathroomAerator}
                    </td>
                  )}
                  {hasShowers && (
                    <td className="py-2 px-2 border-b text-center">{shower === "No Touch." ? "No Touch." : shower}</td>
                  )}
                  <td className="py-2 px-2 border-b text-center">0.8 GPF</td>
                  {hasNotes && <td className="py-2 px-2 border-b">{unitNotes}</td>}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="footer-container">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-29%20115454-uWCS2yWrowegSqw9c2SIVcLdedTk82.png"
          alt="GreenLight Footer"
          className="w-full h-auto"
          crossOrigin="anonymous"
        />
      </div>
    </div>
  )
}
