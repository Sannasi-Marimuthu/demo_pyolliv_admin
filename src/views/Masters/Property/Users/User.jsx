// import { Button, Col, Form, Input, Row, Select, Table } from 'antd'
// import FormItem from 'antd/es/form/FormItem'
// import React, { useEffect, useState } from 'react'
// import { api, validation } from '../../../../Axios/axios'
// import { useNavigate } from 'react-router-dom'
// import BackupTableIcon from '@mui/icons-material/BackupTable'
// import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
// import { EditOutlined } from '@ant-design/icons'
// import { toast, ToastContainer, Zoom } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'
// import '../../CSS/Master.css'

// export default function User() {
//   const PropertyCode = sessionStorage.getItem('propertyId')
//   const navigate = useNavigate()
//   const [username, setUsername] = useState('')
//   const [password, setPassword] = useState('')
//   const [email, setEmail] = useState('')
//   const [usertype, setUsertype] = useState('')
//   const [property, setProperty] = useState([])
//   const [viewTable, setViewTable] = useState(false)
//   const [viewForm, setViewForm] = useState(true)
//   const [newfile, setNewfile] = useState(false)
//   const [opentable, setOpentable] = useState(true)
//   const [isEditMode, setIsEditMode] = useState(false)
//   const [viewProperty, setViewProperty] = useState([])
//   const [viewUserProperty, setViewUserProperty] = useState([])
//   const [view, setView] = useState([])

//   const Mail = sessionStorage.getItem('Email')

//   // Create a new dataSource for the Table
//   const tableDataSource = view.map((user) => {
//     const userProperty = viewUserProperty.find((prop) => prop.Email === user.Email)
//     let displayName = 'Unknown'

//     if (userProperty) {
//       const propertyNames = Array.isArray(userProperty.PropertyName)
//         ? userProperty.PropertyName.map((code) => {
//             const match = viewProperty.find((item) => item.Propertycode === code)
//             return match ? match.Propertyname : null
//           }).filter((name) => name !== null)
//         : [
//             viewProperty.find((item) => item.Propertycode === userProperty.PropertyName)
//               ?.Propertyname,
//           ]

//       displayName = propertyNames.length > 0 ? propertyNames.join(', ') : 'Unknown'
//     }

//     return {
//       ...user,
//       UserName: displayName,
//     }
//   })

//   const columns = [
//     { title: 'Display Name', dataIndex: 'UserName', key: 'UserName' },
//     { title: 'User Type', dataIndex: 'UserType', key: 'UserType' },
//     { title: 'E-mail', dataIndex: 'Email', key: 'Email' },
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

//   // Fetch Usertype data
//   useEffect(() => {
//     if (PropertyCode == 0) {
//       api.getAll('get?type=Usertype').then((response) => {
//         setView(response.data)
//       })
//     } else {
//       api.getAll('get?type=Usertype').then((response) => {
//         const filteredData = response.data.filter((item) => item.Email == Mail)
//         console.log('filtered-Email', filteredData[0])
//         setView(filteredData)
//       })
//     }
//   }, [Mail, PropertyCode])

//   // Fetch Propertymaster data
//   useEffect(() => {
//     const fetchPropertyMaster = async () => {
//       try {
//         const response = await api.getAll('get?type=Propertymaster')
//         const data = response.data
//         console.log('data', data)
//         if (PropertyCode == 0) {
//           setViewProperty(data)
//         } else {
//           const filteredData = data.filter((item) => item.Propertycode == PropertyCode)
//           setViewProperty(filteredData)
//         }
//       } catch (error) {
//         toast.error('Error in getting Property Type')
//       }
//     }
//     fetchPropertyMaster()
//   }, [PropertyCode])

//   // Fetch Userproperty data
//   useEffect(() => {
//     const fetchUserProperty = async () => {
//       try {
//         const response = await api.getAll('get?type=Userproperty')
//         const data = response.data
//         const uniqueUserProperty = Array.from(
//           new Map(data.map((item) => [item.Email, item])).values(),
//         )
//         setViewUserProperty(uniqueUserProperty)
//       } catch (error) {
//         toast.error('Error in getting User Property')
//       }
//     }
//     fetchUserProperty()
//   }, [])

//   // Edit user
//   const editUser = (record) => {
//     const propertyNames = record.UserName.split(', ').filter((name) => name !== 'Unknown')
//     const propertyCodes = propertyNames
//       .map((name) => viewProperty.find((item) => item.Propertyname === name)?.Propertycode)
//       .filter((code) => code !== undefined)
//     setProperty(propertyCodes.length > 0 ? propertyCodes : [])
//     setPassword('*****')
//     setUsertype(record.UserType)
//     setEmail(record.Email)
//     sessionStorage.setItem('userId', record._id)
//   }

