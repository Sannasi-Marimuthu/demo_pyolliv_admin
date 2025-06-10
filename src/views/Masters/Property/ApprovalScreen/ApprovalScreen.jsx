import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Modal, Form, Input, Select, message, Row, Col, Upload } from 'antd'
import { api } from '../../../../Axios/axios'
import axios from 'axios'
import { UploadOutlined } from '@ant-design/icons'
import { GoogleMap, StandaloneSearchBox, Marker, useJsApiLoader } from '@react-google-maps/api'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { generateUniqueCode, generateUniqueRoom } from '../PropertyMaster/uniqueCodes'
import { useNavigate } from 'react-router-dom'

const { Option } = Select
const { TextArea } = Input

const GOOGLE_API_KEY = 'AIzaSyCmt0pZZUQmVayZvjHfVHdF_7pVZUKCAsg' // Replace with your actual key
const libraries = ['places']

export default function ApprovalScreen() {
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileListMap, setFileListMap] = useState({})
  const [roomFileListMap, setRoomFileListMap] = useState({})
  const [removedUtilityImages, setRemovedUtilityImages] = useState({})
  const [removedRoomImages, setRemovedRoomImages] = useState({})
  const [imageFileListMap, setImageFileListMap] = useState({})
  const [removedImagesMap, setRemovedImagesMap] = useState({})
  const [emptyFields, setEmptyFields] = useState({})

  const [propertyAddress, setPropertyAddress] = useState('')
  const [area, setArea] = useState('')
  const [city, setCity] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [isMapModalVisible, setIsMapModalVisible] = useState(false)
  const inputRef = useRef(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries,
  })

  const navigate = useNavigate()

  const baseUrl = 'https://backend-2-rkqo.onrender.com/api'
  const baseUrl1 = 'https://backend-2-rkqo.onrender.com'

  const [cancellation, setCancellation] = useState([])
  const [propertyType, setPropertyType] = useState([])
  const [star, setStar] = useState([])
  const [amenities, setAmenities] = useState([])
  const [roomType, setRoomType] = useState([])
  const [roomView, setRoomView] = useState([])
  const [roomOccupancy, setRoomOccupancy] = useState([])
  const [roomAmenities, setRoomAmenities] = useState([])
  const [mealPackage, setMealPackage] = useState([])
  const [mealType, setMealType] = useState([])
  const [mealPrice, setMealPrice] = useState([])
  const [GuestType, setGuestType] = useState([])
  const [utilityType, setUtilityType] = useState([])
  const [bedType, setBedType] = useState([])
  const [propertyOwnerType, setPropertyOwnerType] = useState([])
  const [uniqueCode, setUniqueCode] = useState('')
  const [uniqueRoomCode, setUniqueRoomCode] = useState('')

  useEffect(() => {
    axios.get(`${baseUrl}/get?type=WebCancellation`).then((res) => setCancellation(res.data))
    axios.get(`${baseUrl}/get?type=Propertytype`).then((res) => setPropertyType(res.data))
    axios.get(`${baseUrl}/get?type=RatingsNumber`).then((res) => setStar(res.data))
    axios.get(`${baseUrl}/get?type=Amenities`).then((res) => setAmenities(res.data))
    axios.get(`${baseUrl}/get?type=WebRoomType`).then((res) => setRoomType(res.data))
    axios.get(`${baseUrl}/get?type=Roomview`).then((res) => setRoomView(res.data))
    axios.get(`${baseUrl}/get?type=WebRoomOccupancy`).then((res) => setRoomOccupancy(res.data))
    axios.get(`${baseUrl}/get?type=WebRoomAmenities`).then((res) => setRoomAmenities(res.data))
    axios.get(`${baseUrl}/get?type=WebMealPackage`).then((res) => setMealPackage(res.data))
    axios.get(`${baseUrl}/get?type=WebMealType`).then((res) => setMealType(res.data))
    axios.get(`${baseUrl}/get?type=WebMealPrice`).then((res) => setMealPrice(res.data))
    axios.get(`${baseUrl}/get?type=WebGuestType`).then((res) => setGuestType(res.data))
    axios.get(`${baseUrl}/get?type=UtilityType`).then((res) => setUtilityType(res.data))
    axios.get(`${baseUrl}/get?type=PropertyOwnertype`).then((res) => setPropertyOwnerType(res.data))
    axios.get(`${baseUrl}/get?type=Bedtype`).then((res) => setBedType(res.data))

    fetchData()
  }, [])

  const fetchData = () => {
    setLoading(true)
    api
      .getAll('get?type=getWeb')
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.log('err', err)
        setLoading(false)
        message.error('Failed to fetch data')
      })
  }

  const renderStars = (rating) => {
    const ratingNumber = rating
    return '★'.repeat(ratingNumber) + '☆'.repeat(5 - ratingNumber)
  }

  const columns = [
    {
      title: 'Hotel Name',
      dataIndex: 'hotelName',
      key: 'hotelName',
      sorter: (a, b) => a.hotelName.localeCompare(b.hotelName),
    },
    { title: 'Property Type', dataIndex: 'propertyType', key: 'propertyType' },
    {
      title: 'Star Rating',
      dataIndex: 'starRating',
      key: 'starRating',
      render: (rating) => renderStars(rating),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          style={{ backgroundColor: '#4b5e4b' }}
          type="primary"
          onClick={() => showModal(record)}
        >
          View/Edit
        </Button>
      ),
    },
  ]

  const showModal = (record) => {
    let code = generateUniqueCode()
    setUniqueCode(code)
    let code1 = generateUniqueRoom()
    setUniqueRoomCode(code1)
    setSelectedHotel(record)
    
    // Prepare form values and track empty fields
    const formValues = {
      hotelName: record.hotelName || '',
      propertyType: record.propertyType || '',
      starRating: record.starRating || '',
      yearOfConstruction: record.yearOfConstruction || '',
      propertyDescription: record.propertyDescription || '',
      noOfRestaurants: record.noOfRestaurants || '',
      noOfFloors: record.noOfFloors || '',
      primaryPhone: record.primaryPhone || '',
      secondaryPhone: record.secondaryPhone || '',
      email: record.email || '',
      customerCare: record.customerCare || '',
      amenities: record.amenities || [],
      allowUnmarriedCouples: record.allowUnmarriedCouples || '',
      allowGuestsBelow18: record.allowGuestsBelow18 || '',
      allowMaleGroups: record.allowMaleGroups || '',
      allowSmoking: record.allowSmoking || '',
      allowParties: record.allowParties || '',
      allowVisitors: record.allowVisitors || '',
      allowPets: record.allowPets || '',
      wheelchairAccessible: record.wheelchairAccessible || '',
      additionalRules: record.additionalRules || '',
      acceptableIdentityProofs: record.acceptableIdentityProofs || [],
      utilities: record.utilities || [],
      rooms: record.rooms || [],
      adddress: record.adddress || '',
      area: record.area || '',
      city: record.city || '',
      latitude: record.latitude || '',
      longitude: record.longitude || '',
      startTime: record.startTime || '',
      endTime: record.endTime || '',
      checkInTime: record.checkInTime || '',
      checkOutTime: record.checkOutTime || '',
      checkIn24Hours: record.checkIn24Hours || '',
      operationalrestaurant: record.operationalrestaurant || '',
      mealpackage: record.mealpackage || '',
      mealtype: record.mealtype || '',
      mealrank: record.mealrank || '',
      usingChannelManager: record.usingChannelManager || '',
      channelManagerCompany: record.channelManagerCompany || '',
      Notes: record.Notes || '',
      cancellationPolicy: record.cancellationPolicy || '',
      accountHolderName: record.accountHolderName || '',
      accountNumber: record.accountNumber || '',
      ifscCode: record.ifscCode || '',
      branch: record.branch || '',
      gstNumber: record.gstNumber || '',
      bankName: record.bankName || '',
      propertyownType: record.propertyownType || '',
      propertyImages: record.propertyImages || [],
      facadeImages: record.facadeImages || [],
      lobbyImages: record.lobbyImages || [],
      receptionImages: record.receptionImages || [],
      corridorsImages: record.corridorsImages || [],
      liftElevatorsImages: record.liftElevatorsImages || [],
      bathroomImages: record.bathroomImages || [],
      parkingImages: record.parkingImages || [],
      otherAreasImages: record.otherAreasImages || [],
      gst: record.gst || [],
    }

    // Identify empty fields for visual indication
    const emptyFieldsMap = {}
    Object.keys(formValues).forEach((key) => {
      const value = formValues[key]
      if (
        (typeof value === 'string' && value.trim() === '') ||
        value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        emptyFieldsMap[key] = true
      }
    })

    // Handle rooms separately for dynamic fields
    ;(record.rooms || []).forEach((room, index) => {
      const roomFields = [
        'roomType',
        'roomsAvailable',
        'roomView',
        'smokingPolicy',
        'smokingRooms',
        'roomSize',
        'roomSizeUnit',
        'roomOccupancy',
        'Rateplan',
        'singleGuestPrice',
        'doubleGuestPrice',
        'tripleGuestPrice',
        'below6YrsCharge',
        'child7to17Charge',
        'extraAdultCharge',
        'extraBed',
        'extraPersons',
        'noOfMaxChildren',
        'bedType',
        'roomAmenities',
        'roomDescription',
      ]
      roomFields.forEach((field) => {
        const value = room[field] || ''
        if (
          (typeof value === 'string' && value.trim() === '') ||
          value === null ||
          value === undefined ||
          (Array.isArray(value) && value.length === 0)
        ) {
          emptyFieldsMap[`rooms[${index}].${field}`] = true
        }
      })
    })

    // Handle utilities separately
    ;(record.utilities || []).forEach((utility, index) => {
      const value = utility.billType || ''
      if (value.trim() === '') {
        emptyFieldsMap[`utilities[${index}].billType`] = true
      }
    })

    setEmptyFields(emptyFieldsMap)
    form.setFieldsValue(formValues)

    setPropertyAddress(record.adddress || '')
    setArea(record.area || '')
    setCity(record.city || '')
    setLatitude(record.latitude || '')
    setLongitude(record.longitude || '')

    const initialFileListMap = {}
    const initialRemovedUtilityImages = {}
    ;(record.utilities || []).forEach((utility, index) => {
      initialFileListMap[index] = (utility.photos || []).map((photo, photoIndex) => ({
        uid: `${index}-${photoIndex}`,
        name: photo,
        status: 'done',
        url: `${baseUrl1}/${photo}`,
      }))
      initialRemovedUtilityImages[index] = []
    })
    setFileListMap(initialFileListMap)
    setRemovedUtilityImages(initialRemovedUtilityImages)

    const initialRoomFileListMap = {}
    const initialRemovedRoomImages = {}
    ;(record.rooms || []).forEach((room, index) => {
      initialRoomFileListMap[index] = (room.roomImages || []).map((image, imageIndex) => ({
        uid: `${index}-${imageIndex}`,
        name: image,
        status: 'done',
        url: `${baseUrl1}/${image}`,
      }))
      initialRemovedRoomImages[index] = []
    })
    setRoomFileListMap(initialRoomFileListMap)
    setRemovedRoomImages(initialRemovedRoomImages)

    const initialImageFileListMap = {}
    const initialRemovedImagesMap = {}
    const imageFields = [
      'propertyImages',
      'facadeImages',
      'lobbyImages',
      'receptionImages',
      'corridorsImages',
      'liftElevatorsImages',
      'bathroomImages',
      'parkingImages',
      'otherAreasImages',
      'gst',
    ]
    imageFields.forEach((field) => {
      initialImageFileListMap[field] = (record[field] || []).map((image, index) => ({
        uid: `${field}-${index}`,
        name: image,
        status: 'done',
        url: `${baseUrl1}/${image}`,
      }))
      initialRemovedImagesMap[field] = []
    })
    setImageFileListMap(initialImageFileListMap)
    setRemovedImagesMap(initialRemovedImagesMap)

    setIsModalVisible(true)
  }
  console.log('.................', selectedHotel)

  const handleOk = () => form.submit()

  const handleCancel = () => {
    setIsModalVisible(false)
    setSelectedHotel(null)
    form.resetFields()
    setFileListMap({})
    setRoomFileListMap({})
    setImageFileListMap({})
    setRemovedUtilityImages({})
    setRemovedRoomImages({})
    setRemovedImagesMap({})
    setEmptyFields({})
    setPropertyAddress('')
    setArea('')
    setCity('')
    setLatitude('')
    setLongitude('')
    navigate(0)
  }

  const onFinish = (values) => {
    api
      .put(`update/${selectedHotel._id}`, values)
      .then(() => {
        message.success('Hotel details updated successfully')
        fetchData()
        setIsModalVisible(false)
        setSelectedHotel(null)
        form.resetFields()
        setFileListMap({})
        setRoomFileListMap({})
        setImageFileListMap({})
        setRemovedUtilityImages({})
        setRemovedRoomImages({})
        setRemovedImagesMap({})
        setEmptyFields({})
        setLoading(false)
      })
      .catch((err) => {
        message.error('Failed to update hotel details')
        console.log('err', err)
        setLoading(false)
      })
  }

  const handleLoad = (ref) => {
    inputRef.current = ref
    console.log('SearchBox loaded:', inputRef.current)
  }

  const extractAddressParts = (fullAddress) => {
    if (!fullAddress) return {}

    const parts = fullAddress.split(',').map((part) => part.trim())
    return {
      address: parts[0] + (parts[1] ? ', ' + parts[1] : ''),
      area: parts.length >= 4 ? parts[parts.length - 4] : '',
      city: parts.length >= 3 ? parts[parts.length - 3] : '',
      state: parts.length >= 2 ? parts[parts.length - 2] : '',
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
        setArea(extractedAddress.area)
        setCity(extractedAddress.city)
        setLatitude(lat)
        setLongitude(lng)

        form.setFieldsValue({
          adddress: fullAddress,
          area: extractedAddress.area,
          city: extractedAddress.city,
          latitude: lat,
          longitude: lng,
        })

        // Update emptyFields state
        setEmptyFields((prev) => ({
          ...prev,
          adddress: fullAddress.trim() === '',
          area: extractedAddress.area.trim() === '',
          city: extractedAddress.city.trim() === '',
          latitude: lat === '',
          longitude: lng === '',
        }))

        console.log('Selected Place:', { fullAddress, lat, lng, extractedAddress })
      } else {
        console.error('No places found')
        toast.error('No places found')
      }
    } else {
      console.error('Invalid StandaloneSearchBox instance')
      toast.error('Error with address search')
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
        const fullAddress = results[0].formatted_address
        const extractedAddress = extractAddressParts(fullAddress)
        setPropertyAddress(fullAddress)
        setArea(extractedAddress.area)
        setCity(extractedAddress.city)
        setLatitude(newLat)
        setLongitude(newLng)

        form.setFieldsValue({
          adddress: fullAddress,
          area: extractedAddress.area,
          city: extractedAddress.city,
          latitude: newLat,
          longitude: newLng,
        })

        // Update emptyFields state
        setEmptyFields((prev) => ({
          ...prev,
          adddress: fullAddress.trim() === '',
          area: extractedAddress.area.trim() === '',
          city: extractedAddress.city.trim() === '',
          latitude: newLat === '',
          longitude: newLng === '',
        }))

        console.log('Updated Address:', fullAddress)
      } else {
        console.error('Reverse geocoding failed:', status)
        toast.error('Failed to update address')
      }
    })
  }

  const showMapModal = () => {
    if (latitude && longitude) {
      setIsMapModalVisible(true)
    } else {
      toast.error('Please select an address with valid coordinates')
    }
  }

  const handleMapModalClose = () => {
    setIsMapModalVisible(false)
  }

  const handleUploadChange = (index, { fileList }) => {
    setFileListMap((prev) => ({
      ...prev,
      [index]: fileList,
    }))

    setRemovedUtilityImages((prev) => {
      const existingFiles = (selectedHotel?.utilities?.[index]?.photos || []).map((photo) => ({
        name: photo,
      }))
      const currentFilenames = fileList
        .filter((file) => !file.originFileObj)
        .map((file) => ({ name: file.name }))
      const removed = existingFiles
        .filter((existing) => !currentFilenames.some((current) => current.name === existing.name))
        .map((file) => file.name)
      return {
        ...prev,
        [index]: removed,
      }
    })

    const currentUtilities = form.getFieldValue('utilities') || []
    const updatedUtilities = [...currentUtilities]
    updatedUtilities[index] = {
      ...updatedUtilities[index],
      billType:
        updatedUtilities[index]?.billType || form.getFieldValue(['utilities', index, 'billType']),
      photos: fileList.map((file) => (file.originFileObj ? file.originFileObj : file.name)),
    }
    form.setFieldsValue({ utilities: updatedUtilities })

    // Update emptyFields for utilities
    setEmptyFields((prev) => ({
      ...prev,
      [`utilities[${index}].billType`]: updatedUtilities[index].billType.trim() === '',
    }))
  }

  const handleRoomUploadChange = (index, { fileList }) => {
    setRoomFileListMap((prev) => ({
      ...prev,
      [index]: fileList,
    }))

    setRemovedRoomImages((prev) => {
      const existingFiles = (selectedHotel?.rooms?.[index]?.roomImages || []).map((image) => ({
        name: image,
      }))
      const currentFilenames = fileList
        .filter((file) => !file.originFileObj)
        .map((file) => ({ name: file.name }))
      const removed = existingFiles
        .filter((existing) => !currentFilenames.some((current) => current.name === existing.name))
        .map((file) => file.name)
      return {
        ...prev,
        [index]: removed,
      }
    })

    const currentRooms = form.getFieldValue('rooms') || []
    const updatedRooms = [...currentRooms]
    updatedRooms[index] = {
      ...updatedRooms[index],
      roomType: updatedRooms[index]?.roomType || form.getFieldValue(['rooms', index, 'roomType']),
      roomImages: fileList.map((file) => (file.originFileObj ? file.originFileObj : file.name)),
    }
    form.setFieldsValue({ rooms: updatedRooms })

    // Update emptyFields for rooms
    setEmptyFields((prev) => ({
      ...prev,
      [`rooms[${index}].roomImages`]: fileList.length === 0,
    }))
  }

  const handleImageUploadChange = (fieldName, { fileList }) => {
    setImageFileListMap((prev) => ({
      ...prev,
      [fieldName]: fileList,
    }))

    setRemovedImagesMap((prev) => {
      const existingFiles = (selectedHotel?.[fieldName] || []).map((image) => ({
        name: image,
      }))
      const currentFilenames = fileList
        .filter((file) => !file.originFileObj)
        .map((file) => ({ name: file.name }))
      const removed = existingFiles
        .filter((existing) => !currentFilenames.some((current) => current.name === existing.name))
        .map((file) => file.name)
      return {
        ...prev,
        [fieldName]: removed,
      }
    })

    form.setFieldsValue({
      [fieldName]: fileList.map((file) => (file.originFileObj ? file.originFileObj : file.name)),
    })

    // Update emptyFields for images
    setEmptyFields((prev) => ({
      ...prev,
      [fieldName]: fileList.length === 0,
    }))
  }

  const handleApprove = async () => {
    setLoading(true)
    const values = form.getFieldsValue()
    const payload = { ...values, _id: selectedHotel._id }

    const propertyCode = uniqueCode
    const totalRooms = payload.rooms
      ? payload.rooms.reduce((sum, room) => sum + Number(room.roomsAvailable || 0), 0)
      : 0

    const policySentences = []
    if (payload.allowUnmarriedCouples) {
      policySentences.push(
        payload.allowUnmarriedCouples === 'Yes'
          ? 'Unmarried couples are allowed'
          : 'Unmarried couples are not allowed',
      )
    }
    if (payload.allowGuestsBelow18) {
      policySentences.push(
        payload.allowGuestsBelow18 === 'Yes'
          ? 'Guests below 18 are allowed'
          : 'Guests below 18 are not allowed',
      )
    }
    if (payload.allowMaleGroups) {
      policySentences.push(
        payload.allowMaleGroups === 'Yes'
          ? 'Male groups are allowed'
          : 'Male groups are not allowed',
      )
    }
    if (payload.allowSmoking) {
      policySentences.push(
        payload.allowSmoking === 'Yes' ? 'Smoking is allowed' : 'Smoking is not allowed',
      )
    }
    if (payload.allowParties) {
      policySentences.push(
        payload.allowParties === 'Yes' ? 'Parties are allowed' : 'Parties are not allowed',
      )
    }
    if (payload.allowVisitors) {
      policySentences.push(
        payload.allowVisitors === 'Yes' ? 'Visitors are allowed' : 'Visitors are not allowed',
      )
    }
    if (payload.allowPets) {
      policySentences.push(
        payload.allowPets === 'Yes' ? 'Pets are allowed' : 'Pets are not allowed',
      )
    }
    if (payload.wheelchairAccessible) {
      policySentences.push(
        payload.wheelchairAccessible === 'Yes'
          ? 'Property is wheelchair accessible'
          : 'Property is not wheelchair accessible',
      )
    }
    if (payload.acceptableIdentityProofs?.length > 0) {
      policySentences.push(
        `Acceptable identity proofs: ${payload.acceptableIdentityProofs.join(', ')}`,
      )
    }
    if (payload.additionalRules) {
      policySentences.push(`Additional rules: ${payload.additionalRules}`)
    }

    const policiesData = {
      PropertyCode: propertyCode,
      PolicyType: 'Property Policy',
      type: 'Policies',
      Policy: policySentences.join('\n'),
    }

    console.log("....////....",payload);
    
    const propertyData = {
      Id: payload._id,
      Propertyname: payload.hotelName,
      Displayname: payload.hotelName,
      Propertytype: payload.propertyType,
      Propertycode: propertyCode,
      RatingId: star.find((item) => item.Rating == payload.starRating)?.RatingId,
      Yearofconstruction: payload.yearOfConstruction,
      Hotelmobile: payload.primaryPhone,
      Phonelist: payload.secondaryPhone,
      Hotelemail: payload.email,
      Propertyaddress: payload.adddress || '',
      Area: payload.area,
      City: payload.city,
      Checkin: payload.checkInTime,
      Checkout: payload.checkOutTime,
      AccountNumber: payload.accountNumber,
      IFSCCode: payload.ifscCode,
      Branch: payload.branch,
      BankName: payload.bankName,
      PropertyOwner: payload.propertyownType,
      DivisionType: 'PYOLLIV-BREAK',
      Propertydescription: payload.propertyDescription,
      Noofrestaurants: Number(payload.noOfRestaurants),
      Nooffloors: Number(payload.noOfFloors),
      Noofrooms: totalRooms,
      Customercare: Number(payload.customerCare),
      Latitude: payload.latitude,
      Longitude: payload.longitude,
    }

    const utilitiesData = payload.utilities.map((utility, index) => {
      const existingImages = (selectedHotel?.utilities?.[index]?.photos || [])
        .filter((photo) => !removedUtilityImages[index]?.includes(photo))
        .map((photo) => ({ filename: photo, isExisting: true }))
      const newImages = (fileListMap[index] || [])
        .filter((file) => file.originFileObj && !removedUtilityImages[index]?.includes(file.name))
        .map((file) => ({ filename: file.name, isExisting: false }))
      return {
        billType: utility.billType,
        photos: [...existingImages, ...newImages],
      }
    })

    const roomsData = payload.rooms.map((room, index) => {
      const roomCode = generateUniqueRoom()
      const existingImages = (selectedHotel?.rooms?.[index]?.roomImages || [])
        .filter((image) => !removedRoomImages[index]?.includes(image))
        .map((image) => ({ filename: image, isExisting: true }))
      const newImages = (roomFileListMap[index] || [])
        .filter((file) => file.originFileObj && !removedRoomImages[index]?.includes(file.name))
        .map((file) => ({ filename: file.name, isExisting: false }))
      return {
        Displayname: room.roomType,
        Description: room.roomDescription,
        Totalrooms: Number(room.roomsAvailable),
        Roomview: room.roomView,
        Bedview: room.bedType,
        Roomsize: room.roomSize,
        Measurement: room.roomSizeUnit,
        Basicadults: Number(room.roomOccupancy.split(':')[1]?.replace('Guest', '') || 2),
        Maxadults:
          Number(room.extraPersons) +
          Number(room.roomOccupancy.split(':')[1]?.replace('Guest', '') || 2),
        Maxchildrens: Number(room.noOfMaxChildren),
        Maxoccupancy:
          Number(room.extraPersons) +
          Number(room.roomOccupancy.split(':')[1]?.replace('Guest', '') || 2) +
          Number(room.noOfMaxChildren),
        Roomcode: roomCode,
        PropertyCode: propertyCode,
        SmokingPolicy: room.smokingPolicy,
        SmokingRooms: room.smokingRooms,
        ExtraBed: room.extraBed,
        ExtraPersons: room.extraPersons,
        RoomAmenities: room.roomAmenities || [],
        RoomImages: [...existingImages, ...newImages],
      }
    })

    const otherImagesData = {}
    const imageFields = [
      'propertyImages',
      'facadeImages',
      'lobbyImages',
      'receptionImages',
      'corridorsImages',
      'liftElevatorsImages',
      'bathroomImages',
      'parkingImages',
      'otherAreasImages',
      'gst',
    ]
    imageFields.forEach((field) => {
      const existingImages = (selectedHotel?.[field] || [])
        .filter((image) => !removedImagesMap[field]?.includes(image))
        .map((image) => ({ filename: image, isExisting: true }))
      const newImages = (imageFileListMap[field] || [])
        .filter((file) => file.originFileObj && !removedImagesMap[field]?.includes(file.name))
        .map((file) => ({ filename: file.name, isExisting: false }))
      otherImagesData[field] = [...existingImages, ...newImages]
    })

    const roomRateData = payload.rooms.map((room, index) => {
      const roomCode = roomsData[index].Roomcode
      return {
        PropertyCode: propertyCode,
        RoomCode: roomCode,
        EntryDate: new Date().toISOString().split('T')[0],
        RatePlan: room.Rateplan || 'Room Only',
        SingleTarrif: Number(room.singleGuestPrice) || 0,
        DoubleTarrif: Number(room.doubleGuestPrice) || 0,
        TripleTarrif: Number(room.tripleGuestPrice) || 0,
        ExtraBedCharges: Number(room.extraBed) || 0,
        Below6YrsCharge: Number(room.below6YrsCharge) || 0,
        Child7to17Charge: Number(room.child7to17Charge) || 0,
        ExtraAdultCharge: Number(room.extraAdultCharge) || 0,
      }
    })

    const rateplanData = payload.rooms.map((room, index) => ({
      PropertyCode: propertyCode,
      RoomType: roomsData[index].Roomcode,
      RatePlan: room.Rateplan || 'Room Only',
      type: 'RatePlan',
      Status: 1,
    }))

    const rateplanDatas = payload.rooms.map((room, index) => ({
      PropertyCode: propertyCode,
      RatePlan: room.Rateplan || 'Room Only',
      type: 'RatePlan',
      Status: 1,
    }))

    const inventoryData = payload.rooms.map((room, index) => {
      const totalRooms = Number(room.roomsAvailable) || 0
      return {
        PropertyCode: propertyCode,
        RoomCode: roomsData[index].Roomcode,
        AvailableDate: new Date().toISOString().split('T')[0],
        AvailableRooms: totalRooms,
        BookedRooms: 0,
        StopSales: 0,
        TotalRooms: totalRooms,
      }
    })

    const amenitiesData = {
      PropertyCode: propertyCode,
      type: 'AmenitiesMaster',
      ...(payload.amenities || []).reduce(
        (acc, amenity) => ({
          ...acc,
          [amenity]: 'yes',
        }),
        {},
      ),
    }

    const formData = new FormData()
    formData.append('propertyData', JSON.stringify(propertyData))
    formData.append('utilitiesData', JSON.stringify(utilitiesData))
    formData.append('roomsData', JSON.stringify(roomsData))
    formData.append('roomRateData', JSON.stringify(roomRateData))
    formData.append('rateplanData', JSON.stringify(rateplanData))
    formData.append('inventoryData', JSON.stringify(inventoryData))
    formData.append('amenitiesData', JSON.stringify(amenitiesData))
    formData.append('rateplanDatas', JSON.stringify(rateplanDatas))
    formData.append('policiesData', JSON.stringify(policiesData))
    formData.append('otherImagesData', JSON.stringify(otherImagesData))

    utilitiesData.forEach((utility, index) => {
      const newFiles = (fileListMap[index] || []).filter(
        (file) => file.originFileObj && !removedUtilityImages[index]?.includes(file.name),
      )
      newFiles.forEach((file, fileIndex) => {
        formData.append(`utilityFiles_${propertyCode}_${index}_${fileIndex}`, file.originFileObj)
      })
    })

    roomsData.forEach((room, index) => {
      const newFiles = (roomFileListMap[index] || []).filter(
        (file) => file.originFileObj && !removedRoomImages[index]?.includes(file.name),
      )
      newFiles.forEach((file, imageIndex) => {
        formData.append(
          `roomFiles_${propertyCode}_${room.Roomcode}_${imageIndex}`,
          file.originFileObj,
        )
      })
    })

    imageFields.forEach((field) => {
      const newFiles = (imageFileListMap[field] || []).filter(
        (file) => file.originFileObj && !removedImagesMap[field]?.includes(file.name),
      )
      newFiles.forEach((file, index) => {
        formData.append(`imageFiles_${propertyCode}_${field}_${index}`, file.originFileObj)
      })
    })

    utilitiesData.forEach((utility, index) => {
      const existingImages = utility.photos
        .filter((photo) => photo.isExisting)
        .map((photo) => photo.filename)
      if (existingImages.length > 0) {
        formData.append(
          `existingUtilityImages_${propertyCode}_${index}`,
          JSON.stringify(existingImages),
        )
      }
    })

    roomsData.forEach((room, index) => {
      const existingImages = room.RoomImages.filter((image) => image.isExisting).map(
        (image) => image.filename,
      )
      if (existingImages.length > 0) {
        formData.append(
          `existingRoomImages_${propertyCode}_${room.Roomcode}`,
          JSON.stringify(existingImages),
        )
      }
    })

    imageFields.forEach((field) => {
      const existingImages = otherImagesData[field]
        .filter((image) => image.isExisting)
        .map((image) => image.filename)
      if (existingImages.length > 0) {
        formData.append(`existingImages_${propertyCode}_${field}`, JSON.stringify(existingImages))
      }
    })

    console.log('FormData contents:')
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? value.name : value}`)
    }

    try {
      const response = await fetch(`${baseUrl}/approval`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save property and rooms')
      }

      message.success({ content: 'Hotel and rooms approved successfully', duration: 5 })
      fetchData()
      setIsModalVisible(false)
      setSelectedHotel(null)
      form.resetFields()
      setFileListMap({})
      setRoomFileListMap({})
      setImageFileListMap({})
      setRemovedUtilityImages({})
      setRemovedRoomImages({})
      setRemovedImagesMap({})
      setEmptyFields({})
      // navigate(0)
    } catch (err) {
      message.error({ content: err.message || 'Failed to approve hotel/rooms', duration: 5 })
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Custom input style for empty fields
  const getInputStyle = (fieldName) => ({
    border: emptyFields[fieldName] ? '1px solid red' : undefined,
  })

  return (
    <div className="approval-screen">
      <h4>Hotel Approval Dashboard</h4>
      <style>{`
        .empty-field input,
        .empty-field textarea,
        .empty-field .ant-select-selector,
        .empty-field .ant-input-number {
          border: 1px solid red !important;
        }
        .empty-field1{
        border: 1px solid red !important;
        }
      `}</style>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={null}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="approve"
            type="primary"
            loading={loading}
            onClick={handleApprove}
            style={{ background: '#4b5e4b', borderColor: '#4b5e4b' }}
          >
            Approve
          </Button>,
        ]}
      >
        <Form form={form} onFinish={onFinish} layout="vertical" className="hotel-form">
          <h5>Basic Information</h5>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="hotelName" label="Name">
                <Input className={emptyFields['hotelName'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="propertyType" label="Property Type">
                <Select className={emptyFields['propertyType'] ? 'empty-field' : ''}>
                  {propertyType.map((type) => (
                    <Option key={type._id} value={type.PropertyName}>
                      {type.PropertyName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="starRating" label="Star Rating">
                <Select className={emptyFields['starRating'] ? 'empty-field' : ''}>
                  {star.map((rating) => (
                    <Option key={rating._id} value={rating.RatingId}>
                      {rating.Rating + ' Star'}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="yearOfConstruction" label="Construction">
                <Input className={emptyFields['yearOfConstruction'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="propertyDescription" label="Property Description">
                <TextArea rows={2} className="empty-field1" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="noOfRestaurants" label="No. of Restaurants">
                <Input type="number" className="empty-field1" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="noOfFloors" label="No. of Floors">
                <Input type="number" className="empty-field1" />
              </Form.Item>
            </Col>
          </Row>

          <h5>Contact Information</h5>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="primaryPhone" label="Primary Phone">
                <Input className={emptyFields['primaryPhone'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="secondaryPhone" label="Secondary Phone">
                <Input className={emptyFields['secondaryPhone'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="email" label="Email">
                <Input className={emptyFields['email'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="customerCare" label="Customer Care">
                <Input className="empty-field1" />
              </Form.Item>
            </Col>
          </Row>

          <h5>Amenities & Policies</h5>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="amenities" label="Amenities">
                <Select mode="multiple" className={emptyFields['amenities'] ? 'empty-field' : ''}>
                  {amenities.map((amenity) => (
                    <Option key={amenity._id} value={amenity.Amenities}>
                      {amenity.Amenities}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="allowUnmarriedCouples" label="Unmarried Couples">
                <Select className={emptyFields['allowUnmarriedCouples'] ? 'empty-field' : ''}>
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="allowGuestsBelow18" label="Guests Below 18">
                <Select className={emptyFields['allowGuestsBelow18'] ? 'empty-field' : ''}>
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="allowMaleGroups" label="Male Groups">
                <Select className={emptyFields['allowMaleGroups'] ? 'empty-field' : ''}>
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="allowSmoking" label="Smoking">
                <Select className={emptyFields['allowSmoking'] ? 'empty-field' : ''}>
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="allowParties" label="Parties">
                <Select className={emptyFields['allowParties'] ? 'empty-field' : ''}>
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="allowVisitors" label="Visitors">
                <Select className={emptyFields['allowVisitors'] ? 'empty-field' : ''}>
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="allowPets" label="Pets">
                <Select className={emptyFields['allowPets'] ? 'empty-field' : ''}>
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="wheelchairAccessible" label="Wheelchair Accessible">
                <Select className={emptyFields['wheelchairAccessible'] ? 'empty-field' : ''}>
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="additionalRules" label="Additional Rules">
                <TextArea
                  rows={2}
                  className={emptyFields['additionalRules'] ? 'empty-field' : ''}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="acceptableIdentityProofs" label="Acceptable Identity Proofs">
                <Select
                  mode="multiple"
                  placeholder="Select proofs"
                  className={emptyFields['acceptableIdentityProofs'] ? 'empty-field' : ''}
                >
                  <Option value="Passport">Passport</Option>
                  <Option value="Aadhar Card">Aadhar Card</Option>
                  <Option value="Driving License">Driving License</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <h5>Room Details</h5>
          <Form.List name="rooms">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div
                    key={field.key}
                    style={{ border: '1px solid #d9d9d9', padding: '16px', marginBottom: '16px' }}
                  >
                    <Row gutter={[16, 16]}>
                      <Col span={8}>
                        <Form.Item {...field} name={[field.name, 'roomType']} label="Room Type">
                          <Select
                            className={emptyFields[`rooms[${index}].roomType`] ? 'empty-field' : ''}
                          >
                            {roomType.map((type) => (
                              <Option key={type._id} value={type.RoomTypes}>
                                {type.RoomTypes}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'roomsAvailable']}
                          label="Rooms Available"
                        >
                          <Input
                            type="number"
                            className={
                              emptyFields[`rooms[${index}].roomsAvailable`] ? 'empty-field' : ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...field} name={[field.name, 'roomView']} label="Room View">
                          <Select
                            className={emptyFields[`rooms[${index}].roomView`] ? 'empty-field' : ''}
                          >
                            {roomView.map((view) => (
                              <Option key={view._id} value={view.RoomView}>
                                {view.RoomView}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'smokingPolicy']}
                          label="Smoking Policy"
                        >
                          <Select
                            className={
                              emptyFields[`rooms[${index}].smokingPolicy`] ? 'empty-field' : ''
                            }
                          >
                            <Option value="yes">Yes</Option>
                            <Option value="no">No</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'smokingRooms']}
                          label="Smoking Rooms"
                        >
                          <Input
                            type="number"
                            className={
                              emptyFields[`rooms[${index}].smokingRooms`] ? 'empty-field' : ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...field} name={[field.name, 'roomSize']} label="Room Size">
                          <Input
                            type="number"
                            className={emptyFields[`rooms[${index}].roomSize`] ? 'empty-field' : ''}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...field} name={[field.name, 'roomSizeUnit']} label="Size Unit">
                          <Select
                            className={
                              emptyFields[`rooms[${index}].roomSizeUnit`] ? 'empty-field' : ''
                            }
                          >
                            <Option value="sqft">Square Feet</Option>
                            <Option value="sqm">Square Meter</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'roomOccupancy']}
                          label="Room Occupancy"
                        >
                          <Select
                            className={
                              emptyFields[`rooms[${index}].roomOccupancy`] ? 'empty-field' : ''
                            }
                          >
                            {roomOccupancy.map((occupancy) => (
                              <Option key={occupancy._id} value={occupancy.OccupancyType}>
                                {occupancy.OccupancyType}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'Rateplan']}
                          label="Rate Plan"
                          initialValue="Room Only"
                        >
                          <Select
                            placeholder="Select a rate plan"
                            className={emptyFields[`rooms[${index}].Rateplan`] ? 'empty-field' : ''}
                          >
                            <Option value="Room Only">Room Only</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'singleGuestPrice']}
                          label="Single Guest Price"
                        >
                          <Input
                            type="number"
                            className={
                              emptyFields[`rooms[${index}].singleGuestPrice`] ? 'empty-field' : ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'doubleGuestPrice']}
                          label="Double Guest Price"
                        >
                          <Input
                            type="number"
                            className={
                              emptyFields[`rooms[${index}].doubleGuestPrice`] ? 'empty-field' : ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'tripleGuestPrice']}
                          label="Triple Guest Price"
                        >
                          <Input
                            type="number"
                            className={
                              emptyFields[`rooms[${index}].tripleGuestPrice`] ? 'empty-field' : ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'below6YrsCharge']}
                          label="Below 6 Years Charge"
                        >
                          <Input
                            type="number"
                            className={
                              emptyFields[`rooms[${index}].below6YrsCharge`] ? 'empty-field' : ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'child7to17Charge']}
                          label="Child 7-17 Years Charge"
                        >
                          <Input
                            type="number"
                            className={
                              emptyFields[`rooms[${index}].child7to17Charge`] ? 'empty-field' : ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'extraAdultCharge']}
                          label="Extra Adult Charge"
                        >
                          <Input
                            type="number"
                            className={
                              emptyFields[`rooms[${index}].extraAdultCharge`] ? 'empty-field' : ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...field} name={[field.name, 'extraBed']} label="Extra Bed">
                          <Input
                            type="number"
                            className={emptyFields[`rooms[${index}].extraBed`] ? 'empty-field' : ''}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'extraPersons']}
                          label="Extra Persons"
                        >
                          <Input
                            type="number"
                            className={
                              emptyFields[`rooms[${index}].extraPersons`] ? 'empty-field' : ''
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'noOfMaxChildren']}
                          label="Max Children"
                        >
                          <Input type="number" className="empty-field1" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item {...field} name={[field.name, 'bedType']} label="Bed Type">
                          <Select
                            className={emptyFields[`rooms[${index}].bedType`] ? 'empty-field' : ''}
                          >
                            {bedType.map((view) => (
                              <Option key={view._id} value={view.BedType}>
                                {view.BedType}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'roomAmenities']}
                          label="Room Amenities"
                        >
                          <Select
                            mode="multiple"
                            className={
                              emptyFields[`rooms[${index}].roomAmenities`] ? 'empty-field' : ''
                            }
                          >
                            {roomAmenities.map((amenity) => (
                              <Option key={amenity._id} value={amenity.Amenity}>
                                {amenity.Amenity}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={16}>
                        <Form.Item
                          {...field}
                          name={[field.name, 'roomDescription']}
                          label="Room Description"
                        >
                          <TextArea
                            rows={3}
                            placeholder="Describe the room..."
                            className="empty-field1"
                          />
                        </Form.Item>
                        <Form.Item
                          label={`Images for ${
                            form.getFieldValue(['rooms', field.name, 'roomType']) || 'Room'
                          }`}
                        >
                          <Upload
                            fileList={roomFileListMap[index] || []}
                            onChange={(info) => handleRoomUploadChange(index, info)}
                            beforeUpload={() => false}
                            multiple
                            listType="picture"
                          >
                            <Button icon={<UploadOutlined />}>Select Images</Button>
                          </Upload>
                        </Form.Item>
                      </Col>
                    </Row>
                    {fields.length > 1 && (
                      <Button
                        type="danger"
                        onClick={() => remove(field.name)}
                        style={{ marginBottom: '16px' }}
                      >
                        Remove Room
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  Add Room
                </Button>
              </>
            )}
          </Form.List>

          <h5>Operational Details</h5>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              {isLoaded && !loadError ? (
                <StandaloneSearchBox onLoad={handleLoad} onPlacesChanged={handlePlaceChange}>
                  <Form.Item name="adddress" label="Address">
                    <Input
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      placeholder="Enter Property Address"
                      className={emptyFields['adddress'] ? 'empty-field' : ''}
                    />
                  </Form.Item>
                </StandaloneSearchBox>
              ) : loadError ? (
                <div>Error loading Google Maps</div>
              ) : (
                <div>Loading Google Maps...</div>
              )}
            </Col>
            <Col span={8}>
              <Form.Item name="area" label="Area">
                <Input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Enter area"
                  className="empty-field1"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="city" label="City">
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className="empty-field1"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="latitude" label="Latitude">
                <Input
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  step="any"
                  className="empty-field1"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="longitude" label="Longitude">
                <Input
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  step="any"
                  className="empty-field1"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Map">
                <Button
                  type="primary"
                  onClick={showMapModal}
                  style={{ backgroundColor: '#4b5e4b', borderColor: '#4b5e4b' }}
                >
                  View in Map
                </Button>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="startTime" label="Start Date">
                <Input type="date" className={emptyFields['startTime'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="endTime" label="End Date">
                <Input type="date" className={emptyFields['endTime'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="checkInTime" label="Check-In Time">
                <Input type="time" className={emptyFields['checkInTime'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="checkOutTime" label="Check-Out Time">
                <Input type="time" className={emptyFields['checkOutTime'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="checkIn24Hours" label="Check-In 24 Hours">
                <Select className={emptyFields['checkIn24Hours'] ? 'empty-field' : ''}>
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="operationalrestaurant" label="Operational Restaurant">
                <Select className={emptyFields['operationalrestaurant'] ? 'empty-field' : ''}>
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="mealpackage" label="Meal Package">
                <Select className={emptyFields['mealpackage'] ? 'empty-field' : ''}>
                  {mealPackage.map((pkg) => (
                    <Option key={pkg._id} value={pkg.MealType}>
                      {pkg.MealType}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="mealtype" label="Meal Type">
                <Select className={emptyFields['mealtype'] ? 'empty-field' : ''}>
                  {mealType.map((type) => (
                    <Option key={type._id} value={type.MealType}>
                      {type.MealType}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="mealrank" label="Meal Price">
                <Select className={emptyFields['mealrank'] ? 'empty-field' : ''}>
                  {mealPrice.map((price) => (
                    <Option key={price._id} value={price.MealRackType}>
                      {price.MealRackType}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="usingChannelManager" label="Using Channel Manager">
                <Select className={emptyFields['usingChannelManager'] ? 'empty-field' : ''}>
                  <Option value="Yes">Yes</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="channelManagerCompany" label="Channel Manager Company">
                <Input className={emptyFields['channelManagerCompany'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="Notes" label="Notes">
                <TextArea rows={2} className={emptyFields['Notes'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="cancellationPolicy" label="Cancellation Policy">
                <Select className={emptyFields['cancellationPolicy'] ? 'empty-field' : ''}>
                  {cancellation.map((policy) => (
                    <Option key={policy._id} value={policy.Policies}>
                      {policy.Policies}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <h5>Financial Details</h5>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="accountHolderName" label="Account Holder Name">
                <Input className={emptyFields['accountHolderName'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="accountNumber" label="Account Number">
                <Input className={emptyFields['accountNumber'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="ifscCode" label="IFSC Code">
                <Input className={emptyFields['ifscCode'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="branch" label="Branch">
                <Input className={emptyFields['branch'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="gstNumber" label="GST Number">
                <Input className={emptyFields['gstNumber'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="bankName" label="Bank Name">
                <Input className={emptyFields['bankName'] ? 'empty-field' : ''} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="propertyownType" label="Property Ownership Type">
                <Select className={emptyFields['propertyownType'] ? 'empty-field' : ''}>
                  {propertyOwnerType.map((type) => (
                    <Option key={type._id} value={type.propertyType}>
                      {type.propertyType}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <h5>Utilities</h5>
          <Form.List name="utilities">
            {(fields) => (
              <>
                {fields.map((field, index) => (
                  <Row gutter={[16, 16]} key={field.key}>
                    <Col span={8}>
                      <Form.Item
                        {...field}
                        name={[field.name, 'billType']}
                        label={`Utility Type ${index + 1}`}
                      >
                        <Select
                          className={
                            emptyFields[`utilities[${index}].billType`] ? 'empty-field' : ''
                          }
                        >
                          {utilityType.map((type) => (
                            <Option key={type._id} value={type.rating}>
                              {type.rating}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={16}>
                      <Form.Item
                        label={`Images for ${
                          form.getFieldValue(['utilities', field.name, 'billType']) || 'Utility'
                        }`}
                      >
                        <Upload
                          fileList={fileListMap[index] || []}
                          onChange={(info) => handleUploadChange(index, info)}
                          beforeUpload={() => false}
                          multiple
                          listType="picture"
                        >
                          <Button icon={<UploadOutlined />}>Select Images</Button>
                        </Upload>
                      </Form.Item>
                    </Col>
                  </Row>
                ))}
              </>
            )}
          </Form.List>

          <h5>Other Images</h5>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item name="propertyImages" label="Property Images">
                <Upload
                  fileList={imageFileListMap['propertyImages'] || []}
                  onChange={(info) => handleImageUploadChange('propertyImages', info)}
                  beforeUpload={() => false}
                  multiple
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Select Images</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="facadeImages" label="Facade Images">
                <Upload
                  fileList={imageFileListMap['facadeImages'] || []}
                  onChange={(info) => handleImageUploadChange('facadeImages', info)}
                  beforeUpload={() => false}
                  multiple
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Select Images</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="lobbyImages" label="Lobby Images">
                <Upload
                  fileList={imageFileListMap['lobbyImages'] || []}
                  onChange={(info) => handleImageUploadChange('lobbyImages', info)}
                  beforeUpload={() => false}
                  multiple
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Select Images</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="receptionImages" label="Reception Images">
                <Upload
                  fileList={imageFileListMap['receptionImages'] || []}
                  onChange={(info) => handleImageUploadChange('receptionImages', info)}
                  beforeUpload={() => false}
                  multiple
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Select Images</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="corridorsImages" label="Corridors Images">
                <Upload
                  fileList={imageFileListMap['corridorsImages'] || []}
                  onChange={(info) => handleImageUploadChange('corridorsImages', info)}
                  beforeUpload={() => false}
                  multiple
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Select Images</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="liftElevatorsImages" label="Lift/Elevators Images">
                <Upload
                  fileList={imageFileListMap['liftElevatorsImages'] || []}
                  onChange={(info) => handleImageUploadChange('liftElevatorsImages', info)}
                  beforeUpload={() => false}
                  multiple
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Select Images</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="bathroomImages" label="Bathroom Images">
                <Upload
                  fileList={imageFileListMap['bathroomImages'] || []}
                  onChange={(info) => handleImageUploadChange('bathroomImages', info)}
                  beforeUpload={() => false}
                  multiple
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Select Images</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="parkingImages" label="Parking Images">
                <Upload
                  fileList={imageFileListMap['parkingImages'] || []}
                  onChange={(info) => handleImageUploadChange('parkingImages', info)}
                  beforeUpload={() => false}
                  multiple
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Select Images</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="otherAreasImages" label="Other Areas Images">
                <Upload
                  fileList={imageFileListMap['otherAreasImages'] || []}
                  onChange={(info) => handleImageUploadChange('otherAreasImages', info)}
                  beforeUpload={() => false}
                  multiple
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Select Images</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="gst" label="GST Image">
                <Upload
                  fileList={imageFileListMap['gst'] || []}
                  onChange={(info) => handleImageUploadChange('gst', info)}
                  beforeUpload={() => false}
                  multiple
                  listType="picture"
                >
                  <Button icon={<UploadOutlined />}>Select Images</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      <Modal
        title="Property Location"
        visible={isMapModalVisible}
        onCancel={handleMapModalClose}
        footer={[
          <Button key="close" onClick={handleMapModalClose}>
            Close
          </Button>,
        ]}
        width={800}
      >
        {isLoaded && !loadError && latitude && longitude ? (
          <GoogleMap
            mapContainerStyle={{ height: '500px', width: '100%' }}
            center={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
            zoom={15}
          >
            <Marker
              position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
              draggable={true}
              onDragEnd={handleMarkerDrag}
            />
          </GoogleMap>
        ) : loadError ? (
          <div>Error loading Google Maps</div>
        ) : (
          <div>Loading Google Maps...</div>
        )}
      </Modal>

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
    </div>
  )
}
