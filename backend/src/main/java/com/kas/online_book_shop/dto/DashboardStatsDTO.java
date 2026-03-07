package com.kas.online_book_shop.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalBooks;
    private Long totalOrders;
    private Long totalCustomers;
    private Long totalRevenue;
    
    // Thống kê theo trạng thái đơn hàng
    private Long pendingOrders;
    private Long processingOrders;
    private Long shippingOrders;
    private Long completedOrders;
    private Long canceledOrders;
    
    // Thống kê sách
    private Long activeBooks;
    private Long inactiveBooks;
    private Long lowStockBooks; // Sách sắp hết hàng
    
    // Thống kê doanh thu
    private Long todayRevenue;
    private Long weekRevenue;
    private Long monthRevenue;
    
    // Thống kê đơn hàng theo thời gian
    private Long todayOrders;
    private Long weekOrders;
    private Long monthOrders;
    
    // Thống kê khách hàng
    private Long newCustomersThisMonth;
    private Long activeCustomers;
}
