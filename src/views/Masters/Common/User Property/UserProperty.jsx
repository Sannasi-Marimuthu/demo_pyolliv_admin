import { Button, Col, Form, Input, Row, Select, Table } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import React, { useEffect, useState } from 'react'
import { api, validation } from '../../../../Axios/axios'
import { useNavigate } from 'react-router-dom'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import { EditOutlined } from '@ant-design/icons'
import '../../CSS/Master.css'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function User() {
  const PropertyCode = sessionStorage.getItem('propertyId')
  const navigate = useNavigate()

  // State declarations
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [property, setProperty] = useState('')
  const [viewTable, setViewTable] = useState(false)
  const [viewForm, setViewForm] = useState(true)
  const [newfile, setNewfile] = useState(false)
  const [opentable, setOpentable] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [viewProperty, setViewProperty] = useState([])
  const [viewUserProperty, setViewUserProperty] = useState([])
  const [view, setView] = useState([])

  const columns = [
    { title: 'E-mail', dataIndex: 'Email', key: 'Email' },
    {
      title: 'Property Name',
      key: 'PropertyName',
      render: (_, record) =>
        Array.isArray(record.PropertyName) ? record.PropertyName.join(', ') : '-',
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

  // Fetch Property Master data
  useEffect(() => {
    const fetchPropertyMaster = async () => {
      try {
        const response = await api.getAll('get?type=Propertymaster')
        const data = response.data
        console.log("data",data);
        if (PropertyCode == 0) {
          setViewProperty(data)
        } else {
          const filteredData = data.filter((item) => item.Propertycode == PropertyCode)
          setViewProperty(filteredData)
        }
      } catch (error) {
        toast.error('Error in getting Property Type')
      }
    }
    fetchPropertyMaster()
  }, [PropertyCode])

  // Fetch User Property data
  useEffect(() => {
    const fetchUserProperty = async () => {
      try {
        const response = await api.getAll('get?type=Userproperty')
        const data = response.data
        const uniqueUserProperty = Array.from(
          new Map(data.map((item) => [item.Email, item])).values(),
        )
        setViewUserProperty(uniqueUserProperty)
      } catch (error) {
        toast.error('Error in getting User Property')
      }
    }
    fetchUserProperty()
  }, [])

  // Fetch User Master data and set username
  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await api.getAll('get?type=Usertype')
        const data = response.data
        setView(data)
        if (email) {
          const filteredData = data.filter((item) => item.Email == email)
          if (filteredData.length > 0) {
            setUsername(filteredData[0].UserName)
          }
        }
      } catch (error) {
        toast.error('Error in getting User Type')
      }
    }
    fetchUserType()
  }, [email])

  // Edit user handler
  const editUser = (record) => {
    setProperty(record.PropertyName)
    setEmail(record.Email)
    sessionStorage.setItem('userPropertyId', record._id)
  }

  // Reset form details
  const resetFormDetails = () => {
    setProperty('')
    setUsername('')
    setEmail('')
  }

  // Save or update user data
  const save = async () => {
    try {
      if (!username?.trim()) {
        return toast.error('User Name is required')
      }
      if (!email) {
        return toast.error('Email is required')
      }

      const userData = {
        type: 'Userproperty',
        PropertyName: property,
        Email: email.trim(),
      }

      const id = sessionStorage.getItem('userPropertyId')
      const apiCall = id
        ? api.update(`update?id=${id}&type=Userproperty`, userData)
        : api.create('post', userData)

      await apiCall
      toast.success(id ? 'Updated Successfully' : 'Created Successfully')
      if (id) sessionStorage.removeItem('userPropertyId')
      resetFormDetails()
      navigate(0) // Refresh the page
    } catch (error) {
      console.error(error)
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  const canceledit = () => {
    sessionStorage.removeItem('userPropertyId')
    resetFormDetails()
    setOpentable(true)
    setIsEditMode(false)
  }

  return (
    <div>
      <div className="tableicon">
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
      <div className="style" style={{ lineHeight: '3', display: 'flex', flexDirection: 'column' }}>
        {viewForm && (
          <div className="form">
            <div className="admin-row">
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">E-mail</p>
                  <Select
                    value={email || undefined}
                    className="inputbox"
                    onChange={(value) => setEmail(value)}
                    options={Array.from(new Set(view.map((item) => item.Email))).map((email) => ({
                      value: email,
                      label: email,
                    }))}
                    placeholder="Select Email"
                  />
                </div>
              </div>
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">Property Name</p>
                  <Select
                    mode="multiple"
                    value={property || undefined}
                    className="inputbox"
                    onChange={(value) => setProperty(value)}
                    placeholder="Select Property Name"
                    showSearch
                    options={viewProperty.map((item) => ({
                      value: item.Propertycode,
                      label: item.Propertyname,
                    }))}
                  />
                </div>
              </div>
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">Display Name</p>
                  <Input
                    value={username}
                    placeholder="Select an E-mail"
                    className="inputbox"
                    disabled
                  />
                </div>
              </div>
            </div>
            <FormItem className="button">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isEditMode && (
                  <Button onClick={canceledit} className="cancel" style={{ marginLeft: '10px' }}>
                    CANCEL
                  </Button>
                )}
                <Button onClick={save} className="save">
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
            dataSource={viewUserProperty}
            columns={columns}
            bordered
            className="custom-table"
            rowKey={(record) => record._id || record.Email}
          />
        </section>
      )}
    </div>
  )
}
