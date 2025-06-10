import React, { useEffect, useState } from 'react'
import { Form, Table, Button, Select, Input, Row, Col, DatePicker, Space, Checkbox } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import '../../CSS/Master.css'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { api, validation } from '../../../../Axios/axios'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { IoHome } from 'react-icons/io5'

export default function RoomType() {
  const { Item: FormItem } = Form
  const navigate = useNavigate()
  const PropertyCode = sessionStorage.getItem('propertyId')
  const { RangePicker } = DatePicker

  const [viewTable, setViewTable] = useState(false)
  const [viewForm, setViewForm] = useState(true)
  const [newfile, setNewfile] = useState(false)
  const [opentable, setOpentable] = useState(true)

  const [isEditMode, setIsEditMode] = useState(false)

  const [maxPropertyId, setMaxPropertyId] = useState(0)

  const [isChecked, setIsChecked] = useState(false)

  // Inputs
  const [date, setDate] = useState(null)
  const [available, setAvailable] = useState('')
  const [room, setRoom] = useState(null)
  const [rate, setRate] = useState(null)

  // Days
  const [selectedDays, setSelectedDays] = useState({
    sun: true,
    mon: true,
    tue: true,
    wed: true,
    thurs: true,
    fri: true,
    sat: true,
  })

  const [filteredDates, setFilteredDates] = useState([])

  // Function to filter dates based on selectedDays
  const filterDatesByDays = () => {
    if (!date || !Array.isArray(date) || date.length < 2) {
      console.warn('Invalid date range selected:', date)
      return
    }

    let startDate = new Date(date[0])
    let endDate = new Date(date[1])
    let validDates = []

    while (startDate <= endDate) {
      let dayOfWeek = startDate.getDay()
      let dayMapping = ['sun', 'mon', 'tue', 'wed', 'thurs', 'fri', 'sat']

      if (selectedDays[dayMapping[dayOfWeek]]) {
        validDates.push(new Date(startDate).toISOString())
      }

      startDate.setDate(startDate.getDate() + 1)
    }

    setFilteredDates(validDates.map((date) => moment(date).format('YYYY-MM-DD')))
  }

  useEffect(() => {
    filterDatesByDays()
    console.log('Filterdays', filteredDates)
  }, [selectedDays, date])

  const toggleDay = (day) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }))
  }

  console.log('days', selectedDays)

  ////   Table   ////
  const columns = [
    {
      title: 'Room Type',
      dataIndex: 'RoomCode',
      key: 'RoomCode',
      render: (roomCode) => {
        const roomCodes = roomCode.split(',')

        const roomNames = roomCodes.map((code) => {
          const room = viewroomtype.find((item) => item.Roomcode === code.trim())
          return room ? room.Displayname : 'Unknown Roomtype'
        })

        return roomNames.join(', ')
      },
    },
    {
      title: 'Date',
      dataIndex: 'EntryDate',
      key: 'EntryDate',
      render: (text) => new Date(text).toLocaleDateString('en-IN'),
    },
    { title: 'Available Rooms', dataIndex: 'AvailableRooms', key: 'AvailableRooms' },
    // { title: 'Double Tarrif', dataIndex: 'DoubleTarrif', key: 'DoubleTarrif' },
    // { title: 'Extra Bed', dataIndex: 'ExtraBedCharges', key: 'ExtraBedCharges' },
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

  const onChange = (selectedDate) => {
    console.log(selectedDate)
    setDate(selectedDate)
  }

  const [checked, setChecked] = useState(0)

  const onCheck = (e) => {
    console.log(`checked = ${e.target.checked}`)
    const value = e.target.checked
    if (value == true) {
      setChecked(1)
      setIsChecked(true)
    } else {
      setChecked(0)
      setIsChecked(false)
    }
  }
  console.log('Stop', checked)

  ///////////  POST and UPDATE  ////////////

  const id = sessionStorage.getItem('RateMaster')

  const handlesubmit = () => {
    const newPropertyId = maxPropertyId + 1

    const InventoryData = {
      ratetype: 'InventoryMaster',
      InventoryId: newPropertyId,
      RoomCode: room,
      PropertyCode: PropertyCode,
      AvailableDate: filteredDates,
      StopSales: checked,
      RatePlan: rate,
      AvailableRooms: available,
    }

    console.log('Data', InventoryData)

    const InventoryData1 = {
      ratetype: 'InventoryMaster',
      RoomCode: room,
      AvailableDate: filteredDates,
      RatePlan: rate,
      AvailableRooms: available,
    }

    try {
      const apiCall = id
        ? api.update(`update?id=${id}&type=InventoryMaster`, InventoryData1)
        : api.create('post', [InventoryData])

      apiCall
        .then(() => {
          toast.success(id ? 'Updated Successfully' : 'Created Successfully')
          if (id) sessionStorage.removeItem('RateMaster')
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

  ////////////  GET  /////////////

  // Room Type
  const [viewroomtype, setViewRoomType] = useState([])
  useEffect(() => {
    if (PropertyCode == 0) {
      api
        .getAll('get?type=Roomtype')
        .then((response) => {
          setViewRoomType(response.data)
        })
        .catch(() => {
          toast.error('Error in getting Room Type')
        })
    } else {
      api
        .getAll('get?type=Roomtype')
        .then((response) => {
          const filteredData = response.data.filter((item) => item.PropertyCode == PropertyCode)
          setViewRoomType(filteredData)
        })
        .catch(() => {
          toast.error('Error in getting Room Type')
        })
    }
  }, [])

  //Rate Plan
  const [rateplan, setRatePlan] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=RatePlan')
      .then((response) => {
        const filteredData = response.data.filter((item) => item.PropertyCode == PropertyCode)
        setRatePlan(filteredData)
      })
      .catch(() => {
        toast.error('Error in getting Rate Plan')
      })
  }, [])

  // Inventory Master
  const [view, setView] = useState([])
  useEffect(() => {
    if (PropertyCode == 0) {
      api
        .getAll('get?type=InventoryMaster')
        .then((response) => {
          setView(response.data)
          const maxId = Math.max(...response.data.map((item) => item.InventoryId || 0), 0)
          setMaxPropertyId(maxId)
        })
        .catch(() => {
          toast.error('Error in getting Room Type')
        })
    } else {
      api
        .getAll('get?type=InventoryMaster')
        .then((response) => {
          const filteredData = response.data.filter((item) => item.PropertyCode == PropertyCode)
          const maxId = Math.max(
            filteredData.map((item) => item.InventoryId || 0),
            0,
          )
          setMaxPropertyId(maxId)
          setView(filteredData)
        })
        .catch(() => {
          toast.error('Error in getting Room Type')
        })
    }
  }, [])

  // For Validation of Rooms
  const [ratevalidation, setRateValidation] = useState('')
  useEffect(() => {
    api.getAll(`get?type=Ratevalidation&roomtype=${room}`).then((response) => {
      setRateValidation(response.data[0].Totalrooms)
    })
  }, [room])
  console.log('ratevalidation', ratevalidation)

  const canceledit = () => {
    sessionStorage.removeItem('RateMaster')
  }
  const home = () => {
    navigate('/Masters/Sample')
  }

  const handleRooms = (e) => {
    validation.Phonelist(e.target.value, setAvailable)
    if (ratevalidation < e.target.value) {
      toast.error(`The Max number of rooms you can select is ${ratevalidation}`)
    }
  }

  return (
    <div>
      <div className="tableicon"></div>
      <div
        className="style"
        style={{
          lineHeight: '3',
          display: 'flex',
          flexDirection: 'column',
          marginTop: '42px',
        }}
      >
        <div className="rateshome" onClick={home}>
          <IoHome />
        </div>
        {viewForm && (
          <div className="form">
            <Form labelCol={{ span: 6 }} colon={false}>
              <div className="rateRow">
                <div className="rate-dateselction">
                  <div className="inputs">
                    <h6 style={{ paddingBottom: 5 }}>
                      Select Date Range<span>*</span>
                    </h6>
                    <Space
                      style={{ width: '100%' }}
                      className="inputs"
                      direction="vertical"
                      size={12}
                    >
                      <RangePicker
                        value={date}
                        disabledDate={(current) => current && current < moment().startOf('day')}
                        className="inputbox"
                        onChange={onChange}
                      />
                    </Space>
                  </div>
                </div>
                <div className="rate-dayselection">
                  <div className="inputs">
                    <h6>Selected Days</h6>
                    <ul className="days">
                      {['mon', 'tue', 'wed', 'thurs', 'fri', 'sat', 'sun'].map((day, index) => (
                        <li key={index} className="day">
                          <button
                            onClick={() => toggleDay(day)}
                            className={selectedDays[day] ? 'selected' : ''}
                          >
                            {day.charAt(0).toUpperCase()}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <ToastContainer
                  position="top-center"
                  autoClose={700}
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
            </Form>
          </div>
        )}
      </div>
      {viewTable && (
        <section>
          <Table
            value={viewTable}
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
                    Room Type<span>*</span>
                  </p>
                  <Select
                    value={room}
                    onChange={(value) => setRoom(value)}
                    placeholder="Select Room Type"
                    className="inputbox"
                    options={viewroomtype.map((item) => ({
                      value: item.Roomcode,
                      label: item.Displayname,
                    }))}
                  />
                </div>
              </div>
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">
                    Available Rooms<span>*</span>
                  </p>
                  <Input
                    maxLength={2}
                    value={available}
                    disabled={isChecked}
                    onChange={handleRooms}
                    className="inputbox"
                    placeholder="Enter Available Rooms"
                  />
                </div>
              </div>
              <div className="admin-col">
                {/* <div className="inputs">
                  <p className="responsive">Rate Plan</p>
                  <Select
                    value={rate}
                    onChange={(value) => setRate(value)}
                    placeholder="Select Rate Plan"
                    className="inputbox"
                    options={rateplan.map((item) => ({
                      value: item.RatePlan,
                      label: item.RatePlan,
                    }))}
                  />
                </div> */}
              </div>
            </div>
            <div className="stopsales">
              <div>
                <Checkbox onChange={onCheck}>StopSales</Checkbox>
              </div>
              <div>
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
                    {isEditMode ? 'UPDATE' : 'UPDATE'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
