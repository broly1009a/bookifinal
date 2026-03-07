package com.kas.online_book_shop.repository;

import com.kas.online_book_shop.model.Publisher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PublisherRepository extends JpaRepository<Publisher, Long> {
    
}
