"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MapPickerProps {
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void
}

export function MapPicker({ onLocationSelect }: MapPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ x: number; y: number } | null>(null)
  const [showMap, setShowMap] = useState(false)

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setSelectedLocation({ x, y })

    // Convert map coordinates to approximate lat/lng (for demo purposes)
    const lat = 28.6139 + (y - 50) * 0.01
    const lng = 77.209 + (x - 50) * 0.01

    // Generate address based on position
    const quadrants = ["North", "South", "East", "West", "Central"]
    const zones = ["A", "B", "C", "D"]
    const quadrant = quadrants[Math.floor(Math.random() * quadrants.length)]
    const zone = zones[Math.floor(Math.random() * zones.length)]
    const address = `${quadrant} Zone ${zone}, Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`

    onLocationSelect({ lat, lng, address })
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        onClick={() => setShowMap(!showMap)}
        variant="outline"
        className="w-full border-blue-400 text-blue-600 hover:bg-blue-50"
      >
        {showMap ? "Hide Map" : "Select Location on Map"}
      </Button>

      {showMap && (
        <Card className="p-4 border-2 border-blue-200 bg-blue-50">
          <p className="text-sm text-gray-600 mb-3">Click on the map to select your location</p>
          <svg
            onClick={handleMapClick}
            className="w-full h-80 bg-white border-2 border-blue-300 rounded-lg cursor-crosshair"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background */}
            <rect width="100" height="100" fill="#e8f4f8" />

            {/* Grid lines */}
            <g stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2,2">
              {[20, 40, 60, 80].map((i) => (
                <g key={`grid-${i}`}>
                  <line x1={i} y1="0" x2={i} y2="100" />
                  <line x1="0" y1={i} x2="100" y2={i} />
                </g>
              ))}
            </g>

            {/* Building zones */}
            <rect x="10" y="10" width="25" height="25" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.5" />
            <text x="22" y="25" textAnchor="middle" fontSize="4" fill="#1e40af">
              A
            </text>

            <rect x="65" y="10" width="25" height="25" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.5" />
            <text x="77" y="25" textAnchor="middle" fontSize="4" fill="#1e40af">
              B
            </text>

            <rect x="10" y="65" width="25" height="25" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.5" />
            <text x="22" y="80" textAnchor="middle" fontSize="4" fill="#1e40af">
              C
            </text>

            <rect x="65" y="65" width="25" height="25" fill="#dbeafe" stroke="#3b82f6" strokeWidth="0.5" />
            <text x="77" y="80" textAnchor="middle" fontSize="4" fill="#1e40af">
              D
            </text>

            {/* Center park area */}
            <circle cx="50" cy="50" r="8" fill="#86efac" opacity="0.6" stroke="#22c55e" strokeWidth="0.5" />
            <text x="50" y="52" textAnchor="middle" fontSize="3" fill="#166534">
              Park
            </text>

            {/* Selected location marker */}
            {selectedLocation && (
              <>
                <circle
                  cx={selectedLocation.x}
                  cy={selectedLocation.y}
                  r="2"
                  fill="#ef4444"
                  stroke="#dc2626"
                  strokeWidth="0.5"
                />
                <circle
                  cx={selectedLocation.x}
                  cy={selectedLocation.y}
                  r="3.5"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="0.3"
                />
              </>
            )}

            {/* Border */}
            <rect width="100" height="100" fill="none" stroke="#1e40af" strokeWidth="1" />
          </svg>

          {selectedLocation && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-sm text-green-800">
              ✓ Location selected on map
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
