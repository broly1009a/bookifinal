package com.kas.online_book_shop.service;

import com.kas.online_book_shop.model.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AuthorService {
    List<Author> getAllAuthors();

    Author saveAuthor(Author author);

    Author updateAuthor(Author author);

    void deleteAuthor(Long id);

    Author getAuthorById(Long id);
    
    Page<Author> getAllAuthor(Pageable pageable);
}
