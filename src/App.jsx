import ChargerAssistant from './components/ChargerAssistant'
import { useEffect, useMemo, useState } from 'react'
import './App.css'

const CITIES = [
  'Mumbai', 'Pune', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata',
  'Ahmedabad', 'Jaipur', 'Lucknow', 'Indore', 'Nagpur', 'Surat', 'Kochi',
  'Chandigarh',
]

const STORAGE = {
  chargers: 'whatacharger_chargers_v2',
  accounts: 'whatacharger_host_accounts_v2',
  bookings: 'whatacharger_bookings_v2',
  session: 'whatacharger_host_session_v2',
}


const SEED_CHARGERS = [
  {
    id: 'CH001', name: 'Green Charge Hub', type: 'Home charger',
    location: 'Kothrud, Pune', city: 'Pune', area: 'Kothrud',
    address: 'Kothrud, Pune, Maharashtra', price: 18, vehicles: ['Car', 'Bike'],
    available: true, emoji: '🏡', color: 'mint', connector: 'Standard socket',
    power: '3.3', latitude: 18.5074, longitude: 73.8077, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH002', name: 'Baner Power Point', type: 'Business charger',
    location: 'Baner, Pune', city: 'Pune', area: 'Baner',
    address: 'Baner, Pune, Maharashtra', price: 22, vehicles: ['Car', 'Bike'],
    available: true, emoji: '⚡', color: 'peach', connector: 'Type 2',
    power: '7.4', latitude: 18.5590, longitude: 73.7868, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH003', name: 'Aundh Home Charging', type: 'Home charger',
    location: 'Aundh, Pune', city: 'Pune', area: 'Aundh',
    address: 'Aundh, Pune, Maharashtra', price: 16, vehicles: ['Car', 'Bike'],
    available: true, emoji: '🏡', color: 'lavender', connector: 'Standard socket',
    power: '3.3', latitude: 18.5600, longitude: 73.8070, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH004', name: 'Hinjawadi Charge Spot', type: 'Business charger',
    location: 'Hinjawadi Phase 1, Pune', city: 'Pune', area: 'Hinjawadi Phase 1',
    address: 'Hinjawadi Phase 1, Pune, Maharashtra', price: 20, vehicles: ['Car', 'Bike'],
    available: true, emoji: '⚡', color: 'mint', connector: 'Type 2',
    power: '7.4', latitude: 18.5913, longitude: 73.7389, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH005', name: 'Wakad EV Stop', type: 'Home charger',
    location: 'Wakad, Pune', city: 'Pune', area: 'Wakad',
    address: 'Wakad, Pune, Maharashtra', price: 17, vehicles: ['Car', 'Bike'],
    available: true, emoji: '🏡', color: 'peach', connector: 'Standard socket',
    power: '3.3', latitude: 18.5987, longitude: 73.7620, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH006', name: 'Viman Nagar Charge Point', type: 'Business charger',
    location: 'Viman Nagar, Pune', city: 'Pune', area: 'Viman Nagar',
    address: 'Viman Nagar, Pune, Maharashtra', price: 24, vehicles: ['Car', 'Bike'],
    available: true, emoji: '⚡', color: 'lavender', connector: 'Type 2',
    power: '7.4', latitude: 18.5679, longitude: 73.9143, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH007', name: 'Kharadi Green Plug', type: 'Home charger',
    location: 'Kharadi, Pune', city: 'Pune', area: 'Kharadi',
    address: 'Kharadi, Pune, Maharashtra', price: 19, vehicles: ['Car', 'Bike'],
    available: true, emoji: '🏡', color: 'mint', connector: 'Standard socket',
    power: '3.3', latitude: 18.5515, longitude: 73.9470, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH008', name: 'Pimpri EV Corner', type: 'Business charger',
    location: 'Pimpri, Pune', city: 'Pune', area: 'Pimpri',
    address: 'Pimpri, Pune, Maharashtra', price: 15, vehicles: ['Car', 'Bike'],
    available: true, emoji: '⚡', color: 'peach', connector: 'Type 2',
    power: '7.4', latitude: 18.6298, longitude: 73.7997, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH009', name: 'Shivajinagar Power Hub', type: 'Business charger',
    location: 'Shivajinagar, Pune', city: 'Pune', area: 'Shivajinagar',
    address: 'Shivajinagar, Pune, Maharashtra', price: 21, vehicles: ['Car', 'Bike'],
    available: true, emoji: '⚡', color: 'lavender', connector: 'Type 2',
    power: '7.4', latitude: 18.5308, longitude: 73.8475, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH010', name: 'Katraj Home Plug', type: 'Home charger',
    location: 'Katraj, Pune', city: 'Pune', area: 'Katraj',
    address: 'Katraj, Pune, Maharashtra', price: 16, vehicles: ['Car', 'Bike'],
    available: true, emoji: '🏡', color: 'mint', connector: 'Standard socket',
    power: '3.3', latitude: 18.4529, longitude: 73.8652, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH011', name: 'Andheri Charge Point', type: 'Business charger',
    location: 'Andheri West, Mumbai', city: 'Mumbai', area: 'Andheri West',
    address: 'Andheri West, Mumbai, Maharashtra', price: 25, vehicles: ['Car', 'Bike'],
    available: true, emoji: '⚡', color: 'peach', connector: 'Type 2',
    power: '7.4', latitude: 19.1364, longitude: 72.8277, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH012', name: 'Powai Green Charge', type: 'Home charger',
    location: 'Powai, Mumbai', city: 'Mumbai', area: 'Powai',
    address: 'Powai, Mumbai, Maharashtra', price: 22, vehicles: ['Car', 'Bike'],
    available: true, emoji: '🏡', color: 'lavender', connector: 'Standard socket',
    power: '3.3', latitude: 19.1176, longitude: 72.9060, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH013', name: 'Bandra EV Point', type: 'Business charger',
    location: 'Bandra West, Mumbai', city: 'Mumbai', area: 'Bandra West',
    address: 'Bandra West, Mumbai, Maharashtra', price: 26, vehicles: ['Car', 'Bike'],
    available: true, emoji: '⚡', color: 'mint', connector: 'Type 2',
    power: '7.4', latitude: 19.0607, longitude: 72.8362, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH014', name: 'Thane Home Charge', type: 'Home charger',
    location: 'Thane West, Thane', city: 'Mumbai', area: 'Thane West',
    address: 'Thane West, Maharashtra', price: 18, vehicles: ['Car', 'Bike'],
    available: true, emoji: '🏡', color: 'peach', connector: 'Standard socket',
    power: '3.3', latitude: 19.2183, longitude: 72.9781, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH015', name: 'Navi Mumbai Power Stop', type: 'Business charger',
    location: 'Vashi, Navi Mumbai', city: 'Mumbai', area: 'Vashi',
    address: 'Vashi, Navi Mumbai, Maharashtra', price: 23, vehicles: ['Car', 'Bike'],
    available: true, emoji: '⚡', color: 'lavender', connector: 'Type 2',
    power: '7.4', latitude: 19.0771, longitude: 72.9987, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH016', name: 'Lonavala Roadside Plug', type: 'Business charger',
    location: 'Lonavala, Maharashtra', city: 'Pune', area: 'Lonavala',
    address: 'Lonavala, Maharashtra', price: 20, vehicles: ['Car', 'Bike'],
    available: true, emoji: '⚡', color: 'mint', connector: 'Type 2',
    power: '7.4', latitude: 18.7546, longitude: 73.4062, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH017', name: 'Nashik Green Plug', type: 'Home charger',
    location: 'College Road, Nashik', city: 'Nashik', area: 'College Road',
    address: 'College Road, Nashik, Maharashtra', price: 17, vehicles: ['Car', 'Bike'],
    available: true, emoji: '🏡', color: 'peach', connector: 'Standard socket',
    power: '3.3', latitude: 20.0059, longitude: 73.7635, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH018', name: 'Kolhapur EV Corner', type: 'Business charger',
    location: 'Tarabai Park, Kolhapur', city: 'Kolhapur', area: 'Tarabai Park',
    address: 'Tarabai Park, Kolhapur, Maharashtra', price: 19, vehicles: ['Car', 'Bike'],
    available: true, emoji: '⚡', color: 'lavender', connector: 'Type 2',
    power: '7.4', latitude: 16.7049, longitude: 74.2433, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH019', name: 'Satara Home Charging', type: 'Home charger',
    location: 'Sadar Bazar, Satara', city: 'Satara', area: 'Sadar Bazar',
    address: 'Satara, Maharashtra', price: 15, vehicles: ['Car', 'Bike'],
    available: true, emoji: '🏡', color: 'mint', connector: 'Standard socket',
    power: '3.3', latitude: 17.6805, longitude: 74.0183, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH020', name: 'Solapur EV Power Point', type: 'Business charger',
    location: 'Hotgi Road, Solapur', city: 'Solapur', area: 'Hotgi Road',
    address: 'Hotgi Road, Solapur, Maharashtra', price: 18, vehicles: ['Car', 'Bike'],
    available: true, emoji: '⚡', color: 'peach', connector: 'Type 2',
    power: '7.4', latitude: 17.6599, longitude: 75.9064, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },


  {
    id: 'CH002', name: 'The Daily Grind', type: 'Cafe charging',
    location: 'Baner, Pune', city: 'Pune', area: 'Baner',
    address: 'Baner, Pune, Maharashtra', price: 22, vehicles: ['Car'],
    available: true, emoji: '☕', color: 'peach', connector: 'Type 2',
    power: '7.4', latitude: 18.5590, longitude: 73.7868, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
  {
    id: 'CH003', name: 'City Power Point', type: 'Business charger',
    location: 'Aundh, Pune', city: 'Pune', area: 'Aundh',
    address: 'Aundh, Pune, Maharashtra', price: 15, vehicles: ['Bike'],
    available: false, emoji: '⚡', color: 'lavender', connector: 'Standard socket',
    power: '3.3', latitude: 18.5580, longitude: 73.8070, hostEmail: '',
    hostName: 'Demo host', demo: true,
  },
]

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function distanceKm(aLat, aLon, bLat, bLon) {
  if ([aLat, aLon, bLat, bLon].some((value) => value === null || value === undefined || value === '' || !Number.isFinite(Number(value)))) return null
  const rad = (value) => (Number(value) * Math.PI) / 180
  const dLat = rad(Number(bLat) - Number(aLat))
  const dLon = rad(Number(bLon) - Number(aLon))
  const lat1 = rad(Number(aLat))
  const lat2 = rad(Number(bLat))
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const mapsUrl = (charger) => {
  if (
    charger.latitude != null &&
    charger.longitude != null &&
    charger.latitude !== "" &&
    charger.longitude !== ""
  ) {
    return `https://www.google.com/maps/dir/?api=1&destination=${charger.latitude},${charger.longitude}`;
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    charger.location || charger.address || charger.name
  )}`;
};
function App() {
 
const [chargers, setChargers] = useState(() => {
  const savedChargers = readStorage(STORAGE.chargers, null);

  if (!Array.isArray(savedChargers)) {
    return SEED_CHARGERS;
  }

  const savedDemoIds = new Set(
    savedChargers
      .filter((charger) => charger.demo)
      .map((charger) => charger.id)
  );

  const newDemoChargers = SEED_CHARGERS.filter(
    (charger) => !savedDemoIds.has(charger.id)
  );

  return [...savedChargers, ...newDemoChargers];
});

  const [accounts, setAccounts] = useState(() => readStorage(STORAGE.accounts, []))
  const [bookings, setBookings] = useState(() => readStorage(STORAGE.bookings, []))
  const [host, setHost] = useState(() => readStorage(STORAGE.session, null))

  const [location, setLocation] = useState('Pune')
  const [cityChoice, setCityChoice] = useState('Pune')
  const [vehicle, setVehicle] = useState('All')
  const [budget, setBudget] = useState('Any')
  const [search, setSearch] = useState('')
  const [gps, setGps] = useState(null)
  const [gpsMessage, setGpsMessage] = useState('')
  const [gpsLoading, setGpsLoading] = useState(false)

  const [page, setPage] = useState('home')
  const [bookingLookupEmail, setBookingLookupEmail] = useState('')
  const [bookingLookupSubmitted, setBookingLookupSubmitted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hostName, setHostName] = useState('')
  const [hostEmail, setHostEmail] = useState('')
  const [hostPassword, setHostPassword] = useState('')
  const [hostError, setHostError] = useState('')
  const [hostMode, setHostMode] = useState('login')

  const [booking, setBooking] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [bookingMessage, setBookingMessage] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  const emptyChargerForm = {
    name: '', type: 'Home charger', city: 'Pune', area: '', address: '',
    price: '18', vehicles: ['Car', 'Bike'], connector: 'Standard socket',
    power: '3.3', latitude: '', longitude: '',
  }
  const [chargerForm, setChargerForm] = useState(emptyChargerForm)
  const [chargerFormMessage, setChargerFormMessage] = useState('')

  useEffect(() => localStorage.setItem(STORAGE.chargers, JSON.stringify(chargers)), [chargers])
  useEffect(() => localStorage.setItem(STORAGE.accounts, JSON.stringify(accounts)), [accounts])
  useEffect(() => localStorage.setItem(STORAGE.bookings, JSON.stringify(bookings)), [bookings])
  useEffect(() => {
    if (host) localStorage.setItem(STORAGE.session, JSON.stringify(host))
    else localStorage.removeItem(STORAGE.session)
  }, [host])

  function openHostLogin() {
    setPage(host ? 'hostDashboard' : 'hostLogin')
    setHostMode('login')
    setHostError('')
    setMenuOpen(false)
  }

  function handleCurrentLocation(forHostForm = false) {
    if (!navigator.geolocation) {
      setGpsMessage('Your browser does not support GPS location. You can enter a city or address manually.')
      return
      
    }
    setGpsLoading(true)
    setGpsMessage('Requesting location permission…')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        const point = { latitude, longitude }
        setGps(point)
        setGpsMessage(`GPS detected: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
        if (forHostForm) {
          setChargerForm((previous) => ({
            ...previous,
            latitude: latitude.toFixed(6),
            longitude: longitude.toFixed(6),
            address: previous.address || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
          }))
        } else {
          setLocation(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
          setCityChoice('')
          document.getElementById('chargers')?.scrollIntoView({ behavior: 'smooth' })
        }
        setGpsLoading(false)
      },
      (error) => {
        const message = error.code === 1
          ? 'Location permission was denied. Allow location access in your browser, or type your city/area.'
          : error.code === 2
            ? 'Your location could not be detected. Check your device location settings or enter a city manually.'
            : 'GPS request timed out. Try again or enter a city manually.'
        setGpsMessage(message)
        setGpsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
    )
  }

  const filteredChargers = useMemo(() => {
    const query = search.trim().toLowerCase()
    const locationQuery = location.trim().toLowerCase()
    let result = chargers.filter((charger) => {
      const matchesVehicle = vehicle === 'All' || charger.vehicles.includes(vehicle)
      const matchesBudget = budget === 'Any' || Number(charger.price) <= Number(budget)
      const searchable = `${charger.name} ${charger.location} ${charger.type} ${charger.city} ${charger.area} ${charger.address} ${charger.hostName}`.toLowerCase()
      const matchesSearch = !query || searchable.includes(query)
      const isGpsSearch = Boolean(gps) && (locationQuery.includes(',') || locationQuery.includes('gps'))
      const matchesLocation = !locationQuery || isGpsSearch || searchable.includes(locationQuery)
      return matchesVehicle && matchesBudget && matchesSearch && matchesLocation
    })
    if (gps) {
      result = [...result].map((charger) => ({
        ...charger,
        distance: distanceKm(gps.latitude, gps.longitude, charger.latitude, charger.longitude),
      })).sort((a, b) => {
        if (a.distance === null) return 1
        if (b.distance === null) return -1
        return a.distance - b.distance
      })
    }
    return result
  }, [chargers, vehicle, budget, search, location, gps])

  function handleHostLogin(event) {
    event.preventDefault()
    setHostError('')
    const email = hostEmail.trim().toLowerCase()
    if (!email || !hostPassword) {
      setHostError('Please enter your email and password.')
      return
    }

    if (hostMode === 'signup') {
      if (hostPassword.length < 6) {
        setHostError('Password must be at least 6 characters.')
        return
      }
      if (accounts.some((account) => account.email === email)) {
        setHostError('An account with this email already exists. Please sign in.')
        return
      }
      const account = {
        id: `HOST-${Date.now()}`,
        name: hostName.trim() || email.split('@')[0],
        email,
        password: hostPassword,
      }
      setAccounts((previous) => [...previous, account])
      setHost({ id: account.id, name: account.name, email: account.email })
      setHostName(account.name)
      setHostPassword('')
      setPage('hostDashboard')
      return
    }

    const account = accounts.find((item) => item.email === email && item.password === hostPassword)
    if (!account) {
      setHostError('Account not found or password is incorrect. Create an account first if you are a new host.')
      return
    }
    setHost({ id: account.id, name: account.name, email: account.email })
    setHostName(account.name)
    setHostPassword('')
    setPage('hostDashboard')
  }

  function openAddCharger() {
    setChargerForm({ ...emptyChargerForm, city: CITIES.includes(cityChoice) ? cityChoice : 'Pune' })
    setChargerFormMessage('')
    setPage('addCharger')
  }

  function toggleVehicle(vehicleName) {
    setChargerForm((previous) => ({
      ...previous,
      vehicles: previous.vehicles.includes(vehicleName)
        ? previous.vehicles.filter((item) => item !== vehicleName)
        : [...previous.vehicles, vehicleName],
    }))
  }

  function saveCharger(event) {
    event.preventDefault()
    setChargerFormMessage('')
    if (!host) {
      setPage('hostLogin')
      setHostError('Please sign in as a host before adding a charger.')
      return
    }
    if (!chargerForm.vehicles.length) {
      setChargerFormMessage('Choose at least one supported vehicle type.')
      return
    }
    if (!chargerForm.area.trim() || !chargerForm.address.trim()) {
      setChargerFormMessage('Please add the charger area and full address so drivers can find it.')
      return
    }
    const latitude = chargerForm.latitude.trim() === '' ? null : Number(chargerForm.latitude)
    const longitude = chargerForm.longitude.trim() === '' ? null : Number(chargerForm.longitude)
    if ((latitude === null) !== (longitude === null) || (latitude !== null && (!Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180))) {
      setChargerFormMessage('Enter valid latitude and longitude, or use the GPS button to fill both.')
      return
    }
    const charger = {
      ...chargerForm,
      id: `CH-${Date.now()}`,
      price: Number(chargerForm.price),
      power: Number(chargerForm.power),
      latitude,
      longitude,
      location: `${chargerForm.area.trim()}, ${chargerForm.city}`,
      available: true,
      emoji: chargerForm.type.toLowerCase().includes('cafe') ? '☕' : chargerForm.type.toLowerCase().includes('business') ? '⚡' : '🏡',
      color: ['mint', 'peach', 'lavender'][chargers.length % 3],
      hostEmail: host.email,
      hostId: host.id,
      hostName: host.name,
      demo: false,
      createdAt: new Date().toISOString(),
    }
    setChargers((previous) => [charger, ...previous])
    setChargerForm({ ...emptyChargerForm, city: charger.city })
    setChargerFormMessage('Charger published! It is now visible in Find Chargers.')
    setPage('hostDashboard')
  }

  function deleteCharger(chargerId) {
    const hasPendingBooking = bookings.some((item) => item.chargerId === chargerId && item.status !== 'declined')
    if (hasPendingBooking) {
      setHostError('This charger has booking requests. Resolve those requests before removing the listing.')
      return
    }
    setChargers((previous) => previous.filter((item) => !(item.id === chargerId && item.hostEmail === host?.email)))
    setHostError('Charger listing removed.')
  }

  function confirmBooking(event) {
    event.preventDefault()
    if (!booking || bookingLoading) return
    setBookingLoading(true)
    setBookingMessage('')
    const newBooking = {
      bookingId: `WAC-${Date.now().toString().slice(-8)}`,
      chargerId: booking.id,
      chargerName: booking.name,
      chargerLocation: booking.location,
      chargerPrice: Number(booking.price),
      hostEmail: booking.hostEmail || '',
      hostName: booking.hostName || 'Demo host',
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    setBookings((previous) => [newBooking, ...previous])
    setBookingMessage(`Request submitted! Reference: ${newBooking.bookingId}. The host can review this request in their dashboard.`)
    setBookingLoading(false)
  }

  function updateBookingStatus(bookingId, status) {
    setBookings((previous) => previous.map((item) =>
      item.bookingId === bookingId && item.hostEmail === host?.email ? { ...item, status } : item
    ))
    setHostError(`Booking ${status}.`)
  }

  function goHome() {
    setPage('home')
    setMenuOpen(false)
  }

  const myChargers = host ? chargers.filter((charger) => charger.hostEmail === host.email) : []
  const myBookings = host ? bookings.filter((item) => item.hostEmail === host.email) : []
  const statusLabel = (status) => status === 'accepted' ? 'Accepted' : status === 'declined' ? 'Declined' : 'Pending'

  
  const customerBookings = bookings.filter(
    (item) =>
      bookingLookupEmail.trim() !== '' &&
      item.customerEmail === bookingLookupEmail.trim().toLowerCase()
  )

  return (
    <div className="app-shell">
      <header className="navbar">
        <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); goHome() }}>
          <span className="brand-icon">ϟ</span>
          <span>WhatA<span className="brand-green">Charger</span></span>
        </a>

        <button className="menu-toggle" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation">☰</button>

        <nav className={menuOpen ? 'nav-links nav-open' : 'nav-links'}>
          <a href="#home" onClick={(event) => { event.preventDefault(); goHome() }}>Home</a>
          <a href="#chargers" onClick={(event) => { event.preventDefault(); goHome(); setTimeout(() => document.getElementById('chargers')?.scrollIntoView({ behavior: 'smooth' }), 0); setMenuOpen(false) }}>Find Chargers</a>
          <a href="#hosts" onClick={(event) => { event.preventDefault(); goHome(); setTimeout(() => document.getElementById('hosts')?.scrollIntoView({ behavior: 'smooth' }), 0); setMenuOpen(false) }}>For Hosts</a>
          <a href="#how-it-works" onClick={(event) => { event.preventDefault(); goHome(); setTimeout(() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }), 0); setMenuOpen(false) }}>How it works</a>
       <a href="#my-bookings" onClick={(event) => {
  event.preventDefault()
  setPage('myBookings')
  setMenuOpen(false)
}}>My Bookings</a>
        </nav>

        <button className="nav-cta" onClick={openHostLogin}>{host ? 'Host Dashboard ↗' : 'Host Login ↗'}</button>
      </header>

      {page === 'home' && (
        <main>
          <section className="hero" id="home">
            <div className="hero-copy">
              <span className="eyebrow">⚡ THE FUTURE IS CHARGED</span>
              <h1>Your next charge.<br /><span>Just around</span><br />the corner.</h1>
              <p className="hero-description">Find nearby EV chargers at homes, cafes and local businesses. Charge your way, without the worry.</p>

              <form className="search-panel" onSubmit={(event) => {
                event.preventDefault()
                document.getElementById('chargers')?.scrollIntoView({ behavior: 'smooth' })
              }}>
                <label className="search-field">
                  <span>📍 Your location</span>
                  <input list="supported-cities" value={location} onChange={(event) => { setLocation(event.target.value); setGps(null); setCityChoice(CITIES.includes(event.target.value) ? event.target.value : '') }} placeholder="Enter city, area or address" />
                  <datalist id="supported-cities">{CITIES.map((city) => <option value={city} key={city} />)}</datalist>
                </label>
                <button className="secondary-button gps-button" type="button" onClick={() => handleCurrentLocation(false)} disabled={gpsLoading}>
                  {gpsLoading ? 'Finding GPS…' : '◎ Use my GPS'}
                </button>
                <label className="search-field">
                  <span>🚗 Vehicle</span>
                  <select value={vehicle} onChange={(event) => setVehicle(event.target.value)}>
                    <option value="All">All EVs</option>
                    <option value="Car">Electric car</option>
                    <option value="Bike">Electric two-wheeler</option>
                  </select>
                </label>
                <label className="search-field">
                  <span>₹ Maximum / kWh</span>
                  <select value={budget} onChange={(event) => setBudget(event.target.value)}>
                    <option value="Any">Any price</option>
                    <option value="15">₹15 or less</option>
                    <option value="20">₹20 or less</option>
                    <option value="25">₹25 or less</option>
                    <option value="30">₹30 or less</option>
                    <option value="50">₹50 or less</option>
                  </select>
                </label>
                <button className="search-button" type="submit">Find chargers →</button>
              </form>
              {gpsMessage && <p className="gps-message" role="status">{gpsMessage}</p>}
              <div className="hero-promises">
                <span>✓ Easy discovery</span><span>✓ Local hosts</span><span>✓ Transparent prices</span>
              </div>
            </div>

            <div className="hero-art" aria-label="Electric vehicle charging illustration">
              <div className="sun-orb" /><div className="art-cloud cloud-one" /><div className="art-cloud cloud-two" />
              <div className="hill hill-back" /><div className="hill hill-front" /><div className="charging-pole"><div className="pole-top">ϟ</div><div className="pole-screen" /><div className="pole-light" /><div className="pole-base" /></div>
              <svg className="charging-cable" viewBox="0 0 180 160" fill="none" aria-hidden="true"><path d="M35 0 V38 C35 68 100 48 100 95 V125" stroke="#174C42" strokeWidth="7" strokeLinecap="round" /><path d="M35 0 V38 C35 68 100 48 100 95 V125" stroke="#A2E6C0" strokeWidth="3" strokeLinecap="round" /></svg>
              <div className="road" /><div className="electric-car"><div className="car-roof" /><div className="car-window" /><div className="car-body"><span className="car-light" /><span className="car-door-line" /><span className="car-charge-port">ϟ</span></div><div className="wheel wheel-left"><span /></div><div className="wheel wheel-right"><span /></div></div>
              <div className="floating-note"><span className="note-icon">ϟ</span><div><strong>Plug into possibility.</strong><span>Powering your next adventure</span></div></div>
              <span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✦</span>
            </div>
          </section>

          <section className="benefits" aria-label="Our benefits">
            <div><span className="benefit-icon mint-icon">⌖</span><div><strong>Find nearby</strong><p>Discover local chargers</p></div></div>
            <div><span className="benefit-icon blue-icon">↗</span><div><strong>Book ahead</strong><p>Send a request to a host</p></div></div>
            <div><span className="benefit-icon purple-icon">♡</span><div><strong>Meet local hosts</strong><p>Charge in your community</p></div></div>
            <div><span className="benefit-icon orange-icon">ϟ</span><div><strong>Drive greener</strong><p>Make every trip count</p></div></div>
          </section>

          <section className="charger-section" id="chargers">
            <div className="section-heading">
              <div><span className="eyebrow">YOUR NEXT STOP</span><h2>Good places to <span>plug in.</span></h2><p>Search by city or area, or use GPS to sort by distance. {gps ? 'Results are ordered nearest to your detected position.' : `Showing listings matching ${location.trim() || 'all locations'}.`}</p></div>
              <span className="sample-label">DEMO + HOST LISTINGS</span>
            </div>

            <div className="results-toolbar">
              <label className="quick-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search charger, area, address or host" /></label>
              <span className="result-count">{filteredChargers.length} locations</span>
            </div>

            <div className="charger-grid">
              {filteredChargers.map((charger) => {
                const activeBooking = bookings.find(
  (item) =>
    item.chargerId === charger.id &&
    (item.status === 'pending' || item.status === 'accepted')
)
                const distance = charger.distance
                return (
                  <article className="charger-card" key={charger.id}>
                    <div className={`charger-art ${charger.color || 'mint'}`}>
                      <span className="charger-emoji">{charger.emoji || '⚡'}</span>
                      <span className={charger.available ? 'availability' : 'availability unavailable'}>{charger.available ? '● Available' : '● Unavailable'}</span>
                      <span className="charger-art-label">{charger.demo ? 'DEMO LISTING' : 'COMMUNITY HOST'}</span>
                    </div>
                    <div className="charger-info">
                      <span className="charger-type">{charger.type}</span><h3>{charger.name}</h3>
                      <p className="charger-location">📍 {charger.location}</p>
                      <p className="charger-address">{charger.address}</p>
                      {distance !== undefined && distance !== null && <p className="charger-distance">◎ {distance.toFixed(1)} km from your GPS location</p>}
                      <p className="charger-host">Host: {charger.hostName || 'Local host'}</p>
                      <div className="charger-bottom">
                        <div className="price"><strong>₹{charger.price}</strong><span>/ kWh</span></div>
                        <button
  className="book-button"
  disabled={!charger.available || !!activeBooking}
  onClick={() => {
    setBooking(charger)
    setCustomerName('')
    setCustomerEmail('')
    setCustomerPhone('')
    setBookingMessage('')
  }}
>
  {activeBooking
    ? activeBooking.status === 'accepted'
      ? 'Booked ✓'
      : 'Request Sent ✓'
    : 'Request booking →'}
</button>
                      </div>
                      <div className="vehicle-tags">{(charger.vehicles || []).map((item) => <span key={item}>{item === 'Car' ? '🚗' : '🛵'} {item}</span>)}</div>
                      
<div className="charger-actions">
  <a
    href={
      charger.latitude != null &&
      charger.longitude != null &&
      charger.latitude !== "" &&
      charger.longitude !== ""
        ? `https://www.google.com/maps/dir/?api=1&destination=${charger.latitude},${charger.longitude}`
        : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
            charger.location || charger.address || charger.name
          )}`
    }
    target="_blank"
    rel="noopener noreferrer"
  >
    📍 Get Directions
  </a>

  <a
    href={
      charger.latitude != null &&
      charger.longitude != null &&
      charger.latitude !== "" &&
      charger.longitude !== ""
        ? `https://www.google.com/maps/search/?api=1&query=${charger.latitude},${charger.longitude}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            charger.location || charger.address || charger.name
          )}`
    }
    target="_blank"
    rel="noopener noreferrer"
  >
    🗺️ View on Map
  </a>
</div>

                    </div>
                  </article>
                )
              })}
            </div>

            {filteredChargers.length === 0 && (
              <div className="empty-state"><span>🔎</span><h3>No matching chargers yet</h3><p>Try another city or clear the filters. Hosts can add new chargers from the host dashboard.</p><button className="secondary-button" onClick={() => { setSearch(''); setLocation(''); setCityChoice(''); setGps(null); setVehicle('All'); setBudget('Any') }}>Clear filters</button></div>
            )}
          </section>

          <section className="how-section" id="how-it-works">
            <div className="how-intro"><span className="eyebrow">SIMPLE AS PLUG AND GO</span><h2>Less searching.<br /><span>More exploring.</span></h2><p>Your next charging stop is only a few steps away.</p></div>
            <div className="steps">
              <div className="step"><span>01</span><div><h3>Find your fit</h3><p>Search by area, vehicle, budget or GPS.</p></div></div>
              <div className="step"><span>02</span><div><h3>Check the location</h3><p>See the host's address and open directions.</p></div></div>
              <div className="step"><span>03</span><div><h3>Request your slot</h3><p>Submit your contact details to the host.</p></div></div>
              <div className="step"><span>04</span><div><h3>Wait for the host</h3><p>Your request appears in the host dashboard.</p></div></div>
            </div>
          </section>

          <section className="host-banner" id="hosts">
            <div className="host-icon">🏡</div>
            <div><span className="eyebrow">OPEN YOUR DOOR TO EVs</span><h2>Got a charger? <span>Make it count.</span></h2><p>Homes, cafes, garages and small businesses can list a charging point, set a price and receive booking requests.</p></div>
            <button className="host-button" onClick={openHostLogin}>{host ? 'Open host dashboard ↗' : 'Become a host ↗'}</button>
          </section>

          <footer className="footer">
            <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); goHome() }}><span className="brand-icon">ϟ</span><span>WhatA<span className="brand-green">Charger</span></span></a>
            <p>Good energy. Better journeys. 🌱</p><span>Hackathon prototype · Demo listings are not verified public charging stations</span>
          </footer>
        </main>
      )}

      {page === 'hostLogin' && (
        <main className="host-page">
          <section className="booking-modal host-auth-card">
            <button className="cancel-button" onClick={goHome}>← Back to website</button>
            <span className="eyebrow">WHATCHARGER HOST PORTAL</span>
            <h2>{hostMode === 'login' ? 'Welcome back, host!' : 'Become a charging host'}</h2>
            <p>{hostMode === 'login' ? 'Sign in to manage charger listings and booking requests.' : 'Create a local demo account to publish your charging point.'}</p>
            <form onSubmit={handleHostLogin}>
              {hostMode === 'signup' && <label>Host or business name<input required value={hostName} onChange={(event) => setHostName(event.target.value)} placeholder="Your business name" /></label>}
              <label>Email address<input required type="email" value={hostEmail} onChange={(event) => setHostEmail(event.target.value)} placeholder="you@example.com" /></label>
              <label>Password<input required type="password" minLength={6} value={hostPassword} onChange={(event) => setHostPassword(event.target.value)} placeholder="At least 6 characters" /></label>
              {hostError && <p role="alert" className="form-message error-message">{hostError}</p>}
              <button className="search-button modal-confirm" type="submit">{hostMode === 'login' ? 'Sign in →' : 'Create account →'}</button>
            </form>
            <button className="cancel-button" onClick={() => { setHostMode((mode) => mode === 'login' ? 'signup' : 'login'); setHostError('') }}>{hostMode === 'login' ? 'New host? Create an account' : 'Already a host? Sign in'}</button>
            <p className="demo-warning">Prototype note: accounts are stored in this browser only. This is not secure production authentication; use Amazon Cognito before launch.</p>
          </section>
        </main>
        
      )}

      {page === 'myBookings' && (
      <main className="host-page">
  <section className="booking-modal host-auth-card">
            <button className="cancel-button" onClick={goHome}>
              ← Back to website
            </button>

            <span className="eyebrow">YOUR CHARGING JOURNEY</span>
            <h2>My Bookings</h2>
            <p>Enter the same email address you used when requesting a charger.</p>
<form className="my-bookings-form" onSubmit={(event) => {
  event.preventDefault()
  setBookingLookupSubmitted(true)
}}>
              <label>
                Customer email address
                <input
                  type="email"
                  required
                  value={bookingLookupEmail}
                 onChange={(event) => {
  setBookingLookupEmail(event.target.value)
  setBookingLookupSubmitted(false)
}}
                  placeholder="you@example.com"
                />
              </label>
              <button className="search-button modal-confirm" type="submit">
                Check bookings →
              </button>
            </form>

            {bookingLookupSubmitted && bookingLookupEmail.trim() !== '' && (
              <section className="dashboard-section">
                <h3>Your booking requests ({customerBookings.length})</h3>

                {customerBookings.length === 0 ? (
                  <div className="empty-state">
                    <span>📅</span>
                    <h3>No bookings found</h3>
                    <p>Check your email address or submit a booking request first.</p>
                  </div>
                ) : (
                  <div className="host-listings">
                    {customerBookings.map((item) => (
                      <article className="host-listing-row booking-row customer-booking-card" key={item.bookingId}>
                        <div>
                          <strong>{item.chargerName}</strong>
                          <p>Reference: {item.bookingId}</p>
                          <p>Location: {item.chargerLocation}</p>
                          <p>Price: ₹{item.chargerPrice} per kWh</p>
                          <p>Host: {item.hostName}</p>
                          <p>Requested: {new Date(item.createdAt).toLocaleString()}</p>
                          <p>Status: <strong>{statusLabel(item.status)}</strong></p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}
          </section>
        </main>
      )}

      {page === 'hostDashboard' && host && (
        
        <main className="host-page">
          <section className="booking-modal host-dashboard-card">
            <div className="dashboard-topline">
              <button className="cancel-button" onClick={goHome}>← Back to website</button>
              <button className="cancel-button" onClick={() => { setHost(null); setPage('home'); setHostError('') }}>Log out</button>
            </div>
            <span className="eyebrow">HOST DASHBOARD</span>
            <h2>Welcome, {host.name || host.email.split('@')[0]}! 👋</h2>
            <p>Manage your charger listings, exact locations and incoming requests.</p>

            <div className="host-dashboard-grid">
              <article><span>⚡</span><h3>My chargers</h3><p>{myChargers.length} registered charger{myChargers.length === 1 ? '' : 's'}</p><button className="secondary-button" onClick={openAddCharger}>＋ Add a charger</button></article>
              <article><span>📅</span><h3>Booking requests</h3><p>{myBookings.filter((item) => item.status === 'pending').length} pending request(s)</p><button className="secondary-button" onClick={() => document.getElementById('host-bookings')?.scrollIntoView({ behavior: 'smooth' })}>View requests</button></article>
              <article><span>₹</span><h3>Pricing</h3><p>Set a price per kWh on each charger listing.</p></article>
            </div>

            {hostError && <p role="status" className="form-message">{hostError}</p>}
            {chargerFormMessage && <p role="status" className="form-message">{chargerFormMessage}</p>}

            <section className="dashboard-section">
              <div className="dashboard-section-heading"><h3>My charger listings</h3><button className="secondary-button" onClick={openAddCharger}>＋ Add charger</button></div>
              {myChargers.length === 0 ? <div className="empty-state compact-empty"><p>You have not listed a charger yet.</p><button className="search-button" onClick={openAddCharger}>List your first charger</button></div> : (
                <div className="host-listings">
                  {myChargers.map((charger) => (
                    <article className="host-listing-row" key={charger.id}>
                      <div><strong>{charger.name}</strong><p>📍 {charger.address}</p><p>₹{charger.price}/kWh · {(charger.vehicles || []).join(', ')} · {charger.power} kW</p><p>Coordinates: {charger.latitude ?? 'Not set'}, {charger.longitude ?? 'Not set'}</p></div>
                      <div className="listing-actions"><a href={mapsUrl(charger)} target="_blank" rel="noreferrer">Open map ↗</a><button className="secondary-button" onClick={() => deleteCharger(charger.id)}>Remove listing</button></div>
                    </article>
                    
                  ))}
                </div>
              )}
            </section>

            <section className="dashboard-section" id="host-bookings">
              <div className="dashboard-section-heading"><h3>Incoming booking requests</h3><span>{myBookings.length} total</span></div>
              {myBookings.length === 0 ? <div className="empty-state compact-empty"><p>New customer requests for your chargers will appear here.</p></div> : (
                <div className="host-listings">
                  {myBookings.map((item) => (
                    <article className="host-listing-row booking-row customer-booking-card" key={item.bookingId}>
                      <div><strong>{item.chargerName}</strong><p>Reference: {item.bookingId}</p><p>{item.customerName} · {item.customerEmail} · {item.customerPhone}</p><p>Submitted: {new Date(item.createdAt).toLocaleString()}</p><p>Status: <strong>{statusLabel(item.status)}</strong></p></div>
                      {item.status === 'pending' && <div className="listing-actions"><button className="secondary-button" onClick={() => updateBookingStatus(item.bookingId, 'accepted')}>Accept request</button><button className="secondary-button" onClick={() => updateBookingStatus(item.bookingId, 'declined')}>Decline</button></div>}
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>
        </main>
      )}

      {page === 'addCharger' && host && (
        <main className="host-page">
          <section className="booking-modal host-form-card">
            <button className="cancel-button" onClick={() => { setPage('hostDashboard'); setChargerFormMessage('') }}>← Back to dashboard</button>
            <span className="eyebrow">LIST YOUR CHARGER</span>
            <h2>Make your charger discoverable.</h2>
            <p>Enter the correct address and use GPS at the charger's physical location for the most accurate map pin.</p>
            <form className="host-charger-form" onSubmit={saveCharger}>
              <label>Charger or business name<input required minLength={2} value={chargerForm.name} onChange={(event) => setChargerForm((p) => ({ ...p, name: event.target.value }))} placeholder="e.g. Green Home Charging" /></label>
              <div className="form-two-columns">
                <label>Charger type<select value={chargerForm.type} onChange={(event) => setChargerForm((p) => ({ ...p, type: event.target.value }))}><option>Home charger</option><option>Cafe charging</option><option>Business charger</option><option>Garage / workshop</option><option>Parking facility</option><option>Other</option></select></label>
                <label>City<select required value={chargerForm.city} onChange={(event) => setChargerForm((p) => ({ ...p, city: event.target.value }))}>{CITIES.map((city) => <option key={city}>{city}</option>)}</select></label>
              </div>
              <div className="form-two-columns">
                <label>Area / neighbourhood<input required value={chargerForm.area} onChange={(event) => setChargerForm((p) => ({ ...p, area: event.target.value }))} placeholder="e.g. Baner" /></label>
                <label>Full address<input required value={chargerForm.address} onChange={(event) => setChargerForm((p) => ({ ...p, address: event.target.value }))} placeholder="Building, road, landmark, city" /></label>
              </div>
              <div className="gps-host-panel"><div><strong>📍 Exact charger location</strong><p>Stand at the charging point and use GPS to fill its coordinates.</p></div><button className="secondary-button" type="button" onClick={() => handleCurrentLocation(true)} disabled={gpsLoading}>{gpsLoading ? 'Detecting…' : '◎ Use charger GPS'}</button></div>
              <div className="form-two-columns">
                <label>Latitude<input inputMode="decimal" value={chargerForm.latitude} onChange={(event) => setChargerForm((p) => ({ ...p, latitude: event.target.value }))} placeholder="e.g. 18.5204" /></label>
                <label>Longitude<input inputMode="decimal" value={chargerForm.longitude} onChange={(event) => setChargerForm((p) => ({ ...p, longitude: event.target.value }))} placeholder="e.g. 73.8567" /></label>
              </div>
              {gpsMessage && <p className="gps-message" role="status">{gpsMessage}</p>}
              {chargerForm.latitude && chargerForm.longitude && <a href={`https://www.google.com/maps?q=${encodeURIComponent(`${chargerForm.latitude},${chargerForm.longitude}`)}`} target="_blank" rel="noreferrer">Preview this pin in Google Maps ↗</a>}
              <div className="form-two-columns">
                <label>Price per kWh (₹)<input required type="number" min="1" max="500" step="0.5" value={chargerForm.price} onChange={(event) => setChargerForm((p) => ({ ...p, price: event.target.value }))} /></label>
                <label>Charging power (kW)<input required type="number" min="0.5" max="500" step="0.1" value={chargerForm.power} onChange={(event) => setChargerForm((p) => ({ ...p, power: event.target.value }))} /></label>
              </div>
              <div className="form-two-columns">
                <label>Connector type<select value={chargerForm.connector} onChange={(event) => setChargerForm((p) => ({ ...p, connector: event.target.value }))}><option>Standard socket</option><option>Type 2</option><option>CCS2</option><option>CHAdeMO</option><option>Two-wheeler charger</option><option>Other / confirm with host</option></select></label>
                <fieldset className="vehicle-checkboxes"><legend>Vehicles supported</legend><label><input type="checkbox" checked={chargerForm.vehicles.includes('Car')} onChange={() => toggleVehicle('Car')} /> 🚗 Electric car</label><label><input type="checkbox" checked={chargerForm.vehicles.includes('Bike')} onChange={() => toggleVehicle('Bike')} /> 🛵 Electric two-wheeler</label></fieldset>
              </div>
              {chargerFormMessage && <p className="form-message" role="status">{chargerFormMessage}</p>}
              <button className="search-button modal-confirm" type="submit">Publish charger listing →</button>
            </form>
            <p className="demo-warning">Listings are stored in this browser for this prototype. Real public listings need a shared backend and authenticated host accounts.</p>
          </section>
        </main>
      )}

      {booking && page === 'home' && (
        <div className="modal-backdrop" onClick={() => { if (!bookingLoading) { setBooking(null); setBookingMessage('') } }}>
          <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => { if (!bookingLoading) { setBooking(null); setBookingMessage('') } }} disabled={bookingLoading} aria-label="Close booking">×</button>
            <span className="eyebrow">YOUR NEXT CHARGING STOP</span>
            <h2 id="booking-title">Request a charging slot</h2>
            <p>You're choosing <strong>{booking.name}</strong> in {booking.location}.</p>
            <p>📍 {booking.address || booking.location}</p>
            <div className="modal-price"><strong>₹{booking.price}</strong> per kWh</div>
            <form onSubmit={confirmBooking}>
              <label>Full name<input required minLength={2} value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Enter your name" /></label>
              <label>Email<input required type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} placeholder="you@example.com" /></label>
              <label>Phone number<input required type="tel" inputMode="numeric" pattern="[0-9]{10}" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="10-digit mobile number" /></label>
              {bookingMessage && <p role="status" className="form-message">{bookingMessage}</p>}
              {!bookingMessage && <button className="search-button modal-confirm" type="submit" disabled={bookingLoading}>{bookingLoading ? 'Submitting…' : 'Send booking request ✓'}</button>}
            </form>
            {bookingMessage && <button className="search-button modal-confirm" onClick={() => { setBooking(null); setBookingMessage('') }}>Done</button>}
            <button className="cancel-button" onClick={() => { if (!bookingLoading) { setBooking(null); setBookingMessage('') } }} disabled={bookingLoading}>Close</button>
          </section>
        </div>
            )}

      <ChargerAssistant />
    </div>
  )
}

export default App

