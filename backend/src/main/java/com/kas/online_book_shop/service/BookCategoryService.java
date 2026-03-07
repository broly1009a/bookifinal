package com.kas.online_book_shop.service;

import com.kas.online_book_shop.model.BookCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookCategoryService {
    List<BookCategory> getAllBookCategories();

    Page<BookCategory> getAllBookCategories(Pageable pageable);

    BookCategory getBookCategoryById(Long id);

    BookCategory saveBookCategory(BookCategory bookCategory);

    BookCategory updateBookCategory(BookCategory bookCategory);

    void deleteBookCategory(Long id);
}
