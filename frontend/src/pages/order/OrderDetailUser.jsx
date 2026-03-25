import React, { useState, useEffect, useRef } from "react"
import "./order.scss"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import Rating from "@mui/material/Rating"
import { useParams } from "react-router-dom"
import { getOrderById } from "../../service/OrderService"
import { useReactToPrint } from "react-to-print"
import PrintIcon from "@mui/icons-material/Print"
import Breadscrumb from "../../components/Breadscrumb"
import { addRating, getRatingByBookAndUser } from "../../services/RatingService"

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

const OrderDetailUser = () => {
    const { id } = useParams()
    const [order, setOrder] = useState({})
    const [bookRatings, setBookRatings] = useState({})
    const [ratingMessage, setRatingMessage] = useState("")
    const [submittingBookId, setSubmittingBookId] = useState(null)
    const printRef = useRef(null)

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    })

    useEffect(() => {
        getOrderById(id).then((res) => {
            setOrder(res.data)
        })
    }, [id])

    useEffect(() => {
        const userId = order?.user?.id
        const isCompleted = order?.state === "COMPLETED"
        const details = order?.orderDetails || []

        if (!userId || !isCompleted || details.length === 0) {
            setBookRatings({})
            return
        }

        const uniqueBookIds = [...new Set(details.map((item) => item?.book?.id).filter(Boolean))]
        if (uniqueBookIds.length === 0) {
            setBookRatings({})
            return
        }

        Promise.all(
            uniqueBookIds.map((bookId) =>
                getRatingByBookAndUser(bookId, userId)
                    .then((res) => ({ bookId, value: res?.data?.value || 0 }))
                    .catch(() => ({ bookId, value: 0 })),
            ),
        ).then((results) => {
            const nextRatings = {}
            results.forEach(({ bookId, value }) => {
                nextRatings[bookId] = value
            })
            setBookRatings(nextRatings)
        })
    }, [order])

    const handleRateBook = async (bookId, value) => {
        if (!value) return
        const userId = order?.user?.id
        if (!userId) {
            setRatingMessage("Khong tim thay nguoi dung de danh gia")
            return
        }

        setSubmittingBookId(bookId)
        setRatingMessage("")

        try {
            await addRating(bookId, userId, value)
            setBookRatings((prev) => ({ ...prev, [bookId]: value }))
            setRatingMessage("Danh gia thanh cong")
        } catch (error) {
            setRatingMessage("Khong the danh gia luc nay. Vui long thu lai")
        } finally {
            setSubmittingBookId(null)
        }
    }

    const items = order?.orderDetails || []
    const subTotal = items.reduce((sum, item) => sum + (item.amount || 0) * (item.salePrice || 0), 0)
    const shippingFee = order?.shippingPrice || 30000
    const total = order?.totalPrice || subTotal + shippingFee
    const fullAddress = [order?.address, order?.ward, order?.district, order?.province].filter(Boolean).join(", ")

    return (
        <div>
            <Breadscrumb title={`Order Detail - ${order?.id || ""}`} />
            <div className="order-detail-user-page" ref={printRef}>
                <div className="order-detail-user-header">
                    <div>
                        <h2>Don hang #{order?.id}</h2>
                        <p>Tao luc: {formatDate(order?.created)}</p>
                    </div>
                    {/* <button className="print-btn" type="button" onClick={handlePrint}>
                        <PrintIcon fontSize="small" />
                        In don
                    </button> */}
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

                <div className="order-items-wrap" id="rating">
                    <h4>San pham trong don</h4>
                    {ratingMessage && (
                        <p style={{ marginBottom: "10px", color: "#0f766e", fontWeight: 500 }}>{ratingMessage}</p>
                    )}
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="order details table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>San pham</TableCell>
                                    <TableCell align="right">So luong</TableCell>
                                    <TableCell align="right">Don gia</TableCell>
                                    <TableCell align="right">Thanh tien</TableCell>
                                    <TableCell align="center">Danh gia</TableCell>
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
                                        <TableCell align="center">
                                            {order?.state === "COMPLETED" ? (
                                                (() => {
                                                    const bookId = item?.book?.id
                                                    const currentRating = bookRatings[bookId] || 0
                                                    const isRated = currentRating > 0

                                                    if (!bookId) return <span>N/A</span>

                                                    if (isRated) {
                                                        return (
                                                            <div>
                                                                <Rating value={currentRating} precision={1} readOnly />
                                                                <div style={{ fontSize: "12px", color: "#15803d" }}>Da danh gia</div>
                                                            </div>
                                                        )
                                                    }

                                                    return (
                                                        <div>
                                                            <Rating
                                                                value={currentRating}
                                                                precision={1}
                                                                onChange={(event, newValue) => handleRateBook(bookId, newValue)}
                                                            />
                                                            {submittingBookId === bookId && (
                                                                <div style={{ fontSize: "12px", color: "#0369a1" }}>Dang gui...</div>
                                                            )}
                                                        </div>
                                                    )
                                                })()
                                            ) : (
                                                <span>Chi danh gia khi don hoan tat</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">Don hang chua co san pham</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                {(order?.customerNote || order?.shopNote) && (
                    <div className="order-notes">
                        <h4>Ghi chu</h4>
                        {order?.customerNote && <p><strong>Khach hang:</strong> {order.customerNote}</p>}
                        {order?.shopNote && <p><strong>Cua hang:</strong> {order.shopNote}</p>}
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderDetailUser