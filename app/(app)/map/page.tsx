"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RefreshCw, Bus, MapPin } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { formatTimeAgo } from "@/utils/format-time"
import { getBuses } from "@/data/map"

export default function MapPage() {
  const [buses, setBuses] = useState<[
    longitude: number,
    latitude: number,
    id: string,
    isDriving: boolean
  ][]>([])
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const loadBusData = async () => {
    setLoading(true)
    try {
      const res = await getBuses()
      setBuses(res.result[1].filter(r => r[3]) || [])
      setLastUpdate(new Date())
    } catch (error) {
      console.error("Error loading bus data:", error)
    } finally {
      setLoading(false)
    }
  }

  const Map = useMemo(() => dynamic(
    () => import('@/components/map/dynamic-map'),
    {
      loading: () => <p>Cargando mapa...</p>,
      ssr: false
    }
  ), [])

  useEffect(() => {
    loadBusData()

    const interval = setInterval(() => {
      loadBusData()
    }, 100000)

    return () => clearInterval(interval)
  }, [])
  

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <header className="bg-[#2d2d2d] border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-2">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Bus className="w-5 h-5 text-purple-400" />
                Mapa de Autobuses
              </h1>
              <p className="text-xs sm:text-sm text-gray-400">
                {buses.length} autobuses en tiempo real
                {lastUpdate && ` • Actualizado: ${formatTimeAgo(lastUpdate)}`}
              </p>
            </div>

            <Button
              onClick={loadBusData}
              disabled={loading}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">{loading ? "Cargando..." : "Actualizar"}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Mapa */}
        <div className="flex-1 relative">
          <Map buses={buses} />

          {/* Controles del mapa */}
          <div className="absolute top-4 right-4 z-[1000] max-md:hidden">
            <Card className="bg-[#2d2d2d] border-gray-700">
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-white">
                  <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
                  <span>Autobuses activos</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[1000]">
              <Card className="bg-[#2d2d2d] border-gray-700">
                <CardContent className="p-6 text-center">
                  <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-2" />
                  <p className="text-white">Actualizando ubicaciones...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Panel lateral */}
        <div className="w-full lg:w-80 bg-[#0f0f0f] border-t lg:border-t-0 lg:border-l border-gray-700 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Autobuses en Servicio</h2>
              <Badge variant="secondary" className="bg-purple-600 text-white">
                {buses.length}
              </Badge>
            </div>

            {/* Lista de autobuses */}
            <div className="space-y-3">
              {buses.map((bus) => (
                <Card
                  key={bus[2]}
                  className={"bg-[#2d2d2d] border-gray-700 cursor-pointer transition-all hover:border-purple-600/50"}
                >
                  <CardContent>
                    <CardTitle className="mt-1 text-lg text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      Ubicación Actual
                    </CardTitle>
                    <span className="text-xs text-gray-400">ID: {bus[2]}</span>
                    <div className="text-sm text-gray-300 mt-1">
                      Latitud: {bus[1].toFixed(5)} <br />
                      Longitud: {bus[0].toFixed(5)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {buses.length === 0 && !loading && (
              <div className="text-center py-8">
                <Bus className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400">No hay datos de autobuses</p>
                <Button onClick={loadBusData} className="mt-2 bg-purple-600 hover:bg-purple-700 text-white">
                  Cargar datos
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossOrigin=""
      />
    </div>
  )
}
