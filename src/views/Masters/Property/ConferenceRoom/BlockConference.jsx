import React, { use, useEffect, useState } from 'react'
import { InputNumber, TimePicker, Button, Card, DatePicker, Table, Input, Select } from 'antd'
import dayjs from 'dayjs'
// import '../../CSS/Master.css'
import { api } from '../../../../Axios/axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { Label } from '@mui/icons-material'

const BlockConference = () => {
  const [slotCount, setSlotCount] = useState()
  const [slots, setSlots] = useState([])
  const [date, setDate] = useState('')
  const [selectedPurpose, setSelectedPurpose] = useState([])
  const [selectedRoom, setSelectedRoom] = useState('')
  const [hallName, setHallName] = useState('')
  const [slotOptions, setSlotOptions] = useState([])

  const [block, setBlock] = useState([])
  const [maxPropertyId, setMaxPropertyId] = useState(0)
  const [maxPropertyId1, setMaxPropertyId1] = useState(0)

  const navigate = useNavigate()

  const PropertyCode = sessionStorage.getItem('propertyId')

  const columns = [
    {
      title: 'Property Code',
      dataIndex: 'PropertyCode',
      key: 'PropertyCode',
    },
    {
      title: 'Slots',
      dataIndex: 'Slots',
      key: 'Slots',
      render: (slots) => (
        <>
          {slots.map((slot, index) => (
            <div key={slot._id}>
              <strong>Slot-{index + 1}:</strong> {slot.from} - {slot.to}
            </div>
          ))}
        </>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => <button onClick={() => handleEdit(record)}>Edit</button>,
    },
  ]

  //Post
  // const handleSubmit = () => {

  //   const requestBody = {
  //     type: 'BlockHall',
  //     Date: date,
  //     Slots: slotCount,
  //     Purpose: selectedPurpose,
  //     PropertyCode: PropertyCode,
  //     HallName: hallName,
  //     RoomType: selectedRoom,
  //   }

  //   console.log('Request Body:', requestBody)

  //   api
  //     .create('post', requestBody)
  //     .then((response) => {
  //       toast.success('Block Rooms Created Successfully')
  //       navigate(0)
  //       console.log(response.data)
  //     })
  //     .then((data) => console.log('Backend Response:', data))
  //     .catch((error) => console.error('Error:', error))
  // }

  const handleSubmit = () => {
    const newBlkid = maxPropertyId + 1

    const newBlkDetid = maxPropertyId1 + 1

    const blockHallData = {
      HallName: hallName,
      Blkid: newBlkid,
      RoomCode: selectedRoom, // Assuming RoomType is the ID
      Blockdate: date,
      Noofslots: slotCount ? 1 : 0, // Assuming slotCount represents the number of slots
      Purposeid: selectedPurpose,
      PropertyCode: PropertyCode,
    }

    const blkDetData = {
      BlockDetId: newBlkDetid,
      Blkid: newBlkid,
      Slotname: slotCount, // Selected slot name from dropdown
      Fromtime: from, // You need to add logic to capture this (e.g., from slotOptions or a TimePicker)
      Totime: to, // Same as above
      Stopsales: 1, // Default value, adjust as needed
    }

    const requestBody = {
      type: 'BlockHall',
      blockHall: blockHallData,
      blkDet: blkDetData,
    }

    console.log('Request Body:', requestBody)

    api
      .create('post', requestBody)
      .then((response) => {
        toast.success('Block Rooms Created Successfully')
        navigate(0)
        console.log(response.data)
      })
      .catch((error) => console.error('Error:', error))
  }

  //Get
  const [view, setView] = useState([])
  useEffect(() => {
    api.getAll('get?type=ConferenceRoom').then((response) => {
      console.log('ConferenceRoom', response.data)
      const filteredData = response.data.filter((item) => item.PropertyCode == PropertyCode)
      setView(filteredData)
    })
  }, [])

  //Block Hall
  useEffect(() => {
    api.getAll('get?type=BlockHall').then((response) => {
      console.log('Block_Hall', response.data)
      setBlock(response.data)
      const maxId = Math.max(...response.data.map((item) => item.Blkid || 0), 0)
      setMaxPropertyId(maxId)
    })
  }, [])

  //Block Hall Det
  useEffect(() => {
    api.getAll('get?type=BlockHallDet').then((response) => {
      console.log('Block_Hall_Det', response.data)
      const maxId = Math.max(...response.data.map((item) => item.BlockDetId || 0), 0)
      setMaxPropertyId1(maxId)
    })
  }, [])

  const [purpose, setPurpose] = useState([])
  useEffect(() => {
    api.getAll('get?type=Purpose').then((response) => {
      console.log('Purpose', response.data)
      setPurpose(response.data)
    })
  }, [])

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const handleRoomTypeChange = (roomType) => {
    setSelectedRoom(roomType)

    // Find the matching conference room based on the selected RoomType
    const matchedRoom = view.find((room) => room.RoomType == roomType)

    setHallName(matchedRoom.HallName)
    console.log('matchedRoom', matchedRoom)

    // Extract slots for the selected RoomType
    if (matchedRoom) {
      const slots = matchedRoom.Slots.map((slot) => ({
        value: slot.slotName, // Slot identifier
        label: `${slot.slotName} (${slot.from} - ${slot.to})`, // Display name with times
        from: slot.from, // Store from time
        to: slot.to,
      }))
      setSlotOptions(slots)
      if (slots.length > 0) {
        setFrom(slots[0].from)
        setTo(slots[0].to)
      }
    } else {
      setSlotOptions([])
    }
  }

  //Date
  const onChange = (date, dateString) => {
    console.log('Selected Date:', dateString)
    setDate(dateString) // Store as string
  }

  return (
    <div
      className="style"
      style={{
        lineHeight: '3',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="form">
        <div className="admin-row">
          <div className="admin-col">
            <div className="inputs">
              <p className="responsive">Hall Name</p>
              <Select
                className="inputbox"
                // mode="multiple"
                placeholder="Select Hall Name"
                value={selectedRoom || undefined}
                onChange={handleRoomTypeChange}
                options={view.map((item) => ({
                  label: item.HallName,
                  value: item.RoomType,
                }))}
              />
            </div>
          </div>
          <div className="admin-col">
            <div className="inputs">
              <p className="responsive">Date</p>
              <DatePicker
                className="inputbox"
                value={date ? dayjs(date, 'YYYY-MM-DD') : null}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="admin-col">
            <div className="inputs">
              <p className="responsive">Slots</p>
              <Select
                className="inputbox"
                value={slotCount}
                placeholder="Select Slots"
                onChange={(value) => setSlotCount(value)}
                style={{ marginBottom: 20 }}
                options={slotOptions}
              />
            </div>
          </div>
          <div className="admin-col">
            <div className="inputs">
              <p className="responsive">Purpose</p>
              <Select
                className="inputbox"
                value={selectedPurpose}
                placeholder="Enter Purpose"
                onChange={(e) => setSelectedPurpose(e)}
                options={purpose.map((item) => ({
                  value: item.PurposeId,
                  label: item.Purpose,
                }))}
                style={{ marginBottom: 20 }}
              />
            </div>
          </div>
        </div>

        <div className="admin-row">
          <div className="admin-col" style={{ textAlign: 'end' }}>
            <Button className="saveconference" type="primary" onClick={handleSubmit}>
              Submit Slots
            </Button>
          </div>
          {/* <div className="admin-col"></div>
          <div className="admin-col"></div> */}
        </div>
        {/* <Table columns={columns} dataSource={view} /> */}
      </div>
    </div>
  )
}

export default BlockConference
