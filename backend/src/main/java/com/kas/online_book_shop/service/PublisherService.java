package com.kas.online_book_shop.service;

import com.kas.online_book_shop.model.Publisher;

import java.util.List;

public interface PublisherService {
    List<Publisher> getAllPublishers();

    Publisher savePublisher(Publisher Publisher);

    Publisher updatePublisher(Publisher Publisher);

    void deletePublisher(Long id);

    Publisher getPublisherById(Long id);
}
