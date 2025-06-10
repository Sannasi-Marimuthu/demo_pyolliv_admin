import { Button, Input, Select, Table } from 'antd'
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
import TextArea from 'antd/es/input/TextArea'

export default function Ratings() {
  const PropertyCode = sessionStorage.getItem('propertyId')

  const navigate = useNavigate()
  const [rating, setRating] = React.useState('')
  const [reviews, setReviews] = React.useState('')
  const [viewTable, setViewTable] = React.useState(false)
  const [viewForm, setViewForm] = React.useState(true)
  const [newfile, setNewfile] = React.useState(false)
  const [opentable, setOpentable] = React.useState(true)
  const [isEditMode, setIsEditMode] = React.useState(false)

  const columns = [
    {
      title: 'Ratings',
      dataIndex: 'Ratings',
      key: 'Ratings',
      render: (rating) => {
        const totalStars = 5
        return (
          <span>
            {'★'.repeat(rating)}
            {'☆'.repeat(totalStars - rating)}
          </span>
        )
      },
    },
    { title: 'Reviews', dataIndex: 'Reviews', key: 'Reviews' },
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

  ///////////////////  GET  ////////////////////

  //Ratings Number Type
  const [ratingsNumber, setRatingsNumber] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=RatingsNumber')
      .then((response) => {
        setRatingsNumber(response.data)
      })
      .catch(() => {
        toast.error('Error in getting Amenities Category')
      })
  }, [])

  //Rating & Reviews Master
  const [view, setView] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=Ratings&Reviews')
      .then((response) => {
        setView(response.data)
      })
      .catch(() => {
        toast.error('Error in getting Amenities Category')
      })
  }, [PropertyCode])

  /////////////////////  EDIT  ///////////////////////

  const editUser = (record) => {
    setRating(record.Ratings)
    setReviews(record.Reviews)
    sessionStorage.setItem('RatingId', record._id)
  }
  const resetFormDetails = () => {
    setRating('')
    setReviews('')
  }

  ///////////////////////  POST  ///////////////////////

  const id = sessionStorage.getItem('RatingId')
  const save = () => {
    try {
      if (!reviews?.trim()) {
        return toast.error('Reviews is required')
      }

      const RatingsData = {
        type: 'Ratings&Reviews',
        Ratings: rating,
        Reviews: reviews.trim(),
        PropertyCode: PropertyCode,
      }
      const RatingsData1 = {
        Ratings: rating,
        Reviews: reviews.trim(),
      }

      const apiCall = id
        ? api.update(`update?id=${id}&type=Ratings`, RatingsData1)
        : api.create('post', RatingsData)

      apiCall
        .then(() => {
          toast.success(id ? 'Updated Successfully' : 'Created Successfully')
          if (id) sessionStorage.removeItem('RatingId')
          navigate(0)
        })
        .catch((error) => {
          console.error(error)
          toast.error(id ? error.response.data.message : error.response.data.message)
        })
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('Something went wrong. Please try again.')
    }
  }

  function canceledit() {
    sessionStorage.removeItem('RatingId')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'end' }}>
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
                  <p className="responsive">Ratings</p>
                  <Select
                    value={rating || undefined}
                    className="inputbox"
                    onChange={(e) => setRating(e)}
                    required={false}
                    placeholder="Select Ratings"
                    options={ratingsNumber.map((item) => ({
                      value: item.Rating,
                      label: item.Rating,
                    }))}
                  />
                </div>
              </div>

              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">Reviews</p>
                  <TextArea
                    value={reviews}
                    className="inputbox"
                    autoSize={{ minRows: 1 }}
                    onChange={(e) => {
                      setReviews(e.target.value)
                    }}
                    required={false}
                    placeholder="Enter Reviews"
                  />
                </div>
              </div>
              <div className="admin-col"></div>
            </div>
            <FormItem className="button1">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isEditMode && (
                  <Button
                    onClick={() => {
                      canceledit()
                      resetFormDetails()
                      setOpentable(true)
                      setIsEditMode(false)
                    }}
                    className="cancel"
                    style={{ marginLeft: '10px' }}
                  >
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
