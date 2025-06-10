import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../../src/views/Masters/CSS/Master.css'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem, CHeaderNav } from '@coreui/react'
import { api } from '../Axios/axios'
import { Select } from 'antd'
import { AppHeaderDropdown } from './header'

const AppBreadcrumb = () => {
  // const navigate = useNavigate()
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  // const [isvisible, setIsVisible] = useState(true)

  // // User Property
  // const Mail = sessionStorage.getItem('Email')
  // const Propertycode = sessionStorage.getItem('propertyId')

  // const [userproperty, setUserProperty] = useState([])
  // useEffect(() => {
  //   if (Propertycode == 0) {
  //     api.getAll('get?type=Userproperty').then((response) => {
  //       setUserProperty(response.data)
  //       console.log(response.data)
  //     })
  //   } else {
  //     api
  //       .getAll('get?type=Userproperty')
  //       .then((response) => {
  //         const filtereddata = response.data.filter((item) => item.Email == Mail)
  //         setUserProperty(filtereddata[0])
  //       })
  //       .catch(() => {
  //         toast.error('Error in getting User Property')
  //       })
  //   }
  // }, [])

  // const Admin = sessionStorage.getItem('Admin')
  // const [property, setProperty] = useState([])
  // useEffect(() => {
  //   if (Admin == 1) {
  //     api.getAll('get?type=Propertymaster').then((response) => {
  //       setProperty(response.data)
  //       console.log('filter', filteredData)
  //     })
  //   } else {
  //     api.getAll('get?type=Propertymaster').then((response) => {
  //       const filteredData = response.data.filter((item) =>
  //         userproperty.PropertyName.some(
  //           (prop) => prop.trim().toLowerCase() === item.Propertyname.trim().toLowerCase(),
  //         ),
  //       )
  //       setProperty(filteredData)
  //       console.log('filter', filteredData)
  //     })
  //   }
  // }, [userproperty])

  // const [code, setCode] = useState(sessionStorage.getItem('propertyId'))

  // const handleSelectChange = (value) => {
  //   setCode(value)
  //   sessionStorage.setItem('propertyId', value)
  //   navigate(0)
  // }

  /////////// From Header 1///////////////

  ///////////////////////////////////////

  const navigate = useNavigate()
  const [isvisible, setIsVisible] = useState(true)

  const Mail = sessionStorage.getItem('Email')
  const Propertycode = sessionStorage.getItem('propertyId')
  const Admin = sessionStorage.getItem('Admin')

  const [userproperty, setUserProperty] = useState([])
  useEffect(() => {
    if (Propertycode == 0) {
      api.getAll('get?type=Userproperty').then((response) => {
        setUserProperty(response.data)
        console.log(response.data)
      })
    } else {
      api
        .getAll('get?type=Userproperty')
        .then((response) => {
          const filtereddata = response.data.filter((item) => item.Email == Mail)
          setUserProperty(filtereddata[0])
          console.log('setUserProperty', filtereddata[0])
        })
        .catch(() => {
          toast.error('Error in getting User Property')
        })
    }
  }, [Propertycode, Mail, Admin])

  const [property, setProperty] = useState([])
  useEffect(() => {
    if (Admin == 1) {
      api.getAll('get?type=Propertymaster').then((response) => {
        console.log('SelectPro', response.data)
        setProperty(response.data)
      })
    } else {
      api.getAll('get?type=Propertymaster').then((response) => {
        const filteredData = response.data.filter((item) =>
          userproperty.PropertyName.some(
            (prop) => prop.trim().toLowerCase() === item.Propertycode.trim().toLowerCase(),
          ),
        )
        setProperty(filteredData)
        console.log('Appfilter', filteredData)
      })
    }
  }, [userproperty])

  const [code, setCode] = useState(sessionStorage.getItem('propertyId'))

  ////////////////////////   Property Master check for mail getting  /////////////////////////

  //
  const [filteredmail, setFilteredMail] = useState([])

  useEffect(() => {
    if (Propertycode == 0) {
      setFilteredMail('admin@gmail.com')
    } else {
      api.getAll(`get?type=getemail&email=${code}`).then((response) => {
        console.log('Backend', response.data[0].Email)
        setFilteredMail(response.data[0].Email)
      })
    }
  }, [Propertycode])
  sessionStorage.setItem('Email', filteredmail)

  const [propertymail, setPropertyMail] = useState()
  const storedValue = sessionStorage.getItem('propertyId')
  useEffect(() => {
    api.getAll('get?type=Propertymaster').then((response) => {
      const filteredData = response.data.filter((item) => item.Propertycode == storedValue)
      setPropertyMail(filteredData)
      console.log('aaaaaaaaa', filteredData)
    })
  }, [])

  const [email, setEmail] = useState([])

  useEffect(() => {
    api.getAll('get?type=Userproperty').then((response) => {
      const filteredData = response.data.filter((item) => {
        item.Email == filteredmail
      })
      setEmail(filteredData)
      console.log('Filtered Data:', filteredData)
      console.log('Full Response Data:', response.data)
    })
  }, [Propertycode])

  const handleSelectChange = (value) => {
    setCode(value)
    console.log('value', value)
    sessionStorage.setItem('propertyId', value)
    navigate(0)
  }

  return (
    <div className="header2">
      <div>
        {breadcrumbs.map((breadcrumb, index) => {
          return (
            <div
              className="headertype"
              {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
              key={index}
            >
              {breadcrumb.name}
            </div>
          )
        })}
        <div>
          <CBreadcrumb style={{ marginBottom: '0px', color: 'white' }}>
            <CBreadcrumb
              color="white"
              style={{ margin: '0px 5px 0px 0px' }}
              className="headersmall"
              href="/"
            >
              Home
            </CBreadcrumb>
            {breadcrumbs.map((breadcrumb, index) => {
              return (
                <CBreadcrumbItem
                  style={{ color: 'white' }}
                  className="headersmall"
                  {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
                  key={index}
                >
                  / {breadcrumb.name}
                </CBreadcrumbItem>
              )
            })}
          </CBreadcrumb>
        </div>
      </div>
      <div className="profile">
        {isvisible && (
          <CHeaderNav style={{ minWidth: 250, width: 'auto', color: 'white' }} className="select">
            <Select
              value={code == 0 ? undefined : code}
              placeholder="Select Property"
              onChange={handleSelectChange}
              className="select1"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={[
                ...(Admin == 1 ? [{ value: '0', label: 'Unselect' }] : []),
                ...property.map((item) => ({
                  value: item.Propertycode,
                  label: item.Propertyname,
                })),
              ]}
            />
          </CHeaderNav>
        )}
        {/* <div className="vr h-100 mx-2 text-body text-opacity-75"></div> */}
        <AppHeaderDropdown className="headerdropdown" />
      </div>
    </div>
  )
}

export default React.memo(AppBreadcrumb)
