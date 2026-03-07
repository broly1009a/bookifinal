package com.kas.online_book_shop.service;

import com.kas.online_book_shop.enums.OrderState;
import com.kas.online_book_shop.enums.PaymentState;
import com.kas.online_book_shop.enums.ShippingState;
import com.kas.online_book_shop.model.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderService {
    List<Order> getOrderByUser(Long userID);

    void processOrder(Order order);

    void changeOrderState(Long OrderId, OrderState orderState);

    Page<Order> queryOrder(OrderState state, PaymentState paymentState, ShippingState shippingState, LocalDateTime from, LocalDateTime to, Pageable pageable);

    List<Order> getAll();

    void changeOrderPaymentState(Long OrderId, PaymentState paymentState);

    void changeOrderShippingState(Long OrderId, ShippingState shippingState);

    Order getOrderById(Long Id);

    void cancel(Long OrderId);
}
