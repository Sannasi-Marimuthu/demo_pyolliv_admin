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

export default function PropertyOwnerType() {
  const { Item: FormItem } = Form
  const navigate = useNavigate()

  const [viewTable, setViewTable] = useState(false)
  const [viewForm, setViewForm] = useState(true)
  const [newfile, setNewfile] = useState(false)
  const [opentable, setOpentable] = useState(true)
  const [maxPropertyId, setMaxPropertyId] = useState(0)

  const [propertyOwnerType, setPropertyOwnerType] = useState('')
  const [status, setStatus] = useState('No')

  const [isEditMode, setIsEditMode] = useState(false)

  const columns = [
    { title: 'Property Owner Type', dataIndex: 'PropertyOwnerType', key: 'PropertyOwnerType' },
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

  const PropertyOwnerData = {
    type: 'PropertyOwnerType',
    PropertyOwnerType: propertyOwnerType,
    PropertyOwnerId: maxPropertyId,
    Status: status === 'Yes' ? 0 : 1,
  }

  const id = sessionStorage.getItem('PropertyOwnerType')
  const handlesubmit = () => {
    if (!id) {
      api
        .create('post', PropertyOwnerData)
        .then(() => {
          toast.success('Created Successfully')
          resetFormDetails()
          navigate(0)
        })
        .catch((error) => {
          toast.error(error.response.data.message)
        })
    } else {
      const PropertyOwnerData = {
        // type: 'PropertyOwnertype',
        PropertyOwnerType: propertyOwnerType,
        Status: status === 'Yes' ? 0 : 1,
      }
      api
        .update(`update?id=${id}&type=PropertyOwnertype`, PropertyOwnerData)
        .then(() => {
          toast.success('Updated Successfully')
          sessionStorage.removeItem('PropertyOwnerType')
          navigate(0)
        })
        .catch((error) => {
          toast.error(error.response.data.message)
        })
    }
  }

  /////////////  GET  /////////////

  const [view, setView] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=PropertyOwnertype')
      .then((response) => {
        setView(response.data)
        const maxId = Math.max(...response.data.map((item) => item.PropertyOwnerId || 0), 0)
        setMaxPropertyId(maxId)
      })
      .catch(() => {
        toast.error('Error in getting Property Owner Type')
      })
  }, [])

  const editUser = (record) => {
    console.log(record)

    setPropertyOwnerType(record.PropertyOwnerType)
    setStatus(record.Status === 1 ? 'No' : 'Yes')
    sessionStorage.setItem('PropertyOwnerType', record._id)
  }

  const resetFormDetails = () => {
    setPropertyOwnerType('')
    setStatus('No')
  }

  const canceledit = () => {
    sessionStorage.removeItem('PropertyOwnerType')
  }

  return (
    <div>
      <div className="tableicon">
        {/* <h3 className="heading">Property Type</h3> */}
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
                  <p className="responsive">Property Owner Type</p>
                  <Input
                    maxLength={30}
                    className="inputbox"
                    placeholder="Enter Property Owner Type"
                    value={propertyOwnerType}
                    onChange={(e) => {
                      validation.sanitizeInput1(e.target.value, setPropertyOwnerType)
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