//   const resetFormDetails = () => {
//     setUsername('')
//     setPassword('')
//     setUsertype('')
//     setEmail('')
//     setProperty([])
//   }

//   const save = async () => {
//     try {
//       if (!password?.trim()) {
//         return toast.error('Password is required')
//       }
//       if (!usertype) {
//         return toast.error('User Type is required')
//       }
//       if (!email?.trim()) {
//         return toast.error('Email is required')
//       }
//       if (!property || (Array.isArray(property) && property.length === 0)) {
//         return toast.error('Property Name is required')
//       }

//       const userTypeData = {
//         type: 'Usertype',
//         UserName: Array.isArray(property)
//           ? property
//               .map((code) => viewProperty.find((item) => item.Propertycode === code)?.Propertyname)
//               .filter((name) => name !== undefined)
//               .join(', ') || 'Unknown User'
//           : viewProperty.find((item) => item.Propertycode === property)?.Propertyname ||
//             'Unknown User',
//         Password: password.trim(),
//         UserType: usertype,
//         Email: email.trim(),
//       }
//       const userTypeId = sessionStorage.getItem('userId')

//       const userPropertyData = {
//         type: 'Userproperty',
//         PropertyName: property,
//         Email: email.trim(),
//       }
//       const userPropertyId = sessionStorage.getItem('userPropertyId')

//       const apiCalls = []

//       apiCalls.push(
//         userTypeId
//           ? api.update(`update?id=${userTypeId}&type=Usertype`, userTypeData)
//           : api.create('post', userTypeData),
//       )

//       apiCalls.push(
//         userPropertyId
//           ? api.update(`update?id=${userPropertyId}&type=Userproperty`, userPropertyData)
//           : api.create('post', userPropertyData),
//       )

//       await Promise.all(apiCalls)

//       toast.success(userTypeId || userPropertyId ? 'Updated Successfully' : 'Created Successfully')

//       if (userTypeId) sessionStorage.removeItem('userId')
//       if (userPropertyId) sessionStorage.removeItem('userPropertyId')

//       resetFormDetails()
//       navigate(0)
//     } catch (error) {
//       console.error('Error in save:', error)
//       toast.error(error.response?.data?.message || 'Something went wrong. Please try again.')
//     }
//   }

//   function canceledit() {
//     sessionStorage.removeItem('userId')
//     resetFormDetails()
//     setIsEditMode(false)
//     setOpentable(true)
//   }

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
//                     Display Name<span>*</span>
//                   </p>
//                   <Select
//                     mode="multiple"
//                     value={property || undefined}
//                     className="inputbox"
//                     onChange={(value) => setProperty(value)}
//                     placeholder="Select Property Name"
//                     showSearch
//                     options={viewProperty.map((item) => ({
//                       value: item.Propertycode,
//                       label: item.Propertyname,
//                     }))}
//                     maxTagCount={1} // Shows only first 2 tags, rest as +x more
//                     maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
//                   />
//                 </div>
//               </div>
//               <div className="admin-col">
//                 <div className="inputs">
//                   <p className="responsive">
//                     E-Mail<span>*</span>
//                   </p>
//                   <Input
//                     type="email"
//                     value={email}
//                     className="inputbox"
//                     maxLength={25}
//                     onChange={(e) => {
//                       setEmail(e.target.value)
//                     }}
//                     rules={[{ required: true, message: 'E-mail is required' }]}
//                     required={false}
//                     placeholder="Enter E-mail"
//                   />
//                 </div>
//               </div>
//               <div className="admin-col">
//                 <div className="inputs">
//                   <p className="responsive">
//                     Password<span>*</span>
//                   </p>
//                   <Input
//                     type="password"
//                     value={password}
//                     className="inputbox"
//                     maxLength={25}
//                     onChange={(e) => {
//                       setPassword(e.target.value)
//                     }}
//                     rules={[{ required: true, message: 'Password is required' }]}
//                     required={false}
//                     placeholder="Enter Password"
//                   />
//                 </div>
//               </div>
//             </div>
//             <div className="admin-row">
//               <div className="admin-col">
//                 <div className="inputs">
//                   <p className="responsive">
//                     User Type<span>*</span>
//                   </p>
//                   <Select
//                     value={usertype || undefined}
//                     className="inputbox"
//                     onChange={(e) => {
//                       setUsertype(e)
//                     }}
//                     rules={[{ required: true, message: 'Please Select a UserType' }]}
//                     required={false}
//                     placeholder="Select User Type"
//                     showSearch
//                     options={[
//                       { value: 'Admin', label: 'Admin' },
//                       { value: 'Guest', label: 'Guest' },
//                     ]}
//                   />
//                 </div>
//               </div>
//               <div className="admin-col"></div>
//               <div className="admin-col"></div>
//             </div>
//             <FormItem className="button">
//               <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//                 {isEditMode && (
//                   <Button onClick={canceledit} className="cancel" style={{ marginLeft: '10px' }}>
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
//             pagination={{
//               pageSize: 10,
//             }}
//             dataSource={tableDataSource}
//             columns={columns}
//             bordered
//             className="custom-table"
//           />
//         </section>
//       )}
//     </div>
//   )
// }

