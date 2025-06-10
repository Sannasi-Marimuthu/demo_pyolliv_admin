import React, { useEffect, useState } from 'react'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import { api } from '../../../../Axios/axios'
import FormItem from 'antd/es/form/FormItem'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'

function AmenitiesMaster() {
  const navigate = useNavigate()
  const PropertyCode = sessionStorage.getItem('propertyId')

  const [amenitiesList, setAmenitiesList] = useState('')
  const [selectedItem, setSelectedItem] = useState('')

  ////////////////////// GET /////////////////////

  // Amenities Category
  const [amenitiesCategory, setAmenitiesCategory] = useState([])
  useEffect(() => {
    api.getAll('get?type=AmenitiesCategory').then((response) => {
      setAmenitiesCategory(response.data)
    })
    // .catch(() => {
    //   toast.error('Error in getting Amenities Category')
    // })
  }, [])

  const [amenitiesCategory1, setAmenitiesCategory1] = useState([])
  useEffect(() => {
    api.getAll('get?type=AmenitiesCategory').then((response) => {
      const filteredData = response.data.filter((item) => {
        return item.AmenitiesCategory == amenitiesList
      })
      setAmenitiesCategory1(filteredData)
      console.log('filter1', filteredData)
    })
  }, [amenitiesList])

  // Amenities
  const [amenity, setAminity] = useState([])
  useEffect(() => {
    api.getAll('get?type=Amenities').then((response) => {
      const filteredData = response.data.filter((item) => {
        return item.AmenitiesCategory == amenitiesCategory1[0].AmenitiesCategoryId
      })
      setAminity(filteredData)
      console.log('filter2', filteredData)
    })
  }, [amenitiesCategory1])

  const [selectedOptions, setSelectedOptions] = useState({})

  console.log('yes', selectedOptions)

  // Amenities Master
  // const [amenitiesMaster, setAmenitiesMaster] = useState([])
  useEffect(() => {
    api.getAll('get?type=AmenitiesMaster').then((response) => {
      const filteredData = response.data.find((item) => item.PropertyCode == PropertyCode)
      console.log('AmenitiesMaster', filteredData)

      if (filteredData) {
        const {  _id, __v, ...amenitiesSelections } = filteredData // Extract only amenities
        setSelectedOptions(amenitiesSelections) // Prefill Yes/No options
      }
    })
  }, [PropertyCode])

  ///////////////////// POST ////////////////////
  const save = () => {
    try {
      console.log('selectedOptions', selectedOptions)
      api
        .create('post', selectedOptions)
        .then(() => {
          toast.success('Saved Successfully')
          navigate(0)
        })
        .catch((err) => {
          console.log(err)
          toast.error('Post Failed')
        })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (amenitiesCategory.length > 0) {
      setSelectedItem(amenitiesCategory[0].AmenitiesCategory)
      setAmenitiesList(amenitiesCategory[0].AmenitiesCategory)
    }
  }, [amenitiesCategory])

  const handleSelection = (index, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [index]: value,
      PropertyCode,
      type: 'AmenitiesMaster',
    }))
  }

  return (
    <div>
      <div className="tableicon">{/* <h3 className="heading">Amenities Master</h3> */}</div>
      <section className="section-1">
        <div className="section-one">
          <ul className="amenitiesul">
            {amenitiesCategory.map((item, index) => (
              <li
                onClick={(e) => {
                  setAmenitiesList(e.target.textContent)
                  setSelectedItem(item.AmenitiesCategory)
                }}
                key={index}
                className={`amenitiesli ${selectedItem === item.AmenitiesCategory ? 'selected' : ''}`}
              >
                {item.AmenitiesCategory}
              </li>
            ))}
          </ul>
        </div>
        <div className="section-two">
          <ul className="amenitiesul1">
            {amenity.map((item, index) => (
              <li key={index} className="amenitiesli1">
                <div>
                  <p className="amenityname">{item.Amenities}</p>
                </div>

                <div className="amenitybuttons">
                  {/* No Button */}
                  <div
                    className={`amenitybutton1 ${selectedOptions[item.Amenities] === 'no' ? 'selected' : ''}`}
                    onClick={() => handleSelection(item.Amenities, 'no')}
                  >
                    <div className="amenitybutton">
                      <input
                        type="radio"
                        name={`amenity-${item.Amenities}`}
                        checked={selectedOptions[item.Amenities] === 'no'}
                        onChange={() => handleSelection(item.Amenities, 'no')}
                      />
                      <p>No</p>
                    </div>
                  </div>

                  {/* Yes Button */}
                  <div
                    className={`amenitybutton1 ${selectedOptions[item.Amenities] === 'yes' ? 'selected' : ''}`}
                    onClick={() => handleSelection(item.Amenities, 'yes')}
                  >
                    <div className="amenitybutton">
                      <input
                        type="radio"
                        name={`amenity-${item.Amenities}`}
                        checked={selectedOptions[item.Amenities] === 'yes'}
                        onChange={() => handleSelection(item.Amenities, 'yes')}
                      />
                      <p>Yes</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <FormItem className="buttonamenity">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button onClick={save} className="save">
            SAVE
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
  )
}

export default AmenitiesMaster
