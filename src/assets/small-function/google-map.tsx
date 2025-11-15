// src/assets/small-function/google-map.tsx
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// === FIX ICON (VITE) ===
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// === FIX CSS TAILWIND ===
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

// === REVERSE GEOCODE (TỰ ĐỘNG LẤY ĐỊA CHỈ) ===
const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  const cacheKey = `addr_${lat.toFixed(6)}_${lng.toFixed(6)}`;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    // Delay 1s để tránh rate limit
    await new Promise((r) => setTimeout(r, 1000));

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
      {
        headers: {
          "User-Agent": "MyShopApp/1.0[](http://localhost:5173)",
        },
      }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (data.error) {
      console.warn("Nominatim error:", data.error);
      return "Không xác định được địa chỉ";
    }

    const address = data.display_name || "Địa chỉ không rõ";
    sessionStorage.setItem(cacheKey, address);
    return address;
  } catch (err) {
    console.error("Geocoding error:", err);
    return "Lỗi lấy địa chỉ";
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

  // === VALIDATE COORDS ===
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

    // === KÉO THẢ → GỌI CALLBACK + LẤY ĐỊA CHỈ ===
    marker.on("dragend", async () => {
      const pos = marker.getLatLng();
      const newLat = pos.lat;
      const newLng = pos.lng;

      // Gọi callback gốc
      onPositionChange?.(newLat, newLng);

      // Tự động lấy địa chỉ
      const address = await reverseGeocode(newLat, newLng);

      // Gửi địa chỉ về parent (Checkout)
      onPositionChange?.(newLat, newLng, address);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    setTimeout(() => map.invalidateSize(), 150);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      initRef.current = false;
    };
  }, []);

  // === CẬP NHẬT VỊ TRÍ KHI PROPS THAY ĐỔI ===
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;

    const newLat = isValid(propLat, propLng) ? propLat : lat;
    const newLng = isValid(propLat, propLng) ? propLng : lng;

    const latLng = L.latLng(newLat, newLng);
    mapInstanceRef.current.setView(latLng, zoom, { animate: true });
    markerRef.current.setLatLng(latLng);

    setTimeout(() => mapInstanceRef.current?.invalidateSize(), 100);
  }, [propLat, propLng, zoom]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "320px" }}
      className="rounded-xl border border-gray-300 overflow-hidden shadow-sm"
    />
  );
}
