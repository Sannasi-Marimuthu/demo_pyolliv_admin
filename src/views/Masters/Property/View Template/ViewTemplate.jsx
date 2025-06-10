import React, { useEffect, useState } from 'react'
import { Form, Table, Button, Select, DatePicker, Modal } from 'antd'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { api } from '../../../../Axios/axios'
import dayjs from 'dayjs'

export default function PropertyType() {
  const { Item: FormItem } = Form
  const [dateSelection, setDateSelection] = useState('')
  const [date, setDate] = useState('')
  const [view, setView] = useState([])
  const [fetchData, setFetchData] = useState(false)
  const [viewTable, setViewTable] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showContent, setShowContent] = useState('')
  const [bookingDetails, setBookingDetails] = useState([])
  const [template, setTemplate] = useState('')
  const [selectedEmail, setSelectedEmail] = useState(null)

  const PropertyCode = sessionStorage.getItem('propertyId')

  // console.log('bookingDet', bookingDetails[0].bookingDet[0])

  const showModal = (record) => {
    console.log('Record', record)
    const booking = bookingDetails.find((b) => b.BkId === record.BkId) || {
      firstName: record.firstName || 'N/A',
      lastName: record.lastName || '',
      ArrivalDate: record.ArrivalDate || '',
      bookingId: record.bookingId || '',
    }

    const filledContent = replacePlaceholders(template, booking)
    const cleanedContent = filledContent
      .replace(/<p><br\s*\/?><\/p>/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim()

    setShowContent(
      `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${cleanedContent}</div>`,
    )
    setIsModalOpen(true)
    setSelectedEmail(record.email || '')
  }
  console.log('????????????????????', template)

  console.log('>>>>>>>>>>>>>>>>>>', showContent)

  const handleCancel = () => {
    setIsModalOpen(false)
    setSelectedEmail(null)
  }

  const [record, setRecord] = useState('')
  const columns = [
    {
      title: 'Guest Name',
      dataIndex: 'firstName',
      key: 'firstName',
      render: (text) => text || 'N/A',
    },
    {
      title: dateSelection === 'ReservationDate' ? 'Reservation Date' : 'Arrival Date',
      dataIndex: dateSelection === 'ReservationDate' ? 'ReservationDate' : 'ArrivalDate',
      key: dateSelection === 'ReservationDate' ? 'ReservationDate' : 'ArrivalDate',
      render: (text) => (text ? new Date(text).toISOString().split('T')[0] : 'N/A'),
    },
    {
      title: 'Booking Id',
      dataIndex: 'bookingId',
      key: 'bookingId',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Price',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (text) => text || '0',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          onClick={() => {
            showModal(record)
            setRecord(record)
          }}
        >
          VIEW
        </Button>
      ),
    },
  ]

  const onChange = (value) => setDateSelection(value)
  const onChange1 = (_, dateString) => setDate(dateString)

  // useEffect(() => {
  //   if (date) {
  //     api
  //       .getAll('get?type=BookingDetails')
  //       .then((response) => {
  //         const filteredData = response.data.filter(
  //           (data) => new Date(data.ArrivalDate).toISOString().split('T')[0] == date,
  //         )
  //         setBookingDetails(filteredData)
  //       })
  //       .catch(() => toast.error('Error fetching booking details'))
  //   }
  // }, [fetchData, dateSelection, date])

  useEffect(() => {
    if (date && PropertyCode == 0) {
      Promise.all([
        api.getAll('get?type=BookingDetails'),
        api.getAll('get?type=BookingDet'),
        api.getAll('get?type=BookingMas'),
        api.getAll('get?type=BookingDetDatewise'),
        api.getAll('get?type=BookingPerDayRent'),
      ])
        .then(([detailsRes, detRes, masRes, datewiseRes, rentRes]) => {
          // Ensure all responses have data

          const details = detailsRes.data || []
          const det = detRes.data || []
          const mas = masRes.data || []
          const datewise = datewiseRes.data || []
          const rent = rentRes.data || []

          // Filter details by date first
          const filteredDetails = details.filter((data) => {
            // const arrivalDate = new Date(data.ArrivalDate).toISOString().split('T')[0]
            return data.ArrivalDate === `${date}`
          })

          // Merge data with proper structure
          const mergedData = filteredDetails.map((detail) => {
            const bkid = detail.BkId // Handle both possible key names

            return {
              ...detail,
              bookingId: detail.bookingId || detail.BkId, // Ensure bookingId is always present
              firstName: detail.firstName || 'N/A', // Add default values
              totalAmount: detail.totalAmount || 0,
              ReservationDate: detail.ReservationDate || detail.ArrivalDate,
              bookingMas: mas.filter((item) => item.Bkid == bkid), // Get first match or empty object
              PropertyCode: mas.filter((item) => item.Bkid == bkid)[0]?.Hotel_code || null,
              bookingDet: det.filter((item) => item.Bkid == bkid),
              bookingDetDatewise: datewise.filter((item) => item.Bkid == bkid),
              bookingPerDayRent: rent.filter((item) => item.Bkid == bkid),
            }
          })

          console.log('/////////////////////////', mergedData)

          setBookingDetails(mergedData)
          console.log('Merged Booking Details:', mergedData)

          // Verify if data is set correctly
          if (mergedData.length === 0) {
            toast.warn('No booking details found for the selected date')
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
          toast.error('Error fetching booking details')
          setBookingDetails([]) // Reset to empty array on error
        })
    }
    else if (date) {
      Promise.all([
        api.getAll('get?type=BookingMas'),
        api.getAll('get?type=BookingDetails'),
        api.getAll('get?type=BookingDet'),
        api.getAll('get?type=BookingDetDatewise'),
        api.getAll('get?type=BookingPerDayRent'),
      ])
        .then(([detailsRes, detRes, masRes, datewiseRes, rentRes]) => {
          // Ensure all responses have data

          //BookingMas
          const mas = masRes.data.filter((item) => item.Hotel_code == PropertyCode) || []
          const property = mas.Bkid
          //BookingDetails
          const details = detailsRes.data.filter((item) => item.Bkid == property) || []
          //BookingDet
          const det = detRes.data.filter((item) => item.Bkid == property) || []
          //BookingDetDatewise
          const datewise = datewiseRes.data.filter((item) => item.Bkid == property) || []
          //BookingPerDayRent
          const rent = rentRes.data.filter((item) => item.Bkid == property) || []

          // Filter details by date first
          const filteredDetails = details.filter((data) => {
            // const arrivalDate = new Date(data.ArrivalDate).toISOString().split('T')[0]
            return data.ArrivalDate === `${date}`
          })

          // Merge data with proper structure
          const mergedData = filteredDetails.map((detail) => {
            const bkid = detail.BkId // Handle both possible key names

            return {
              ...detail,
              bookingId: detail.bookingId || detail.BkId, // Ensure bookingId is always present
              firstName: detail.firstName || 'N/A', // Add default values
              totalAmount: detail.totalAmount || 0,
              ReservationDate: detail.ReservationDate || detail.ArrivalDate,
              bookingMas: mas.filter((item) => item.Bkid == bkid), // Get first match or empty object
              PropertyCode: mas.filter((item) => item.Bkid == bkid)[0]?.Hotel_code || null,
              bookingDet: det.filter((item) => item.Bkid == bkid),
              bookingDetDatewise: datewise.filter((item) => item.Bkid == bkid),
              bookingPerDayRent: rent.filter((item) => item.Bkid == bkid),
            }
          })

          console.log('/////////////////////////', mergedData)

          setBookingDetails(mergedData)
          console.log('Merged Booking Details:', mergedData)

          // Verify if data is set correctly
          if (mergedData.length === 0) {
            toast.warn('No booking details found for the selected date')
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
          toast.error('Error fetching booking details')
          setBookingDetails([]) // Reset to empty array on error
        })
    } else {
      setBookingDetails([]) // Reset when no date is selected
    }
  }, [date, fetchData]) // Keep dependencies as they are
  useEffect(() => {
    api
      .getAll('get?type=Email')
      .then((response) => {
        const filteredTemplates = response.data.filter(
          (data) => data.TemplateType === 'Reservation',
        )
        if (filteredTemplates.length > 0) setTemplate(filteredTemplates[0].Content)
      })
      .catch(() => toast.error('Error fetching email template'))
  }, [])

  const [hostDetails, setHostDetails] = useState([])

  useEffect(() => {
    if (PropertyCode) {
      api
        .getAll('get?type=EmailMaster')
        .then((response) => {
          const filteredData = response.data.filter((data) => data.PropertyCode === PropertyCode)
          setHostDetails(filteredData[0])
          // console.log('filteredData', filteredData[0])
        })
        .catch(() => toast.error('Error fetching Email Master'))
    } else {
      api
        .getAll('get?type=EmailMaster')
        .then((response) => {
          setHostDetails(response.data[0])
        })
        .catch(() => toast.error('Error fetching Email Master'))
    }
  }, []) // Added Propertycode as a dependency

  console.log('hostDetails', hostDetails)

  const replacePlaceholders = (template, booking) => {
    console.log('Booking Data:', booking)

    const defaultValues = {
      ArrivalTime: 'N/A',
      DepartureTime: 'N/A',
      ReservationNumber: 'N/A',
      NumberofRooms: 'N/A',
      TotalAmount: '0',
    }

    const keyMap = {
      'Property Name': 'PropertyName',
      'Booking Id': 'BkId',
      // 'Arrival Date': 'ArrivalDate',
      // 'Departure Date': 'DepartureDate',
      'Number of Guests': 'NumberofPax',
      'Room Type': 'roomType',
      'Rate Plan': 'ratePlan',
      'Total Price': 'totalAmount',
      'Number of Rooms': 'noofrooms',
      'Arrival Time': 'Fromtime', // Special handling below
      'Departure Time': 'Totime', // Special handling below
      'Reservation Number': 'Booking_pnr_no', // Special handling below
    }

    return template.replace(/\${([^}]+)}/g, (match, key) => {
      const trimmedKey = key.trim()

      if (trimmedKey === 'Name') {
        return `${booking.firstName || ''} ${booking.lastName || ''}`.trim()
      }

      const mappedKey = keyMap[trimmedKey] || trimmedKey
      let value = booking[mappedKey] || 'N/A'

      // Handle special cases for nested objects
      if (trimmedKey === 'Arrival Time') {
        value = booking.bookingDet?.[0]?.Fromtime
      }
      if (trimmedKey === 'Arrival Date') {
        value = booking.bookingDet?.[0]?.Fromdate
      }
      if (trimmedKey === 'Departure Date') {
        value = booking.bookingDet?.[0]?.Todate
      }
      if (trimmedKey === 'Departure Time') {
        value = booking.bookingDet?.[0]?.Totime
      }

      if (trimmedKey === 'Reservation Number') {
        value = booking.bookingMas?.[0]?.Booking_pnr_no || defaultValues.ReservationNumber
      }

      if (trimmedKey === 'Number of Rooms') {
        value = booking.noofrooms || defaultValues.NumberofRooms
      }

      return value
    })
  }

  const emailSend = () => {
    const emailSendData = {
      type: 'EmailSend',

      guestEmail: record.email,
      subject: 'Booking Confirmation',
      message: showContent,
    }

    console.log('<<<<<<<<<<<<>>>>>>>>>>', emailSendData)

    api
      .create('post', emailSendData)
      .then((response) => {
        setIsModalOpen(false)
        toast.success(`Email sent to ${record.email}`)
      })
      .catch((err) => {
        console.log('Mail Sending error', err)
      })
  }

  const check = () => {
    setFetchData(true)
    setViewTable(true)
  }

  // const sendEmail = (email) => {
  //   if (!email) {
  //     toast.error('No email selected')
  //     return
  //   }
  //   toast.success(`Email sent to ${email}`)
  // }

  return (
    <div>
      <div className="style" style={{ lineHeight: '3', display: 'flex', flexDirection: 'column' }}>
        <div className="form">
          <div className="admin-row">
            <div className="admin-col">
              <div className="inputs">
                <p className="responsive">
                  Type of Booking<span>*</span>
                </p>
                <Select
                  className="inputbox"
                  value={dateSelection || undefined}
                  placeholder="Select type of Booking"
                  options={[
                    { label: 'Reservation Date', value: 'ReservationDate' },
                    { label: 'Arrival Date', value: 'ArrivalDate' },
                  ]}
                  onChange={onChange}
                />
              </div>
            </div>
            <div className="admin-col">
              <div className="inputs">
                <p className="responsive">
                  Date<span>*</span>
                </p>
                <DatePicker
                  className="inputbox"
                  onChange={onChange1}
                  value={date ? dayjs(date) : null}
                />
              </div>
            </div>
            <div className="admin-col">
              <FormItem className="templatebutton">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Button className="save" style={{ height: '31.6px' }} onClick={check}>
                    Check
                  </Button>
                </div>
                <ToastContainer
                  position="top-center"
                  autoClose={500}
                  hideProgressBar
                  theme="light"
                  transition={Zoom}
                />
              </FormItem>
            </div>
          </div>
        </div>

        {viewTable && (
          <Table
            pagination={false}
            dataSource={bookingDetails}
            columns={columns}
            bordered
            rowKey="_id"
          />
        )}

        <Modal title="Email Preview" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <div>
            <div
              dangerouslySetInnerHTML={{ __html: showContent }}
              style={{
                '& p': {
                  margin: '8px 0', // Reduce the default margin for <p> tags
                },
                fontSize: 14,
              }}
            />
          </div>
          <Button type="primary" style={{ marginTop: '15px' }} onClick={emailSend}>
            Send Email
          </Button>
        </Modal>
      </div>
      
    </div>
  )
}
