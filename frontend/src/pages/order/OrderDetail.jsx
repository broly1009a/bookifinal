import React, { useState, useEffect, useRef } from "react"
import "./order.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { useParams } from "react-router-dom"
import { getOrderById } from "../../service/OrderService"
import { useReactToPrint } from "react-to-print"
import PrintIcon from "@mui/icons-material/Print"


const formatDate = (inputDate) => {
    if (!inputDate) return "Chua cap nhat"
    const date = new Date(inputDate)
    if (Number.isNaN(date.getTime())) return "Chua cap nhat"

    const day = `${date.getDate()}`.padStart(2, "0")
    const month = `${date.getMonth() + 1}`.padStart(2, "0")
    const year = date.getFullYear()
    const hours = `${date.getHours()}`.padStart(2, "0")
    const minutes = `${date.getMinutes()}`.padStart(2, "0")

    return `${day}/${month}/${year} ${hours}:${minutes}`
}

const formatCurrency = (value) => `${(value || 0).toLocaleString()} VND`

const getBadgeClass = (value) => {
    const text = (value || "").toUpperCase()
    if (["PAID", "DELIVERED", "SHIPPED", "ACTIVE", "DONE"].includes(text)) return "is-success"
    if (["PENDING", "NOTSHIPPING", "CART", "PROCESSING"].includes(text)) return "is-warning"
    if (["CANCELED", "FAILED", "RETURNED", "INACTIVE"].includes(text)) return "is-danger"
    return "is-default"
}

const OrderDetail = () => {
    const { id } = useParams()
    const [order, setOrder] = useState({})
    const printRef = useRef(null)

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        documentTitle: `order-${id}`,
    })

    useEffect(() => {
        getOrderById(id).then((res) => {
            setOrder(res.data)
        })
    }, [id])

    const items = order?.orderDetails || []
    const subTotal = items.reduce((sum, item) => sum + (item.amount || 0) * (item.salePrice || 0), 0)
    const shippingFee = order?.shippingPrice || 30000
    const total = order?.totalPrice || subTotal + shippingFee
    const fullAddress = [order?.address, order?.ward, order?.district, order?.province].filter(Boolean).join(", ")


    return (
        <div>
            <div className="list">
                <Sidebar />
                <div className="listContainer">
                    <Navbar />
                    <div className="order-detail-user-page" ref={printRef}>
                        <div className="order-detail-user-header">
                            <div>
                                <h2>Don hang #{order?.id}</h2>
                                <p>Tao luc: {formatDate(order?.created)}</p>
                            </div>
                            <button className="print-btn" type="button" onClick={handlePrint}>
                                <PrintIcon fontSize="small" />
                                In don
                            </button>
                        </div>

                        <div className="order-status-row">
                            <div className={`status-pill ${getBadgeClass(order?.state)}`}>Trang thai don: {order?.state || "N/A"}</div>
                            <div className={`status-pill ${getBadgeClass(order?.paymentState)}`}>
                                Thanh toan: {order?.paymentState || "N/A"}
                            </div>
                            <div className={`status-pill ${getBadgeClass(order?.shippingState)}`}>
                                Van chuyen: {order?.shippingState || "N/A"}
                            </div>
                        </div>

                        <div className="order-info-grid">
                            <div className="info-card">
                                <h4>Thong tin nguoi nhan</h4>
                                <p><strong>Ten:</strong> {order?.fullName || order?.user?.fullName || "N/A"}</p>
                                <p><strong>SDT:</strong> {order?.phone || "N/A"}</p>
                                <p><strong>Email:</strong> {order?.email || order?.user?.email || "N/A"}</p>
                                <p><strong>Dia chi:</strong> {fullAddress || "N/A"}</p>
                            </div>

                            <div className="info-card summary-card">
                                <h4>Tong quan thanh toan</h4>
                                <div className="summary-line">
                                    <span>Tam tinh</span>
                                    <span>{formatCurrency(subTotal)}</span>
                                </div>
                                <div className="summary-line">
                                    <span>Phi van chuyen</span>
                                    <span>{formatCurrency(shippingFee)}</span>
                                </div>
                                <div className="summary-line total-line">
                                    <span>Tong cong</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="order-items-wrap">
                            <h4>San pham trong don</h4>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 700 }} aria-label="order details table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>San pham</TableCell>
                                        <TableCell align="right">So luong</TableCell>
                                        <TableCell align="right">Don gia</TableCell>
                                        <TableCell align="right">Thanh tien</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="product-cell">
                                                    <div className="product-name">{item?.book?.title}</div>
                                                    <div className="product-sub">ISBN: {item?.book?.isbn || "N/A"}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell align="right">{(item.amount || 0).toLocaleString()}</TableCell>
                                            <TableCell align="right">{formatCurrency(item.salePrice)}</TableCell>
                                            <TableCell align="right">{formatCurrency((item.amount || 0) * (item.salePrice || 0))}</TableCell>
                                        </TableRow>
                                    ))}
                                    {items.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">Don hang chua co san pham</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    {(order?.customerNote || order?.shopNote) && (
                        <div className="order-notes" style={{ margin: "12px" }}>
                            <h4>Ghi chu</h4>
                            {order?.customerNote && <p><strong>Khach hang:</strong> {order.customerNote}</p>}
                            {order?.shopNote && <p><strong>Cua hang:</strong> {order.shopNote}</p>}
                        </div>
                    )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetail