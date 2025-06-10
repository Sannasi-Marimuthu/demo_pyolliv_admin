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

  const [maxPropertyId, setMaxPropertyId] = useState(0)

  const [amenitiesCategory, setAmenitiesCategory] = useState('')
  const [status, setStatus] = useState('No')

  const [isEditMode, setIsEditMode] = useState(false)

  const columns = [
    { title: 'Amenities Category', dataIndex: 'AmenitiesCategory', key: 'AmenitiesCategory' },
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

  const id = sessionStorage.getItem('Amenitiescategory')
  const handlesubmit = () => {
    const newPropertyId = maxPropertyId + 1
    try {
      if (!amenitiesCategory) {
        return toast.error('Amenities Category is required')
      }

      const AmenitiesCategory = amenitiesCategory?.toString().trim() || ''
      if (AmenitiesCategory.length === 0) {
        return toast.error('Inputs cannot be empty or contain only spaces')
      }

      const AmenitiesCategoryData = {
        type: 'AmenitiesCategory',
        AmenitiesCategory: amenitiesCategory,
        AmenitiesCategoryId: newPropertyId,
        Status: status === 'Yes' ? 0 : 1,
      }
      const AmenitiesCategoryData1 = {
        type: 'AmenitiesCategory',
        AmenitiesCategory: amenitiesCategory,
        Status: status === 'Yes' ? 0 : 1,
      }

      console.log(AmenitiesCategoryData)

      const apiCall = id
        ? api.update(`update?id=${id}&type=AmenitiesCategory`, AmenitiesCategoryData1)
        : api.create('post', AmenitiesCategoryData)

      apiCall
        .then(() => {
          toast.success(id ? 'Updated Successfully' : 'Created Successfully')
          if (id) sessionStorage.removeItem('Amenitiescategory')
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

  const [view, setView] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=AmenitiesCategory')
      .then((response) => {
        setView(response.data)
        const maxId = Math.max(...response.data.map((item) => item.AmenitiesCategoryId || 0), 0)
        setMaxPropertyId(maxId)
      })
      .catch(() => {
        toast.error('Error in getting Amenities Category')
      })
  }, [maxPropertyId])

  const editUser = (record) => {
    console.log(record)

    setAmenitiesCategory(record.AmenitiesCategory)
    setStatus(record.Status === 1 ? 'No' : 'Yes')
    sessionStorage.setItem('Amenitiescategory', record._id)
  }

  const resetFormDetails = () => {
    setAmenitiesCategory('')
    setStatus('No')
  }

  const canceledit = () => {
    sessionStorage.removeItem('Amenitiescategory')
  }

  return (
    <div>
      <div className="tableicon">
        {/* <h3 className="heading">Amenities Category</h3> */}
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
                  <p className="responsive">Amenities Category</p>
                  <Input
                    maxLength={30}
                    className="inputbox"
                    placeholder="Enter Amenities Category"
                    value={amenitiesCategory || undefined}
                    onChange={(e) => {
                      setAmenitiesCategory(e.target.value)
                    }}
                  />
                </div>
              </div>
              <div className="admin-col">
                {isEditMode && (
                  <div className="admin-col">
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
                  </div>
                )}
              </div>
              <div className="admin-col"></div>
            </div>
            <FormItem className={isEditMode ? 'button1' : 'button2'}>
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
