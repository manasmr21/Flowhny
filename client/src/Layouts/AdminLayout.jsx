import { Outlet } from "react-router-dom"
import Dashboard from "../AdminComponents/AdminPanel/Dashboard"

const AdminLayout = () => {
  return (
    <>
    <Dashboard/>
      <Outlet/> 
    </>
  )
}

export default AdminLayout
