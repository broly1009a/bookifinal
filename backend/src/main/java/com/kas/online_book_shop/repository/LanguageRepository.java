package com.kas.online_book_shop.repository;

import com.kas.online_book_shop.model.Language;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LanguageRepository extends JpaRepository<Language, Long> {
    
}
