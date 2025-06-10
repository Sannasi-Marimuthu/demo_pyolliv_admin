// import React, { useState } from 'react'
// import { InputNumber, TimePicker, Button, Card } from 'antd'
// import dayjs from 'dayjs'
// // import '../../CSS/Master.css'
// import { api } from '../../../../Axios/axios'

// const TimeSlotSelector = () => {
//   const [slotCount, setSlotCount] = useState(0)
//   const [slots, setSlots] = useState([])

//   const PropertyCode = sessionStorage.getItem('propertyId')

//   const handleSlotChange = (value) => {
//     setSlotCount(value)
//     setSlots(Array.from({ length: value }, () => ({ from: null, to: null })))
//   }

//   const handleTimeChange = (index, type) => (time, timeString) => {
//     const updatedSlots = [...slots]

//     if (time) {
//       // Only update if a time is actually selected
//       if (type === 'from') {
//         updatedSlots[index].from = time
//         updatedSlots[index].to = null // Reset To Time when From Time changes
//       } else {
//         updatedSlots[index].to = time
//       }
//       setSlots(updatedSlots)
//     }
//   }

//   const getDisabledFromTimes = (index) => {
//     if (index === 0) return {}

//     const prevToTime = slots[index - 1]?.to
//     if (!prevToTime) return {}

//     return {
//       disabledHours: () => {
//         const prevHour = prevToTime.hour()
//         return Array.from({ length: prevHour }, (_, i) => i)
//       },
//       disabledMinutes: (hour) => {
//         const prevHour = prevToTime.hour()
//         if (hour === prevHour) {
//           return Array.from({ length: prevToTime.minute() + 1 }, (_, i) => i)
//         }
//         return []
//       },
//     }
//   }

//   const getDisabledToTimes = (index) => {
//     const fromTime = slots[index]?.from
//     if (!fromTime) return {}

//     return {
//       disabledHours: () => {
//         const fromHour = fromTime.hour()
//         return Array.from({ length: fromHour }, (_, i) => i)
//       },
//       disabledMinutes: (hour) => {
//         const fromHour = fromTime.hour()
//         if (hour === fromHour) {
//           return Array.from({ length: fromTime.minute() }, (_, i) => i)
//         }
//         return []
//       },
//     }
//   }

//   const handleSubmit = () => {
//     const formattedSlots = slots.map((slot, index) => ({
//       [`Slot-${index + 1}`]: {
//         from: slot.from ? slot.from.format('hh:mm A') : 'Not selected',
//         to: slot.to ? slot.to.format('hh:mm A') : 'Not selected',
//       },
//     }))

//     const requestBody = {
//       type: 'ConferenceRoom', // You can make this dynamic if needed
//       Slots: formattedSlots,
//       PropertyCode: PropertyCode, // You can make this dynamic if needed
//     }

//     console.log('Request Body:', requestBody)

//     // Example: Sending to backend via fetch
//     api
//       .create('post', requestBody)
//       .then((response) => response.json())
//       .then((data) => console.log('Backend Response:', data))
//       .catch((error) => console.error('Error:', error))
//   }

//   return (
//     <div
//       className="style"
//       style={{
//         lineHeight: '3',
//         display: 'flex',
//         flexDirection: 'column',
//       }}
//     >
//       <div className="form">
//         <div className="admin-row">
//           <div className="admin-col">
//             <div className="inputs">
//               <p className="responsive">Enter Number of Slots:</p>
//               <InputNumber
//                 className="inputbox"
//                 min={1}
//                 max={10}
//                 value={slotCount}
//                 onChange={handleSlotChange}
//                 style={{ marginBottom: 20 }}
//               />
//             </div>
//           </div>
//           <div className="admin-col"></div>
//           <div className="admin-col"></div>
//         </div>

//         <div className="admin-row">
//           <div className="admin-col">
//             {slots.map((slot, index) => (
//               <Card key={index} title={`Slot-${index + 1}`} style={{ marginBottom: 10 }}>
//                 <TimePicker
//                   use12Hours
//                   format="h:mm A"
//                   placeholder="From Time"
//                   value={slot.from ? dayjs(slot.from) : null} // Ensure proper dayjs object
//                   onChange={handleTimeChange(index, 'from')}
//                   disabledTime={() => getDisabledFromTimes(index)}
//                   style={{ marginRight: 10 }}
//                 />
//                 <TimePicker
//                   use12Hours
//                   format="h:mm A"
//                   placeholder="To Time"
//                   value={slot.to ? dayjs(slot.to) : null} // Ensure proper dayjs object
//                   onChange={handleTimeChange(index, 'to')}
//                   disabledTime={() => getDisabledToTimes(index)}
//                 />
//               </Card>
//             ))}
//           </div>
//           <div className="admin-col"></div>
//           <div className="admin-col"></div>
//         </div>

//         <div className="admin-row">
//           <div className="admin-col">
//             {slotCount > 0 && (
//               <Button style={{ textAlign: 'end' }} type="primary" onClick={handleSubmit}>
//                 Submit Slots
//               </Button>
//             )}{' '}
//           </div>
//           <div className="admin-col"></div>
//           <div className="admin-col"></div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default TimeSlotSelector





