package com.kas.online_book_shop.repository;

import com.kas.online_book_shop.model.BookCollection;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookCollectionRepository extends JpaRepository<BookCollection, Long> {
    
}
