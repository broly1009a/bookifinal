package com.kas.online_book_shop.repository;

import com.kas.online_book_shop.model.Book;
import com.kas.online_book_shop.model.Order;
import com.kas.online_book_shop.model.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    Optional<OrderDetail> findByOrderAndBook(Order oder, Book book);
}
