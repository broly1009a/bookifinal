package com.kas.online_book_shop.service;

import com.kas.online_book_shop.model.Language;

import java.util.List;

public interface LanguageService {
    List<Language> getAllLanguages();

    Language saveLanguage(Language language);

    Language updateLanguage(Language language);

    void deleteLanguage(Long id);

    Language getLanguageById(Long id);
}
