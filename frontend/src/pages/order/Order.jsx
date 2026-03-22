import React, { useState, useEffect } from "react"
import "./order.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import { DataGrid } from "@mui/x-data-grid";
import { orderColumns } from "../../datatablesource";
import { getAllOrders } from "../../service/OrderService"
import { Link, useLocation } from "react-router-dom";
import SidebarSale from "../../components/sidebar/SidebarSale";

const Order = () => {
    const [data, setData] = useState([])
    const [columns, setColumns] = useState([]);
    const location = useLocation();
    const isSaleRoute = location.pathname.startsWith('/sale');
    const orderBasePath = isSaleRoute ? '/sale/orders' : '/admin/orders';


    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 230,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`${orderBasePath}/${params.row.id}`} style={{ textDecoration: "none" }}>
                            <div className="viewButton">View Detail</div>
                        </Link>
                        <div
                            className="deleteButton"
                        >
                            <a href={`/order-state/${params.row.id}`} style={{textDecoration: 'none', color: 'crimson'}}>Change State</a>
                        </div>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        getAllOrders().then((res) => {
            setData(res.data)
            setColumns(orderColumns.concat(actionColumn))
        })
    }, [])

    return (
        <div className="list">
            {isSaleRoute ? <SidebarSale /> : <Sidebar />}
            <div className="listContainer">
                <Navbar />
                <div className="datatable">
                    <div className="datatableTitle">
                       Manage Orders
                    </div>
                    <DataGrid
                        className="datagrid"
                        rows={data}
                        columns={columns}
                        pageSize={9}
                        rowsPerPageOptions={[9]}
                    />
                </div>
            </div>
        </div>
    )
}

export default Order