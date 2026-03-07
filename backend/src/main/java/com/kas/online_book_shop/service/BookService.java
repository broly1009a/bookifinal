package com.kas.online_book_shop.service;

import com.kas.online_book_shop.enums.BookState;
import com.kas.online_book_shop.model.Book;
import com.kas.online_book_shop.model.BookCategory;
import com.kas.online_book_shop.model.BookCollection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BookService {

    Book getBookById(Long id);

    Page<Book> getAllBooks(Pageable pageable);

    List<Book> getAllBooks();

    Book saveBook(Book book);

    Book updateBook(Book book);

    void deleteBook(Long id);

    void changeBookState(Long id);

    Page<Book> getBookByCategoriesAndPriceRange(List<BookCategory> categories, int min, int max, Pageable pageable);

    Page<Book> getBooksByCollectionAndPriceRanges(BookCollection collection, BookCategory category, int min, int max, Pageable pageable);

    Page<Book> getBooksByName(String name, Pageable pageable);

    void addBookToCollection(Long bookId, Long collectionId);

    Page<Book> queryBook(String title, BookState state, BookCollection collection, Pageable pageable);
}
