import { Button, Input, Select, Table } from 'antd'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import '../../Masters/CSS/Master.css'
import 'react-toastify/dist/ReactToastify.css'
import { api } from '../../../Axios/axios'
import FormItem from 'antd/es/form/FormItem'
import { useNavigate } from 'react-router-dom'
import { EditOutlined } from '@ant-design/icons'

function File() {
  const Mail = sessionStorage.getItem('Email')
  const Propertycode = sessionStorage.getItem('propertyId')
  // const [formData, setFormData] = useState({ image: null })
  const navigate = useNavigate()
  const [image, setImage] = useState()

  const [category, setCategory] = useState('')
  const [editImageDetails, setEditImageDetails] = useState(null) // To store details of the image being edited

  const [viewTable, setViewTable] = useState(false)
  const [viewForm, setViewForm] = useState(true)
  const [newfile, setNewfile] = useState(false)
  const [opentable, setOpentable] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)

  //Show Image

  const baseURL = 'http://164.52.195.176:4500/' // Change based on backend config

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (_, record) => {
        const imageCategories = [
          { name: 'Cover Image', field: 'CoverImage', images: record.CoverImage || [] },
          { name: 'Property Image', field: 'PropertyImage', images: record.PropertyImage || [] },
          { name: 'Room Image', field: 'RoomImage', images: record.RoomImage || [] },
        ]

        return imageCategories
          .filter((category) => category.images.length > 0) // Only show categories with images
          .map((category, catIndex) => (
            <div key={catIndex} style={{ marginBottom: '10px' }}>
              <h6 style={{ marginBottom: '5px' }}>{category.name}</h6>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {category.images.map((img, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={`${baseURL}${img}`}
                      alt={category.name}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      onError={(e) => (e.target.src = '/fallback-image.jpg')}
                    />
                    <Button
                      type="primary"
                      size="small"
                      style={{ position: 'absolute', top: 0, right: 0 }}
                      onClick={() => {
                        editSingleImage(record, category.field, img, index)
                        setViewForm(true)
                        setViewTable(false)
                        setNewfile(false)
                        setIsEditMode(true)
                      }}
                    >
                      <EditOutlined />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))
      },
    },
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

  const editUser = (record) => {
    setImages(record.image ? [baseURL + record.image] : [])
    setCategory(record.categoryField)
    sessionStorage.setItem('imageid', record._id)
  }

  /////////////////  Multiple Image  ////////////////

  const [images, setImages] = useState([])
  const [formData, setFormData] = useState({ image: [] })

  const readFileAsDataURL = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (event) => resolve(event.target.result)
      reader.readAsDataURL(file)
    })
  }

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = src
      img.onload = () => resolve(img)
    })
  }

  // console.log('image', formData)

  const id = sessionStorage.getItem('imageid')
  ///////////////////////////////////////////////////////////////////////////////////////////////////////

  // Updated handleFileChange function
  const fileInputRef = useRef(null)

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files)
    if (!files.length) return

    if (editImageDetails) {
      // We're editing a single image - only allow one replacement image
      if (files.length > 1) {
        toast.error('Please select only one image to replace the existing image.')
        return
      }

      const file = files[0]
      const maxSize = 2 * 1024 * 1024 // 2MB

      if (file.size > maxSize) {
        toast.error('File size exceeds 2MB. Please select a smaller file.')
        return
      }

      const imgUrl = await readFileAsDataURL(file)
      const img = await loadImage(imgUrl)

      if (img.naturalWidth < 300 || img.naturalHeight < 200) {
        toast.error('Image resolution should be at least 300 × 200 pixels.')
        return
      }

      // Replace the current image preview with the new one
      setImages([imgUrl])
      setFormData({ image: [file] })
    } else {
      // Normal multi-image upload flow
      if (files.length + images.length > 10) {
        toast.error('You can only upload up to 10 images.')
        return
      }

      const maxSize = 2 * 1024 * 1024
      const newImages = []
      const newFiles = []

      for (const file of files) {
        if (file.size > maxSize) {
          toast.error('File size exceeds 2MB. Please select a smaller file.')
          continue
        }
        const imgUrl = await readFileAsDataURL(file)
        const img = await loadImage(imgUrl)

        if (img.naturalWidth < 300 || img.naturalHeight < 200) {
          toast.error('Image pixels should have at least 300 × 200.')
          continue
        }

        newImages.push(imgUrl)
        newFiles.push(file)
      }

      setImages((prevImages) => [...prevImages, ...newImages])
      setFormData((prev) => ({ ...prev, image: [...prev.image, ...newFiles] }))
    }
  }

  // Updated save function
  const save = async () => {
    if (!formData.image.length) {
      toast.error('Please select images to upload.')
      return
    }

    const fileData = new FormData()
    fileData.append('type', 'Filetype')
    fileData.append('PropertyCode', Propertycode)

    if (category === 'RoomImage' && !editImageDetails) {
      fileData.append('RoomCode', room)
    }

    if (editImageDetails) {
      // Single image edit mode
      fileData.append('editMode', 'singleImage')
      fileData.append('categoryField', editImageDetails.category) // e.g. 'CoverImage'
      fileData.append('oldImage', editImageDetails.image) // The old image filename
      fileData.append('imageIndex', editImageDetails.index) // The position in the array

      // Append the new replacement image
      fileData.append('newImage', formData.image[0])
    } else {
      // Normal multi-image upload
      formData.image.forEach((file) => {
        fileData.append(`${category}`, file)
      })
    }

    try {
      if (!id) {
        // Create new record
        const response = await fetch(`${baseURL}api/post`, {
          method: 'POST',
          body: fileData,
        })
        if (response.ok) {
          toast.success('Images Uploaded Successfully', {
            position: 'top-center',
            autoClose: 3000,
          })
          navigate(0)
        } else {
          throw new Error('Failed to upload images')
        }
      } else {
        // Update existing record
        const response = await axios.put(
          `${baseURL}api/update?id=${id}&type=Filetype`,
          fileData,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        )
        toast.success('Images Updated Successfully', {
          position: 'top-center',
          autoClose: 3000,
        })
        navigate(0)
        resetFormDetails()
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Error uploading images')
    }
  }

  // Add a function to reset form state
  const resetFormDetails = () => {
    sessionStorage.removeItem('imageid')
    setEditImageDetails(null)
    setImages([])
    setFormData({ image: [] })
    setCategory('')
    setRoom([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Update editSingleImage function to properly extract the filename
  const editSingleImage = (record, categoryField, image, index) => {
    // Extract just the filename without the base URL
    const imageFileName = typeof image === 'string' ? image.replace(`${baseURL}`, '') : image

    setEditImageDetails({
      recordId: record._id,
      category: categoryField, // e.g., 'CoverImage'
      image: imageFileName, // Just the filename part
      index: index, // The index in the array
    })

    setCategory(categoryField) // Pre-select the category in the form
    setImages([`${baseURL}${imageFileName}`]) // Show preview of the current image
    sessionStorage.setItem('imageid', record._id)
  }

  const [view, setView] = useState([])
  useEffect(() => {
    api.getAll('get?type=Filetype').then((response) => {
      console.log('getimage', response.data)
      const filteredData = response.data.filter((item) => item.PropertyCode == Propertycode)
      setView(filteredData)
      console.log('*******************', filteredData)
    })
  }, [Propertycode])

  //Image Category
  const [imageCategory, setImageCategory] = useState([])
  useEffect(() => {
    api.getAll('get?type=ImageCategory').then((response) => {
      console.log('getimage', response.data)
      // const filteredData = response.data.filter((item) => item.PropertyCode == Propertycode)
      setImageCategory(response.data)
      // console.log('*******************', filteredData)
    })
  }, [Propertycode])

  const transformedData = []
  const categoryMap = {
    CoverImage: 'Cover Image',
    PropertyImage: 'Property Image',
    RoomImage: 'Room Image',
  }

  // Group images by category and combine them into a single row
  view.forEach((record) => {
    Object.keys(categoryMap).forEach((key) => {
      if (record[key] && record[key].length > 0) {
        // Check if this category already exists in transformedData
        let existingCategory = transformedData.find((item) => item.category === categoryMap[key])

        if (existingCategory) {
          // If category exists, append new images
          existingCategory.images = [...existingCategory.images, ...record[key]]
        } else {
          // If category does not exist, create a new row
          transformedData.push({
            category: categoryMap[key],
            images: record[key],
          })
        }
      }
    })
  })

  // User Property
  const [propertyname, setPropertyName] = useState('')
  const [userproperty, setUserProperty] = useState([])
  useEffect(() => {
    if (Propertycode == 0) {
      api.getAll('get?type=Userproperty').then((response) => {
        setUserProperty(response.data)
        console.log(response.data)
      })
    } else {
      api
        .getAll('get?type=Userproperty')
        .then((response) => {
          const filtereddata = response.data.filter((item) => item.Email == Mail)
          setUserProperty(filtereddata[0])
          console.log('userproperty', filtereddata)
        })
        .catch(() => {
          toast.error('Error in getting User Property')
        })
    }
  }, [])
  console.log('Property', userproperty)

  // Property Master
  const [property, setProperty] = useState([])
  useEffect(() => {
    api.getAll('get?type=Propertymaster').then((response) => {
      const userPropertyNames = userproperty[0].PropertyName
      const filteredData = response.data.filter((property) =>
        userPropertyNames.includes(property.Propertyname),
      )
      setProperty(filteredData)
      console.log('PropertyMaster', filteredData)
      console.log('OriginalPropertyMaster', response.data)
    })
  }, [userproperty])

  // Room Type
  const [room, setRoom] = useState([])
  const [roomtype, setRoomType] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=Roomtype')
      .then((response) => {
        const filteredData = response.data.filter((item) => item.PropertyCode == Propertycode)
        setRoomType(filteredData)
        console.log('RoomType', filteredData)
        console.log('OriginalRoomType', response.data)
      })
      .catch(() => {
        toast.error('Error in getting Room Type')
      })
  }, [propertyname])

  const canceledit = () => {
    sessionStorage.removeItem('imageid')
    navigate(0)
  }

  return (
    <div>
      <div className="tableicon">
        {/* <h3 className="heading">Room Type</h3> */}
        {newfile && (
          <h6
            onClick={() => {
              setViewForm(true)
              setViewTable(false)
              setNewfile(false)
              setOpentable(true)
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
        }}
      >
        {viewForm && (
          <div className="form">
            <div className="admin-row">
              <div className="admin-col">
                <div className="inputs">
                  <div className="imagesize">
                    <p className="responsiveimage" style={{ width: 'auto' }}>
                      {editImageDetails ? 'Replace Image' : 'Upload Images'}
                      <span>*</span>
                    </p>
                    <div className="imagesdiv">
                      <span className="imagesize1">Min-Resolution: 300×200</span>
                      <span className="imagesize1">Max-Size: 2MB</span>
                    </div>
                  </div>
                  <Input
                    type="file"
                    className="inputboximage"
                    multiple={!editImageDetails} // Allow multiple only when not editing a single image
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">
                    Select Category<span>*</span>
                  </p>
                  <Select
                    style={{ height: '35px' }}
                    className="inputbox"
                    showSearch
                    placeholder="Select Category"
                    value={category || undefined}
                    onChange={(e) => {
                      setCategory(e)
                    }}
                    disabled={editImageDetails} // Disable category selection when editing a single image
                    options={imageCategory.map((item) => ({
                      value: item.ImageCategory,
                      label: item.ImageCategory,
                    }))}
                  />
                </div>
              </div>
              <div className="admin-col">
                {category === 'RoomImage' && !editImageDetails && (
                  <div className="inputs">
                    <p className="responsive">
                      Select Room Type<span>*</span>
                    </p>
                    <Select
                      style={{ height: '35px' }}
                      className="inputbox"
                      showSearch
                      placeholder="Select Room Type"
                      value={room || undefined}
                      onChange={(e) => {
                        setRoom(e)
                      }}
                      options={roomtype.map((item) => ({
                        value: item.Roomcode,
                        label: item.Displayname,
                      }))}
                    />
                  </div>
                )}
              </div>
            </div>

            <FormItem className={category === 'RoomImage' ? 'button' : 'button1'}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isEditMode && (
                  <Button
                    onClick={() => {
                      canceledit()
                      setOpentable(true)
                      resetFormDetails()
                      setIsEditMode(false)
                    }}
                    className="cancel"
                  >
                    CANCEL
                  </Button>
                )}
                <Button onClick={save} className="save">
                  {'SAVE'}
                </Button>
                <ToastContainer
                  position="top-center"
                  autoClose={800}
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
            </FormItem>
            {/* Display All Selected Images Horizontally */}
            <div className="image-preview-container">
              {images.map((img, index) => (
                <div key={index} className="image-wrapper">
                  <img className="image-preview" src={img} alt={`Uploaded preview ${index}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {viewTable && (
        <section className="showtable">
          <Table
            value={view}
            pagination={{
              pageSize: 10,
            }}
            dataSource={view}
            columns={columns}
            style={{ marginTop: 20 }}
            bordered
            className="custom-table"
          />
        </section>
      )}
    </div>
  )
}

export default File
