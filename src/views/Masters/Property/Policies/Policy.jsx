// import { Button, Select, Table } from 'antd'
// import FormItem from 'antd/es/form/FormItem'
// import React, { useEffect, useState } from 'react'
// import { api, validation } from '../../../../Axios/axios'
// import { useNavigate } from 'react-router-dom'
// import BackupTableIcon from '@mui/icons-material/BackupTable'
// import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
// import { EditOutlined } from '@ant-design/icons'
// import '../../CSS/Master.css'
// import { toast, ToastContainer, Zoom } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import TextArea from 'antd/es/input/TextArea'

// export default function Policy() {
//   const PropertyCode = sessionStorage.getItem('propertyId')

//   const navigate = useNavigate()
//   const [policy, setPolicy] = React.useState('')
//   // const [rules, setRules] = React.useState('')
//   const [policytype, setPolicyType] = React.useState('')
//   const [viewTable, setViewTable] = React.useState(false)
//   const [viewForm, setViewForm] = React.useState(true)
//   const [newfile, setNewfile] = React.useState(false)
//   const [opentable, setOpentable] = React.useState(true)
//   const [isEditMode, setIsEditMode] = React.useState(false)
//   // console.log('policy', policy)

//   // const handlechange = (e) => {
//   //   setPolicy(e)
//   //   console.log(e)
//   // }
//   const columns = [
//     { title: 'Policy', dataIndex: 'Policy', key: 'Policy' },
//     { title: 'Policy Type', dataIndex: 'PolicyType', key: 'PolicyType' },
//     // { title: 'House Rules', dataIndex: 'Rules', key: 'Rules' },
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

//   ///////////////////  GET  ////////////////////

//   //Policy Type
//   const [viewtype, setViewType] = useState([])
//   useEffect(() => {
//     api
//       .getAll('get?type=PolicyType')
//       .then((response) => {
//         setViewType(response.data)
//       })
//       .catch(() => {
//         toast.error('Error in getting Amenities Category')
//       })
//   }, [PropertyCode])

//   //Policy Master
//   const [view, setView] = useState([])
//   useEffect(() => {
//     api
//       .getAll('get?type=Policies')
//       .then((response) => {
//         if (PropertyCode == 0) {
//           setView(response.data)
//         }
//         else{
//           const filteredData = response.data.filter((item) => item.PropertyCode == PropertyCode)
//           setView(filteredData)
//         }
//       })
//       .catch(() => {
//         toast.error('Error in getting Amenities Category')
//       })
//   }, [PropertyCode])

//   /////////////////////  EDIT  ///////////////////////
//   const [editCode, setEditCode] = useState('')
//   const editUser = (record) => {
//     console.log('record', record)

//     setPolicy(record.Policy)
//     // setRules(record.Rules)
//     setPolicyType(record.PolicyType)
//     setEditCode(record.PropertyCode)
//     sessionStorage.setItem('PolicyId', record._id)
//   }
//   const resetFormDetails = () => {
//     setPolicy('')
//     // setRules('')
//     setPolicyType('')
//   }

//   ///////////////////////  POST  ///////////////////////

//   const id = sessionStorage.getItem('PolicyId')
//   const save = () => {
//     try {
//       if (!policy?.trim()) {
//         return toast.error('Policies is required')
//       }
//       if (!policytype) {
//         return toast.error('Policy Type is required')
//       }

//       const PolicyData = {
//         type: 'Policies',
//         Policy: policy.trim(),
//         PolicyType: policytype.trim(),
//         PropertyCode: id ? editCode : PropertyCode,
//       }
//       api
//         .create('post', PolicyData)
//         .then(() => {
//           toast.success('Policies Saved Successfully')
//           navigate(0)
//         })
//         .catch((error) => {
//           console.error(error)
//           toast.error(id ? error.response.data.message : error.response.data.message)
//         })
//     } catch (error) {
//       console.error('Unexpected error:', error)
//       toast.error('Something went wrong. Please try again.')
//     }
//   }

//   function canceledit() {
//     sessionStorage.removeItem('PolicyId')
//   }
//   const name = 'Wilton'
//   const [content, setContent] = useState('')

//   useEffect(() => {
//     setContent()
//   }, [name])

//   console.log('content', content)

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'end' }}>
//         {newfile && (
//           <h6
//             onClick={() => {
//               setViewForm(true)
//               setViewTable(false)
//               setNewfile(false)
//               setOpentable(true)
//             }}
//           >
//             <AddToPhotosIcon className="newtable1" />
//           </h6>
//         )}
//         {opentable && (
//           <h6
//             onClick={() => {
//               setViewForm(false)
//               setViewTable(true)
//               setNewfile(true)
//               setOpentable(false)
//             }}
//           >
//             <BackupTableIcon className="backuptable1" />
//           </h6>
//         )}
//       </div>
//       <div
//         className="style"
//         style={{
//           lineHeight: '3',
//           display: 'flex',
//           flexDirection: 'column',
//         }}
//       >
//         {viewForm && (
//           <div className="form">
//             <div className="admin-row">
//               <div className="admin-col">
//                 <div className="inputs">
//                   <p className="responsive">
//                     Policy Type<span>*</span>
//                   </p>
//                   <Select
//                     value={policytype || undefined}
//                     className="inputbox"
//                     onChange={(e) => setPolicyType(e)}
//                     placeholder="Select Policy Type"
//                     options={viewtype.map((item) => ({
//                       label: item.PolicyType,
//                       value: item.PolicyType,
//                     }))}
//                   />
//                 </div>
//               </div>

//               <div className="admin-col">
//                 <div className="inputs">
//                   <div className="description">
//                     <p className="responsive">
//                       Policies<span>*</span>
//                     </p>
//                     {/* <span className="descriptionlength">{policy.length}/{200}</span> */}
//                   </div>

//                   <TextArea
//                     // maxLength={200}
//                     value={policy}
//                     onChange={(e) => {
//                       setPolicy(e.target.value)
//                     }}
//                     // onChange={(e) => {
//                     //   validation.sanitizeDescription(e.target.value, setPolicy)
//                     // }}
//                     className="inputbox"
//                     placeholder="Enter Description"
//                     autoSize={{
//                       minRows: 1,
//                     }}
//                   />
//                 </div>
//               </div>
//               <div className="admin-col"></div>
//             </div>
//             <div className="admin-row-policies">
//               <div className="admin-col-policies">
//                 <p className="policies-example">
//                   Policies Example usage: (After every point press enter)
//                 </p>
//                 <p className="policies-example">
//                   Full refund if canceled 24-48 hours before check-in
//                 </p>
//                 <p className="policies-example">
//                   Partial refund (50%) if cancelled within 24 hours
//                 </p>
//               </div>
//             </div>
//             <FormItem className="button1">
//               <div>
//                 {isEditMode && (
//                   <Button
//                     onClick={() => {
//                       canceledit()
//                       resetFormDetails()
//                       setOpentable(true)
//                       setIsEditMode(false)
//                     }}
//                     className="cancel"
//                     style={{ marginLeft: '10px' }}
//                   >
//                     CANCEL
//                   </Button>
//                 )}
//                 <Button onClick={save} className="save">
//                   {isEditMode ? 'UPDATE' : 'SAVE'}
//                 </Button>
//               </div>
//               <ToastContainer
//                 position="top-center"
//                 autoClose={500}
//                 hideProgressBar
//                 newestOnTop={false}
//                 closeOnClick={false}
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme="light"
//                 transition={Zoom}
//               />
//             </FormItem>
//           </div>
//         )}
//       </div>
//       {viewTable && (
//         <section className="showtable">
//           <Table
//             value={viewTable}
//             pagination={{
//               pageSize: 10,
//             }}
//             dataSource={view}
//             columns={columns}
//             bordered
//             className="custom-table"
//           />
//         </section>
//       )}
//     </div>
//   )
// }

import { Button, Select, Table } from 'antd'
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