// src/App.js
import React from 'react';
import { FiHome, FiBook, FiVideo, FiSettings, FiLogOut, FiSearch, FiBell, FiUser } from 'react-icons/fi';

function App() {
  return (
    <div style={styles.app}>
      {/* Sidebar */}
      {/* <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <FiHome size={24} />
        </div>
        <div style={styles.sidebarNav}>
          <FiBook size={24} />
          <FiVideo size={24} />
          <FiSettings size={24} />
        </div>
        <div style={styles.sidebarLogout}>
          <FiLogOut size={24} />
        </div>
      </div> */}

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <select style={styles.select}>
              <option>Good To Go</option>
            </select>
            <select style={styles.select}>
              <option>Sales</option>
            </select>
          </div>
          <div style={styles.headerRight}>
            <FiSearch size={20} />
            <FiBell size={20} />
            <FiUser size={20} />
          </div>
        </div>

        {/* Dashboard */}
        <div style={styles.dashboard}>
          {/* Analytics Card */}
          <div style={{ ...styles.card, ...styles.analyticsCard }}>
            <h3>Booking Analytics</h3>
            <h1>+21,597M</h1>
            <div style={styles.analyticsStats}>
              <div>
                <p>HOPE</p>
                <p>$77568372</p>
              </div>
              <div>
                <p>Negligible</p>
                <p>1234 SS-14</p>
              </div>
            </div>
          </div>

          {/* Property Image */}
          <div style={styles.card}>
            <img
              src="https://via.placeholder.com/150"
              alt="Property"
              style={{ borderRadius: '10px', width: '100%', height: '100%' }}
            />
          </div>

          {/* Property Facts */}
          <div style={styles.card}>
            <h3>Property Facts</h3>
            <p style={styles.factNumber}>145 <span style={styles.factLabel}>Current Tenants</span></p>
            <p style={styles.factNumber}>1,349 <span style={styles.factLabel}>Out Of Contract</span></p>
          </div>

          {/* Property Analytics Chart (Mocked) */}
          <div style={styles.card}>
            <h3>Property Analytics</h3>
            <div style={styles.chartPlaceholder}>
              <div style={{ ...styles.bar, height: '100px' }}></div>
              <div style={{ ...styles.bar, height: '150px' }}></div>
              <div style={{ ...styles.bar, height: '80px' }}></div>
              <div style={{ ...styles.bar, height: '120px' }}></div>
            </div>
          </div>

          {/* Past Charting */}
          <div style={styles.card}>
            <h3>Past Charting</h3>
            <div style={styles.chartPlaceholder}>
              <div style={{ ...styles.bar, ...styles.peachBar, height: '80px' }}></div>
              <div style={{ ...styles.bar, ...styles.peachBar, height: '120px' }}></div>
              <div style={{ ...styles.bar, ...styles.peachBar, height: '60px' }}></div>
            </div>
          </div>

          {/* Posting Forces */}
          <div style={styles.card}>
            <h3>Posting Forces</h3>
            <div style={styles.forceItem}>
              <img
                src="https://via.placeholder.com/40"
                alt="User"
                style={styles.userImg}
              />
              <p>HeadBW</p>
              <p>113,770</p>
            </div>
            <div style={styles.forceItem}>
              <img
                src="https://via.placeholder.com/40"
                alt="User"
                style={styles.userImg}
              />
              <p>Connie</p>
              <p>54.20</p>
            </div>
          </div>

          {/* Property Tables */}
          <div style={styles.card}>
            <h3>Property Tables</h3>
            <img
              src="https://via.placeholder.com/150"
              alt="Property"
              style={{ borderRadius: '10px', width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Styles object
const styles = {
  app: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
    width: '60px',
    backgroundColor: '#e0e9e5', // Light green
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0',
  },
  sidebarLogo: {
    margin: '20px 0',
  },
  sidebarNav: {
    margin: '20px 0',
  },
  sidebarLogout: {
    margin: '20px 0',
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f8f7f5',
    overflowY: 'auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    marginBottom: '20px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  select: {
    marginRight: '10px',
    padding: '5px',
    border: 'none',
    backgroundColor: '#e0e9e5',
    borderRadius: '5px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  headerRightIcon: {
    marginLeft: '15px',
    color: '#4a6b5b', // Primary green
    cursor: 'pointer',
  },
  dashboard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  analyticsCard: {
    backgroundColor: '#4a6b5b', // Primary green
    color: '#ffffff',
  },
  analyticsStats: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  factNumber: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  factLabel: {
    fontSize: '14px',
    color: '#888',
  },
  chartPlaceholder: {
    display: 'flex',
    gap: '10px',
  },
  bar: {
    width: '20px',
    backgroundColor: '#4a6b5b', // Primary green
    borderRadius: '5px',
  },
  peachBar: {
    backgroundColor: '#f4d9c6', // Peach
  },
  forceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
  },
  userImg: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  },
};

export default App;