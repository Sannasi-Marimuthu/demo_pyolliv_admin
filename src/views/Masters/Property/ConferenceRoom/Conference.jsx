/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useRef } from 'react'
import { InputNumber, TimePicker, Button, Card, Table, Input, Select, Modal, Image } from 'antd'
import dayjs from 'dayjs'
import '../../CSS/Master.css'
import { api } from '../../../../Axios/axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import { EditOutlined, UploadOutlined } from '@ant-design/icons'

const { Option } = Select

const Conference = () => {
  const [slotCount, setSlotCount] = useState(null)
  const [slots, setSlots] = useState([])
  const [roomtype, setRoomType] = useState([])
  const [selectedRoom, setSelectedRoom] = useState('')
  const [hallName, setHallName] = useState('')
  const [capacity, setCapacity] = useState('')
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [view, setView] = useState([])
  const [editId, setEditId] = useState(null)
  const [viewTable, setViewTable] = useState(false)
  const [viewForm, setViewForm] = useState(true)
  const [newfile, setNewfile] = useState(false)
  const [opentable, setOpentable] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [images, setImages] = useState([])
  const [previewImage, setPreviewImage] = useState('')
  const [previewVisible, setPreviewVisible] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 'auto', height: 'auto' })
  const fileInputRef = useRef(null)

  const navigate = useNavigate()
  const PropertyCode = sessionStorage.getItem('propertyId') || 'DEFAULT_PROPERTY_CODE'

  const columns = [
    {
      title: 'Property Code',
      dataIndex: 'PropertyCode',
      key: 'PropertyCode',
      render: (propertyCode) => {
        const room = property.find((item) => item.Propertycode === propertyCode)
        return room ? room.Displayname : propertyCode
      },
    },
    {
      title: 'Hall Name',
      dataIndex: 'HallName',
      key: 'HallName',
    },
    {
      title: 'Room Type',
      dataIndex: 'RoomType',
      key: 'RoomType',
      render: (roomType) => {
        const room = rooms.find((item) => item.Roomcode === roomType)
        return room ? room.Displayname : roomType
      },
    },
    {
      title: 'Capacity',
      dataIndex: 'Capacity',
      key: 'Capacity',
    },
    {
      title: 'Slots',
      dataIndex: 'Slots',
      key: 'Slots',
      render: (slots) => (
        <>
          {slots.map((slot, index) => (
            <div key={index}>
              <strong>Slot-{index + 1}:</strong> {slot.from} - {slot.to}, Price: ₹{slot.price}
            </div>
          ))}
        </>
      ),
    },
    {
      title: 'Images',
      dataIndex: 'ConferenceImages',
      key: 'ConferenceImages',
      render: (images) => {
        const flatImages = Array.isArray(images) ? images.flat() : []
        return (
          <div style={{ display: 'flex', gap: '8px' }}>
            {flatImages.length > 0 ? (
              flatImages.map((img, idx) => (
                <Image
                  key={idx}
                  src={`http://164.52.195.176:4500/Uploads/${img}`}
                  width={50}
                  style={{ cursor: 'pointer', objectFit: 'cover' }}
                  preview={false} // Disable default preview
                  onClick={() => {
                    setPreviewImage(`http://164.52.195.176:4500/Uploads/${img}`)
                    setPreviewVisible(true)
                  }}
                />
              ))
            ) : (
              <span>No images</span>
            )}
          </div>
        )
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => {
            handleEdit(record)
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

  const handleChange = (value) => {
    setSelectedAmenities(value)
  }

  const handleSlotChange = (value) => {
    setSlotCount(value)
    setSlots(Array.from({ length: value }, () => ({ from: null, to: null, price: '' })))
  }

  const handlePriceChange = (index, value) => {
    const updatedSlots = [...slots]
    updatedSlots[index].price = value
    setSlots(updatedSlots)
  }

  const handleTimeChange = (index, type) => (time, timeString) => {
    const updatedSlots = [...slots]
    if (time) {
      if (type === 'from') {
        updatedSlots[index].from = time
        updatedSlots[index].to = null
      } else {
        updatedSlots[index].to = time
      }
      setSlots(updatedSlots)
    }
  }

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target
    setImageDimensions({ width: naturalWidth, height: naturalHeight })
  }

  const getDisabledFromTimes = (index) => {
    if (index === 0) return {}
    const prevToTime = slots[index - 1]?.to
    if (!prevToTime) return {}
    return {
      disabledHours: () => Array.from({ length: prevToTime.hour() }, (_, i) => i),
      disabledMinutes: (hour) => {
        const prevHour = prevToTime.hour()
        if (hour === prevHour) {
          return Array.from({ length: prevToTime.minute() + 1 }, (_, i) => i)
        }
        return []
      },
    }
  }

  const getDisabledToTimes = (index) => {
    const fromTime = slots[index]?.from
    if (!fromTime) return {}
    return {
      disabledHours: () => Array.from({ length: fromTime.hour() }, (_, i) => i),
      disabledMinutes: (hour) => {
        const fromHour = fromTime.hour()
        if (hour === fromHour) {
          return Array.from({ length: fromTime.minute() }, (_, i) => i)
        }
        return []
      },
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (files.some((file) => file.size > maxSize)) {
      toast.error('Each image must be under 10MB')
      return
    }
    const newImages = files.map((file, index) => ({
      uid: `new-${Date.now()}-${index}`,
      file,
      existingFile: null,
    }))
    setImages((prev) => [...prev, ...newImages])
    e.target.value = null
  }

  const handlePreview = (image) => {
    setPreviewImage(
      image.file
        ? URL.createObjectURL(image.file)
        : `http://164.52.195.176:4500/Uploads/${image.existingFile}`,
    )
    setPreviewVisible(true)
  }

  const handleCancelPreview = () => {
    setPreviewVisible(false)
    setPreviewImage('')
  }

  const handleRemove = (image) => {
    setImages((prev) => prev.filter((item) => item.uid !== image.uid))
  }

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleSubmit = async () => {
    if (
      !hallName ||
      !selectedRoom ||
      !capacity ||
      slots.some((slot) => !slot.from || !slot.to || !slot.price)
    ) {
      toast.error('Please fill all required fields')
      return
    }

    if (images.length === 0) {
      toast.error('At least one image is required')
      return
    }

    const formattedSlots = slots.map((slot, index) => ({
      slotName: `Slot-${index + 1}`,
      from: slot.from ? slot.from.format('hh:mm A') : 'Not selected',
      to: slot.to ? slot.to.format('hh:mm A') : 'Not selected',
      price: slot.price,
      availability: 1,
    }))

    const formData = new FormData()
    formData.append('type', 'ConferenceRoom')
    formData.append('Slots', JSON.stringify(formattedSlots))
    formData.append('PropertyCode', PropertyCode)
    formData.append('HallName', hallName)
    formData.append('RoomType', selectedRoom)
    formData.append('Capacity', capacity)
    formData.append('Amenities', JSON.stringify(selectedAmenities))
    formData.append('propertyData', JSON.stringify({ Propertycode: PropertyCode }))

    console.log('Images state:', images)
    images.forEach((image, index) => {
      if (image.file) {
        formData.append(`ConferenceImages[${index}]`, image.file)
      }
      if (isEditMode && image.existingFile && !image.file) {
        formData.append(
          `ExistingConferenceImages[${index}]`,
          image.existingFile.replace(/\\/g, '/'),
        )
      }
    })

    for (let [key, value] of formData.entries()) {
      console.log(`FormData: ${key} = ${value}`)
    }

    const baseUrl = 'https://backend-2-rkqo.onrender.com/api'
    const endpoint = editId
      ? `${baseUrl}/update?id=${editId}&type=ConferenceRoom`
      : `${baseUrl}/conference`
    console.log('Sending request to:', endpoint)

    try {
      const response = await fetch(endpoint, {
        method: editId ? 'PATCH' : 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to save conference room')
      }
      0
      const data = await response.json()
      toast.success(`Conference Room ${editId ? 'Updated' : 'Created'} Successfully`)
      setEditId(null)
      setIsEditMode(false)
      resetForm()
      fetchConferenceRooms()
      setViewForm(false)
      setViewTable(true)
      setNewfile(true)
      setOpentable(false)
    } catch (error) {
      console.error('API Error:', error)
      toast.error(error.message || 'Failed to save conference room')
    }
  }

  const resetForm = () => {
    setHallName('')
    setSelectedRoom('')
    setCapacity('')
    setSelectedAmenities([])
    setSlotCount(null)
    setSlots([])
    images.forEach((image) => {
      if (image.file) {
        URL.revokeObjectURL(URL.createObjectURL(image.file))
      }
    })
    setImages([])
  }

  const handleCancelEdit = () => {
    setEditId(null)
    setIsEditMode(false)
    resetForm()
    setViewForm(false)
    setViewTable(true)
    setNewfile(true)
    setOpentable(false)
  }

  const fetchConferenceRooms = () => {
    if (PropertyCode === '0') {
      api
        .getAll('get?type=ConferenceRoom')
        .then((response) => {
          setView(response.data)
        })
        .catch((error) => {
          console.error('Error fetching conference rooms:', error)
          toast.error('Error fetching conference rooms')
        })
    } else {
      api
        .getAll('get?type=ConferenceRoom')
        .then((response) => {
          const filteredData = response.data.filter((item) => item.PropertyCode === PropertyCode)
          setView(filteredData)
          console.log('<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>', filteredData)
        })
        .catch((error) => {
          console.error('Error fetching conference rooms:', error)
          toast.error('Error fetching conference rooms')
        })
    }
  }

  useEffect(() => {
    fetchConferenceRooms()
  }, [])

  const [amenitiesCategory, setAmenitiesCategory] = useState([])
  useEffect(() => {
    api.getAll('get?type=AmenitiesCategory').then((response) => {
      const filteredData = response.data.filter((item) => item.AmenitiesCategory === 'Conference ')
      setAmenitiesCategory(filteredData[0]?.AmenitiesCategoryId || null)
      if (!filteredData.length) {
        toast.error('No conference amenities category found')
      }
    })
  }, [])

  const [amenities, setAmenities] = useState([])
  useEffect(() => {
    api.getAll('get?type=Amenities').then((response) => {
      const filteredData = response.data.filter(
        (item) => item.AmenitiesCategory === amenitiesCategory,
      )
      setAmenities(filteredData)
    })
  }, [amenitiesCategory])

  const [property, setProperty] = useState([])
  useEffect(() => {
    api.getAll('get?type=Propertymaster').then((response) => {
      setProperty(response.data)
    })
  }, [])

  const [rooms, setRooms] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=Roomtype')
      .then((response) => {
        setRooms(response.data)
        const existingRoomTypes = new Set(view.map((item) => item.RoomType))
        const filteredData = response.data.filter(
          (item) =>
            item.isConference === 1 &&
            !existingRoomTypes.has(item.Roomcode) &&
            item.PropertyCode === PropertyCode,
        )
        setRoomType(filteredData)
      })
      .catch((error) => {
        console.error('Error fetching room types:', error)
        toast.error('Error fetching room types')
      })
  }, [view])

  const handleEdit = (record) => {
    setEditId(record._id)
    setHallName(record.HallName)
    setSelectedRoom(record.RoomType)
    setCapacity(record.Capacity)
    setSelectedAmenities(record.Amenities)
    const formattedSlots = record.Slots.map((slot) => ({
      from: slot.from !== 'Not selected' ? dayjs(slot.from, 'hh:mm A') : null,
      to: slot.to !== 'Not selected' ? dayjs(slot.to, 'hh:mm A') : null,
      price: slot.price,
    }))
    setSlotCount(formattedSlots.length)
    setSlots(formattedSlots)

    const flatImages = Array.isArray(record.ConferenceImages) ? record.ConferenceImages.flat() : []
    console.log('Flat ConferenceImages:', flatImages)

    setImages(
      flatImages.map((img, idx) => ({
        uid: `existing-${idx}`,
        file: null,
        existingFile: img,
      })),
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        {newfile && (
          <h6
            onClick={() => {
              setViewForm(true)
              setViewTable(false)
              setNewfile(false)
              setOpentable(true)
              setIsEditMode(false)
              resetForm()
            }}
          >
            <AddToPhotosIcon className="newtable1" />
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
            <BackupTableIcon className="backuptable1" />
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
                  <p className="responsive">Hall Name</p>
                  <Input
                    className="inputbox"
                    placeholder="Enter a Hall Name"
                    value={hallName}
                    onChange={(e) => setHallName(e.target.value)}
                  />
                </div>
                <div className="inputs">
                  <p className="responsive">Amenities</p>
                  <Select
                    className="inputbox"
                    placeholder="Select Amenities"
                    mode="multiple"
                    onChange={handleChange}
                    value={selectedAmenities}
                    maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
                    maxTagCount={2}
                    options={amenities.map((item) => ({
                      value: item.Amenities,
                      label: item.Amenities,
                    }))}
                  />
                </div>
                <div className="slots" style={{ marginTop: 10 }}>
                  {slots.map((slot, index) => (
                    <Card key={index} title={`Slot-${index + 1}`} style={{ marginBottom: 10 }}>
                      <div className="conferenceprice">
                        <div>
                          <TimePicker
                            use12Hours
                            format="h:mm A"
                            placeholder="From Time"
                            value={slot.from}
                            onChange={handleTimeChange(index, 'from')}
                            disabledTime={() => getDisabledFromTimes(index)}
                          />
                        </div>
                        <div>
                          <TimePicker
                            use12Hours
                            format="h:mm A"
                            placeholder="To Time"
                            value={slot.to}
                            onChange={handleTimeChange(index, 'to')}
                            disabledTime={() => getDisabledToTimes(index)}
                          />
                        </div>
                        <div>
                          <Input
                            className="conferencemoney"
                            placeholder="₹  Price"
                            value={slot.price}
                            onChange={(e) => handlePriceChange(index, e.target.value)}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">Room Type</p>
                  <Select
                    className="inputbox"
                    placeholder="Select a Room Type"
                    onChange={(value) => setSelectedRoom(value)}
                    value={selectedRoom || undefined}
                    options={roomtype.map((item) => ({
                      value: item.Roomcode,
                      label: item.Displayname,
                    }))}
                  />
                </div>
                <div className="inputs">
                  <p className="responsive">Maximum Seating Capacity</p>
                  <InputNumber
                    className="inputbox"
                    placeholder="Enter Maximum Seating Capacity"
                    value={capacity}
                    onChange={(value) => setCapacity(value)}
                    min={1}
                  />
                </div>
              </div>
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">Enter Number of Slots</p>
                  <InputNumber
                    className="inputbox"
                    min={1}
                    max={10}
                    value={slotCount}
                    placeholder="Enter Number of Slots"
                    onChange={handleSlotChange}
                  />
                </div>
                <div className="inputs">
                  <p className="responsive">Conference Images</p>
                  <Button
                    icon={<UploadOutlined />}
                    onClick={handleUploadClick}
                    className="inputbox"
                    aria-label="Upload conference images"
                  >
                    Upload Images
                  </Button>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  {images.length > 0 && (
                    <div
                      style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}
                      className="thumbnail-container"
                    >
                      {images.map((image) => (
                        <div
                          key={image.uid}
                          className="thumbnail-wrapper"
                          style={{ position: 'relative' }}
                        >
                          <Image
                            src={
                              image.file
                                ? URL.createObjectURL(image.file)
                                : `http://164.52.195.176:4500/Uploads/${image.existingFile}`
                            }
                            alt="Conference Image"
                            width={100}
                            height={100}
                            style={{ objectFit: 'cover', cursor: 'pointer' }}
                            preview={false} // Disable default preview
                            onClick={() => handlePreview(image)}
                          />
                          <Button
                            type="link"
                            danger
                            style={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                              padding: 0,
                            }}
                            className="remove-button"
                            onClick={() => handleRemove(image)}
                          >
                            X
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="admin-row">
              <div className="admin-col">
                <div className="inputsslots">
                  {slotCount > 0 && (
                    <>
                      {isEditMode && (
                        <Button
                          onClick={handleCancelEdit}
                          className="cancel"
                          style={{ marginRight: '10px' }}
                        >
                          CANCEL
                        </Button>
                      )}
                      <Button className="saveconference" type="primary" onClick={handleSubmit}>
                        {isEditMode ? 'UPDATE' : 'SUBMIT'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewTable && (
          <section className="showtable">
            <Table
              pagination={{ pageSize: 10 }}
              dataSource={view}
              columns={columns}
              bordered
              className="custom-table"
              rowKey="_id"
            />
          </section>
        )}
      </div>

      <Modal
        open={previewVisible}
        footer={null}
        onCancel={handleCancelPreview}
        width="auto"
        centered
        bodyStyle={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '20px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          backgroundColor: '#f0f2f5', // Light background for clean look
          borderRadius: '8px',
        }}
      >
        {previewImage && (
          <>
            <img
              alt="Preview"
              src={previewImage}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                border: '2px solid #ffffff', // White border
                borderRadius: '8px', // Rounded corners
                objectFit: 'contain',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
              }}
              onLoad={handleImageLoad}
            />
            <Button
              type="default"
              onClick={handleCancelPreview}
              style={{
                marginTop: '16px',
                width: '120px',
                borderRadius: '4px',
              }}
            >
              Close
            </Button>
          </>
        )}
      </Modal>
    </div>
  )
}

export default Conference
