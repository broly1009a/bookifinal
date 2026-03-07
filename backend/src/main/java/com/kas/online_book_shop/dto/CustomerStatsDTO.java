package com.kas.online_book_shop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerStatsDTO {
    private Long customerId;
    private String customerName;
    private String email;
    private String phone;
    private Long totalOrders;
    private Long totalSpent;
}
