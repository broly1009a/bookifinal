package com.kas.online_book_shop.repository;

import com.kas.online_book_shop.model.PostCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostCategoryRepository extends JpaRepository<PostCategory, Long> {
    
}
