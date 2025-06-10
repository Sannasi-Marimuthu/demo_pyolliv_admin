/* eslint-disable prettier/prettier */
import React, { useEffect, useRef, useState } from 'react'
import { Input, Table, Button, Select, Tabs, TimePicker } from 'antd'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import '../../CSS/Master.css'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import FormItem from 'antd/es/form/FormItem'
import TextArea from 'antd/es/input/TextArea'
import { useNavigate } from 'react-router-dom'
import { api, validation } from '../../../../Axios/axios'
import moment from 'moment/moment'
import { GoogleMap, StandaloneSearchBox, Marker, useJsApiLoader } from '@react-google-maps/api'
import axios from 'axios'

const GOOGLE_API_KEY = 'AIzaSyCmt0pZZUQmVayZvjHfVHdF_7pVZUKCAsg' // Replace with your actual key
const libraries = ['places']

const validateConstructionYear = (value, setConstruction, currentYear) => {
  // Sanitize input to allow only numbers
  const sanitizedValue = value.replace(/[^0-9]/g, '')

  // Check if the input is empty
  if (sanitizedValue === '') {
    setConstruction('')
    return
  }

  // Ensure the input is a valid 4-digit year
  if (sanitizedValue.length <= 4) {
    const year = parseInt(sanitizedValue, 10)
    if (sanitizedValue.length === 4 && year > currentYear) {
      toast.error(`Year cannot be in the future (beyond ${currentYear})`)
      return
    }
    if (sanitizedValue.length === 4 && year < 1800) {
      // Optional: Restrict to reasonable past years (e.g., 1800 or later)
      toast.error('Year must be 1800 or later')
      return
    }
    setConstruction(sanitizedValue)
  } else {
    toast.error('Year must be a 4-digit number')
  }
}

