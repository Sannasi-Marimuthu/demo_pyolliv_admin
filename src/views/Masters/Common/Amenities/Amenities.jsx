import React, { useEffect, useState } from 'react'
import { Form, Table, Button, Select, Input, Row, Col } from 'antd'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import { EditOutlined } from '@ant-design/icons'
import '../../CSS/Master.css'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { api, validation } from '../../../../Axios/axios'
import { useNavigate } from 'react-router-dom'

export default function PropertyType() {
  const { Item: FormItem } = Form
  const navigate = useNavigate()

  const [viewTable, setViewTable] = useState(false)
  const [viewForm, setViewForm] = useState(true)
  const [newfile, setNewfile] = useState(false)
  const [opentable, setOpentable] = useState(true)

  const [amenities, setAmenities] = useState('')
  const [amenitiesCategory, setAmenitiesCategory] = useState('')
  const [status, setStatus] = useState('No')

  const [isEditMode, setIsEditMode] = useState(false)

  const columns = [
    { title: 'Amenities', dataIndex: 'Amenities', key: 'Amenities' },
    {
      title: 'Amenities Category',
      dataIndex: 'AmenitiesCategory',
      key: 'AmenitiesCategory',
      render: (categoryId) => {
        const amenityCategory = viewAminitiesCategory.find(
          (item) => item.AmenitiesCategoryId == categoryId,
        )
        return amenityCategory ? amenityCategory.AmenitiesCategory : 'Unknown'
      },
    },
    {
      title: 'Inactive',
      dataIndex: 'Status',
      key: 'Status',
      render: (status) => (status == 1 ? 'No' : 'Yes'),
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
  /////////////////////  POST  ////////////////////

  const id = sessionStorage.getItem('Amenities')
  const handlesubmit = () => {
    try {
      if (!amenities) {
        return toast.error('Amenities is required')
      }

      const Amenities = amenities?.toString().trim() || ''
      if (Amenities.length === 0) {
        return toast.error('Inputs cannot be empty or contain only spaces')
      }

      const AmenitiesData = {
        type: 'Amenities',
        Amenities: amenities.trim(),
        AmenitiesCategory: amenitiesCategory,
        Status: status === 'Yes' ? 0 : 1,
      }

      console.log(AmenitiesData)

      const apiCall = id
        ? api.update(`update?id=${id}&type=Amenities`, AmenitiesData)
        : api.create('post', AmenitiesData)

      apiCall
        .then(() => {
          toast.success(id ? 'Updated Successfully' : 'Created Successfully')
          if (id) sessionStorage.removeItem('Amenities')
          navigate(0)
        })
        .catch((error) => {
          console.error(error)
          toast.error(id ? error.response.data.message : error.response.data.message)
        })
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  ////////////////////  GET  /////////////////////

  const [view, setView] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=Amenities')
      .then((response) => {
        setView(response.data)
      })
      .catch(() => {
        toast.error('Error in getting Amenities')
      })
  }, [])

  const [viewAminitiesCategory, setViewAminitiesCategory] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=AmenitiesCategory')
      .then((response) => {
        const filtereddata = response.data.filter((item) => item.Status == 1)
        setViewAminitiesCategory(filtereddata)
      })
      .catch(() => {
        toast.error('Error in getting Amenities Category')
      })
  }, [])

  //////////////////////  EDIT  /////////////////////////

  const editUser = (record) => {
    console.log(record)

    setAmenities(record.Amenities)

    const amenitycategory = viewAminitiesCategory.find(
      (item) => item.AmenitiesCategoryId == record.AmenitiesCategory,
    )
    if (amenitycategory) {
      setAmenitiesCategory(amenitycategory.AmenitiesCategory)
    }

    setStatus(record.Status === 1 ? 'No' : 'Yes')
    sessionStorage.setItem('Amenities', record._id)
  }

  const resetFormDetails = () => {
    setAmenities('')
    setAmenitiesCategory('')
    setStatus('No')
  }

  const canceledit = () => {
    sessionStorage.removeItem('Amenities')
    navigate(0)
  }

  return (
    <div>
      <div className="tableicon">
        {/* <h3 className="heading">Amenities</h3> */}
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
          // marginTop: '40px',
        }}
      >
        {viewForm && (
          <div className="form">
            <div className="admin-row">
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">Amenities</p>
                  <Input
                    maxLength={30}
                    className="inputbox"
                    placeholder="Enter Amenities"
                    value={amenities}
                    onChange={(e) => {
                      setAmenities(e.target.value)
                    }}
                  />
                </div>
              </div>
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">Amenities Category</p>{' '}
                  <Select
                    className="inputbox"
                    showSearch
                    placeholder="Select Amenities Category"
                    value={amenitiesCategory || undefined}
                    onChange={(value) => {
                      setAmenitiesCategory(value)
                    }}
                    options={viewAminitiesCategory.map((item) => ({
                      value: item.AmenitiesCategoryId,
                      label: item.AmenitiesCategory,
                    }))}
                  />
                </div>
              </div>

              <div className="admin-col">
                {isEditMode && (
                  <div className="inputs">
                    <p className="responsive">Inactive</p>{' '}
                    <Select
                      className="inputbox"
                      showSearch
                      placeholder="Select Yes or No"
                      value={status}
                      onChange={(value) => {
                        setStatus(value)
                      }}
                      options={[
                        { value: 'Yes', label: 'Yes' },
                        { value: 'No', label: 'No' },
                      ]}
                    />
                  </div>
                )}
              </div>
            </div>
            <FormItem className={isEditMode ? 'button' : 'button1'}>
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
                <Button onClick={handlesubmit} className="save">
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
            pagination={{
              pageSize: 10,
            }}
            dataSource={view}
            columns={columns}
            bordered
            className="custom-table"
          />
        </section>
      )}
    </div>
  )
}
