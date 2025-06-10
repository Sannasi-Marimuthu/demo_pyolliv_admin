import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify' // Assuming you're using react-toastify
import { api } from '../../../../Axios/axios'
 // Your API service

// Utility function to generate unique code
export const generateUniqueCode = (existingCodes = []) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code
  do {
    code = Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length)),
    ).join('')
  } while (existingCodes.includes(code))

  return code
}

export const generateUniqueRoom = (existingCodes = []) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code
  do {
    code = Array.from({ length: 6 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length)),
    ).join('')
  } while (existingCodes.includes(code))

  return code
}

const YourComponent = () => {
  const [viewproperty, setViewProperty] = useState([])
  const [viewroom, setViewRoom] = useState([])
  const [newPropertyCode, setNewPropertyCode] = useState('')
  const [newRoomCode, setNewRoomCode] = useState('')

  // Fetch properties on mount
  useEffect(() => {
    api
      .getAll('get?type=Propertymaster')
      .then((response) => {
        setViewProperty(response.data)
      })
      .catch(() => {
        toast.error('Error in getting Property Type')
      })
  }, [])

  // Fetch Room Types on mount
  useEffect(() => {
    api
      .getAll('get?type=Roomtype')
      .then((response) => {
        setViewRoom(response.data)
      })
      .catch(() => {
        toast.error('Error in getting Room Type')
      })
  }, [])

  // Function to generate a new unique Propertycode
  const handleGenerateCode = () => {
    // Extract existing Propertycodes from viewproperty
    const existingCodes = viewproperty.map((item) => item.Propertycode)

    // Generate a new unique code
    const uniqueCode = generateUniqueCode(existingCodes)
    setNewPropertyCode(uniqueCode)

    // Optional: Log or use the code as needed
    console.log('Generated Unique Propertycode:', uniqueCode)
  }

  // Function to generate a new unique RoomCode
  const handleGenerateRoom = () => {
    // Extract existing RoomCodes from viewroom
    const existingCodes = viewroom.map((item) => item.Roomcode)

    // Generate a new unique code
    const uniqueCode = generateUniqueRoom(existingCodes)
    setNewRoomCode(uniqueCode)

    // Optional: Log or use the code as needed
    console.log('Generated Unique Propertycode:', uniqueCode)
  }

  return (
    <div>
      <h1>Property List</h1>
      <button onClick={handleGenerateCode}>Generate New Property Code</button>
      {newPropertyCode && <p>New Property Code: {newPropertyCode}</p>}
      <ul>
        {viewproperty.map((property) => (
          <li key={property._id}>
            {property.Propertyname} - {property.Propertycode}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default YourComponent
