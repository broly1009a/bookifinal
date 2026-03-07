package com.kas.online_book_shop.repository;

import com.kas.online_book_shop.model.BookCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookCategoryRepository extends JpaRepository<BookCategory, Long> {

}