export default function ItemMaster({ onSelect, defaultValue = '' }) {
  const baseURL = 'http://164.52.195.176:4500/'

  // Get the current year
  const currentYear = new Date().getFullYear() // 2025 as of April 17, 2025

  // Location for address
  const [city, setCity] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState([])

  const handleChange = (event) => {
    setCity(event.target.value)
  }

  const PropertyCode = sessionStorage.getItem('propertyId')
  const inputRef = useRef(null)
  const inputRef1 = useRef(null)

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries,
  })

  const handleLoad = (ref) => {
    inputRef.current = ref
    console.log('SearchBox loaded:', inputRef.current)
  }

  const handleLoad1 = (ref) => {
    inputRef1.current = ref
    console.log('SearchBox loaded:', inputRef1.current)
  }

  const extractAddressParts = (fullAddress) => {
    const parts = fullAddress.split(',').map((part) => part.trim())
    return {
      address1: parts[0] + (parts[1] ? ', ' + parts[1] : ''),
      address2: parts[2] || '',
      area: parts.length >= 4 ? parts[parts.length - 4] : '',
      city: parts.length >= 3 ? parts[parts.length - 3] : '',
      state: parts.length >= 2 ? parts[parts.length - 2] : '',
      pincode: parts[5] ? parts[5].match(/\d+/)?.[0] || '' : '',
      country: parts.length >= 1 ? parts[parts.length - 1] : '',
    }
  }

  const handlePlaceChange = () => {
    if (inputRef.current && typeof inputRef.current.getPlaces === 'function') {
      const places = inputRef.current.getPlaces()
      if (places && places.length > 0) {
        const selectedPlace = places[0]
        const lat = selectedPlace.geometry.location.lat()
        const lng = selectedPlace.geometry.location.lng()
        const fullAddress = selectedPlace.formatted_address
        const extractedAddress = extractAddressParts(fullAddress)

        setPropertyAddress(fullAddress)
        setLatitude(lat)
        setLongitude(lng)
        setAddress1(extractedAddress.address1)
        setAddress2(extractedAddress.address2)
        setCity(extractedAddress.city)
        setArea(extractedAddress.area)
      } else {
        console.error('No places found')
      }
    } else {
      console.error(
        'inputRef.current is not a valid StandaloneSearchBox instance:',
        inputRef.current,
      )
    }
  }

  const handleMarkerDrag = (e) => {
    const newLat = e.latLng.lat()
    const newLng = e.latLng.lng()
    setLatitude(newLat)
    setLongitude(newLng)

    const geocoder = new window.google.maps.Geocoder()
    geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        setPropertyAddress(results[0].formatted_address)
        setLocationInput(results[0].formatted_address)
      } else {
        console.error('Reverse geocoding failed:', status)
      }
    })
  }

  // Time
  const [checkin, setCheckIn] = useState(null)
  const [checkout, setCheckOut] = useState(null)

  // const onChange = (e) => {
  //   if (e) {
  //     setCheckIn(e.target.value)
  //   }
  // }
  const onChange = (time, timeString) => {
    console.log(timeString)
    setCheckIn(timeString)
  }

  const onChange1 = (time, timeString) => {
    console.log(time, timeString)
    setCheckOut(timeString)
  }
  // const onChange1 = (e) => {
  //   if (e) {
  //     setCheckOut(e.target.value)
  //   }
  // }

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [viewTable, setViewTable] = useState(PropertyCode != 0)
  const [viewForm, setViewForm] = useState(PropertyCode == 0)
  const [newfile, setNewfile] = useState(false)
  const [opentable, setOpentable] = useState(PropertyCode == 0)
  const [isEditMode, setIsEditMode] = useState(false)

  // Property Details
  const [propertyname, setPropertyName] = useState('')
  const [propertydescription, setPropertyDescription] = useState('')
  const [construction, setConstruction] = useState('')
  const [displayname, setDisplayName] = useState('')
  const [propertytype, setPropertyType] = useState('')
  const [rooms, setRooms] = useState('')
  const [restaurants, setRestaurants] = useState('')
  const [floors, setFloors] = useState('')
  const [currency, setCurrency] = useState('')
  const [division, setDivision] = useState('')
  const [timezone, setTimeZone] = useState('')
  const [uniqueCode, setUniqueCode] = useState('')
  const [rating, setRating] = useState('')
  const [status, setStatus] = useState('No')
  const [smoking, setSmoking] = useState('')
  const [smokingVisible, setSmokingVisible] = useState(false)
  const [smokinRoom, setSmokingRoom] = useState('')
  const [selectPropertyOwner, setSelectPropertyOwner] = useState('')

  // Address
  const [hotelphone, setHotelPhone] = useState('')
  const [hotelmobile, setHotelMobile] = useState('')
  const [hotelemail, setHotelEmail] = useState('')
  const [phonlist, setPhonelList] = useState('')
  const [weblist, setWebList] = useState('')
  const [emaillist, setEmailList] = useState('')
  const [customercare, setCustomerCare] = useState('')

  // Location
  const [latitude, setLatitude] = useState(11.0018115)
  const [longitude, setLongitude] = useState(76.9628425)
  const [propertyaddress, setPropertyAddress] = useState('')
  const [address1, setAddress1] = useState('')
  const [address2, setAddress2] = useState('')
  const [area, setArea] = useState('')

  // MD Details
  const [MdName, setMdname] = useState('')
  const [Mdemail, setMdEmail] = useState('')
  const [Mdphone, setMdPhone] = useState('')

  // Finance
  const [accountNumber, setAccountNumber] = useState('')
  const [ifscCode, setIfscCode] = useState('')
  const [branch, setBranch] = useState('')
  const [bank, setBank] = useState('')
  const [utilities, setUtilities] = useState([{ utilityType: '', file: null, existingFile: null }])

  // Route
  const [entries, setEntries] = useState([])
  const [radius, setRadius] = useState('')
  const [transportMode, setTransportMode] = useState('')
  const [transportInput, setTransportInput] = useState('')
  const [locationInput, setLocationInput] = useState('')

  // Table Columns
  const columns = [
    { title: 'PropertyName', dataIndex: 'Propertyname', key: 'Propertyname' },
    { title: 'PropertyCode', dataIndex: 'Propertycode', key: 'Propertycode' },
    { title: 'City', dataIndex: 'City', key: 'City' },
    { title: 'Property Type', dataIndex: 'Propertytype', key: 'Propertytype' },
    { title: 'Number of rooms', dataIndex: 'Noofrooms', key: 'Noofrooms' },
    { title: 'Check In', dataIndex: 'Checkin', key: 'Checkin' },
    { title: 'Check Out', dataIndex: 'Checkout', key: 'Checkout' },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            editUser(record)
            setViewForm(true)
            setViewTable(false)
            setNewfile(false)
            setIsEditMode(true)
          }}
        >
          <EditOutlined />
        </Button>
      ),
    },
  ]

  const columns1 = [
    { title: 'Hotel Phone', dataIndex: 'Hotelphone', key: 'Hotelphone' },
    { title: 'Hotel Mobile', dataIndex: 'Hotelmobile', key: 'Hotelmobile' },
    { title: 'Hotel Email', dataIndex: 'Hotelemail', key: 'Hotelemail' },
    { title: 'Phone List', dataIndex: 'Phonelist', key: 'Phonelist' },
    { title: 'Website List', dataIndex: 'Websitelist', key: 'Websitelist' },
    { title: 'Email list', dataIndex: 'Emaillist', key: 'Emaillist' },
    { title: 'Customer Care', dataIndex: 'Customercare', key: 'Customercare' },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            editUser(record)
            setViewForm(true)
            setViewTable(false)
            setNewfile(false)
            setIsEditMode(true)
          }}
        >
          <EditOutlined />
        </Button>
      ),
    },
  ]

  const columns2 = [
    { title: 'Property Address', dataIndex: 'Propertyaddress', key: 'Propertyaddress' },
    { title: 'Best Route', dataIndex: 'Bestroute', key: 'Bestroute' },
    { title: 'From', dataIndex: 'From', key: 'From' },
    { title: 'Mode of Transport', dataIndex: 'Modeoftransport', key: 'Modeoftransport' },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            editUser(record)
            setViewForm(true)
            setViewTable(false)
            setNewfile(false)
            setIsEditMode(true)
          }}
        >
          <EditOutlined />
        </Button>
      ),
    },
  ]

  const columns3 = [
    { title: 'MD Name', dataIndex: 'MdName', key: 'MdName' },
    { title: 'MD Email', dataIndex: 'MdMail', key: 'MdMail' },
    { title: 'MD Phone', dataIndex: 'MdPhone', key: 'MdPhone' },
    {
      title: 'Action',
      dataIndex: 'Action',
      key: 'Action',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            editUser(record)
            setViewForm(true)
            setViewTable(false)
            setNewfile(false)
            setIsEditMode(true)
          }}
        >
          <EditOutlined />
        </Button>
      ),
    },
  ]

  const generateUniqueCode = (existingCodes = []) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code
    do {
      code = Array.from({ length: 6 }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length)),
      ).join('')
    } while (existingCodes.includes(code))
    setUniqueCode(code)
    return code
  }

  const [timeZoneApi, setTimeZoneApi] = useState([])
  useEffect(() => {
    generateUniqueCode()
    axios
      .get('http://api.timezonedb.com/v2.1/list-time-zone?key=QLUZ0S62WT83&format=json')
      .then((response) => {
        setTimeZoneApi(response.data)
      })
  }, [])

  // Utility Handlers
 const handleUtilityChange = (index, field, value) => {
   const newUtilities = [...utilities]
   if (field === 'file') {
     // Only set file if a valid File object is provided
     newUtilities[index][field] = value && value instanceof File ? value : null
     // Preserve existingFile if no new file is selected
     newUtilities[index].existingFile = newUtilities[index].existingFile || null
   } else {
     newUtilities[index][field] = value
   }
   setUtilities(newUtilities)
   console.log(`Updated utility[${index}]:`, newUtilities[index]) // Debug log
 }

  const addUtility = () => {
    setUtilities([...utilities, { utilityType: '', file: null, existingFile: null }])
  }

  const removeUtility = (index) => {
    if (utilities.length === 1) {
      toast.error('At least one utility is required')
      return
    }
    const newUtilities = utilities.filter((_, i) => i !== index)
    setUtilities(newUtilities)
  }

  console.log('UITILITIES>>>>>>>', utilities)

  // Mode of Transport
  const addEntry = () => {
    const isDuplicate = entries.some((entry) => entry.Transport === transportMode)
    if (isDuplicate) {
      toast.error('This transport mode already exists!')
      return
    }
    const newEntry = {
      id: entries.length + 1,
      Transport: transportMode,
      BestRoute: transportInput,
      Radius: radius + 'km',
    }
    setEntries([...entries, newEntry])
    setTransportMode('')
    setTransportInput('')
    setRadius('')
  }

  const id = sessionStorage.getItem('Propertymaster')

