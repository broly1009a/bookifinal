import React from "react"
import Sidebar from "../../components/sidebar/Sidebar"
import SidebarManager from "../../components/sidebar/SidebarManager"
import Navbar from "../../components/navbar/Navbar"
import ProfileDetailDashBoard from "../../components/User/ProfileDetailDashBoard"
import { useLocation } from "react-router-dom"

const ProfilePage = ({ cookies }) => {
    const location = useLocation()
    const isManager = location.pathname.startsWith('/manager')
    const isSale = location.pathname.startsWith('/sale')

    const renderSidebar = () => {
        if (isManager) {
            return <SidebarManager />
        } else if (isSale) {
            return <Sidebar /> // Update to SidebarSale if exists
        }
        return <Sidebar />
    }

    return (
        <div className="list">
            {renderSidebar()}
            <div className="listContainer">
                <Navbar />
                <ProfileDetailDashBoard cookies={cookies} />
            </div>
        </div>
    )
}

export default ProfilePage
