import { Button, Input, Select, Table } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import React, { useEffect, useRef, useState } from 'react'
import { api } from '../../../../Axios/axios'
import { Link, useNavigate } from 'react-router-dom'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import '../../CSS/Master.css'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { BiShowAlt } from 'react-icons/bi'

export default function Email() {
  const PropertyCode = sessionStorage.getItem('propertyId')

  const navigate = useNavigate()
  const [policy, setPolicy] = React.useState('')
  // const [rules, setRules] = React.useState('')
  const [templatetype, setTemplateType] = React.useState('')
  const [templatename, setTemplateName] = React.useState('')
  const [viewTable, setViewTable] = React.useState(false)
  const [viewForm, setViewForm] = React.useState(true)
  const [newfile, setNewfile] = React.useState(false)
  const [opentable, setOpentable] = React.useState(false)
  const [isEditMode, setIsEditMode] = React.useState(false)
  // console.log('policy', policy)

  const handlechange = (e) => {
    setPolicy(e)
    console.log(e)
  }
  //   const columns = [
  //     { title: 'Policy', dataIndex: 'Policy', key: 'Policy' },
  //     { title: 'Template Type', dataIndex: 'PolicyType', key: 'PolicyType' },
  //     {
  //       title: 'Action',
  //       dataIndex: 'Action',
  //       key: 'Action',
  //       render: (_, record) => (
  //         <Button
  //           type="primary"
  //           onClick={() => {
  //             editUser(record)
  //             setViewForm(true)
  //             setViewTable(false)
  //             setNewfile(false)
  //             setIsEditMode(true)
  //           }}
  //         >
  //           <EditOutlined />
  //         </Button>
  //       ),
  //     },
  //   ]

  ///////////////////  GET  ////////////////////

  //Policy Type

  const [viewtype, setViewType] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=TemplateType')
      .then((response) => {
        setViewType(response.data)
      })
      .catch(() => {
        toast.error('Error in getting Template Type')
      })
  }, [PropertyCode])

  //Policy Master
  const [view, setView] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=Policies')
      .then((response) => {
        setView(response.data)
      })
      .catch(() => {
        toast.error('Error in getting Amenities Category')
      })
  }, [PropertyCode])

  /////////////////////  EDIT  ///////////////////////

  const editUser = (record) => {
    setPolicy(record.Policy)
    // setRules(record.Rules)
    setTemplateType(record.PolicyType)
    // sessionStorage.setItem('PolicyId', record._id)
  }
  const resetFormDetails = () => {
    setPolicy('')
    // setRules('')
    setTemplateType('')
  }

  ///////////////////////  POST  ///////////////////////

  // const id = sessionStorage.getItem('PolicyId')
  const save = () => {
    try {
      if (!templatename) {
        return toast.error('Template Name is required')
      }
      if (!templatetype) {
        return toast.error('Template Type is required')
      }

      const EmailData = {
        type: 'Email',
        PropertyCode: PropertyCode,
        TemplateName: templatename.trim(),
        TemplateType: templatetype.trim(),
        Content: `${content}`,
      }

      api
        .create('post', EmailData)
        .then(() => {
          toast.success('Email Saved Successfully')
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
    // sessionStorage.removeItem('PolicyId')
  }

  const name = 'Wilton'
  const [content, setContent] = useState('<name>')

  // useEffect(() => {
  //   setContent(`
  //     <div class="content">
  //             <p>Dear <strong>${name}</strong></p></br>

  //             <p>For any queries, feel free to contact us at
  //                 <a href="mailto:support@company.com" style="color: #007bff;">support@company.com</a>.
  //             </p>

  //             <p>We look forward to welcoming you!</p>

  //             <a href="{{booking_link}}" class="button">View Booking Details</a>
  //         </div>
  //   `)
  // }, [name])

  console.log('content', content)
  const quillRef = useRef(null) // Reference to ReactQuill

  const modules = {
    toolbar: [
      [{ font: [] }], // Font family
      [{ size: ['small', false, 'large', 'huge'] }], // Font sizes
      [{ bold: true }, { italic: true }, { underline: true }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ link: true }, { image: true }], // Image support
      ['clean'],
    ],
  }
  const [openeye, setOpenEye] = useState(false)
  const eye = () => {
    setOpenEye((prevState) => !prevState)
  }

  // Function to insert text at cursor position
  const insertTextAtCursor = (text) => {
    if (!quillRef.current) {
      console.error('Quill editor is not ready yet.')
      return
    }

    const quill = quillRef.current.getEditor() // Get Quill instance safely
    if (!quill) {
      console.error('Quill instance not found.')
      return
    }

    // Force focus before getting selection
    quill.focus()

    let range = quill.getSelection() // Get current cursor position
    console.log('Selected Range:', range)

    if (!range) {
      console.warn('Cursor is not inside the editor. Setting cursor to the end.')
      range = { index: quill.getLength(), length: 0 } // Move to end if no selection
    }

    console.log('Inserting text:', text)

    quill.insertText(range.index, text) // Insert text at cursor position
    quill.setSelection(range.index + text.length) // Move cursor forward

    // Update React state to reflect changes
    setContent(quill.root.innerHTML)

    setOpenEye(false) // Close dropdown after selection
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
                  <p className="responsive">Template Name</p>
                  <Input
                    value={templatename || undefined}
                    className="inputbox"
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter Template Name"
                  />
                </div>
              </div>
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">Template Type</p>
                  <Select
                    value={templatetype || undefined}
                    className="inputbox"
                    onChange={(e) => setTemplateType(e)}
                    placeholder="Select Template Type"
                    options={viewtype.map((item) => ({
                      label: item.TemplateName,
                      value: item.TemplateName,
                    }))}
                  />
                </div>
              </div>
              <div className="admin-col"></div>
            </div>
            <div className="policydiv">
              <ReactQuill
                ref={quillRef}
                value={content}
                onChange={setContent}
                modules={modules}
                className="Policy"
              />
              <div className="policyeye" onClick={eye}>
                <BiShowAlt />
                <span className="policydrop">Tags</span>
              </div>
              {openeye && (
                <ul className={`emaildrop ${openeye ? 'show' : ''}`}>
                  <li onClick={() => insertTextAtCursor('${Name}')} className="emaildropli">
                    <span className="emaildropli1">Guest Name</span>
                  </li>
                  <li onClick={() => insertTextAtCursor('${Booking Id}')} className="emaildropli">
                    <span className="emaildropli1">Booking Id</span>
                  </li>
                  <li
                    onClick={() => insertTextAtCursor('${Reservation Number}')}
                    className="emaildropli"
                  >
                    <span className="emaildropli1">Reservation Number</span>
                  </li>
                  <li
                    onClick={() => insertTextAtCursor('${Property Name}')}
                    className="emaildropli"
                  >
                    <span className="emaildropli1">Property Name</span>
                  </li>
                  <li onClick={() => insertTextAtCursor('${Arrival Date}')} className="emaildropli">
                    <span className="emaildropli1">Arrival Date</span>
                  </li>
                  <li onClick={() => insertTextAtCursor('${Arrival Time}')} className="emaildropli">
                    <span className="emaildropli1">Arrival Time</span>
                  </li>
                  <li
                    onClick={() => insertTextAtCursor('${Departure Date}')}
                    className="emaildropli"
                  >
                    <span className="emaildropli1">Departure Date</span>
                  </li>
                  <li
                    onClick={() => insertTextAtCursor('${Departure Time}')}
                    className="emaildropli"
                  >
                    <span className="emaildropli1">Departure Time</span>
                  </li>
                  <li
                    onClick={() => insertTextAtCursor('${Number of Rooms}')}
                    className="emaildropli"
                  >
                    <span className="emaildropli1">No.of Rooms</span>
                  </li>
                  <li
                    onClick={() => insertTextAtCursor('${Number of Guests}')}
                    className="emaildropli"
                  >
                    <span className="emaildropli1">Number of Pax</span>
                  </li>

                  <li onClick={() => insertTextAtCursor('${Room Type}')} className="emaildropli">
                    <span className="emaildropli1">Room Type</span>
                  </li>
                  <li onClick={() => insertTextAtCursor('${Rate Plan}')} className="emaildropli">
                    <span className="emaildropli1">Rate Plan</span>
                  </li>
                  {/* <li
                    onClick={() => insertTextAtCursor('${Rate Plan Per Day}')}
                    className="emaildropli"
                  >
                    <span className="emaildropli1">Rate Plan Per Day</span>
                  </li> */}
                  <li onClick={() => insertTextAtCursor('${Tarrif}')} className="emaildropli">
                    <span className="emaildropli1">Tarrif</span>
                  </li>
                  <li onClick={() => insertTextAtCursor('${Total Price}')} className="emaildropli">
                    <span className="emaildropli1">Total Amount</span>
                  </li>
                </ul>
              )}
            </div>

            <FormItem className="button">
              <div>
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
