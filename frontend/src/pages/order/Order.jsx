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
    const [searchText, setSearchText] = useState("");
    const [stateFilter, setStateFilter] = useState("ALL");
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

    const normalize = (value) => String(value || "").toLowerCase();

    const filteredData = data.filter((order) => {
        const keyword = normalize(searchText).trim();
        const matchesSearch =
            keyword === "" ||
            normalize(order?.id).includes(keyword) ||
            normalize(order?.fullName || order?.user?.fullName).includes(keyword) ||
            normalize(order?.email || order?.user?.email).includes(keyword) ||
            normalize(order?.phone).includes(keyword);

        const matchesState = stateFilter === "ALL" || order?.state === stateFilter;
        return matchesSearch && matchesState;
    });

    const stateOptions = Array.from(new Set(data.map((order) => order?.state).filter(Boolean)));

    return (
        <div className="list">
            {isSaleRoute ? <SidebarSale /> : <Sidebar />}
            <div className="listContainer">
                <Navbar />
                <div className="datatable">
                    <div className="datatableTitle">
                       Manage Orders
                       <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                           <input
                               type="text"
                               placeholder="Search id, ten, email, sdt"
                               value={searchText}
                               onChange={(e) => setSearchText(e.target.value)}
                               style={{ padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px", minWidth: "220px" }}
                           />
                           <select
                               value={stateFilter}
                               onChange={(e) => setStateFilter(e.target.value)}
                               style={{ padding: "6px 8px", border: "1px solid #ccc", borderRadius: "4px" }}
                           >
                               <option value="ALL">All states</option>
                               {stateOptions.map((state) => (
                                   <option key={state} value={state}>{state}</option>
                               ))}
                           </select>
                       </div>
                    </div>
                    <DataGrid
                        className="datagrid"
                        rows={filteredData}
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