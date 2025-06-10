// import React, { useEffect, useState } from 'react'
// import { Form, Table, Button, Select, Input, Row, Col } from 'antd'
// import BackupTableIcon from '@mui/icons-material/BackupTable'
// import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
// import { EditOutlined } from '@ant-design/icons'
// import '../../CSS/Master.css'
// import { toast, ToastContainer, Zoom } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import { api, validation } from '../../../../Axios/axios'
// import { useNavigate } from 'react-router-dom'

// export default function EmailMaster() {
//   const { Item: FormItem } = Form
//   const navigate = useNavigate()
//   const PropertyCode = sessionStorage.getItem('propertyId')

//   const [viewTable, setViewTable] = useState(false)
//   const [viewForm, setViewForm] = useState(true)
//   const [newfile, setNewfile] = useState(false)
//   const [opentable, setOpentable] = useState(true)

//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [port, setPort] = useState('')
//   const [host, setHost] = useState('')
//   const [secure, setSecure] = useState('')
//   const [status, setStatus] = useState('No')

//   const [isEditMode, setIsEditMode] = useState(false)

//   const columns = [
//     { title: 'Email', dataIndex: 'Email', key: 'Email' },
//     { title: 'Password', dataIndex: 'Password', key: 'Password' },
//     { title: 'Port', dataIndex: 'Port', key: 'Port' },
//     { title: 'Secure', dataIndex: 'Secure', key: 'Secure' },
//     {
//       title: 'Inactive',
//       dataIndex: 'Status',
//       key: 'Status',
//       render: (status) => (status == 1 ? 'No' : 'Yes'),
//     },
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

//   /////////////////////  POST  ////////////////////

//   const id = sessionStorage.getItem('RatePlanId')
//   const handlesubmit = () => {
//     try {
//       if (!email) {
//         return toast.error('Email is required')
//       }
//       if (!password) {
//         return toast.error('Password is required')
//       }
//       if (!port) {
//         return toast.error('Port is required')
//       }
//       // if (!secure) {
//       //   return toast.error('Secure is required')
//       // }

//       const Email = email?.toString().trim() || ''
//       const Password = password?.toString().trim() || ''
//       const Port = port?.toString().trim() || ''
//       if (Email.length && Password.length && Port.length === 0) {
//         return toast.error('Inputs cannot be empty or contain only spaces')
//       }

//       const EmailData = {
//         type: 'EmailMaster',
//         Email: email,
//         Password: password,
//         Port: port,
//         Secure: secure,
//         SMTPHost: 'smtp.gmail.com',
//         PropertyCode: PropertyCode,
//         Status: status === 'Yes' ? 0 : 1,
//       }

//       console.log(EmailData)

//       api
//         .create('post', EmailData)
//         .then(() => {
//           toast.success('Email Details Saved Successfully')
//           navigate(0)
//         })
//         .catch((error) => {
//           console.error(error)
//           toast.error(id ? error.response.data.message : error.response.data.message)
//         })
//     } catch (error) {
//       console.error('Unexpected error:', error)
//     }
//   }

//   ////////////////////  GET  /////////////////////

//   const [view, setView] = useState([])
//     useEffect(() => {
//       if (PropertyCode == 0) {
//         api
//           .getAll('get?type=EmailMaster')
//           .then((response) => {
//             setView(response.data)
//           })
//           .catch(() => {
//             toast.error('Error in getting Rate Plan')
//           })
//       } else {
//         api
//           .getAll('get?type=EmailMaster')
//           .then((response) => {
//             const filteredData = response.data.filter((item) => item.PropertyCode === PropertyCode)
//             setView(filteredData)
//           })
//           .catch(() => {
//             toast.error('Error in getting Rate Plan')
//           })
//       }
//     }, [])

//   ////////////////////  EDIT  /////////////////////////

//     const editUser = (record) => {
//       console.log(record)
//       setEmail(record.Email)
//       setPassword(record.Password)
//       setPort(record.Port)
//       setSecure(record.Secure === 'false' ? 'No (http)' : 'Yes (https)')
//       setStatus(record.Status === '1' ? 'No' : 'Yes')
//       sessionStorage.setItem('RatePlanId', record._id)
//     }

//     const resetFormDetails = () => {
//       setRates('')
//       setStatus('No')
//     }

//     const canceledit = () => {
//       sessionStorage.removeItem('RatePlanId')
//       navigate(0)
//     }

//   return (
//     <div>
//       <div className="tableicon">
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
//                     Email Id<span>*</span>
//                   </p>
//                   <Input
//                     maxLength={30}
//                     className="inputbox"
//                     placeholder="Enter Email Id"
//                     value={email}
//                     onChange={(e) => {
//                       validation.sanitizeEmail(e.target.value, setEmail)
//                     }}
//                   />
//                 </div>
//               </div>
//               <div className="admin-col">
//                 <div className="inputs">
//                   <p className="responsive">
//                     Password<span>*</span>
//                   </p>
//                   <Input
//                     maxLength={30}
//                     className="inputbox"
//                     placeholder="Enter Password"
//                     value={password}
//                     onChange={(e) => {
//                       setPassword(e.target.value)
//                     }}
//                   />
//                 </div>
//               </div>
//               <div className="admin-col">
//                 <div className="inputs">
//                   <p className="responsive">
//                     Port<span>*</span>
//                   </p>
//                   <Input
//                     maxLength={5}
//                     className="inputbox"
//                     placeholder="Enter Port Number"
//                     value={port}
//                     onChange={(e) => {
//                       validation.sanitizePhone(e.target.value, setPort)
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="admin-row">
//               <div className="admin-col">
//                 <div className="inputs">
//                   <p className="responsive">
//                     Secure<span>*</span>
//                   </p>
//                   <Select
//                     maxLength={30}
//                     className="inputbox"
//                     placeholder="Select Secure"
//                     value={secure || undefined}
//                     onChange={(e) => setSecure(e)}
//                     options={[
//                       { label: 'Yes (https)', value: true },
//                       { label: 'No (http)', value: false },
//                     ]}
//                   />
//                 </div>
//               </div>

//               <div className="admin-col">
//                 {isEditMode && (
//                   <div className="inputs">
//                     <p className="responsive">Inactive</p>{' '}
//                     <Select
//                       className="inputbox"
//                       showSearch
//                       placeholder="Select Yes or No"
//                       value={status}
//                       onChange={(value) => {
//                         setStatus(value)
//                       }}
//                       options={[
//                         { value: 'Yes', label: 'Yes' },
//                         { value: 'No', label: 'No' },
//                       ]}
//                     />
//                   </div>
//                 )}
//               </div>
//               <div className="admin-col">
//                 {/* <div className="inputs">
//                   <p className="responsive">SMTP Host</p>
//                   <Input
//                     maxLength={30}
//                     className="inputbox"
//                     placeholder="Select Host"
//                     value={host}
//                     onChange={(e) => {
//                       validation.sanitizeInput1(e.target.value, setHost)
//                     }}
//                   />
//                 </div> */}
//               </div>
//             </div>

//             <FormItem className={isEditMode ? 'button' : 'button'}>
//               <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                 {isEditMode && (
//                   <Button
//                     onClick={() => {
//                       canceledit()
//                       setOpentable(true)
//                       resetFormDetails()
//                       setIsEditMode(false)
//                     }}
//                     className="cancel"
//                   >
//                     CANCEL
//                   </Button>
//                 )}
//                 <Button onClick={handlesubmit} className="save">
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
