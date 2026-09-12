import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const GOVERNORATES = [
  "Capital Governorate",
  "Muharraq Governorate",
  "Northern Governorate",
  "Southern Governorate",
];

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.setView(
      [position.lat, position.lng],
      17,
      {
        animate: true,
      }
    );
  }, [position, map]);

  return null;
}

function LocationMarker({
  position,
  setPosition,
  reverseGeocode,
}) {
  useMapEvents({
    click(event) {
      const newPosition = {
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      };

      setPosition(newPosition);

      reverseGeocode(
        newPosition.lat,
        newPosition.lng
      );
    },
  });

  return (
    <Marker
      position={[
        position.lat,
        position.lng,
      ]}
      draggable={true}
      eventHandlers={{
        dragend: (event) => {
          const marker = event.target;

          const location =
            marker.getLatLng();

          const newPosition = {
            lat: location.lat,
            lng: location.lng,
          };

          setPosition(newPosition);

          reverseGeocode(
            newPosition.lat,
            newPosition.lng
          );
        },
      }}
    />
  );
}

function LocationPicker({
  onLocationChange,
}) {
  const [position, setPosition] =
    useState({
      lat: 26.2235,
      lng: 50.5876,
    });

  const [address, setAddress] =
    useState({
      flatVilla: "",
      buildingNumber: "",
      roadNumber: "",
      blockNumber: "",
      area: "",
      governorate: "",
      poBox: "",
      country: "Bahrain",
    });

  const [loadingLocation, setLoadingLocation] =
    useState(false);

  const [loadingAddress, setLoadingAddress] =
    useState(false);

  const [locationError, setLocationError] =
    useState("");

  useEffect(() => {
    onLocationChange({
      address,
      latitude: position.lat,
      longitude: position.lng,
    });
  }, [
    address,
    position,
    onLocationChange,
  ]);

  const reverseGeocode = async (
    latitude,
    longitude
  ) => {
    try {
      setLoadingAddress(true);
      setLocationError("");

      const url =
        `https://nominatim.openstreetmap.org/reverse` +
        `?format=jsonv2` +
        `&lat=${latitude}` +
        `&lon=${longitude}` +
        `&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          "Address lookup failed"
        );
      }

      const data =
        await response.json();

      const result =
        data.address || {};

      let governorate =
        result.state ||
        result.county ||
        "";

      if (
        governorate &&
        !governorate
          .toLowerCase()
          .includes("governorate")
      ) {
        governorate =
          `${governorate} Governorate`;
      }

      setAddress((previous) => ({
        ...previous,

        buildingNumber:
          result.house_number ||
          "",

        roadNumber:
          result.road ||
          result.street ||
          "",

        blockNumber:
          result.block ||
          result.postcode ||
          "",

        area:
          result.suburb ||
          result.neighbourhood ||
          result.village ||
          result.town ||
          "",

        governorate,

        country:
          result.country ||
          "Bahrain",
      }));
    } catch (error) {
      console.error(
        "Reverse geocoding error:",
        error
      );

      setLocationError(
        "Location found, but the address could not be completely detected. Please check the fields manually."
      );
    } finally {
      setLoadingAddress(false);
    }
  };

  const getCurrentLocation = () => {
    setLocationError("");
    setLoadingLocation(true);

    if (!navigator.geolocation) {
      setLoadingLocation(false);

      setLocationError(
        "Geolocation is not supported by this browser."
      );

      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (location) => {
        try {
          const latitude =
            location.coords.latitude;

          const longitude =
            location.coords.longitude;

          const newPosition = {
            lat: latitude,
            lng: longitude,
          };

          setPosition(newPosition);

          await reverseGeocode(
            latitude,
            longitude
          );
        } finally {
          setLoadingLocation(false);
        }
      },

      (error) => {
        console.error(
          "GPS error:",
          error
        );

        setLoadingLocation(false);

        if (error.code === 1) {
          setLocationError(
            "Location permission was denied. Please allow location access in your browser."
          );
        } else if (error.code === 2) {
          setLocationError(
            "Your location could not be determined."
          );
        } else if (error.code === 3) {
          setLocationError(
            "Location request timed out. Please try again."
          );
        } else {
          setLocationError(
            "Unable to get your current location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  const handleAddressChange = (
    field,
    value
  ) => {
    setAddress((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  return (
    <div className="location-box">

      <div className="location-heading">
        <strong>
          Bahrain Address
        </strong>

        <span>
          Enter your address or use
          your current location.
        </span>
      </div>

      <button
        type="button"
        className="location-btn"
        onClick={getCurrentLocation}
        disabled={
          loadingLocation ||
          loadingAddress
        }
      >
        {loadingLocation
          ? "📍 Detecting Location..."
          : loadingAddress
          ? "🔎 Getting Address..."
          : "📍 Use Current Location"}
      </button>

      {locationError && (
        <p className="location-error">
          {locationError}
        </p>
      )}

      <div className="address-grid">

        <div className="address-field">
          <label>
            Flat / Villa / Unit No.
          </label>

          <input
            type="text"
            value={address.flatVilla}
            onChange={(e) =>
              handleAddressChange(
                "flatVilla",
                e.target.value
              )
            }
            placeholder="Optional"
          />
        </div>

        <div className="address-field">
          <label>
            Building Number *
          </label>

          <input
            type="text"
            value={
              address.buildingNumber
            }
            onChange={(e) =>
              handleAddressChange(
                "buildingNumber",
                e.target.value
              )
            }
            placeholder="Building No."
            required
          />
        </div>

        <div className="address-field">
          <label>
            Road Number *
          </label>

          <input
            type="text"
            value={address.roadNumber}
            onChange={(e) =>
              handleAddressChange(
                "roadNumber",
                e.target.value
              )
            }
            placeholder="Road No."
            required
          />
        </div>

        <div className="address-field">
          <label>
            Block Number *
          </label>

          <input
            type="text"
            value={address.blockNumber}
            onChange={(e) =>
              handleAddressChange(
                "blockNumber",
                e.target.value
              )
            }
            placeholder="Block No."
            required
          />
        </div>

        <div className="address-field">
          <label>
            Area / Town *
          </label>

          <input
            type="text"
            value={address.area}
            onChange={(e) =>
              handleAddressChange(
                "area",
                e.target.value
              )
            }
            placeholder="Area / Town"
            required
          />
        </div>

        <div className="address-field">
          <label>
            Governorate *
          </label>

          <select
            value={address.governorate}
            onChange={(e) =>
              handleAddressChange(
                "governorate",
                e.target.value
              )
            }
            required
          >
            <option value="">
              Select Governorate
            </option>

            {GOVERNORATES.map(
              (governorate) => (
                <option
                  key={governorate}
                  value={governorate}
                >
                  {governorate}
                </option>
              )
            )}
          </select>
        </div>

        <div className="address-field">
          <label>
            P.O. Box
          </label>

          <input
            type="text"
            value={address.poBox}
            onChange={(e) =>
              handleAddressChange(
                "poBox",
                e.target.value
              )
            }
            placeholder="Optional"
          />
        </div>

        <div className="address-field">
          <label>
            Country
          </label>

          <input
            type="text"
            value="Bahrain"
            readOnly
          />
        </div>

      </div>

      <div className="map-container">

        <MapContainer
          center={[
            position.lat,
            position.lng,
          ]}
          zoom={16}
          scrollWheelZoom={true}
          style={{
            height: "300px",
            width: "100%",
          }}
        >

          <TileLayer
            attribution="© OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController
            position={position}
          />

          <LocationMarker
            position={position}
            setPosition={setPosition}
            reverseGeocode={
              reverseGeocode
            }
          />

        </MapContainer>

      </div>

      <div className="location-details">

        <strong>
          Selected GPS Location
        </strong>

        <small>
          Latitude:{" "}
          {position.lat.toFixed(6)}
        </small>

        <small>
          Longitude:{" "}
          {position.lng.toFixed(6)}
        </small>

      </div>

      <p className="map-help">
        Drag the marker or click on the
        map to adjust the exact location.
      </p>

      <p className="map-attribution">
        Map © OpenStreetMap contributors
      </p>

    </div>
  );
}

export default LocationPicker;