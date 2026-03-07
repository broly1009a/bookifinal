package com.kas.online_book_shop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopBookDTO {
    private Long bookId;
    private String bookTitle;
    private String bookISBN;
    private Long soldQuantity;
    private Long revenue;
    private String imageUrl;
}
