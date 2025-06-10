import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import '../views/Masters/CSS/Master.css'
import { AppSidebarNav } from './AppSidebarNav'

// import logo from 'src/assets/images/MG Logo.png'
// D:\REACT JS\Py-Olliv AdminPanel\Py-Olliv Frontend\src\assets\images\pyollivwhite.png
import logo from 'src/assets/images/pyollivwhite.png'
import logo1 from 'src/assets/images/logo-removebg-preview (1).png'
import { sygnet } from 'src/assets/brand/sygnet'

import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      // colorScheme="dark"
      style={{ backgroundColor: '#4b5e4b', color: 'white' }}
      position="fixed"
      // unfoldable={unfoldable}
      // visible={sidebarShow}
      // onVisibleChange={(visible) => {
      //   dispatch({ type: 'set', sidebarShow: visible })
      // }}
    >
      <CSidebarHeader
        style={{ padding: '0px', backgroundColor: '#4b5e4b', display:'flex',alignItems:'center',justifyContent:'center' }}
        className="border-bottom"
      >
        <CSidebarBrand to="/">
          <img height={55} className="logo" src={logo} alt="MICROGENN" />
          {/* <img
            style={{ marginLeft: '-35px', marginTop: '8px' }}
            height={50}
            width={200}
            src={logo1}
            alt="MICROGENN"
          /> */}
          {/* <CIcon customClassName="sidebar-brand-narrow" icon={sygnet} height={32} /> */}
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          // onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      {/* <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter> */}
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
