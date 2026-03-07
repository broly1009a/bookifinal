package com.kas.online_book_shop.service;

import com.kas.online_book_shop.dto.*;

import java.time.LocalDateTime;
import java.util.List;

public interface DashboardService {
    
    // Thống kê tổng quan - dành cho ADMIN và MANAGER
    DashboardStatsDTO getOverallStats();
    
    // Thống kê doanh thu theo ngày - dành cho ADMIN, MANAGER, SALE
    List<RevenueByDateDTO> getRevenueByDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    // Sách bán chạy nhất - dành cho ADMIN, MANAGER
    List<TopBookDTO> getTopSellingBooks(int limit);
    
    // Thống kê đơn hàng theo trạng thái - dành cho ADMIN, MANAGER, SALE
    List<OrderStatsDTO> getOrderStatsByState();
    
    // Top khách hàng mua nhiều nhất - dành cho ADMIN, MANAGER, SALE
    List<CustomerStatsDTO> getTopCustomers(int limit);
    
    // Thống kê doanh thu theo tháng (12 tháng gần nhất) - dành cho ADMIN, MANAGER
    List<RevenueByDateDTO> getMonthlyRevenue();
    
    // Thống kê đơn hàng theo ngày (7 ngày gần nhất) - dành cho SALE
    List<RevenueByDateDTO> getDailyOrdersLastWeek();
}
