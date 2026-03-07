package com.kas.online_book_shop.dto;

import com.kas.online_book_shop.enums.OrderState;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatsDTO {
    private OrderState orderState;
    private Long count;
    private Long totalRevenue;
}
