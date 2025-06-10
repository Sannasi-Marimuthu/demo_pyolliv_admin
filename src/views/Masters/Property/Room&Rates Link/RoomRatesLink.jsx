import React, { useEffect, useState } from 'react'
import { Form, Table, Button, Select, Input } from 'antd'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import { EditOutlined } from '@ant-design/icons'
import '../../CSS/Master.css'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { api, validation } from '../../../../Axios/axios'
import { useNavigate } from 'react-router-dom'
import { render } from 'sass'

export default function RoomRatesLink() {
  const { Item: FormItem } = Form
  const navigate = useNavigate()
  const PropertyCode = sessionStorage.getItem('propertyId')

  const [viewTable, setViewTable] = useState(false)
  const [viewForm, setViewForm] = useState(true)
  const [newfile, setNewfile] = useState(false)
  const [opentable, setOpentable] = useState(true)

  const [selectroom, setSelectRoom] = useState('')
  const [selectrate, setSelectRate] = useState('')
  const [status, setStatus] = useState('No')
  const [open, setOpen] = useState(false)
  const handleChange = (value) => {
    setSelectRate(value)
    setOpen(false) // Close dropdown after selection
  }
  const [isEditMode, setIsEditMode] = useState(false)

  const columns = [
    {
      title: 'Room Type',
      dataIndex: 'RoomType',
      key: 'RoomType',
      render: (roomtype) => {
        const matchedRoom = rooms.find((room) => room.Roomcode === roomtype)
        return matchedRoom ? matchedRoom.Displayname : 'Unknown Room'
      },
    },
    {
      title: 'Rates',
      dataIndex: 'RatePlan',
      key: 'RatePlan',
      // render: (ratePlans) => ratePlans.join(', '),
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

  const id = sessionStorage.getItem('RatePlanLinkId')
  const handlesubmit = () => {
    try {
      if (!selectroom) {
        return toast.error('Room Type is required')
      }
      // if (!selectrate) {
      //   return toast.error('Rate Plan is required')
      // }

      const RatesData = {
        type: 'RoomRateLink',
        RoomType: selectroom,
        RatePlan: selectrate.length > 0 ? selectrate : showInput.map((item) => item.RatePlan),
        PropertyCode: PropertyCode,
        Status: status === 'Yes' ? 0 : 1,
      }

      const RatesData1 = {
        type: 'RoomRateLink',
        RoomType: selectroom,
        // PropertyCode: PropertyCode,
        RatePlan: selectrate.length > 0 ? selectrate : showInput.map((item) => item.RatePlan),
        Status: status === 'Yes' ? 0 : 1,
      }

      console.log(RatesData)

      const apiCall = id ? api.create('post', RatesData1) : api.create('post', RatesData)

      apiCall
        .then(() => {
          toast.success(id ? 'Updated Successfully' : 'Created Successfully')
          if (id) sessionStorage.removeItem('RatePlanLinkId')
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
    if (PropertyCode == 0) {
      api
        .getAll('get?type=RoomRateLink')
        .then((response) => {
          setView(response.data)
        })
        .catch(() => {
          toast.error('Error in getting Rate Plan')
        })
    } else {
      api
        .getAll('get?type=RoomRateLink')
        .then((response) => {
          const filteredData = response.data.filter((item) => item.PropertyCode === PropertyCode)
          setView(filteredData)
          console.log('filteredData', filteredData)
        })
        .catch(() => {
          toast.error('Error in getting Rate Plan')
        })
    }
  }, [PropertyCode])

  const [showInput, setShowInput] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=RoomRateLink')
      .then((response) => {
        const filteredData = response.data.filter((item) => item.RoomType == selectroom)
        setShowInput(filteredData)
        console.log('filteredData12345', filteredData)
      })
      .catch(() => {
        toast.error('Error in getting Rate Plan')
      })
  }, [selectroom])

  //Room Types
  const [rooms, setRooms] = useState([])
  useEffect(() => {
    if (PropertyCode == 0) {
      api
        .getAll('get?type=Roomtype')
        .then((response) => {
          // const filteredData = response.data.filter((item) => item.PropertyCode === PropertyCode)
          setRooms(response.data)
        })
        .catch(() => {
          toast.error('Error in getting Rooomtype')
        })
    } else {
      api
        .getAll('get?type=Roomtype')
        .then((response) => {
          const filteredData = response.data.filter((item) => item.PropertyCode === PropertyCode)
          setRooms(filteredData)
        })
        .catch(() => {
          toast.error('Error in getting Rate Plan')
        })
    }
  }, [PropertyCode])

  //Room Types
  const [rateplan, setRatePlan] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=RatePlan')
      .then((response) => {
        const filteredData = response.data.filter((item) => item.PropertyCode === PropertyCode)
        setRatePlan(filteredData)
        console.log(filteredData)
      })
      .catch(() => {
        toast.error('Error in getting Rate Plan')
      })
  }, [PropertyCode])

  //////////////////////  EDIT  /////////////////////////

  const editUser = (record) => {
    console.log(record)
    setSelectRate(record.RatePlan)
    setSelectRoom(record.RoomType)

    setStatus(record.Status === 1 ? 'No' : 'Yes')
    sessionStorage.setItem('RatePlanLinkId', record._id)
  }

  const resetFormDetails = () => {
    setStatus('No')
    setSelectRate('')
    setSelectRoom('')
  }

  const canceledit = () => {
    sessionStorage.removeItem('RatePlanLinkId')
    navigate(0)
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
                  <p className="responsive">
                    Room Types<span>*</span>
                  </p>
                  <Select
                    className="inputbox"
                    placeholder="Select Room Type"
                    value={selectroom || undefined}
                    onChange={(value) => setSelectRoom(value)}
                    options={rooms.map((item) => ({
                      label: item.Displayname,
                      value: item.Roomcode,
                    }))}
                  />
                </div>
              </div>
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">
                    Rate Plan<span>*</span>
                  </p>
                  <Select
                    mode="multiple"
                    className="inputbox"
                    placeholder="Select Rate Plan"
                    value={
                      selectrate.length > 0 ? selectrate : showInput.map((item) => item.RatePlan)
                    } // Pre-fill with saved values
                    onChange={handleChange}
                    options={rateplan.map((item) => ({
                      label: item.RatePlan,
                      value: item.RatePlan,
                    }))}
                    open={open}
                    onDropdownVisibleChange={(visible) => setOpen(visible)}
                    maxTagCount={2} // Limits visible tags to 2
                    maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`} // Displays remaining count
                    style={{ width: '100%' }} // Ensures it fits within the container
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
