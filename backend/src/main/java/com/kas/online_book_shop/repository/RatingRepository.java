package com.kas.online_book_shop.repository;

import com.kas.online_book_shop.model.Book;
import com.kas.online_book_shop.model.Rating;
import com.kas.online_book_shop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByBookAndUser(Book book, User user);
    List<Rating> findByBook(Book book);
    Optional<Rating> findTopByOrderByIdDesc();

    @Query("SELECT COALESCE(AVG(r.value), 0) FROM Rating r WHERE r.book.id = :bookId")
    Double getAverageByBookId(@Param("bookId") Long bookId);

    Long countByBook_Id(Long bookId);
}