import { Button, Col, Form, Input, Row, Select, Table } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import React, { useEffect, useState } from 'react'
import { api, validation } from '../../../../Axios/axios'
import { useNavigate } from 'react-router-dom'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos'
import { EditOutlined } from '@ant-design/icons'
import { toast, ToastContainer, Zoom } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '../../CSS/Master.css'

export default function User() {
  const PropertyCode = sessionStorage.getItem('propertyId')
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [usertype, setUsertype] = useState('')
  const [property, setProperty] = useState([])
  const [viewTable, setViewTable] = useState(false)
  const [viewForm, setViewForm] = useState(true)
  const [newfile, setNewfile] = useState(false)
  const [opentable, setOpentable] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [viewProperty, setViewProperty] = useState([])
  const [viewUserProperty, setViewUserProperty] = useState([])
  const [view, setView] = useState([])

  const Mail = sessionStorage.getItem('Email')

  // Create a new dataSource for the Table
  const tableDataSource = view.map((user) => {
    const userProperty = viewUserProperty.find((prop) => prop.Email === user.Email)
    let displayName = 'Unknown'

    if (userProperty) {
      const propertyNames = Array.isArray(userProperty.PropertyName)
        ? userProperty.PropertyName.map((code) => {
            const match = viewProperty.find((item) => item.Propertycode === code)
            return match ? match.Propertyname : null
          }).filter((name) => name !== null)
        : [
            viewProperty.find((item) => item.Propertycode === userProperty.PropertyName)
              ?.Propertyname,
          ]

      displayName = propertyNames.length > 0 ? propertyNames.join(', ') : 'Unknown'
    }

    return {
      ...user,
      UserName: displayName,
    }
  })

  const columns = [
    { title: 'Display Name', dataIndex: 'UserName', key: 'UserName' },
    { title: 'User Type', dataIndex: 'UserType', key: 'UserType' },
    { title: 'E-mail', dataIndex: 'Email', key: 'Email' },
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

  // Fetch Usertype data
  useEffect(() => {
    if (PropertyCode == 0) {
      api.getAll('get?type=Usertype').then((response) => {
        setView(response.data)
      })
    } else {
      api.getAll('get?type=Usertype').then((response) => {
        const filteredData = response.data.filter((item) => item.Email == Mail)
        console.log('filtered-Email', filteredData[0])
        setView(filteredData)
      })
    }
  }, [Mail, PropertyCode])

  // Fetch Propertymaster data
  useEffect(() => {
    const fetchPropertyMaster = async () => {
      try {
        const response = await api.getAll('get?type=Propertymaster')
        const data = response.data
        console.log('data', data)
        if (PropertyCode == 0) {
          setViewProperty(data)
        } else {
          const filteredData = data.filter((item) => item.Propertycode == PropertyCode)
          setViewProperty(filteredData)
        }
      } catch (error) {
        toast.error('Error in getting Property Type')
      }
    }
    fetchPropertyMaster()
  }, [PropertyCode])

  // Fetch Userproperty data
  useEffect(() => {
    const fetchUserProperty = async () => {
      try {
        const response = await api.getAll('get?type=Userproperty')
        const data = response.data
        const uniqueUserProperty = Array.from(
          new Map(data.map((item) => [item.Email, item])).values(),
        )
        setViewUserProperty(uniqueUserProperty)
      } catch (error) {
        toast.error('Error in getting User Property')
      }
    }
    fetchUserProperty()
  }, [])

  // Edit user
  const editUser = (record) => {
    const propertyNames = record.UserName.split(', ').filter((name) => name !== 'Unknown')
    const propertyCodes = propertyNames
      .map((name) => viewProperty.find((item) => item.Propertyname === name)?.Propertycode)
      .filter((code) => code !== undefined)
    setProperty(propertyCodes.length > 0 ? propertyCodes : [])
    setPassword('*****')
    setUsertype(record.UserType)
    setEmail(record.Email)
    sessionStorage.setItem('userId', record._id)
    const userProperty = viewUserProperty.find((prop) => prop.Email === record.Email)
    if (userProperty) {
      sessionStorage.setItem('userPropertyId', userProperty._id)
    }
  }

  const resetFormDetails = () => {
    setUsername('')
    setPassword('')
    setUsertype('')
    setEmail('')
    setProperty([])
  }

  const save = async () => {
    try {
      if (!password?.trim()) {
        return toast.error('Password is required')
      }
      if (!usertype) {
        return toast.error('User Type is required')
      }
      if (!email?.trim()) {
        return toast.error('Email is required')
      }
      if (!property || (Array.isArray(property) && property.length === 0)) {
        return toast.error('Property Name is required')
      }

      const userTypeData = {
        type: 'Usertype',
        UserName: Array.isArray(property)
          ? property
              .map((code) => viewProperty.find((item) => item.Propertycode === code)?.Propertyname)
              .filter((name) => name !== undefined)
              .join(', ') || 'Unknown User'
          : viewProperty.find((item) => item.Propertycode === property)?.Propertyname ||
            'Unknown User',
        Password: password.trim(),
        UserType: usertype,
        Email: email.trim(),
      }
      const userTypeId = sessionStorage.getItem('userId')

      const userPropertyData = {
        type: 'Userproperty',
        PropertyName: property,
        Email: email.trim(),
      }
      const userPropertyId = sessionStorage.getItem('userPropertyId')

      const apiCalls = []

      apiCalls.push(
        userTypeId
          ? api.update(`update?id=${userTypeId}&type=Usertype`, userTypeData)
          : api.create('post', userTypeData),
      )

      apiCalls.push(
        userPropertyId
          ? api.update(`update?id=${userPropertyId}&type=Userproperty`, userPropertyData)
          : api.create('post', userPropertyData),
      )

      await Promise.all(apiCalls)

      toast.success(userTypeId || userPropertyId ? 'Updated Successfully' : 'Created Successfully')

      if (userTypeId) sessionStorage.removeItem('userId')
      if (userPropertyId) sessionStorage.removeItem('userPropertyId')

      resetFormDetails()
      navigate(0)
    } catch (error) {
      console.error('Error in save:', error)
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.')
    }
  }

  function canceledit() {
    sessionStorage.removeItem('userId')
    sessionStorage.removeItem('userPropertyId')
    resetFormDetails()
    setIsEditMode(false)
    setOpentable(true)
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
                    Display Name<span>*</span>
                  </p>
                  <Select
                    mode="multiple"
                    value={property || undefined}
                    className="inputbox"
                    onChange={(value) => setProperty(value)}
                    placeholder="Select Property Name"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    maxTagCount={2}
                    maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
                    options={viewProperty.map((item) => ({
                      value: item.Propertycode,
                      label: item.Propertyname,
                    }))}
                  />
                </div>
              </div>
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">
                    E-Mail<span>*</span>
                  </p>
                  <Input
                    type="email"
                    value={email}
                    className="inputbox"
                    maxLength={25}
                    onChange={(e) => {
                      setEmail(e.target.value)
                    }}
                    rules={[{ required: true, message: 'E-mail is required' }]}
                    required={false}
                    placeholder="Enter E-mail"
                  />
                </div>
              </div>
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">
                    Password<span>*</span>
                  </p>
                  <Input
                    type="password"
                    value={password}
                    className="inputbox"
                    maxLength={25}
                    onChange={(e) => {
                      setPassword(e.target.value)
                    }}
                    rules={[{ required: true, message: 'Password is required' }]}
                    required={false}
                    placeholder="Enter Password"
                  />
                </div>
              </div>
            </div>
            <div className="admin-row">
              <div className="admin-col">
                <div className="inputs">
                  <p className="responsive">
                    User Type<span>*</span>
                  </p>
                  <Select
                    value={usertype || undefined}
                    className="inputbox"
                    onChange={(e) => {
                      setUsertype(e)
                    }}
                    rules={[{ required: true, message: 'Please Select a UserType' }]}
                    required={false}
                    placeholder="Select User Type"
                    showSearch
                    options={[
                      { value: 'Admin', label: 'Admin' },
                      { value: 'Guest', label: 'Guest' },
                    ]}
                  />
                </div>
              </div>
              <div className="admin-col"></div>
              <div className="admin-col"></div>
            </div>
            <FormItem className="button">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {isEditMode && (
                  <Button onClick={canceledit} className="cancel" style={{ marginLeft: '10px' }}>
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
            pagination={{
              pageSize: 10,
            }}
            dataSource={tableDataSource}
            columns={columns}
            bordered
            className="custom-table"
          />
        </section>
      )}
    </div>
  )
}
