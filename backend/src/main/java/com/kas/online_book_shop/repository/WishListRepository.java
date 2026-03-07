package com.kas.online_book_shop.repository;

import com.kas.online_book_shop.model.Book;
import com.kas.online_book_shop.model.User;
import com.kas.online_book_shop.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishListRepository extends JpaRepository<Wishlist, Long> {
    Wishlist findByUserAndBook (User user, Book book);    
}
