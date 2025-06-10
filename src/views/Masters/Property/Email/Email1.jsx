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
  const [policy, setPolicy] = useState('')
  const [templatetype, setTemplateType] = useState('')
  const [templatename, setTemplateName] = useState('')
  const [viewTable, setViewTable] = useState(false)
  const [viewForm, setViewForm] = useState(true)
  const [newfile, setNewfile] = useState(false)
  const [opentable, setOpentable] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [viewtype, setViewType] = useState([])
  const [view, setView] = useState([])
  const [content, setContent] = useState('<p>Dear <strong>Wilton</strong></p><br/>')
  const quillRef = useRef(null)
  const [openeye, setOpenEye] = useState(false)

  useEffect(() => {
    api
      .getAll('get?type=TemplateType')
      .then((response) => {
        setViewType(response.data)
      })
      .catch(() => {
        toast.error('Error in getting Template Type')
      })

    api
      .getAll('get?type=Policies')
      .then((response) => {
        setView(response.data)
      })
      .catch(() => {
        toast.error('Error in getting Policies')
      })
  }, [PropertyCode])

  const modules = {
    toolbar: {
      container: [
        [{ font: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline'],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        [{ table: 'insert' }], // Custom table button
        ['clean'],
      ],
      handlers: {
        table: function () {
          insertTable()
        },
      },
    },
  }

  // Function to insert a table at the cursor position
  const insertTable = () => {
    const quill = quillRef.current.getEditor()
    const range = quill.getSelection(true) // Force selection
    const tableHTML = `
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Row 1, Cell 1</td>
            <td>Row 1, Cell 2</td>
          </tr>
          <tr>
            <td>Row 2, Cell 1</td>
            <td>Row 2, Cell 2</td>
          </tr>
        </tbody>
      </table>
    `
    quill.clipboard.dangerouslyPasteHTML(range.index, tableHTML)
    setContent(quill.root.innerHTML) // Update content state
  }

  const insertTextAtCursor = (text) => {
    const quill = quillRef.current.getEditor()
    const range = quill.getSelection() || { index: quill.getLength(), length: 0 }
    quill.insertText(range.index, text)
    quill.setSelection(range.index + text.length)
    setContent(quill.root.innerHTML)
    setOpenEye(false)
  }

  const save = () => {
    if (!templatename) return toast.error('Template Name is required')
    if (!templatetype) return toast.error('Template Type is required')

    const EmailData = {
      type: 'Email',
      TemplateName: templatename.trim(),
      TemplateType: templatetype.trim(),
      Content: content,
    }

    api
      .create('post', EmailData)
      .then(() => {
        toast.success('Email Saved Successfully')
        navigate(0)
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || 'Something went wrong')
      })
  }

  const resetFormDetails = () => {
    setPolicy('')
    setTemplateType('')
    setTemplateName('')
    setContent('')
  }

  const eye = () => setOpenEye((prev) => !prev)

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
      <div className="style" style={{ lineHeight: '3', display: 'flex', flexDirection: 'column' }}>
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
                  {/* Add other tags as in your original code */}
                </ul>
              )}
            </div>
            <FormItem className="button">
              <div>
                {isEditMode && (
                  <Button
                    onClick={() => {
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
            pagination={{ pageSize: 10 }}
            dataSource={view}
            columns={[
              { title: 'Policy', dataIndex: 'Policy', key: 'Policy' },
              { title: 'Template Type', dataIndex: 'PolicyType', key: 'PolicyType' },
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
                    Edit
                  </Button>
                ),
              },
            ]}
            bordered
            className="custom-table"
          />
        </section>
      )}
    </div>
  )
}
