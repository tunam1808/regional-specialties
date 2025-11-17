// src/assets/small-function/google-map.tsx
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// === FIX ICON ===
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// === FIX CSS ===
const fixCSS = () => {
  const id = "leaflet-css-fix";
  if (document.getElementById(id)) return;
  const style = document.createElement("style");
  style.id = id;
  style.innerHTML = `
    .leaflet-container img, .leaflet-pane img { max-width: none !important; }
    .leaflet-marker-icon { background: transparent !important; }
  `;
  document.head.appendChild(style);
};

// === REVERSE GEOCODE ===
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const cacheKey = `addr_${lat.toFixed(6)}_${lng.toFixed(6)}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    await new Promise((r) => setTimeout(r, 1100)); // >1s

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          "User-Agent": "MyShopApp/1.0[](http://localhost:5173)", // SỬA TẠI ĐÂY
        },
      }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    sessionStorage.setItem(cacheKey, address);
    return address;
  } catch (err) {
    console.error("Reverse geocoding error:", err);
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
};

interface MapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  onPositionChange?: (lat: number, lng: number, address?: string) => void;
}

export default function Map({
  latitude: propLat = 21.0285,
  longitude: propLng = 105.8542,
  zoom = 16,
  onPositionChange,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const initRef = useRef(false);
  const [addressLoading, setAddressLoading] = useState(false);

  const isValid = (lat?: number, lng?: number) =>
    lat != null &&
    lng != null &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180;

  const lat = isValid(propLat, propLng) ? propLat : 21.0285;
  const lng = isValid(propLat, propLng) ? propLng : 105.8542;

  // === INIT MAP ===
  useEffect(() => {
    if (!mapRef.current || initRef.current) return;
    initRef.current = true;
    fixCSS();

    const map = L.map(mapRef.current).setView([lat, lng], zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([lat, lng], {
      draggable: true,
      autoPan: true,
    }).addTo(map);
    markerRef.current = marker;
    mapInstanceRef.current = map;

    marker.on("dragend", async () => {
      if (!markerRef.current) return;
      const pos = markerRef.current.getLatLng();
      const newLat = pos.lat;
      const newLng = pos.lng;

      setAddressLoading(true);
      onPositionChange?.(newLat, newLng);

      const address = await reverseGeocode(newLat, newLng);
      setAddressLoading(false);
      onPositionChange?.(newLat, newLng, address);
    });

    requestAnimationFrame(() => map.invalidateSize());

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      initRef.current = false;
    };
  }, []);

  // === CẬP NHẬT KHI PROPS THAY ĐỔI ===
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;

    const newLat = isValid(propLat, propLng) ? propLat : lat;
    const newLng = isValid(propLat, propLng) ? propLng : lng;
    const latLng = L.latLng(newLat, newLng);

    mapInstanceRef.current.setView(latLng, zoom, { animate: true });
    markerRef.current.setLatLng(latLng);

    requestAnimationFrame(() => mapInstanceRef.current?.invalidateSize());
  }, [propLat, propLng, zoom]);

  return (
    <div className="relative">
      <div
        ref={mapRef}
        style={{ width: "100%", height: "320px" }}
        className="rounded-xl border border-gray-300 overflow-hidden shadow-sm"
      />
      {addressLoading && (
        <p className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded text-xs text-blue-600 shadow">
          Đang lấy địa chỉ...
        </p>
      )}
    </div>
  );
}
