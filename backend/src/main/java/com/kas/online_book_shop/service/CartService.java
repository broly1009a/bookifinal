package com.kas.online_book_shop.service;

import com.kas.online_book_shop.dto.OrderDetailDTO;
import com.kas.online_book_shop.model.Order;

import java.util.List;

public interface CartService {
    void addToCart(OrderDetailDTO orderDetailDTO);

    Order getCartByUser(Long userId);

    void updateCart(Order order);

    List<Order> getAllCart();
}
