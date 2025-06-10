import React, { useEffect, useState } from 'react'
import { Form, Table, Button, Select, Input, Row, Col, Checkbox, TimePicker, List } from 'antd'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import { EditOutlined } from '@ant-design/icons'
import '../../CSS/Master.css'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TextArea from 'antd/es/input/TextArea'
import { api, validation } from '../../../../Axios/axios'
import { Navigate, useNavigate } from 'react-router-dom'
import { AddComment } from '@mui/icons-material'
import dayjs from 'dayjs'
import { generateUniqueRoom } from '../PropertyMaster/uniqueCodes'

export default function RoomType() {
  const { Item: FormItem } = Form
  const navigate = useNavigate()
  const PropertyCode = sessionStorage.getItem('propertyId')

  const [viewTable, setViewTable] = useState(false)
  const [viewForm, setViewForm] = useState(true)
  const [newfile, setNewfile] = useState(false)
  const [opentable, setOpentable] = useState(true)

  const [isEditMode, setIsEditMode] = useState(false)

  // Inputs
  const [displayname, setDisplayName] = useState('')
  const [description, setDescription] = useState('')
  const [totalrooms, setTotalRooms] = useState('')
  const [roomView, setRoomView] = useState('')
  const [bedView, setBedView] = useState('')
  const [roomsize, setRoomSize] = useState('')
  const [measurement, setMeasurement] = useState('')
  const [adults, setAdults] = useState('')
  const [maxadults, setMaxAdults] = useState('')
  const [maxchildrens, setMaxChildrens] = useState('')
  const [occupancy, setOccupancy] = useState('')
  const [uniqueCode, setUniqueCode] = useState('')
  const [checked, setChecked] = useState(0)

  const columns = [
    { title: 'Display Name', dataIndex: 'Displayname', key: 'Displayname' },
    { title: 'Total Rooms', dataIndex: 'Totalrooms', key: 'Totalrooms' },
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
            setEdit(record.Roomcode)
          }}
        >
          <EditOutlined />
        </Button>
      ),
    },
  ]

  useEffect(() => {
    let code = generateUniqueRoom()
    console.log('GEEEEEEEEEEEEEEEEEEEEEEEE', code)
    setUniqueCode(code)
  }, [])

  // const generateUniqueCode = (existingCodes = []) => {
  //   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  //   let code
  //   do {
  //     code = Array.from({ length: 6 }, () =>
  //       characters.charAt(Math.floor(Math.random() * characters.length)),
  //     ).join('')
  //   } while (existingCodes.includes(code))

  //   setUniqueCode(code)
  //   return code
  // }

  // useEffect(() => {
  //   generateUniqueCode()
  // }, [])

  const RoomtypeData = {
    type: 'Roomtype',
    Displayname: displayname,
    Description: description,
    Totalrooms: totalrooms,
    Roomview: roomView,
    Bedview: bedView,
    Roomsize: roomsize,
    Measurement: measurement,
    Basicadults: adults,
    Maxadults: maxadults,
    Maxchildrens: maxchildrens,
    Maxoccupancy: occupancy,
    Roomcode: uniqueCode,
    PropertyCode: PropertyCode,
    isConference: checked,
  }

  const RoomtypeData1 = {
    Displayname: displayname,
    Description: description,
    Totalrooms: totalrooms,
    Roomview: roomView,
    Bedview: bedView,
    Roomsize: roomsize,
    Measurement: measurement,
    Basicadults: adults,
    Maxadults: maxadults,
    Maxchildrens: maxchildrens,
    Maxoccupancy: occupancy,
    PropertyCode: PropertyCode,
    isConference: checked,
  }

  //Property Master
  const [propertytotalrooms, setPropertyTotalRooms] = useState()
  useEffect(() => {
    api.getAll('get?type=Propertymaster').then((response) => {
      const filteredData = response.data.filter((item) => item.Propertycode == PropertyCode)
      setPropertyTotalRooms(filteredData[0].Noofrooms)
      // console.log('propertymaster', filteredData[0].Noofrooms)
    })
  }, [])

  //total Rooms
  let [get, setGet] = useState('')
  let [edit, setEdit] = useState('')
  console.log('get', get)

  // const total = (e) => {
  //   if (propertytotalrooms < sumofRooms) {
  //     toast.error('No.of Rooms Exceeds Maximum')
  //   }
  //   validation.Phonelist(e.target.value, setTotalRooms)
  // }

  ///////////  POST and UPDATE  ////////////

  const id = sessionStorage.getItem('Roomtype')
  // const onchangeedit = () => {
  //   if (id) {
  //     setGet(
  //       `get?type=totalroomsupdate&rateproperty=${PropertyCode}&rateroom=${edit}&rooms=${totalrooms}`,
  //     )
  //   } else {
  //     setGet(`get?type=totalroomspost&rateproperty=${PropertyCode}&rooms=${totalrooms}`)
  //   }
  // }

  const [sumofRooms, setSumOfRooms] = useState()
  useEffect(() => {
    api
      .getAll(
        id
          ? `get?type=totalroomsupdate&rateproperty=${PropertyCode}&rateroom=${edit}&rooms=${totalrooms}`
          : `get?type=totalroomspost&rateproperty=${PropertyCode}&rooms=${totalrooms}`,
      )
      .then((response) => {
        setSumOfRooms(response.data)
        console.log('TotalRooms', response.data)
      })
  }, [totalrooms])

  const total = () => {
    console.log('propertytotalrooms', propertytotalrooms)
    console.log('sumofRooms', sumofRooms)

    if (propertytotalrooms < sumofRooms) {
      toast.error('No.of Rooms Exceeds Maximum')
    }
  }

  console.log('sumofRooms')
  console.log(sumofRooms)

  // useEffect(() => {
  //   if (id) {
  //     setGet(
  //       `get?type=totalroomsupdate&rateproperty=${PropertyCode}&rateroom=${edit}&rooms=${totalrooms}`,
  //     )
  //   } else {
  //     setGet(`get?type=totalroomspost&rateproperty=${PropertyCode}&rooms=${totalrooms}`)
  //   }
  // }, [totalrooms])

  const handlesubmit = () => {
    try {
      const trimmedData = {
        DisplayName: displayname?.toString().trim() || '',
        Description: description?.toString().trim() || '',
        TotalRooms: totalrooms?.toString().trim() || '',
        RoomView: roomView?.toString().trim() || '',
        BedView: bedView?.toString().trim() || '',
        // RoomSize: roomsize?.toString().trim() || '',
        // Measurement: measurement?.toString().trim() || '',
        // Adults: adults?.toString().trim() || '',
        // MaxAdults: maxadults?.toString().trim() || '',
        // MaxChildrens: maxchildrens?.toString().trim() || '',
        Occupancy: occupancy?.toString().trim() || '',
        // Amenities: amenities?.toString().trim() || '',
        RoomTypeCode: uniqueCode?.toString().trim() || '',
        // PropertyCode: PropertyCode?.toString().trim() || '',
      }

      for (const [key, value] of Object.entries(trimmedData)) {
        if (!value.length) {
          return toast.error(`${key.replace(/([A-Z])/g, ' $1')} is required`)
        }
      }

      if (Object.values(trimmedData).some((value) => value.length === 0)) {
        return toast.error('Inputs cannot be empty or contain only spaces')
      }
      if (propertytotalrooms < sumofRooms) {
        toast.error('No.of Rooms Exceeds Maximum')
      } else {
        if (id) {
          api
            .update(`update?id=${id}&type=Roomtype`, RoomtypeData1)
            .then(() => {
              toast.success('Updated Successfully')
              sessionStorage.removeItem('Roomtype')
              // navigate(0)
            })
            .catch((error) => {
              console.error(error)
              toast.error(error.response.data.message)
            })
        } else {
          api
            .create('post', RoomtypeData)
            .then(() => {
              toast.success('Created Successfully')
              // navigate(0)
            })
            .catch((error) => {
              console.error(error)
              toast.error(error.response.data.message)
            })
        }
        // const apiCall = id
        //   ? api.update(`update?id=${id}&type=Roomtype`, RoomtypeData1)
        //   : api.create('post', RoomtypeData)

        // apiCall
        //   .then(() => {
        //     toast.success(id ? 'Updated Successfully' : 'Created Successfully')
        //     if (id) sessionStorage.removeItem('Roomtype')
        //     navigate(0)
        //   })
        //   .catch((error) => {
        //     console.error(error)
        //     toast.error(id ? error.response.data.message : error.response.data.message)
        //   })
      }
    } catch (error) {
      console.error('Unexpected error:', error)
    }
  }

  ////////////  GET  /////////////

  // User Property
  const Mail = sessionStorage.getItem('Email')
  const [userproperty, setUserProperty] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=Userproperty')
      .then((response) => {
        const filtereddata = response.data.filter((item) => item.Email == Mail)
        setUserProperty(filtereddata[0])
      })
      .catch(() => {
        toast.error('Error in getting User Property')
      })
  }, [])

  // useEffect(()=>{
  //   if (propertytotalrooms > 10) {
  //     toast.error('No.of Rooms Exceeds Maximum')
  //   }
  // })

  // Room Type
  const [view, setView] = useState([])
  useEffect(() => {
    if (PropertyCode == 0) {
      api
        .getAll('get?type=Roomtype')
        .then((response) => {
          setView(response.data)
        })
        .catch(() => {
          toast.error('Error in getting Room Type')
        })
    } else {
      api
        .getAll('get?type=Roomtype')
        .then((response) => {
          const filteredData = response.data.filter((item) => item.PropertyCode == PropertyCode)
          setView(filteredData)
        })
        .catch(() => {
          toast.error('Error in getting Room Type')
        })
    }
  }, [])

  // Room View
  const [viewRoom, setViewRoom] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=Roomview')
      .then((response) => {
        const filtereddata = response.data.filter((item) => item.Status == 1)
        setViewRoom(filtereddata)
      })
      .catch(() => {
        toast.error('Error in getting Room View')
      })
  }, [])

  // Bed Type
  const [viewBed, setViewBed] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=Bedtype')
      .then((response) => {
        const filtereddata = response.data.filter((item) => item.Status == 1)
        setViewBed(filtereddata)
      })
      .catch(() => {
        toast.error('Error in getting Bed View')
      })
  }, [])

  ////////////  Edit  ////////////

  const editUser = (record) => {
    console.log('record', record)

    setDisplayName(record.Displayname),
      setDescription(record.Description),
      setTotalRooms(record.Totalrooms),
      setRoomView(record.Roomview),
      setBedView(record.Bedview),
      setRoomSize(record.Roomsize),
      setMeasurement(record.Measurement),
      setAdults(record.Basicadults),
      setMaxAdults(record.Maxadults),
      setMaxChildrens(record.Maxchildrens),
      setOccupancy(record.Maxoccupancy),
      // setAmenities(record.Amenities),
      setUniqueCode(record.Roomcode)
    sessionStorage.setItem('Roomtype', record._id)
  }

  const canceledit = () => {
    sessionStorage.removeItem('Propertytpe')
  }

  const MeasurementSelection = ['Square feet', 'Square meter']

  // const onCheck = (e) => {
  //   console.log(`checked = ${e.target.checked}`)
  //   const value = e.target.checked
  //   if (value == true) {
  //     setChecked(1)
  //   } else {
  //     setChecked(0)
  //   }
  // }
  // console.log('Stop', checked)

  const conference = [
    {
      value: 1,
      label: 'Yes',
    },
    {
      value: 0,
      label: 'No',
    },
  ]

  // useEffect(() => {
  //   if (checked) {
  //     navigate('/Masters/Conference')
  //   }
  // }, [checked])

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
          // marginTop: '40px',
        }}
      >
        {viewForm && (
          <div className="form">
            <div className="admin-row">
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">
                    Display Name<span>*</span>
                  </p>
                  <Input
                    maxLength={35}
                    value={displayname}
                    onChange={(e) => {
                      validation.sanitizeInput1(e.target.value, setDisplayName)
                    }}
                    className="inputbox"
                    placeholder="Enter Display Name"
                  />
                </div>
                <div className="inputs">
                  <div className="description">
                    <p className="responsive">
                      Description<span>*</span>
                    </p>
                    <span className="descriptionlength">
                      {description.length}/{200}
                    </span>
                  </div>

                  <TextArea
                    maxLength={200}
                    value={description}
                    onChange={(e) => {
                      validation.sanitizeDescription(e.target.value, setDescription)
                    }}
                    className="inputbox"
                    placeholder="Enter Description"
                    autoSize={{
                      minRows: 1,
                    }}
                  />
                </div>

                <div className="inputs">
                  <p className="responsive">
                    Room View<span>*</span>
                  </p>{' '}
                  <Select
                    className="inputbox"
                    showSearch
                    placeholder="Select Room View"
                    value={roomView || undefined}
                    onChange={(e) => {
                      setRoomView(e)
                    }}
                    options={viewRoom.map((item) => ({
                      value: item.RoomView,
                      label: item.RoomView,
                    }))}
                  />
                </div>

                <div className="inputs">
                  <p className="responsive">
                    Bed Type<span>*</span>
                  </p>
                  <Select
                    className="inputbox"
                    showSearch
                    placeholder="Select Bed Type"
                    value={bedView || undefined}
                    onChange={(e) => {
                      setBedView(e)
                    }}
                    options={viewBed.map((item) => ({
                      value: item.BedType,
                      label: item.BedType,
                    }))}
                  />
                </div>
                <div className="inputs">
                  <p className="responsive">isConference</p>
                  <Select
                    className="inputbox"
                    showSearch
                    placeholder="Select Bed Type"
                    value={checked || undefined}
                    onChange={(e) => {
                      setChecked(e)
                    }}
                    options={conference}
                  />
                </div>
              </div>
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">Room Size</p>
                  <Input
                    maxLength={10}
                    value={roomsize}
                    onChange={(e) => {
                      validation.Phonelist(e.target.value, setRoomSize)
                    }}
                    className="inputbox"
                    placeholder="Enter Room Size"
                  />
                </div>
                <div className="inputs">
                  <p className="responsive">Measurement</p>
                  <Select
                    className="inputbox"
                    showSearch
                    placeholder="Select Measurement"
                    value={measurement || undefined}
                    onChange={(e) => {
                      setMeasurement(e)
                    }}
                    options={MeasurementSelection.map((item) => ({
                      value: item,
                      label: item,
                    }))}
                  />
                </div>
                <div className="inputs">
                  <p className="responsive">
                    Total Rooms<span>*</span>
                  </p>
                  <Input
                    maxLength={2}
                    value={totalrooms}
                    onKeyUp={total}
                    onBeforeInput={total}
                    onChange={(e) => validation.Phonelist(e.target.value, setTotalRooms)}
                    className="inputbox"
                    placeholder="Enter Total Rooms"
                  />
                </div>

                <div className="inputs">
                  <p className="responsive">Basic Adults</p>
                  <Input
                    maxLength={2}
                    value={adults}
                    onChange={(e) => {
                      validation.Phonelist(e.target.value, setAdults)
                    }}
                    className="inputbox"
                    placeholder="Enter Basic Adults"
                  />
                </div>
              </div>
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">Maximum Adults</p>
                  <Input
                    maxLength={2}
                    value={maxadults}
                    onChange={(e) => {
                      validation.Phonelist(e.target.value, setMaxAdults)
                    }}
                    className="inputbox"
                    placeholder="Enter Maximum Adults"
                  />
                </div>

                <div className="inputs">
                  <p className="responsive">Number of Max Children</p>
                  <Input
                    maxLength={2}
                    value={maxchildrens}
                    onChange={(e) => {
                      validation.Phonelist(e.target.value, setMaxChildrens)
                    }}
                    className="inputbox"
                    placeholder="Enter Number of Max Children"
                  />
                </div>

                <div className="inputs">
                  <p className="responsive">
                    Maximum Occupancy<span>*</span>
                  </p>
                  <Input
                    maxLength={2}
                    value={occupancy}
                    onChange={(e) => {
                      validation.Phonelist(e.target.value, setOccupancy)
                    }}
                    className="inputbox"
                    placeholder="Enter Maximum Occupancy "
                  />
                </div>

                {/* <div className="inputs">
                    <p className="responsive">Amenities</p>
                    <Input
                      maxLength={35}
                      value={amenities}
                      onChange={(e) => {
                        validation.Onlytext(e.target.value, setAmenities)
                      }}
                      className="inputbox"
                      placeholder="Enter Amenities"
                    />
                  </div> */}
                <div className="inputs">
                  <p className="responsive">
                    Room Type Code<span>*</span>
                  </p>
                  <Input
                    value={uniqueCode}
                    onChange={(e) => {
                      setUniqueCode(e.target.value)
                    }}
                    className="inputbox"
                    disabled
                    // value={uniqueCode}
                  />
                </div>
              </div>
            </div>
            <div className="isconference">
              {/* <div>
                <Checkbox onChange={onCheck}>isConference</Checkbox>
              </div> */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {isEditMode && (
                    <Button
                      onClick={() => {
                        canceledit()
                        setOpentable(true)
                        navigate(0)
                        setIsEditMode(false)
                      }}
                      className="cancel"
                      style={{ marginLeft: '10px' }}
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
              </div>
            </div>
            {/* <div>
              <div style={{ width: 350, margin: '20px auto', textAlign: 'center' }}>
                <RangePicker
                  use12Hours
                  format="h:mm A"
                  onChange={setTimeRange}
                  placeholder={['Start Time', 'End Time']}
                  style={{ width: '100%' }}
                />

                <Button type="primary" onClick={handleGenerateIntervals} style={{ marginTop: 10 }}>
                  Generate Intervals
                </Button>

                <List
                  bordered
                  style={{ marginTop: 20 }}
                  dataSource={intervals}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              </div>
            </div> */}
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
