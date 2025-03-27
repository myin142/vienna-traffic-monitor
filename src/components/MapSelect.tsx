import { Marker as LeafletMarker } from "leaflet";
import { useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { Stop } from "../stops.service";
import { MonitorResponse } from "../wiener-linien.service";

interface MapSelectProps {
  position: [number, number];
  nearbyStops: Stop[];
  monitoring: Record<number, MonitorResponse>;
  setPosition: (position: [number, number]) => void;
}

export function MapSelect({
  nearbyStops,
  monitoring,
  position,
  setPosition,
}: Readonly<MapSelectProps>) {
  const markerRef = useRef(null as LeafletMarker | null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          setPosition([latLng.lat, latLng.lng]);
        }
      },
    }),
    []
  );

  const stops = nearbyStops.map((stop) => (
    <Marker key={stop.rbl} position={stop.latLng} opacity={0.5}>
      <Popup>
        <div className="flex flex-col">
          <span className="font-bold">{stop.name}</span>
          {monitoring[stop.rbl]?.lines?.map((l) => (
            <div key={l.name + l.towards + l.barrierFree}>
              <span>
                {l.name} - {l.towards}
              </span>
              <div className="flex gap-2 text-slate-500">
                {l.departures.departure.slice(0, 4).map((d) => (
                  <span key={d.departureTime.timePlanned}>
                    {d.departureTime.countdown}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Popup>
    </Marker>
  ));

  return (
    <MapContainer className="w-full h-full" center={position} zoom={15}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        riseOnHover={true}
        draggable={true}
        position={position}
        eventHandlers={eventHandlers}
        ref={markerRef}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      {stops}
    </MapContainer>
  );
}
