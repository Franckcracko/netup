import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { Icon, type Marker as IMarker } from "leaflet"

import { useRef } from "react"

export default function MyMap({ buses = [] }: {
  buses: [
    longitude: number,
    latitude: number,
    id: string,
    isDriving: boolean
  ][]
}) {
  const { position, zoom } = {
    position: { lat: 22.2995396, lng: -97.8398807 },
    zoom: 10
  }

  return <MapContainer className="w-full h-full" center={position} zoom={zoom} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    {
      buses.map((bus) => (
        bus[3] ? (
          <CustoMarker
            bus={bus}
            key={bus[2]}
          />
        )
          : (
            <Marker
              key={bus[2]}
              icon={
                new Icon({
                  iconUrl: "/flag-marker.svg",
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                  popupAnchor: [0, -32]
                })
              }
              position={{ lat: bus[1], lng: bus[0] }}
            >
              <Popup>
                <h3 className="font-bold mb-1">
                  No. {bus[2]}
                  <span className="block text-xs font-normal text-muted-foreground">
                    {new Date().toTimeString()}
                  </span>
                  {/* <span className="block text-xs font-normal text-muted-foreground">
                    {bus.speed} km/h
                  </span> */}
                </h3>
              </Popup>
            </Marker>
          )
      ))
    }
  </MapContainer>
}

function CustoMarker({ bus }: { bus: [longitude: number, latitude: number, id: string, isDriving: boolean] }) {
  const markerRef = useRef<IMarker>(null);

  return (
    <Marker
      ref={(ref) => {
        markerRef.current = ref;
      }}
      icon={
        new Icon({
          iconUrl: "/bus-marker.svg",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
          // className:"rotate-180"
        })
      }
      position={{ lat: bus[1], lng: bus[0] }}
    >
      <Popup>
        <h3 className="font-bold mb-1">
          No. {bus[2]}
          <span className="block text-xs font-normal text-muted-foreground">
            {new Date().toString()}
          </span>
        </h3>
        {/* <p className="text-xs text-muted-foreground">
          {bus.speed} km/h
        </p> */}
      </Popup>
    </Marker>
  )
}