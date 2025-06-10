import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const RoomType = React.lazy(() => import('./views/Masters/Property/RoomType/RoomType'))
const PropertyMaster = React.lazy(
  () => import('./views/Masters/Property/PropertyMaster/PropertyMaster'),
)
const RoomView = React.lazy(() => import('./views/Masters/Common/Room View/RoomView'))
const BedView = React.lazy(() => import('./views/Masters/Common/Bed View/BedView'))
const PropertyType = React.lazy(() => import('./views/Masters/Common/PropertyType/PropertyType'))
const ManagementType = React.lazy(() => import('./views/Masters/Common/ManagementType/ManagementType'))
const Files = React.lazy(() => import('./views/Masters/Files/File'))
const Video = React.lazy(() => import('./views/Masters/Files/Video'))
const User = React.lazy(() => import('./views/Masters/Property/Users/User'))
const AmenitiesMaster = React.lazy(
  () => import('./views/Masters/Property/AmenitiesMaster/AmenitiesMaster'),
)
const Transport = React.lazy(() => import('./views/Masters/Common/Mode of Transport/Transport'))
const Amenities = React.lazy(() => import('./views/Masters/Common/Amenities/Amenities'))
const PolicyType = React.lazy(() => import('./views/Masters/Common/PolicyType/PolicyType'))
const AmenitiesCategory = React.lazy(
  () => import('./views/Masters/Common/Amenities/AmenitiesCategory'),
)
const UserProperty = React.lazy(() => import('./views/Masters/Common/User Property/UserProperty'))
const IDProof = React.lazy(() => import('./views/Masters/Common/Id Proof/IDProof'))
const RateMaster = React.lazy(() => import('./views/Masters/Property/Rate Master/RateMaster'))
const RatePlanMaster = React.lazy(() => import('./views/Masters/Property/RatePlanMaster/RatePlanMaster'))
const Inventory = React.lazy(() => import('./views/Masters/Property/Inventory/Inventory'))
const Sample = React.lazy(() => import('./views/Masters/Property/Rate Master/RateSample'))
const Policy = React.lazy(() => import('./views/Masters/Property/Policies/Policy'))
const Reviews = React.lazy(() => import('./views/Masters/Property/Ratings & Reviews/Rating&Reviews'))
const RatePlan = React.lazy(() => import('./views/Masters/Property/Room&Rates Link/RoomRatesLink'))
const Conference = React.lazy(() => import('./views/Masters/Property/ConferenceRoom/Conference'))
const BlockConference = React.lazy(() => import('./views/Masters/Property/ConferenceRoom/BlockConference'))
const PropertyOwner = React.lazy(() => import('./views/Masters/Property/PropertyOwnerType/PropertyOwnerType'))
const Utility = React.lazy(() => import('./views/Masters/Property/UtilityType/UtilityType'))
// const Ota = React.lazy(() => import('./views/Masters/Property/OtaMaster/OtaMaster'))
const Email = React.lazy(() => import('./views/Masters/Property/Email/Email'))
const ViewEmail = React.lazy(() => import('./views/Masters/Property/View Template/ViewTemplate'))
// const EmailMaster = React.lazy(() => import('./views/Masters/Property/EmailMaster/EmailMaster'))
const Approval = React.lazy(() => import('./views/Masters/Property/ApprovalScreen/ApprovalScreen'))
// const Policies = React.lazy(() => import('./views/Masters/Common/Policies/Policies'))
const Try = React.lazy(() => import('./views/Masters/Property/Inventory/Try'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/Masters/RoomType', name: 'Room Type', element: RoomType },
  { path: '/Masters/ManagementType', name: 'Management Type', element: ManagementType },
  { path: '/Masters/PropertyMaster', name: 'Onboard Property', element: PropertyMaster },
  { path: '/Masters/AmenitiesMaster', name: 'Amenities Master', element: AmenitiesMaster },
  { path: '/Masters/Conference', name: 'Conference', element: Conference },
  { path: '/Masters/BlockConference', name: 'Block Hall', element: BlockConference },
  { path: '/Masters/PropertyOwner', name: 'Property Owner Type', element: PropertyOwner },
  { path: '/Masters/Utility', name: 'Utility Type', element: Utility },
  // { path: '/Masters/Ota', name: 'Ota Master', element: Ota },
  { path: '/Masters/PropertyType', name: 'Property Type', element: PropertyType },
  { path: '/Masters/Transport', name: 'Near By Places', element: Transport },
  { path: '/Masters/RoomView', name: 'Room View', element: RoomView },
  { path: '/Masters/BedView', name: 'Bed Type', element: BedView },
  { path: '/Masters/RoomImages', name: 'Room Images', element: Files },
  { path: '/Masters/Video', name: 'Video', element: Video },
  { path: '/Masters/User', name: 'User', element: User },
  { path: '/Amenities/Amenities', name: 'Amenities', element: Amenities },
  { path: '/Amenities/UserProperty', name: 'UserProperty', element: UserProperty },
  { path: '/Masters/IDProof', name: 'ID Proof Name', element: IDProof },
  { path: '/Masters/RateMaster', name: 'Rate Master', element: RateMaster },
  { path: '/Masters/RatePlanMaster', name: 'RatePlanMaster', element: RatePlanMaster },
  { path: '/Masters/Sample', name: 'Rate & Inventory', element: Sample },
  { path: '/Masters/InventoryMaster', name: 'Inventory Master', element: Inventory },
  { path: '/Masters/Policy', name: 'Policies', element: Policy },
  { path: '/Masters/PolicyType', name: 'Policy Type', element: PolicyType },
  { path: '/Masters/Try', name: 'Try', element: Try },
  { path: '/Masters/Ratings&Reviews', name: 'Ratings & Reviews', element: Reviews },
  { path: '/Masters/RoomRateLink', name: 'Room & Rate Link', element: RatePlan },
  { path: '/Masters/Email', name: 'Email Template', element: Email },
  { path: '/Masters/ViewEmail', name: 'View Mails', element: ViewEmail },
  // { path: '/Masters/EmailMaster', name: 'Email Master', element: EmailMaster },
  { path: '/Masters/Approval', name: 'Email Master', element: Approval },
  // { path: '/Masters/Policies', name: 'Policies', element: Policies },
  {
    path: '/Amenities/AmenitiesCategory',
    name: 'AmenitiesCategory',
    element: AmenitiesCategory,
  },
]

export default routes
