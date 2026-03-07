package com.kas.online_book_shop.repository;

import com.kas.online_book_shop.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long>{
    
}
