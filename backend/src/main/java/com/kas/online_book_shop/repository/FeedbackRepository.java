package com.kas.online_book_shop.repository;

import com.kas.online_book_shop.model.Book;
import com.kas.online_book_shop.model.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long>{
    Page<Feedback> findByBook(Book book, Pageable pageable);
}
