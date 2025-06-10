import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { useNavigate } from 'react-router-dom'
import { Icon } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import '../../views/Masters/CSS/Master.css'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  return (
    <CDropdown variant="nav-item" className="logoutdiv">
      <CDropdownToggle placement="bottom-end" className=" py-0 pe-0" caret={false}>
        <AccountCircleIcon className="logout" />
      </CDropdownToggle>

      <CDropdownMenu className="logoutdiv" style={{ listStyle: 'none' }}>
        <CDropdownItem
          href="#"
          onClick={() => {
            sessionStorage.removeItem('login'), navigate(0)
            sessionStorage.removeItem('propertyId'), navigate(0)
            sessionStorage.removeItem('Email'), navigate(0)
          }}
        >
          <CIcon icon={cilLockLocked} className="logoutdiv me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
