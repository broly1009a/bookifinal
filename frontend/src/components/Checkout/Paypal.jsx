import React, { useEffect, useState } from 'react'
import { addOrder } from '../../services/OrderService'
const Paypal = ({value, cart, setCart}) => {
    
    const paypal = React.useRef()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    const getPay = () => {
        if (!window.paypal) {
            setError('PayPal SDK chưa được tải. Vui lòng kiểm tra kết nối internet.')
            setLoading(false)
            return
        }

        if (!cart.orderDetails || cart.orderDetails.length === 0) {
            setError('Giỏ hàng trống')
            setLoading(false)
            return
        }

        window.paypal.Buttons({
            createOrder: (data, actions, err) => {
                return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                        {
                            description: "Book Order - Online Book Shop",
                            amount: {
                                currency_code: "USD",
                                value: value,
                            }
                        }
                    ]
                })
            },
            onApprove: async (data, actions) => {
                const order = await actions.order.capture()
                console.log('PayPal Order Success:', order)
                
                cart.paymentState = 'PAID'
                cart.paypalOrderId = order.id
                
                addOrder(cart).then(res => {
                    console.log('Order saved:', res)
                    alert('Thanh toán thành công!')
                    window.location.href = '/account'
                })
                .catch(err => {
                    console.error('Error saving order:', err)
                    alert('Lỗi khi lưu đơn hàng. Vui lòng liên hệ support.')
                })
            },
            onError: (err) => {
                console.error('PayPal Error:', err)
                setError('Có lỗi xảy ra với PayPal. Vui lòng thử lại.')
            },
            onCancel: (data) => {
                console.log('PayPal payment cancelled:', data)
                alert('Bạn đã hủy thanh toán')
            }
        }).render(paypal.current)
        setLoading(false)
    }

    useEffect(() => {
        if (!isNaN(value) && value > 0) {
            getPay()
        } else {
            setLoading(false)
        }
    }, [value])
  return (
    <div style={{minHeight: '500px'}} className='payment mt-5 mb-5'>
        {loading && <div className='text-center'><p>Đang tải PayPal...</p></div>}
        {error && <div className='alert alert-danger'>{error}</div>}
        <div ref={paypal}></div>
    </div>
  )
}

export default Paypal