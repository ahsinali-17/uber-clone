import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

// Fix default icon issues
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const LiveLocation = ({className}) => {
  const [position, setPosition] = useState(null)

  const updatePosition = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition([coords.latitude, coords.longitude])
      },
      (err) => console.error('Geo error:', err),
      { enableHighAccuracy: true }
    )
  }

  useEffect(() => {
    updatePosition()
    const interval = setInterval(updatePosition, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!position) return <div>Loading current location...</div>

  return (
    <MapContainer
      center={position}
      zoom={15}
      className={`w-screen z-0 ${className}`}
      zoomControl={false}
      scrollWheelZoom={true}
    >
      <ZoomControl position="bottomright" />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={position}>
        <Popup>Your live location</Popup>
      </Marker>
    </MapContainer>
  )
}

export default LiveLocation