const save = async () => {
  const Account = accountNumber.trim()
  const IFSC = ifscCode.trim()
  const Branch = branch.trim()

  if (Account.length === 0 || IFSC.length === 0 || Branch.length === 0) {
    toast.error('Input cannot be empty or contain only spaces')
    return
  }

  // Validate utilities
  const validUtilities = utilities.filter(
    (u) => u.utilityType && (u.file instanceof File || u.existingFile),
  )
  if (validUtilities.length === 0) {
    toast.error('At least one utility with type and file (new or existing) is required')
    return
  }

  if (loading) return
  setLoading(true)

  // Debug utilities array
  console.log(
    'Utilities before processing:',
    utilities.map((u) => ({
      utilityType: u.utilityType,
      file: u.file,
      isFileValid: u.file instanceof File,
      existingFile: u.existingFile,
    })),
  )

  const PropertyData = {
    type: 'Propertymaster',
    Propertyname: propertyname,
    Propertydescription: propertydescription,
    Yearofconstruction: construction,
    Displayname: displayname,
    Propertytype: propertytype,
    Noofrooms: rooms,
    Noofrestaurants: restaurants,
    Nooffloors: floors,
    Currency: currency,
    Timezone: timezone,
    Checkin: checkin,
    Checkout: checkout,
    Status: 1,
    DivisionType: division,
    PropertyOwner: selectPropertyOwner,
    Smoking: smoking,
    SmokingRoom: smokinRoom ? smokinRoom : 0,
    RatingId: rating,
    Propertycode: uniqueCode,
    Hotelphone: hotelphone,
    Hotelmobile: hotelmobile,
    Hotelemail: hotelemail,
    Phonelist: phonlist,
    Websitelist: weblist,
    Emaillist: emaillist,
    Customercare: customercare,
    Propertyaddress: propertyaddress,
    Latitude: latitude,
    Longitude: longitude,
    City: city,
    Area: area,
    Entry: entries,
    MdName: MdName,
    MdMail: Mdemail,
    MdPhone: Mdphone,
    AccountNumber: accountNumber,
    IFSCCode: ifscCode,
    Branch: branch,
    BankName: bank,
  }

  if (!id) {
    // Create Flow
    const formData = new FormData()
    Object.keys(PropertyData).forEach((key) => {
      if (key === 'Entry') {
        formData.append(key, JSON.stringify(PropertyData[key]))
      } else {
        formData.append(key, PropertyData[key])
      }
    })

    // Append utilities with indexed fields
    validUtilities.forEach((utility, index) => {
      console.log(`Appending utility ${index} (create):`, {
        utilityType: utility.utilityType,
        file: utility.file,
        isFileValid: utility.file instanceof File,
        existingFile: utility.existingFile,
      })
      formData.append(`UtilityType[${index}]`, utility.utilityType)
      if (utility.file && utility.file instanceof File) {
        formData.append(`UtilityFile[${index}]`, utility.file)
      } else if (utility.file) {
        console.warn(`Invalid file for ${utility.utilityType} in create:`, utility.file)
        toast.error(`Invalid file selected for ${utility.utilityType}`)
        return
      }
      // Existing files are typically not used in create flow
      if (utility.existingFile) {
        console.warn(`Ignoring existingFile in create flow: ${utility.existingFile}`)
      }
    })

    for (let [key, value] of formData.entries()) {
      console.log(`Create FormData Entry: ${key} =`, value)
    }

    try {
      const response = await fetch(`${baseURL}api/post`, {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        toast.success('Property Created Successfully', {
          position: 'top-center',
          autoClose: 3000,
        })
        navigate(0)
        setViewForm(false)
        setViewTable(true)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to upload Files')
      }
    } catch (error) {
      console.error('Create error:', error)
      toast.error(error.message || 'Something went wrong while uploading images')
    } finally {
      setLoading(false)
    }
  } else {
    // Update Flow
    const updateFormData = new FormData()
    Object.keys(PropertyData).forEach((key) => {
      if (key === 'Entry') {
        updateFormData.append(key, JSON.stringify(PropertyData[key]))
      } else {
        updateFormData.append(key, PropertyData[key])
      }
    })

    // Append utilities with indexed fields
    validUtilities.forEach((utility, index) => {
      console.log(`Appending utility ${index} (update):`, {
        utilityType: utility.utilityType,
        file: utility.file,
        isFileValid: utility.file instanceof File,
        existingFile: utility.existingFile,
      })
      updateFormData.append(`UtilityType[${index}]`, utility.utilityType)
      if (utility.file && utility.file instanceof File) {
        updateFormData.append(`UtilityFile[${index}]`, utility.file)
      }
      if (utility.existingFile && !utility.file) {
        updateFormData.append(`ExistingUtilityFile[${index}]`, utility.existingFile)
      }
    })

    // Debug FormData before sending
    for (let [key, value] of updateFormData.entries()) {
      console.log(`Update FormData Entry: ${key} =`, value)
    }

    try {
      const baseurl = 'http://164.52.195.176:4500/api'
      const endpoint = `${baseurl}/update1?id=${id}&type=Propertymaster`

      const response = await fetch(endpoint, {
        method: 'PATCH',
        body: updateFormData,
      })

      if (response.ok) {
        toast.success('Property Updated Successfully', {
          position: 'top-center',
          autoClose: 3000,
        })
        sessionStorage.removeItem('Propertymaster')
        navigate(0)
        setViewForm(false)
        setViewTable(true)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update property')
      }
    } catch (error) {
      console.error('Update error:', error)
      toast.error(error.message || 'Error updating property')
    } finally {
      setLoading(false)
    }
  }
}

  const [view, setView] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=Propertytype')
      .then((response) => {
        const filtereddata = response.data.filter((item) => item.Status == 1)
        setView(filtereddata)
      })
      .catch(() => toast.error('Error in getting Property Type'))
  }, [])

  const [ratingview, setRatingView] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=RatingsNumber')
      .then((response) => {
        setRatingView(response.data)
      })
      .catch(() => toast.error('Error in getting Property Type'))
  }, [])

  const [currencys, setCurrencys] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=Currency')
      .then((response) => {
        setCurrencys(response.data)
      })
      .catch(() => toast.error('Error in getting Currency'))
  }, [])

  const [viewproperty, setViewProperty] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=Propertymaster')
      .then((response) => {
        const filteredData =
          PropertyCode == 0
            ? response.data
            : response.data.filter((item) => item.Propertycode == PropertyCode)
        setViewProperty(filteredData)
      })
      .catch(() => toast.error('Error in getting Property Type'))
  }, [])

  const [viewTransport, setViewTransport] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=Transport')
      .then((response) => {
        const filtereddata = response.data.filter((item) => item.Status == 1)
        setViewTransport(filtereddata)
      })
      .catch(() => toast.error('Error in getting Transport'))
  }, [])

  const [propertyOwner, setPropertyOwner] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=PropertyOwnertype')
      .then((response) => {
        setPropertyOwner(response.data)
      })
      .catch(() => toast.error('Error in getting Property Owner Type'))
  }, [])

  const [utilityType, setUtilityType] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=UtilityType')
      .then((response) => {
        setUtilityType(response.data)
      })
      .catch(() => toast.error('Error in getting Utility Type'))
  }, [])

  const [managementType, setManagementType] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=ManagementType')
      .then((response) => {
        setManagementType(response.data)
      })
      .catch(() => toast.error('Error in getting Management Type'))
  }, [])

  const [folder, setFolder] = useState('')

  const editUser = (record) => {
    setPropertyName(record.Propertyname)
    setPropertyDescription(record.Propertydescription)
    setConstruction(record.Yearofconstruction)
    setDisplayName(record.Displayname)
    setPropertyType(record.Propertytype)
    setRooms(record.Noofrooms)
    setRestaurants(record.Noofrestaurants)
    setFloors(record.Nooffloors)
    setCurrency(record.Currency)
    setTimeZone(record.Timezone)
    setCheckIn(record.Checkin)
    setCheckOut(record.Checkout)
    setUniqueCode(record.Propertycode)
    setFolder(record.Propertycode)
    setHotelPhone(record.Hotelphone)
    setHotelMobile(record.Hotelmobile)
    setHotelEmail(record.Hotelemail)
    setPhonelList(record.Phonelist)
    setWebList(record.Websitelist)
    setEmailList(record.Emaillist)
    setCustomerCare(record.Customercare)
    setPropertyAddress(record.Propertyaddress)
    setCity(record.City)
    setMdname(record.MdName)
    setMdEmail(record.MdMail)
    setMdPhone(record.MdPhone)
    setRating(record.RatingId)
    setAccountNumber(record.AccountNumber)
    setIfscCode(record.IFSCCode)
    setBranch(record.Branch)
    setBank(record.BankName)
    // Map utilities with photos array
    setUtilities(
      record.Utilities && record.Utilities.length > 0
        ? record.Utilities.map((u) => ({
            utilityType: u.billType,
            file: null, // New file to be uploaded (null initially)
            existingFile: u.photos && u.photos.length > 0 ? u.photos[0].filename : null, // Use the first filename from photos
          }))
        : [{ utilityType: '', file: null, existingFile: null }],
    )
    setSmoking(record.Smoking)
    setSmokingRoom(record.SmokingRoom)
    setDivision(record.DivisionType)
    setSelectPropertyOwner(record.PropertyOwner)
    setArea(record.Area)
    sessionStorage.setItem('Propertymaster', record._id)
  }

  const canceledit = () => {
    navigate(0)
    sessionStorage.removeItem('Propertymaster')
  }

  const { TabPane } = Tabs
  const [activeTab, setActiveTab] = useState('1')

  const save1 = () => {
    if (!propertyname) toast.error('Property name is required')
    else if (!propertydescription) toast.error('Property Description is required')
    else if (!construction) toast.error('Year of Construction is required')
    else if (!displayname) toast.error('Display name is required')
    else if (!propertytype) toast.error('Property type is required')
    else if (!rating) toast.error('Ratings is required')
    else if (!rooms) toast.error('Number of Rooms is required')
    else if (!checkin) toast.error('Check In Time is required')
    else if (!checkout) toast.error('Check Out Time is required')
    else {
      if (!id) {
        const trimmed = [
          propertyname,
          propertydescription,
          construction,
          displayname,
          propertytype,
          rooms,
          checkin,
          checkout,
        ].map((s) => s.trim())
        if (trimmed.some((s) => s.length === 0)) {
          toast.error('Input cannot be empty or contain only spaces')
          return
        }
      }
      setActiveTab('2')
    }
  }

  const save2 = () => {
    if (!hotelphone) toast.error('Hotel phone is required')
    else if (!hotelmobile) toast.error('Hotel mobile is required')
    else if (!hotelemail) toast.error('Hotel mail is required')
    else if (!customercare) toast.error('Customer Care Number is required')
    else {
      if (!id && hotelemail.trim().length === 0) {
        toast.error('Input cannot be empty or contain only spaces')
        return
      }
      setActiveTab('3')
    }
  }

  const save3 = () => {
    if (!propertyaddress) toast.error('Property Address is required')
    else if (!city) toast.error('City is required')
    else if (!area) toast.error('Area is required')
    else {
      if (!id) {
        const trimmed = [propertyaddress, city, area].map((s) => s.trim())
        if (trimmed.some((s) => s.length === 0)) {
          toast.error('Input cannot be empty or contain only spaces')
          return
        }
      }
      setActiveTab('4')
    }
  }

  const save4 = () => {
    if (!MdName) toast.error('MD Name is required')
    else if (!Mdemail) toast.error('MD Email is required')
    else if (!Mdphone) toast.error('MD Mobile Number is required')
    else {
      if (!id) {
        const trimmed = [MdName, Mdemail, Mdphone].map((s) => s.trim())
        if (trimmed.some((s) => s.length === 0)) {
          toast.error('Input cannot be empty or contain only spaces')
          return
        }
      }
      setActiveTab('5')
    }
  }

  const smokingoptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
  ]

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
        <TabPane className="tab" tab="Property Details" key="1">
          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }}>
            {newfile && (
              <h6
                onClick={() => {
                  setViewForm(true)
                  setViewTable(false)
                  setNewfile(false)
                  setOpentable(true)
                }}
              >
                <AddToPhotosIcon className="newtable" />
              </h6>
            )}
            {opentable && (
              <h6
                onClick={() => {
                  setViewForm(false)
                  setViewTable(true)
                  setNewfile(true)
                  setOpentable(false)
                }}
              >
                <BackupTableIcon className="backuptable" />
              </h6>
            )}
          </div>

          <div
            className="style"
            style={{
              lineHeight: '3',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginTop: '0px',
            }}
          >
            {viewForm && (
              <div className="form">
                <div gutter={24} className="admin-row">
                  <div span={12} className="admin-col">
                    <div className="inputs">
                      <p className="responsive">
                        Property Name<span>*</span>
                      </p>
                      <Input
                        maxLength={30}
                        value={propertyname}
                        onChange={(e) => validation.sanitizeInput1(e.target.value, setPropertyName)}
                        className="inputbox"
                        placeholder="Enter Property Name"
                      />
                    </div>
                    <div className="inputs">
                      <div className="description">
                        <p className="responsive">
                          Property Description<span>*</span>
                        </p>
                        <span className="descriptionlength">
                          {propertydescription.length}/{500}
                        </span>
                      </div>
                      <TextArea
                        maxLength={500}
                        value={propertydescription}
                        onChange={(e) =>
                          validation.sanitizeDescription(e.target.value, setPropertyDescription)
                        }
                        className="inputbox"
                        placeholder="Enter Description"
                        autoSize={{ minRows: 1 }}
                      />
                    </div>
                    {/* <div className="inputs">
                      <p className="responsive">
                        Year of Construction<span>*</span>
                      </p>
                      <Input
                        maxLength={4}
                        value={construction}
                        onChange={(e) => validation.sanitizePhone(e.target.value, setConstruction)}
                        className="inputbox"
                        placeholder="Enter Year of Construction"
                      />
                    </div> */}
                    <div className="inputs">
                      <p className="responsive">
                        Year of Construction<span>*</span>
                      </p>
                      <Input
                        maxLength={4}
                        value={construction}
                        onChange={(e) =>
                          validateConstructionYear(e.target.value, setConstruction, currentYear)
                        }
                        className="inputbox"
                        placeholder="Enter Year of Construction"
                        type="text" // Use text to allow controlled input
                      />
                    </div>
                    <div className="inputs">
                      <p className="responsive">
                        Display Name<span>*</span>
                      </p>
                      <Input
                        maxLength={35}
                        value={displayname}
                        onChange={(e) => validation.sanitizeInput1(e.target.value, setDisplayName)}
                        className="inputbox"
                        placeholder="Enter Display Name"
                      />
                    </div>
                    <div className="inputs">
                      <p className="responsive">
                        Division Type<span>*</span>
                      </p>
                      <Select
                        value={division || undefined}
                        onChange={(e) => setDivision(e)}
                        className="inputbox"
                        placeholder="Select Type of Division"
                        options={managementType.map((item) => ({
                          value: item.ManagementType,
                          label: item.ManagementType,
                        }))}
                      />
                    </div>
                    <div className="inputs">
                      <p className="responsive">
                        Property Code<span>*</span>
                      </p>
                      <Input className="inputbox" disabled value={uniqueCode} />
                    </div>
                  </div>
                  <div span={12} className="admin-col">
                    <div className="inputs">
                      <p className="responsive">
                        Property Type<span>*</span>
                      </p>
                      <Select
                        value={propertytype || undefined}
                        onChange={(value) => setPropertyType(value)}
                        className="inputbox"
                        showSearch
                        placeholder="Select Property Type"
                        options={view.map((item) => ({
                          value: item.PropertyName,
                          label: item.PropertyName,
                        }))}
                      />
                    </div>
                    <div className="inputs">
                      <p className="responsive">
                        No of Rooms<span>*</span>
                      </p>
                      <Input
                        maxLength={3}
                        value={rooms}
                        onChange={(e) => validation.sanitizePhone(e.target.value, setRooms)}
                        className="inputbox"
                        placeholder="Enter No of Rooms"
                      />
                    </div>
                    <div className="inputs">
                      <p className="responsive">No of Restaurants</p>
                      <Input
                        maxLength={2}
                        value={restaurants}
                        onChange={(e) => validation.sanitizePhone(e.target.value, setRestaurants)}
                        className="inputbox"
                        placeholder="Enter No.of Restaurants"
                      />
                    </div>
                    <div className="inputs">
                      <p className="responsive">No of Floors</p>
                      <Input
                        maxLength={2}
                        value={floors}
                        onChange={(e) => validation.sanitizePhone(e.target.value, setFloors)}
                        className="inputbox"
                        placeholder="Enter No of Floors"
                      />
                    </div>
                    <div className="inputs">
                      <p className="responsive">
                        Star Rating<span>*</span>
                      </p>
                      <Select
                        value={rating || undefined}
                        onChange={(e) => setRating(e)}
                        className="inputbox"
                        placeholder="Select Rating"
                        options={ratingview.map((item) => ({
                          value: item.RatingId,
                          label: item.Rating,
                        }))}
                      />
                    </div>
                    <div className="inputs">
                      <p className="responsive">
                        Property Owner Type<span>*</span>
                      </p>
                      <Select
                        value={selectPropertyOwner || undefined}
                        onChange={(e) => setSelectPropertyOwner(e)}
                        className="inputbox"
                        placeholder="Select Property Owner Type"
                        options={propertyOwner.map((item) => ({
                          value: item.PropertyOwnerType,
                          label: item.PropertyOwnerType,
                        }))}
                      />
                    </div>
                  </div>
                  <div className="admin-col">
                    <div className="inputs">
                      <p className="responsive">Currency</p>
                      <Select
                        value={currency || undefined}
                        onChange={(value) => setCurrency(value)}
                        className="inputbox"
                        showSearch
                        placeholder="Select Currency"
                        options={currencys.map((item) => ({
                          value: item.Symbol,
                          label: item.Currency,
                        }))}
                      />
                    </div>
                    <div className="inputs">
                      <p className="responsive">Time Zone</p>
                      <Select
                        value={timezone || undefined}
                        onChange={(e) => setTimeZone(e)}
                        className="inputbox"
                        placeholder="Enter Time Zone"
                        showSearch
                        options={timeZoneApi?.zones?.map((zone) => ({
                          value: zone.zoneName,
                          label: zone.zoneName,
                        }))}
                      />
                    </div>
                    <div className="inputs">
                      <p className="responsive">
                        Default Check-In Time<span>*</span>
                      </p>
                      <TimePicker
                        use12Hours
                        format="h:mm A"
                        className="inputboxtime"
                        onChange={onChange}
                      />
                      {/* <input
                        type="time"
                        value={checkin}
                        onChange={onChange}
                        onClick={(e) => e.target.showPicker()}
                        placeholder="select time"
                        className="inputboxtime"
                      /> */}
                    </div>
                    <div className="inputs">
                      <p className="responsive">
                        Default Check-Out Time<span>*</span>
                      </p>
                      <TimePicker
                        use12Hours
                        format="h:mm A"
                        className="inputboxtime"
                        onChange={onChange1}
                      />
                      {/* <input
                        type="time"
                        value={checkout}
                        onChange={onChange1}
                        onClick={(e) => e.target.showPicker()}
                        placeholder="select time"
                        className="inputboxtime"
                      /> */}
                    </div>
                    <div className="inputs">
                      <p className="responsive">
                        Smoking Allow<span>*</span>
                      </p>
                      <Select
                        value={smoking || undefined}
                        onChange={(e) => {
                          setSmoking(e)
                          setSmokingVisible(e === 'Yes')
                        }}
                        className="inputbox"
                        placeholder="Select Smoking"
                        options={smokingoptions}
                      />
                    </div>
                    {smokingVisible && (
                      <div className="inputs">
                        <p className="responsive">No of Smoking Rooms</p>
                        <Input
                          maxLength={2}
                          value={smokinRoom}
                          onChange={(e) => validation.sanitizePhone(e.target.value, setSmokingRoom)}
                          className="inputbox"
                          placeholder="Enter No of Smoking Rooms"
                        />
                      </div>
                    )}
                    {isEditMode && (
                      <div className="inputs">
                        <p className="responsive">Inactive</p>
                        <Select
                          className="inputbox"
                          showSearch
                          placeholder="Select Yes or No"
                          value={status || undefined}
                          onChange={(value) => setStatus(value)}
                          options={[
                            { value: 'Yes', label: 'Yes' },
                            { value: 'No', label: 'No' },
                          ]}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <FormItem className="button">
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {isEditMode && (
                      <Button
                        onClick={() => {
                          canceledit()
                          setOpentable(PropertyCode == 0)
                          setIsEditMode(false)
                        }}
                        className="cancel"
                        style={{ marginLeft: '10px' }}
                      >
                        CANCEL
                      </Button>
                    )}
                    <Button onClick={save1} className="save">
                      {isEditMode ? 'UPDATE' : 'SAVE'}
                    </Button>
                  </div>
                  <ToastContainer
                    position="top-center"
                    autoClose={500}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Zoom}
                  />
                </FormItem>
              </div>
            )}
          </div>

          {viewTable && (
            <section>
              <Table
                value={viewTable}
                pagination={viewproperty.length > 10 ? { pageSize: 10 } : false}
                dataSource={viewproperty}
                columns={columns}
                bordered
                className="custom-table"
              />
            </section>
          )}
        </TabPane>
        <TabPane className="tab" tab="Hotel Contact Details" key="2">
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            {newfile && (
              <h6
                onClick={() => {
                  setViewForm(true)
                  setViewTable(false)
                  setNewfile(false)
                  setOpentable(true)
                }}
              >
                <AddToPhotosIcon className="newtable" />
              </h6>
            )}
            {opentable && (
              <h6
                onClick={() => {
                  setViewForm(false)
                  setViewTable(true)
                  setNewfile(true)
                  setOpentable(false)
                }}
              >
                <BackupTableIcon className="backuptable" />
              </h6>
            )}
          </div>

          <div
            className="style"
            style={{ lineHeight: '3', display: 'flex', flexDirection: 'column', marginTop: '0px' }}
          >
            {viewForm && (
              <div className="form">
                <div gutter={24} className="admin-row">
                  <div span={8} className="admin-col">
                    <div className="inputs">
                      <p className="responsive">
                        Hotel Phone<span>*</span>
                      </p>
                      <Input
                        maxLength={10}
                        value={hotelphone}
                        onChange={(e) => validation.sanitizePhone(e.target.value, setHotelPhone)}
                        className="inputbox"
                        placeholder="Enter Hotel Phone"
                      />
                    </div>
                    <div className="inputs">
                      <p className="responsive">
                        Hotel Mobile<span>*</span>
                      </p>
                      <Input
                        maxLength={10}
                        value={hotelmobile}
                        onChange={(e) => validation.sanitizePhone(e.target.value, setHotelMobile)}
                        className="inputbox"
                        placeholder="Enter Hotel Mobile"
                      />
                    </div>
                    <div className="inputs">
                      <p className="responsive">
                        Hotel Email<span>*</span>
                      </p>
                      <Input
                        maxLength={30}
                        value={hotelemail}
                        onChange={(e) => validation.sanitizeEmail(e.target.value, setHotelEmail)}
                        type="email"
                        className="inputbox"
                        placeholder="Enter Hotel Email"
                      />
                    </div>
                  </div>
                  <div span={8} className="admin-col">
                    <div className="inputs">
                      <p className="responsive">Phone List</p>
                      <TextArea
                        maxLength={100}
                        value={phonlist}
                        onChange={(e) => validation.Phonelist(e.target.value, setPhonelList)}
                        className="inputbox"
                        placeholder="Enter Phone List"
                        autoSize={{ minRows: 1 }}
                      />
                    </div>
                    <div className="inputs">
                      <p className="responsive">Website List</p>
                      <TextArea
                        maxLength={100}
                        value={weblist}
                        onChange={(e) => validation.sanitizeDescription(e.target.value, setWebList)}
                        className="inputbox"
                        placeholder="Enter Website List"
                        autoSize={{ minRows: 1 }}
                      />
                    </div>
                  </div>
                  <div span={8} className="admin-col">
                    <div className="inputs">
                      <p className="responsive">Email List</p>
                      <TextArea
                        maxLength={100}
                        value={emaillist}
                        onChange={(e) => validation.Emaillist(e.target.value, setEmailList)}
                        className="inputbox"
                        placeholder="Enter Email List"
                        autoSize={{ minRows: 1 }}
                      />
                    </div>
                    <div className="inputs">
                      <p className="responsive">
                        Customer Care Number<span>*</span>
                      </p>
                      <Input
                        maxLength={10}
                        value={customercare}
                        onChange={(e) => validation.sanitizePhone(e.target.value, setCustomerCare)}
                        className="inputbox"
                        placeholder="Enter Customer Care Number"
                      />
                    </div>
                  </div>
                </div>
                <FormItem className="button">
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {isEditMode && (
                      <Button
                        onClick={() => {
                          canceledit()
                          setOpentable(true)
                          setIsEditMode(false)
                        }}
                        className="cancel"
                        style={{ marginLeft: '10px' }}
                      >
                        CANCEL
                      </Button>
                    )}
                    <Button onClick={save2} className="save">
                      {isEditMode ? 'UPDATE' : 'SAVE'}
                    </Button>
                  </div>
                  <ToastContainer
                    position="top-center"
                    autoClose={500}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Zoom}
                  />
                </FormItem>
              </div>
            )}
          </div>

          {viewTable && (
            <section>
              <Table
                value={viewTable}
                pagination={viewproperty.length > 10 ? { pageSize: 10 } : false}
                dataSource={viewproperty}
                columns={columns1}
                bordered
                className="custom-table"
              />
            </section>
          )}
        </TabPane>
        <TabPane className="tab" tab="Address Details" key="3">
          <div style={{ display: 'flex', justifyContent: 'end' }}>
            {newfile && (
              <h6
                onClick={() => {
                  setViewForm(true)
                  setViewTable(false)
                  setNewfile(false)
                  setOpentable(true)
                }}
              >
                <AddToPhotosIcon className="newtable" />
              </h6>
            )}
            {opentable && (
              <h6
                onClick={() => {
                  setViewForm(false)
                  setViewTable(true)
                  setNewfile(true)
                  setOpentable(false)
                }}
              >
                <BackupTableIcon className="backuptable" />
              </h6>
            )}
          </div>

          <div
            className="style"
            style={{ lineHeight: '3', display: 'flex', flexDirection: 'column', marginTop: '0px' }}
          >
            {viewForm && (
              <div>
                {isLoaded && !loadError ? (
                  <div className="form">
                    <div className="admin-row">
                      <div className="admin-col">
                        <StandaloneSearchBox
                          onLoad={handleLoad}
                          onPlacesChanged={handlePlaceChange}
                        >
                          <div className="inputs">
                            <p className="responsive">
                              Property Address<span>*</span>
                            </p>
                            <Input
                              type="text"
                              value={propertyaddress}
                              onChange={(e) => setPropertyAddress(e.target.value)}
                              className="inputbox"
                              placeholder="Enter Property Address"
                            />
                          </div>
                        </StandaloneSearchBox>
                      </div>
                      <div className="admin-col">
                        <div className="inputs">
                          <p className="responsive">Area</p>
                          <Input
                            maxLength={30}
                            value={area}
                            onChange={(e) => validation.sanitizeInput1(e.target.value, setArea)}
                            className="inputbox"
                            placeholder="Enter Area"
                          />
                        </div>
                      </div>
                      <div className="admin-col">
                        <div className="inputs">
                          <p className="responsive">
                            City<span>*</span>
                          </p>
                          <Input
                            value={city}
                            onChange={handleChange}
                            className="inputbox"
                            placeholder="Enter City"
                          />
                        </div>
                      </div>
                    </div>
                    <hr style={{ marginTop: 40 }} />
                    <div className="admin-row">
                      <div className="admin-col">
                        <div className="inputs">
                          <p className="responsive">Near by Places</p>
                          <Select
                            value={transportMode || undefined}
                            onChange={(value) => setTransportMode(value)}
                            className="inputbox"
                            showSearch
                            placeholder="Select Near by Places"
                            options={viewTransport.map((item) => ({
                              value: item.Transport,
                              label: item.Transport,
                            }))}
                          />
                        </div>
                      </div>
                      <div className="admin-col">
                        <div className="inputs">
                          <p className="responsive">From</p>
                          <Input
                            value={transportInput || undefined}
                            onChange={(e) => setTransportInput(e.target.value)}
                            placeholder="Enter From Place"
                            className="inputbox"
                          />
                        </div>
                      </div>
                      <div className="admin-coltranpost">
                        <div className="inputstransport">
                          <p className="responsive">Distance in Km</p>
                          <Input
                            maxLength={2}
                            value={radius}
                            onChange={(e) => validation.Phonelist(e.target.value, setRadius)}
                            className="inputbox"
                            placeholder="Enter distance in km"
                          />
                        </div>
                        <div style={{ display: 'flex', position: 'relative' }}>
                          <PlusCircleOutlined className="transportplus" onClick={addEntry} />
                        </div>
                      </div>
                    </div>
                    <FormItem className="button">
                      <div
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      >
                        {isEditMode && (
                          <Button
                            onClick={() => {
                              canceledit()
                              setOpentable(PropertyCode == 0)
                              setIsEditMode(false)
                            }}
                            className="cancel"
                            style={{ marginLeft: '10px' }}
                          >
                            CANCEL
                          </Button>
                        )}
                        <Button onClick={save3} className="save">
                          {isEditMode ? 'UPDATE' : 'SAVE'}
                        </Button>
                      </div>
                      <ToastContainer
                        position="top-center"
                        autoClose={500}
                        hideProgressBar
                        newestOnTop={false}
                        closeOnClick={false}
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                        transition={Zoom}
                      />
                    </FormItem>
                    <div className="entry">
                      <GoogleMap
                        mapContainerStyle={{ height: '300px', width: '50%' }}
                        center={{ lat: latitude, lng: longitude }}
                        zoom={15}
                      >
                        <Marker
                          position={{ lat: latitude, lng: longitude }}
                          draggable={true}
                          onDragEnd={handleMarkerDrag}
                        />
                      </GoogleMap>
                      <div className="entry2">
                        {entries.length > 0 && (
                          <Table
                            dataSource={entries}
                            columns={[
                              { title: 'SI.No', dataIndex: 'id', key: 'id' },
                              { title: 'Transport', dataIndex: 'Transport', key: 'Transport' },
                              { title: 'Best Route', dataIndex: 'BestRoute', key: 'BestRoute' },
                              { title: 'Radius', dataIndex: 'Radius', key: 'Radius' },
                            ]}
                            pagination={false}
                            bordered
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : loadError ? (
                  <div>Error loading Google Maps</div>
                ) : (
                  <div>Loading Google Maps...</div>
                )}
              </div>
            )}
          </div>

          {viewTable && (
            <section className="showtable">
              <Table
                value={viewTable}
                pagination={viewproperty.length > 10 ? { pageSize: 10 } : false}
                dataSource={viewproperty}
                columns={columns2}
                bordered
                className="custom-table"
              />
            </section>
          )}
        </TabPane>
        <TabPane className="tab" tab="Management Contact Details" key="4">
          <div
            className="commondiv"
            style={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }}
          >
            {newfile && (
              <h6
                onClick={() => {
                  setViewForm(true)
                  setViewTable(false)
                  setNewfile(false)
                  setOpentable(true)
                }}
              >
                <AddToPhotosIcon className="newtable" />
              </h6>
            )}
            {opentable && (
              <h6
                onClick={() => {
                  setViewForm(false)
                  setViewTable(true)
                  setNewfile(true)
                  setOpentable(false)
                }}
              >
                <BackupTableIcon className="backuptable" />
              </h6>
            )}
          </div>

          <div
            className="style"
            style={{
              lineHeight: '3',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginTop: '0px',
            }}
          >
            {viewForm && (
              <div className="form">
                <div className="admin-row">
                  <div className="admin-col">
                    <div className="inputs">
                      <p className="responsive">
                        Property Partner<span>*</span>
                      </p>
                      <Input
                        maxLength={60}
                        value={MdName}
                        onChange={(e) => validation.sanitizeInput1(e.target.value, setMdname)}
                        className="inputbox"
                        placeholder="Enter Property Partner Name"
                      />
                    </div>
                  </div>
                  <div className="admin-col">
                    <div className="inputs">
                      <p className="responsive">
                        Email Id<span>*</span>
                      </p>
                      <Input
                        maxLength={30}
                        value={Mdemail}
                        onChange={(e) => validation.sanitizeEmail(e.target.value, setMdEmail)}
                        className="inputbox"
                        placeholder="Enter Email Id"
                      />
                    </div>
                  </div>
                  <div className="admin-col">
                    <div className="inputs">
                      <p className="responsive">
                        Mobile Number<span>*</span>
                      </p>
                      <Input
                        maxLength={10}
                        value={Mdphone}
                        onChange={(e) => validation.sanitizePhone(e.target.value, setMdPhone)}
                        className="inputbox"
                        placeholder="Enter Mobile Number"
                      />
                    </div>
                  </div>
                </div>
                <FormItem className="button">
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {isEditMode && (
                      <Button
                        onClick={() => {
                          canceledit()
                          setOpentable(PropertyCode == 0)
                          setIsEditMode(false)
                        }}
                        className="cancel"
                        style={{ marginLeft: '10px' }}
                      >
                        CANCEL
                      </Button>
                    )}
                    <Button onClick={save4} disabled={loading} className="save">
                      {isEditMode ? 'UPDATE' : 'SAVE'}
                    </Button>
                  </div>
                  <ToastContainer
                    position="top-center"
                    autoClose={500}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Zoom}
                  />
                </FormItem>
              </div>
            )}
          </div>

          {viewTable && (
            <section className="showtable">
              <Table
                value={viewTable}
                pagination={viewproperty.length > 10 ? { pageSize: 10 } : false}
                dataSource={viewproperty}
                columns={columns3}
                bordered
                className="custom-table"
              />
            </section>
          )}
        </TabPane>
        <TabPane className="tab" tab="Finance Details" key="5">
          <div
            className="commondiv"
            style={{ display: 'flex', justifyContent: 'end', alignItems: 'end' }}
          >
            {newfile && (
              <h6
                onClick={() => {
                  setViewForm(true)
                  setViewTable(false)
                  setNewfile(false)
                  setOpentable(true)
                }}
              >
                <AddToPhotosIcon className="newtable" />
              </h6>
            )}
            {opentable && (
              <h6
                onClick={() => {
                  setViewForm(false)
                  setViewTable(true)
                  setNewfile(true)
                  setOpentable(false)
                }}
              >
                <BackupTableIcon className="backuptable" />
              </h6>
            )}
          </div>

          <div
            className="style"
            style={{
              lineHeight: '3',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginTop: '0px',
            }}
          >
            {viewForm && (
              <div className="form">
                <div className="admin-row">
                  <div className="admin-col">
                    <div className="inputs">
                      <p className="responsive">
                        Account Number<span>*</span>
                      </p>
                      <Input
                        maxLength={60}
                        value={accountNumber}
                        onChange={(e) => validation.sanitizePhone(e.target.value, setAccountNumber)}
                        className="inputbox"
                        placeholder="Enter Account Number"
                      />
                    </div>
                  </div>
                  <div className="admin-col">
                    <div className="inputs">
                      <p className="responsive">
                        IFSC Code<span>*</span>
                      </p>
                      <Input
                        maxLength={30}
                        value={ifscCode}
                        onChange={(e) => validation.sanitizeInput(e.target.value, setIfscCode)}
                        className="inputbox"
                        placeholder="Enter IFSC Code"
                      />
                    </div>
                  </div>
                  <div className="admin-col">
                    <div className="inputs">
                      <p className="responsive">
                        Bank Name<span>*</span>
                      </p>
                      <Input
                        maxLength={50}
                        value={bank}
                        onChange={(e) => validation.sanitizeInput1(e.target.value, setBank)}
                        className="inputbox"
                        placeholder="Enter Bank Name"
                      />
                    </div>
                  </div>
                </div>
                <div className="admin-row">
                  <div className="admin-col">
                    <div className="inputs">
                      <p className="responsive">
                        Bank Branch Name<span>*</span>
                      </p>
                      <Input
                        maxLength={50}
                        value={branch}
                        onChange={(e) => validation.sanitizeInput1(e.target.value, setBranch)}
                        className="inputbox"
                        placeholder="Enter Bank Branch Name"
                      />
                    </div>
                  </div>
                  <div className="admin-col"></div>
                  <div className="admin-col"></div>
                </div>
                {/* Utility Fields with Add and Remove Buttons */}
                {utilities.map((utility, index) => (
                  <div
                    key={index}
                    className="admin-row"
                    style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                  >
                    <div className="admin-col" style={{ flex: 1, marginRight: '10px' }}>
                      <div className="inputs">
                        <p className="responsive">Utility Type</p>
                        <Select
                          value={utility.utilityType || undefined}
                          onChange={(value) => handleUtilityChange(index, 'utilityType', value)}
                          className="inputbox"
                          placeholder="Select Utility Type"
                          options={utilityType.map((item) => ({
                            value: item.UtilityType,
                            label: item.UtilityType,
                          }))}
                        />
                      </div>
                    </div>
                    <div className="admin-col" style={{ flex: 1, marginRight: '10px' }}>
                      <div className="inputs">
                        <p className="responsive">Utility File</p>
                        <Input
                          type="file"
                          className="inputbox"
                          accept="image/*"
                          onChange={(e) => handleUtilityChange(index, 'file', e.target.files[0])}
                        />
                      </div>
                    </div>
                    <div className="admin-colimage" style={{ flex: 1 }}>
                      {utility.file && (
                        <div className="image-previewutility">
                          <img
                            src={URL.createObjectURL(utility.file)}
                            alt={`${utility.utilityType} preview`}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                            onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                          />
                        </div>
                      )}
                      {!utility.file && utility.existingFile && (
                        <div className="image-previewutility">
                          <img
                            src={`${baseURL}uploads/${utility.existingFile.replace(/\\/g, '/')}`}
                            alt={`${utility.utilityType} preview`}
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
                            onError={(e) => console.error('Image load error:', e)}
                          />
                        </div>
                      )}
                      <div
                        className=""
                        style={{
                          display: 'flex',
                          alignItems: 'end',
                          gap: '10px',
                          justifyContent: 'end',
                        }}
                      >
                        {index === utilities.length - 1 && (
                          <Button className="saveutility" onClick={addUtility}>
                            <PlusOutlined />
                          </Button>
                        )}
                        <Button
                          className="cancel"
                          style={{ marginTop: index === utilities.length - 1 ? '30%' : '68%' }}
                          onClick={() => removeUtility(index)}
                        >
                          <DeleteOutlined />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <FormItem className="button">
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {isEditMode && (
                      <Button
                        onClick={() => {
                          canceledit()
                          setOpentable(PropertyCode == 0)
                          setIsEditMode(false)
                        }}
                        className="cancel"
                        style={{ marginLeft: '10px' }}
                      >
                        CANCEL
                      </Button>
                    )}
                    <Button onClick={save} disabled={loading} className="save">
                      {isEditMode ? 'UPDATE' : 'SAVE'}
                    </Button>
                  </div>
                  <ToastContainer
                    position="top-center"
                    autoClose={500}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    transition={Zoom}
                  />
                </FormItem>
              </div>
            )}
          </div>

          {viewTable && (
            <section className="showtable">
              <Table
                value={viewTable}
                pagination={viewproperty.length > 10 ? { pageSize: 10 } : false}
                dataSource={viewproperty}
                columns={columns3}
                bordered
                className="custom-table"
              />
            </section>
          )}
        </TabPane>
      </Tabs>
    </div>
  )
}
