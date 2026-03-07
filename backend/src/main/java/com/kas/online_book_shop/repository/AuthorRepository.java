package com.kas.online_book_shop.repository;

import com.kas.online_book_shop.model.Author;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorRepository extends JpaRepository<Author, Long> {

}
