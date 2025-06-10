import React, { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import '../../CSS/Master.css'
import { FaUser, FaUsers } from 'react-icons/fa'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { SlArrowRightCircle } from 'react-icons/sl'
import { api } from '../../../../Axios/axios'
import moment from 'moment'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Button, Input } from 'antd'
//Calendar in mui
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
// import calendar from '../../../../assets/images/calendar.png'
import { MdPlayArrow } from 'react-icons/md'
import { TiArrowSortedDown } from 'react-icons/ti'
import calendar from '../../../../assets/images/calendar1.png'
import dayjs from 'dayjs'

export default function RoomType() {
  const navigate = useNavigate()
  const PropertyCode = sessionStorage.getItem('propertyId')
  const [filteredData, setFilteredData] = useState([])
  const [double, setDouble] = useState({})
  const [single, setSingle] = useState({})
  const [updateinventory, setUpdateInventory] = useState({})

  // Inputs
  const [availablerooms, setAvailableRooms] = useState(null)

  /////////  Calendar  /////////
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDateCalendar, setSelectedDateCalendar] = useState(null)
  const [viewcalendar, setViewCalendar] = useState('day')

  const handleDateChange = (date) => {
    if (viewcalendar === 'day') {
      console.log('Selected Date:', date.format('YYYY-MM-DD'))
      setSelectedDateCalendar(date)
      setShowCalendar(false)
      setDates(generateDates(new Date(date), 7)) // 🔹 Update dates based on selection
    }
  }

  // Disable past dates
  const disablePastDates = (date) => {
    return date.isBefore(dayjs().startOf('day'))
  }

  ////////////////////////   Date Picker /////////////////////////

  const [selectedDate, setSelectedDate] = useState(null)
  const [dates, setDates] = useState(generateDates(new Date(), 7))
  console.log('date', dates)
  console.log('selectedDateCalendar', selectedDateCalendar)

  // Function to generate dates based on selected range
  function generateDates(startDate, range = 7) {
    return Array.from({ length: range }, (_, i) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i) // Incrementing date

      return {
        fullDate: date,
        day: date.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase(),
        date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase(),
        formattedDate: date.toISOString().split('T')[0], // Directly returns YYYY-MM-DD format
      }
    })
  }

  const handleDateSelection = (date) => {
    setSelectedDate(date)

    // Filter the inventory based on the selected date
    const filtered = view.filter((item) => item.AvailableDate == date)

    setFilteredData(filtered)

    // Update the available rooms state dynamically
    const updatedAvailableRooms = {}
    filtered.forEach((item) => {
      updatedAvailableRooms[item.Roomcode] = item.AvailableRooms
    })

    setAvailableRooms(updatedAvailableRooms)
    console.log('Updated Rooms:', updatedAvailableRooms)
  }

  // Rate Master
  const [view, setView] = useState([])

  ////////////  Get  /////////////

  // Filter using Propertycode from backend in Rate Master
  const [getrates, setGetRates] = useState([])
  useEffect(() => {
    const selectedDateFormatted = selectedDateCalendar
      ? selectedDateCalendar.format('YYYY-MM-DD') // ✅ Format as YYYY-MM-DD if selected
      : dates[0].formattedDate // ✅ Otherwise, use first date in the list
    api
      .getAll(`get?type=RateMasterRates&propertycode=${PropertyCode}&date=${selectedDateFormatted}`)
      .then((response) => {
        setGetRates(response.data)
        console.log('RateMaster', response.data)
      })
  }, [selectedDateCalendar, dates])

  // Room Rate Link
  const [rateroom, setRateRoom] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=RoomRateLink')
      .then((response) => {
        const filteredData = response.data.filter((item) => item.PropertyCode == PropertyCode)
        setRateRoom(filteredData)
        console.log('RoomRateLink', filteredData)
      })
      .catch(() => {
        toast.error('Error in getting Room Rate Link')
      })
  }, [PropertyCode])

  // Room Type
  const [room, setRoom] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=Roomtype')
      .then((response) => {
        const filteredData = response.data.filter((item) => item.PropertyCode == PropertyCode)
        setRoom(filteredData)
        console.log('Roomtype', filteredData)
      })
      .catch(() => {
        toast.error('Error in getting Room Rate Link')
      })
  }, [PropertyCode])

  // Room Type
  const [inventory, setInventory] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=InventoryMaster')
      .then((response) => {
        setInventory(response.data)
        console.log('setInventory', response.data)
      })
      .catch(() => {
        toast.error('Error in getting Room Rate Link')
      })
  }, [PropertyCode])

  //Property Master
  // const [viewproperty, setViewProperty] = useState([])
  // useEffect(() => {
  //   api.getAll(`get?type=PropertyRates&propertycode=${PropertyCode}`).then((response) => {
  //     console.log('PropertyMasterData', response.data[0])
  //     setViewProperty(response.data[0])
  //   })
  // }, [PropertyCode])

  /////////////////////// UPDATE ///////////////////////

  const handleSubmit = async () => {
    const updatedRates = []
    const updatedInventory = []

    // Loop through displayed dates and gather data
    dates.forEach(({ formattedDate }) => {
      // ✅ Handle Rates
      Object.entries(double).forEach(([key, doubleTarrif]) => {
        const [roomType, ratePlan] = key.split('-')

        // Find previous rate from backend to retain unchanged values
        const previousRate = getrates.find(
          (rate) =>
            rate.RoomCode === roomType &&
            rate.RatePlan.trim() === ratePlan.trim() &&
            rate.EntryDate === formattedDate,
        )

        updatedRates.push({
          ratetype: 'RateMaster',
          PropertyCode: PropertyCode,
          RoomCode: roomType,
          RatePlan: ratePlan,
          EntryDate: formattedDate, // ✅ Ensuring YYYY-MM-DD format
          DoubleTarrif:
            double[`${roomType}-${ratePlan}-${formattedDate}`] !== undefined
              ? Number(double[`${roomType}-${ratePlan}-${formattedDate}`])
              : previousRate?.DoubleTarrif || 0,
          SingleTarrif:
            single[`${roomType}-${ratePlan}-${formattedDate}`] !== undefined
              ? Number(single[`${roomType}-${ratePlan}-${formattedDate}`])
              : previousRate?.SingleTarrif || 0,
        })
      })

      //////// ✅ Optimized Inventory Update (Only Changed Data) ////////

      Object.entries(updateinventory).forEach(([key, availableRooms]) => {
        const [roomType] = key.split('-')

        // Find previous inventory data for comparison
        const previousInventory = inventory.find(
          (inv) => inv.RoomCode === roomType && inv.AvailableDate === formattedDate,
        )

        // Determine the new value
        const newAvailableRooms =
          updateinventory[`${roomType}-${formattedDate}`] !== undefined
            ? Number(updateinventory[`${roomType}-${formattedDate}`])
            : previousInventory?.AvailableRooms || 0

        // ✅ Only push to updatedInventory if the value has changed
        if (newAvailableRooms !== (previousInventory?.AvailableRooms || 0)) {
          updatedInventory.push({
            ratetype: 'InventoryMaster',
            PropertyCode: PropertyCode,
            RoomCode: roomType,
            AvailableDate: formattedDate,
            AvailableRooms: newAvailableRooms,
          })
        }
      })
    })

    // ✅ Prevent unnecessary API calls if no data changed
    if (updatedRates.length === 0 && updatedInventory.length === 0) {
      toast.warn('No changes detected.')
      return
    }

    try {
      if (updatedRates.length > 0) {
        console.log('Final Data Sent to Backend (Rates):', updatedRates) // ✅ Debugging
        await api.create('post', updatedRates)
        toast.success('Rates updated successfully!')
      }

      if (updatedInventory.length > 0) {
        console.log('Final Data Sent to Backend (Inventory):', updatedInventory) // ✅ Debugging
        await api.create('post', updatedInventory)
        toast.success('Inventory updated successfully!')
      }

      navigate(0)
    } catch (error) {
      console.error('Error updating data:', error)
      toast.error('Error updating data. Please try again.')
    }
  }

  console.log('double', double)

  //Try
  const [showRates, setShowRates] = useState(false)
  const [showEP, setShowEP] = useState(false)

  console.log('rateroom', rateroom)

  //////////////
  const groupedRooms = rateroom.reduce((acc, item) => {
    if (!acc[item.RoomType]) {
      acc[item.RoomType] = []
    }
    acc[item.RoomType].push(item)
    return acc
  }, {})

  console.log('groupedRooms', groupedRooms)

  // Change only one input at a time

  const handleDoubleChange = (roomType, ratePlan, date, value) => {
    setDouble((prev) => ({
      ...prev,
      [`${roomType}-${ratePlan}-${date}`]: value,
    }))
  }

  const handleSingleChange = (roomType, ratePlan, date, value) => {
    setSingle((prev) => ({
      ...prev,
      [`${roomType}-${ratePlan}-${date}`]: value,
    }))
  }
  const bulk = () => {
    // navigate('/Masters/RateMaster')
    setDropdown(!dropdown)
  }
  const [dropdown, setDropdown] = useState(false)
  const ratepage = () => {
    navigate('/Masters/RateMaster')
  }
  const inventorypage = () => {
    navigate('/Masters/InventoryMaster')
  }
  // const [showSingle, setShowSingle] = useState(true)
  // const [showDouble, setShowDouble] = useState(true)

  return (
    <div>
      <div className="ratestop">
        <div>
          <Button onClick={bulk} className="ratesbulk">
            BULK UPDATE
            {dropdown ? (
              <TiArrowSortedDown className="ratesbulkicon1" />
            ) : (
              <MdPlayArrow className="ratesbulkicon" />
            )}
          </Button>
          <div>
            {dropdown && (
              <div className="ratesdropdown">
                <span className="ratesdropdownname" onClick={ratepage}>
                  Rate Master
                </span>
                <span
                  className="ratesdropdownname"
                  onClick={inventorypage}
                  style={{ marginTop: '10px' }}
                >
                  Inventory Master
                </span>
              </div>
            )}
          </div>
        </div>
        <div onClick={() => setShowCalendar(!showCalendar)} className="ratescalendardiv">
          <div className="ratescal">
            <img src={calendar} className="ratescalendar" alt="Calendar Icon" />
            <span className="ratescalendarcontent">Calendar</span>
          </div>
        </div>
      </div>

      {showCalendar && (
        <div className="calendar-container">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar
              shouldDisableDate={disablePastDates}
              value={selectedDateCalendar}
              onChange={handleDateChange}
              onViewChange={(newView) => setViewCalendar(newView)} // ✅ Manage calendar view state
              view={viewcalendar} // Set the controlled view mode
            />
          </LocalizationProvider>
        </div>
      )}

      <div className="RateDate-container">
        <div className="RateDate">
          <div className="room-title">Room & Inventory</div>
          <div className="room-dates">
            {dates.map((item) => (
              <div
                key={item.date}
                className={`rateBox ${selectedDate === item.date ? 'selected' : ''} 
    ${item.day === 'SUN' ? 'sunday-bg' : ''}`} // ✅ Add special class for Sundays
                onClick={() => handleDateSelection(item.date)}
              >
                <div className="day">{item.day}</div>
                <div className="date">{item.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rate-master">
        <div className="section-header">
          <div className="section-header1">
            <button className="toggle-button" onClick={() => setShowRates(!showRates)}>
              {showRates ? <FiMinus className="ratesvg" /> : <FiPlus className="ratesvg" />}
            </button>
            <h6 className="showrate text-lg font-semibold">
              {showRates ? 'Hide Rates' : 'Show All Rate Plans'}
            </h6>
          </div>
          <div>
            <Button className="section-header1-Button" onClick={handleSubmit}>
              UPDATE
            </Button>
          </div>
        </div>

        {/* Loop through grouped room types */}
        {Object.entries(groupedRooms).map(([roomType, ratePlans], index) => {
          const matchingRoom = room.find((data) => data.Roomcode === roomType)

          return (
            <div key={index} className="rate-container">
              <div className="rate-section">
                {/* Display Room Type only once */}
                <div className="raterow1">
                  <div className="ratetop1">
                    <div className="rate-header1">
                      <button
                        className="toggle-button bg-gray-200 hover:bg-gray-300"
                        onClick={() => setShowRates(!showRates)}
                      >
                        {showRates ? (
                          <FiMinus className="ratesvg" />
                        ) : (
                          <FiPlus className="ratesvg" />
                        )}
                      </button>
                      <span className="ratesroomtype">
                        {matchingRoom?.Displayname || 'Unknown Room'}
                      </span>
                    </div>
                  </div>

                  {/* Inventory Section */}
                  <div className="ratetarrifdulex">
                    <div className="rate-grid">
                      {[...Array(7)].map((_, index) => {
                        // ✅ Use `selectedDateCalendar` if available, otherwise use `dates[0]`
                        const startDate = selectedDateCalendar
                          ? moment(selectedDateCalendar.format('YYYY-MM-DD'), 'YYYY-MM-DD') // Ensure correct format
                          : moment(dates[0].formattedDate, 'YYYY-MM-DD')

                        const dateToCheck = startDate.add(index, 'days').format('YYYY-MM-DD')

                        // Find inventory for the current date and roomType
                        const matchingInventory = inventory.find(
                          (inv) => inv.AvailableDate === dateToCheck && inv.RoomCode === roomType,
                        )

                        // Unique key for each input field
                        const inputKey = `${roomType}-${dateToCheck}`

                        return (
                          <div key={index} className="text-center">
                            <Input
                              className="input-fieldrooms"
                              value={
                                updateinventory[inputKey] !== undefined
                                  ? updateinventory[inputKey]
                                  : (matchingInventory?.AvailableRooms ?? 0)
                              }
                              onChange={(e) => {
                                const value = Number(e.target.value)

                                if (value > matchingRoom?.Totalrooms) {
                                  toast.error(`Rooms should not exceed ${matchingRoom?.Totalrooms}`)
                                  return // Prevent state update
                                }

                                setUpdateInventory((prev) => ({
                                  ...prev,
                                  [inputKey]: value, // ✅ Update only the specific input field
                                }))
                              }}
                            />

                            {/* <span>
                              {matchingInventory && matchingRoom
                                ? (matchingRoom.Totalrooms || 0) - matchingInventory.AvailableRooms
                                : 0}
                              sold
                            </span> */}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <hr className="ratehr" />

                {/* Display Each RatePlan Under the RoomType */}
                {showRates &&
                  ratePlans.map((item, rateIndex) => (
                    <div key={rateIndex} className="rate-grid-ep">
                      <div className="rate-header">
                        <button
                          className="toggle-button bg-gray-200 hover:bg-gray-300"
                          onClick={() => setShowRates(!showRates)}
                        >
                          {showRates ? (
                            <FiMinus className="ratesvg" />
                          ) : (
                            <FiPlus className="ratesvg" />
                          )}
                        </button>
                        <div className="ep">
                          <span className="ratesep">{item.RatePlan}</span>
                          {/* <button className="inventorybutton" onClick={handleSubmit}>
                            Update Rate
                          </button> */}
                        </div>
                      </div>
                      <div>
                        {/* Double Occupancy */}
                        <div className="ratetarrif">
                          <div className="ratetarrif1">
                            <FaUsers className="mr-2" /> 2
                          </div>
                          <div className="rate-grid">
                            {Array.from({ length: 7 }).map((_, index) => {
                              // ✅ Start from `selectedDateCalendar` if available, else use `dates[0]`
                              const startDate = selectedDateCalendar
                                ? moment(selectedDateCalendar.format('YYYY-MM-DD')) // Convert Dayjs to Moment for consistency
                                : moment(dates[0].formattedDate, 'YYYY-MM-DD')

                              const dateToCheck = startDate.add(index, 'days').format('YYYY-MM-DD')

                              const matchingRate = getrates.find(
                                (rate) =>
                                  rate.RoomCode === item.RoomType &&
                                  rate.RatePlan === item.RatePlan &&
                                  rate.EntryDate === dateToCheck,
                              )

                              return (
                                <div key={index} className="text-center">
                                  <Input
                                    value={
                                      double[`${item.RoomType}-${item.RatePlan}-${dateToCheck}`] ??
                                      matchingRate?.DoubleTarrif ??
                                      0
                                    }
                                    onChange={(e) =>
                                      handleDoubleChange(
                                        item.RoomType,
                                        item.RatePlan,
                                        dateToCheck,
                                        e.target.value,
                                      )
                                    }
                                    type="text"
                                    className="input-field"
                                    defaultValue={matchingRate?.DoubleTarrif || 0}
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Single Occupancy */}
                        <div className="ratetarrif">
                          <div className="ratetarrif1">
                            <FaUser className="mr-2" /> 1
                          </div>
                          <div className="rate-grid bg-gray-100">
                            {Array.from({ length: 7 }).map((_, index) => {
                              // ✅ Use `selectedDateCalendar` if available, otherwise use `dates[0]`
                              const startDate = selectedDateCalendar
                                ? moment(selectedDateCalendar.format('YYYY-MM-DD'), 'YYYY-MM-DD') // Convert `selectedDateCalendar` properly
                                : moment(dates[0].formattedDate, 'YYYY-MM-DD')

                              const dateToCheck = startDate.add(index, 'days').format('YYYY-MM-DD')

                              const matchingRate = getrates.find(
                                (rate) =>
                                  rate.RoomCode === item.RoomType &&
                                  rate.RatePlan === item.RatePlan &&
                                  rate.EntryDate === dateToCheck,
                              )

                              return (
                                <div key={index} className="text-center">
                                  <Input
                                    value={
                                      single[`${item.RoomType}-${item.RatePlan}-${dateToCheck}`] ??
                                      matchingRate?.SingleTarrif ??
                                      0
                                    }
                                    onChange={(e) =>
                                      handleSingleChange(
                                        item.RoomType,
                                        item.RatePlan,
                                        dateToCheck,
                                        e.target.value,
                                      )
                                    }
                                    type="text"
                                    className="input-field"
                                  />
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )
        })}
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
  )
}
