import React, { useState, useEffect, useRef } from 'react'
import '../../CSS/Master.css'

const App = () => {
  const [location, setLocation] = useState(null) // { lat, lng }
  const [locationInput, setLocationInput] = useState('')
  const [transportMode, setTransportMode] = useState('')
  const [transportInput, setTransportInput] = useState('')
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [places, setPlaces] = useState([])
  const locationInputRef = useRef(null)
  const transportInputRef = useRef(null)
  const dropdownRef = useRef(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  const apiKey = 'AIzaSyCmt0pZZUQmVayZvjHfVHdF_7pVZUKCAsg' // Your Google API key

  // Load Google Maps JavaScript API dynamically
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.onload = () => setScriptLoaded(true)
      script.onerror = () => console.error('Failed to load Google Maps script')
      document.body.appendChild(script)
    } else {
      setScriptLoaded(true)
    }
  }, [apiKey])

  // Initialize Google Places Autocomplete for location input
  useEffect(() => {
    if (!scriptLoaded || !locationInputRef.current) return

    const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
      types: ['geocode'],
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (place.geometry) {
        const newLocation = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }
        setLocation(newLocation)
        console.log('newLocation', newLocation)

        setLocationInput(place.formatted_address)
        setPlaces([])
        setTransportInput('')
        setTransportMode('')
        setDropdownVisible(false)
      }
    })
  }, [scriptLoaded])

  // Fetch nearby places using PlacesService
  const fetchNearbyPlaces = (latLng, type, radius, callback) => {
    const service = new window.google.maps.places.PlacesService(document.createElement('div'))
    service.nearbySearch(
      {
        location: latLng,
        radius: radius, // Use dynamic radius
        type: type,
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          callback(results || [])
        } else {
          callback([])
          console.log(`No results for ${type} with radius ${radius}: ${status}`)
        }
      },
    )
  }

  // Filter places to match the exact type
  const filterPlacesByType = (places, mode) => {
    const typeMap = {
      'Railway Station': 'train_station',
      Airport: 'airport',
      'Bus Stand': 'bus_station',
    }
    const expectedType = typeMap[mode]

    // Log raw results for debugging
    console.log(
      `Raw results for ${mode}:`,
      places.map((p) => ({ name: p.name, types: p.types })),
    )

    const filtered = places.filter((place) => {
      const types = place.types
      const name = place.name.toLowerCase()

      // Must include the expected type
      const hasExpectedType = types.includes(expectedType)

      // Strict check for Airport only
      if (mode === 'Airport') {
        // Exclude unwanted secondary types and enforce name filter
        const noUnwantedTypes = !types.some(
          (type) =>
            ['store', 'health', 'food'].includes(type) &&
            !['airport', 'train_station', 'bus_station'].includes(type),
        )
        return (
          hasExpectedType &&
          noUnwantedTypes &&
          (name.includes('airport') || name === 'cjb' || name.includes('kovai'))
        )
      }

      // Normal check for Railway Station and Bus Stand: only require the expected type
      return hasExpectedType
    })

    // Log filtered results for debugging
    console.log(
      `Filtered results for ${mode}:`,
      filtered.map((p) => ({ name: p.name, types: p.types })),
    )
    return filtered
  }

  // Fetch places based on selected transport mode with dynamic radius
  const fetchPlacesByMode = (lat, lng, mode) => {
    if (!window.google || !scriptLoaded) return

    const latLng = new window.google.maps.LatLng(lat, lng)
    const typeMap = {
      'Railway Station': 'train_station',
      Airport: 'airport',
      'Bus Stand': 'bus_station',
    }

    // Set radius based on transport mode
    const radiusMap = {
      Airport: 20000, // 20 km for Airport
      'Railway Station': 5000, // 5 km for Railway Station
      'Bus Stand': 5000, // 5 km for Bus Stand
    }
    const selectedRadius = mode ? radiusMap[mode] : 5000 // Default to 5 km if no mode

    if (!mode) {
      // Fetch all if no mode selected (using 5 km default for consistency)
      Promise.all([
        new Promise((resolve) => fetchNearbyPlaces(latLng, 'airport', 20000, resolve)), // 20 km for airports
        new Promise((resolve) => fetchNearbyPlaces(latLng, 'train_station', 5000, resolve)), // 5 km
        new Promise((resolve) => fetchNearbyPlaces(latLng, 'bus_station', 5000, resolve)), // 5 km
      ])
        .then(([airports, trainStations, busStations]) => {
          setPlaces([...airports, ...trainStations, ...busStations])
        })
        .catch((error) => {
          console.error('Error fetching places:', error)
          setPlaces([])
        })
    } else {
      // Fetch and filter only the selected type with appropriate radius
      fetchNearbyPlaces(latLng, typeMap[mode], selectedRadius, (results) => {
        const filteredPlaces = filterPlacesByType(results, mode)
        setPlaces(filteredPlaces)
      })
    }
  }

  // Handle transport input focus
  const handleTransportFocus = () => {
    if (!location) {
      alert('Please enter a location first.')
      return
    }
    setDropdownVisible(true)
    fetchPlacesByMode(location.lat, location.lng, transportMode)
  }

  // Handle clicking a dropdown item
  const handleItemClick = (placeName) => {
    setTransportInput(placeName)
    setDropdownVisible(false)
  }

  // Hide dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        transportInputRef.current &&
        !transportInputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="app">
      <div className="container">
        <form>
          <div className="input-group">
            <label>Location:</label>
            <input
              ref={locationInputRef}
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Enter a location (e.g., Gandhipuram)"
              className="input"
              disabled={!scriptLoaded}
            />
          </div>
          <div className="input-group">
            <label>Transport Mode:</label>
            <select
              value={transportMode}
              onChange={(e) => {
                setTransportMode(e.target.value)
                setTransportInput('')
                setPlaces([])
                setDropdownVisible(false)
              }}
              className="input"
              disabled={!scriptLoaded}
            >
              <option value="">-- Select Transport Mode --</option>
              <option value="Railway Station">Railway Station</option>
              <option value="Airport">Airport</option>
              <option value="Bus Stand">Bus Stand</option>
            </select>
          </div>
          <div className="input-group">
            <label>Nearby Transport:</label>
            <input
              ref={transportInputRef}
              type="text"
              value={transportInput}
              onChange={(e) => setTransportInput(e.target.value)}
              onFocus={handleTransportFocus}
              placeholder="Click to select nearby transport"
              className="input"
              disabled={!scriptLoaded || !location}
            />
            {dropdownVisible && (
              <div ref={dropdownRef} className="dropdown">
                {places.length === 0 ? (
                  <div className="dropdown-item">Loading or no nearby transport found</div>
                ) : (
                  places.map((place) => (
                    <div
                      key={place.place_id}
                      className="dropdown-item"
                      onClick={() => handleItemClick(place.name)}
                    >
                      {place.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default App
