package com.kas.online_book_shop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueByDateDTO {
    private LocalDate date;
    private Long revenue;
    private Long orderCount;
}
