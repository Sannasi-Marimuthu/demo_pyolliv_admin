import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilPuzzle, cilSpeedometer } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'
import '../src/views/Masters/CSS/Master.css'

const PropertyId = sessionStorage.getItem('propertyId')

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    className: 'nav-group-title',
    badge: {
      color: 'info',
    },
  },
  {
    component: CNavGroup,
    name: 'Masters',
    to: '/Masters',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    className: 'nav-group-title',
    items: [
      ...(PropertyId == 0
        ? [
            {
              component: CNavGroup,
              name: 'Common',
              to: '/Property',
              icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
              className: 'nav-subgroup-title',
              items: [
                ...(PropertyId == 0
                  ? [
                      {
                        component: CNavItem,
                        name: 'PropertyType',
                        to: '/Masters/PropertyType',
                        className: 'nav-item-small',
                        onClick: () => {
                          sessionStorage.removeItem('Propertytype')
                        },
                      },
                    ]
                  : []),
                ...(PropertyId == 0
                  ? [
                      {
                        component: CNavItem,
                        name: 'Near by Places',
                        to: '/Masters/Transport',
                        className: 'nav-item-small',
                        onClick: () => {
                          sessionStorage.removeItem('Transport')
                        },
                      },
                    ]
                  : []),
                // ...(PropertyId == 0
                //   ? [
                //       {
                //         component: CNavItem,
                //         name: 'Management Type',
                //         to: '/Masters/ManagementType',
                //         className: 'nav-item-small',
                //         onClick: () => {
                //           sessionStorage.removeItem('ManagementType')
                //         },
                //       },
                //     ]
                //   : []),
                ...(PropertyId == 0
                  ? [
                      {
                        component: CNavItem,
                        name: 'Room View',
                        to: '/Masters/RoomView',
                        className: 'nav-item-small',
                        onClick: () => {
                          sessionStorage.removeItem('Roomview')
                        },
                      },
                    ]
                  : []),

                ...(PropertyId == 0
                  ? [
                      {
                        component: CNavItem,
                        name: 'Bed Type',
                        to: '/Masters/BedView',
                        className: 'nav-item-small',
                        onClick: () => {
                          sessionStorage.removeItem('Bedtype')
                        },
                      },
                    ]
                  : []),
                ...(PropertyId == 0
                  ? [
                      {
                        component: CNavItem,
                        name: 'Amenities',
                        to: '/Amenities/Amenities',
                        className: 'nav-item-small',
                        onClick: () => {
                          sessionStorage.removeItem('Amenities')
                        },
                      },
                    ]
                  : []),
                ...(PropertyId == 0
                  ? [
                      {
                        component: CNavItem,
                        name: 'Amenities Category',
                        to: '/Amenities/AmenitiesCategory',
                        className: 'nav-item-small',
                        onClick: () => {
                          sessionStorage.removeItem('userPropertyId')
                        },
                      },
                    ]
                  : []),
                // ...(PropertyId == 0
                //   ? [
                //       {
                //         component: CNavItem,
                //         name: 'User Property',
                //         to: '/Amenities/UserProperty',
                //         className: 'nav-item-small',
                //         onClick: () => {
                //           sessionStorage.removeItem('Amenitiescategory')
                //         },
                //       },
                //     ]
                //   : []),
                ...(PropertyId == 0
                  ? [
                      {
                        component: CNavItem,
                        name: 'Policy Type',
                        to: '/Masters/PolicyType',
                        className: 'nav-item-small',
                        onClick: () => {
                          sessionStorage.removeItem('PolicyType')
                        },
                      },
                    ]
                  : []),
                // ...(PropertyId == 0
                //   ? [
                //       {
                //         component: CNavItem,
                //         name: 'Policies',
                //         to: '/Masters/Policies',
                //         className: 'nav-item-small',
                //         // onClick: () => {
                //         //   sessionStorage.removeItem('PolicyType')
                //         // },
                //       },
                //     ]
                //   : []),
                ...(PropertyId == 0
                  ? [
                      {
                        component: CNavItem,
                        name: 'ID Proof Name',
                        to: '/Masters/IDProof',
                        className: 'nav-item-small',
                        onClick: () => {
                          sessionStorage.removeItem('Amenitiescategory')
                        },
                      },
                    ]
                  : []),
                ...(PropertyId == 0
                  ? [
                      {
                        component: CNavItem,
                        name: 'Property Owner Type',
                        to: '/Masters/PropertyOwner',
                        className: 'nav-item-small',
                        // onClick: () => {
                        //   sessionStorage.removeItem('Amenitiescategory')
                        // },
                      },
                    ]
                  : []),
                ...(PropertyId == 0
                  ? [
                      {
                        component: CNavItem,
                        name: 'Utility Type',
                        to: '/Masters/Utility',
                        className: 'nav-item-small',
                        // onClick: () => {
                        //   sessionStorage.removeItem('Amenitiescategory')
                        // },
                      },
                    ]
                  : []),
                // ...(PropertyId == 0
                //   ? [
                //       {
                //         component: CNavItem,
                //         name: 'Ota Master',
                //         to: '/Masters/Ota',
                //         className: 'nav-item-small',
                //         // onClick: () => {
                //         //   sessionStorage.removeItem('Amenitiescategory')
                //         // },
                //       },
                //     ]
                //   : []),
                ...(PropertyId == 0
                  ? [
                      {
                        component: CNavItem,
                        name: 'Email Template',
                        to: '/Masters/Email',
                        className: 'nav-item-small',
                        // onClick: () => {
                        //   sessionStorage.removeItem('Amenitiescategory')
                        // },
                      },
                    ]
                  : []),
                // ...(PropertyId == 0
                //   ? [
                //       {
                //         component: CNavItem,
                //         name: 'Email Master',
                //         to: '/Masters/EmailMaster',
                //         className: 'nav-item-small',
                //         // onClick: () => {
                //         //   sessionStorage.removeItem('Amenitiescategory')
                //         // },
                //       },
                //     ]
                //   : []),
              ],
            },
          ]
        : []),
      {
        component: CNavGroup,
        name: 'Property',
        to: '/Property',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        className: 'nav-subgroup-title',
        items: [
          {
            component: CNavItem,
            name: 'Approval Screen',
            to: '/Masters/Approval',
            className: 'nav-item-small',
            // onClick: () => {
            //   sessionStorage.removeItem('Propertymaster')
            // },
          },
          {
            component: CNavItem,
            name: 'Onboard Property',
            to: '/Masters/PropertyMaster',
            className: 'nav-item-small',
            onClick: () => {
              sessionStorage.removeItem('Propertymaster')
            },
          },
          {
            component: CNavItem,
            name: 'User',
            to: '/Masters/User',
            className: 'nav-item-small',
          },
          // {
          //   component: CNavItem,
          //   name: 'Sample',
          //   to: '/Masters/Sample',
          //   className: 'nav-item-small',
          // },
          {
            component: CNavItem,
            name: 'Room Type',
            to: '/Masters/RoomType',
            className: 'nav-item-small',
            onClick: () => {
              sessionStorage.removeItem('Roomtype')
            },
          },

          {
            component: CNavItem,
            name: 'Rate Plan Master',
            to: '/Masters/RatePlanMaster',
            className: 'nav-item-small',
            onClick: () => {
              sessionStorage.removeItem('RatePlanId')
            },
          },
          {
            component: CNavItem,
            name: 'Room & Rate Link',
            to: '/Masters/RoomRateLink',
            className: 'nav-item-small',
            onClick: () => {
              sessionStorage.removeItem('RateRoomLinkId')
            },
          },
          {
            component: CNavItem,
            name: 'Rate Master',
            to: '/Masters/Sample',
            className: 'nav-item-small',
            onClick: () => {
              sessionStorage.removeItem('RateMaster')
            },
          },
          // {
          //   component: CNavItem,
          //   name: 'Inventory',
          //   to: '/Masters/InventoryMaster',
          //   className: 'nav-item-small',
          //   onClick: () => {
          //     sessionStorage.removeItem('InventoryMaster')
          //   },
          // },
          {
            component: CNavItem,
            name: 'Room Images',
            to: '/Masters/RoomImages',
            className: 'nav-item-small',
          },
          // {
          //   component: CNavItem,
          //   name: 'User',
          //   to: '/Masters/User',
          //   className: 'nav-item-small',
          // },
          {
            component: CNavItem,
            name: 'Amenities',
            to: '/Masters/AmenitiesMaster',
            className: 'nav-item-small',
            onClick: () => {
              sessionStorage.removeItem('AmenitiesMaster')
            },
          },
          {
            component: CNavItem,
            name: 'Policies',
            to: '/Masters/Policy',
            className: 'nav-item-small',
            onClick: () => {
              sessionStorage.removeItem('PolicyId')
            },
          },
          // {
          //   component: CNavItem,
          //   name: 'Property Owner Type',
          //   to: '/Masters/PropertyOwner',
          //   className: 'nav-item-small',
          // },
          // {
          //   component: CNavItem,
          //   name: 'Utility Type',
          //   to: '/Masters/Utility',
          //   className: 'nav-item-small',
          // },
          // {
          //   component: CNavItem,
          //   name: 'Ota Master',
          //   to: '/Masters/Ota',
          //   className: 'nav-item-small',
          // },
          // {
          //   component: CNavItem,
          //   name: 'Email Template',
          //   to: '/Masters/Email',
          //   className: 'nav-item-small',
          //   // onClick: () => {
          //   //   sessionStorage.removeItem('Email')
          //   // },
          // },
          // {
          //   component: CNavItem,
          //   name: 'Email Master',
          //   to: '/Masters/EmailMaster',
          //   className: 'nav-item-small',
          //   // onClick: () => {
          //   //   sessionStorage.removeItem('Email')
          //   // },
          // },
          {
            component: CNavItem,
            name: 'View Mails',
            to: '/Masters/ViewEmail',
            className: 'nav-item-small',
            // onClick: () => {
            //   sessionStorage.removeItem('Email')
            // },
          },

          // {
          //   component: CNavItem,
          //   name: 'Try',
          //   to: '/Masters/Try',
          //   className: 'nav-item-small',
          //   onClick: () => {
          //     sessionStorage.removeItem('Email')
          //   },
          // },
          // {
          //   component: CNavItem,
          //   name: 'Ratings & Reviews',
          //   to: '/Masters/Ratings&Reviews',
          //   className: 'nav-item-small',
          //   onClick: () => {
          //     sessionStorage.removeItem('RatingId')
          //   },
          // },
          // ...(PropertyId == 0
          //   ? [
          //       {
          //         component: CNavItem,
          //         name: 'Video',
          //         to: '/Masters/Video',
          //         className: 'nav-item-small',
          //       },
          //     ]
          //   : []),
        ],
      },
      {
        component: CNavGroup,
        name: 'Conference',
        to: '/Property',
        icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
        className: 'nav-subgroup-title',
        items: [
          {
            component: CNavItem,
            name: 'Conference Hall',
            to: '/Masters/Conference',
            className: 'nav-item-small',
          },
          {
            component: CNavItem,
            name: 'Block Hall',
            to: '/Masters/BlockConference',
            className: 'nav-item-small',
          },
        ],
      },
    ],
  },
]

export default _nav