export default function Policy() {
  const PropertyCode = sessionStorage.getItem('propertyId')
  const navigate = useNavigate()
  const [policy, setPolicy] = useState('')
  const [policytype, setPolicyType] = useState('')
  const [viewTable, setViewTable] = useState(false)
  const [viewForm, setViewForm] = useState(true)
  const [newfile, setNewfile] = useState(false)
  const [opentable, setOpentable] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)

  const columns = [
    { title: 'Policy', dataIndex: 'Policy', key: 'Policy' },
    { title: 'Policy Type', dataIndex: 'PolicyType', key: 'PolicyType' },
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

  // Policy Type
  const [viewtype, setViewType] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=PolicyType')
      .then((response) => {
        setViewType(response.data)
      })
      .catch(() => {
        toast.error('Error in getting Policy Types')
      })
  }, [PropertyCode])

  // Policy Master
  const [view, setView] = useState([])
  useEffect(() => {
    api
      .getAll('get?type=Policies')
      .then((response) => {
        if (PropertyCode == 0) {
          setView(response.data)
        } else {
          const filteredData = response.data.filter((item) => item.PropertyCode == PropertyCode)
          setView(filteredData)
        }
      })
      .catch(() => {
        toast.error('Error in getting Policies')
      })
  }, [PropertyCode])

  // Handle Policy Type Change
  const handlePolicyTypeChange = (selectedPolicyType) => {
    setPolicyType(selectedPolicyType)
    // Only auto-fill if PropertyCode is not 0 and not in edit mode
    if (PropertyCode != 0 && !isEditMode) {
      // Find policies for the selected policy type
      const matchedPolicy = view.find((item) => item.PolicyType === selectedPolicyType)
      if (matchedPolicy) {
        setPolicy(matchedPolicy.Policy) // Auto-fill the policy field
      } else {
        setPolicy('') // Clear the policy field if no matching policy
      }
    } else {
      setPolicy('') // Clear the policy field if PropertyCode is 0 or in edit mode
    }
  }

  // Edit User
  const [editCode, setEditCode] = useState('')
  const editUser = (record) => {
    setPolicy(record.Policy)
    setPolicyType(record.PolicyType)
    setEditCode(record.PropertyCode)
    sessionStorage.setItem('PolicyId', record._id)
  }

  const resetFormDetails = () => {
    setPolicy('')
    setPolicyType('')
  }

  // Save Policy
  const id = sessionStorage.getItem('PolicyId')
  const save = () => {
    try {
      if (!policy?.trim()) {
        return toast.error('Policies is required')
      }
      if (!policytype) {
        return toast.error('Policy Type is required')
      }

      const PolicyData = {
        type: 'Policies',
        Policy: policy.trim(),
        PolicyType: policytype.trim(),
        PropertyCode: id ? editCode : PropertyCode,
      }
      api
        .create('post', PolicyData)
        .then(() => {
          toast.success('Policies Saved Successfully')
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
    sessionStorage.removeItem('PolicyId')
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
                  <p className="responsive">
                    Policy Type<span>*</span>
                  </p>
                  <Select
                    value={policytype || undefined}
                    className="inputbox"
                    onChange={handlePolicyTypeChange}
                    placeholder="Select Policy Type"
                    options={viewtype.map((item) => ({
                      label: item.PolicyType,
                      value: item.PolicyType,
                    }))}
                  />
                </div>
              </div>

              <div className="admin-col">
                <div className="inputs">
                  <div className="description">
                    <p className="responsive">
                      Policies<span>*</span>
                    </p>
                  </div>
                  <TextArea
                    value={policy}
                    onChange={(e) => {
                      setPolicy(e.target.value)
                    }}
                    className="inputbox"
                    placeholder="Enter Description"
                    autoSize={{
                      minRows: 1,
                    }}
                  />
                </div>
              </div>
              <div className="admin-col"></div>
            </div>
            <div className="admin-row-policies">
              <div className="admin-col-policies">
                <p className="policies-example">
                  Policies Example usage: (After every point press enter)
                </p>
                <p className="policies-example">
                  Full refund if canceled 24-48 hours before check-in
                </p>
                <p className="policies-example">
                  Partial refund (50%) if cancelled within 24 hours
                </p>
              </div>
            </div>
            <FormItem className="button1">
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
