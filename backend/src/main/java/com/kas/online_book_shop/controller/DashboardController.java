package com.kas.online_book_shop.controller;

import com.kas.online_book_shop.dto.*;
import com.kas.online_book_shop.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Dashboard Controller - Cung cấp các API thống kê cho 3 role:
 * - ADMIN: Có thể truy cập tất cả endpoints
 * - MANAGER: Có thể truy cập hầu hết endpoints (quản lý tổng quan)
 * - SALE: Có thể truy cập các endpoints liên quan đến đơn hàng và khách hàng
 * 
 * Lưu ý: Cần cấu hình Security để phân quyền phù hợp cho từng endpoint
 */
@RestController
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost"})
@RequiredArgsConstructor
@RequestMapping("/api/v1/dashboard")
public class DashboardController {
    
    private final DashboardService dashboardService;

    /**
     * Lấy thống kê tổng quan
     * Roles: ADMIN, MANAGER
     * Bao gồm: Tổng số sách, đơn hàng, khách hàng, doanh thu, etc.
     */
    @GetMapping("/stats/overall")
    public ResponseEntity<DashboardStatsDTO> getOverallStats() {
        return ResponseEntity.ok(dashboardService.getOverallStats());
    }

    /**
     * Lấy doanh thu theo khoảng thời gian
     * Roles: ADMIN, MANAGER, SALE
     * Query params:
     * - startDate: Ngày bắt đầu (format: yyyy-MM-dd'T'HH:mm:ss)
     * - endDate: Ngày kết thúc (format: yyyy-MM-dd'T'HH:mm:ss)
     */
    @GetMapping("/revenue/by-date-range")
    public ResponseEntity<List<RevenueByDateDTO>> getRevenueByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(dashboardService.getRevenueByDateRange(startDate, endDate));
    }

    /**
     * Lấy doanh thu theo tháng (12 tháng gần nhất)
     * Roles: ADMIN, MANAGER
     */
    @GetMapping("/revenue/monthly")
    public ResponseEntity<List<RevenueByDateDTO>> getMonthlyRevenue() {
        return ResponseEntity.ok(dashboardService.getMonthlyRevenue());
    }

    /**
     * Lấy thống kê đơn hàng theo ngày (7 ngày gần nhất)
     * Roles: ADMIN, MANAGER, SALE
     */
    @GetMapping("/orders/daily-last-week")
    public ResponseEntity<List<RevenueByDateDTO>> getDailyOrdersLastWeek() {
        return ResponseEntity.ok(dashboardService.getDailyOrdersLastWeek());
    }

    /**
     * Lấy danh sách sách bán chạy nhất
     * Roles: ADMIN, MANAGER
     * Query param:
     * - limit: Số lượng sách cần lấy (mặc định: 10)
     */
    @GetMapping("/books/top-selling")
    public ResponseEntity<List<TopBookDTO>> getTopSellingBooks(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(dashboardService.getTopSellingBooks(limit));
    }

    /**
     * Lấy thống kê đơn hàng theo trạng thái
     * Roles: ADMIN, MANAGER, SALE
     */
    @GetMapping("/orders/stats-by-state")
    public ResponseEntity<List<OrderStatsDTO>> getOrderStatsByState() {
        return ResponseEntity.ok(dashboardService.getOrderStatsByState());
    }

    /**
     * Lấy danh sách khách hàng mua nhiều nhất
     * Roles: ADMIN, MANAGER, SALE
     * Query param:
     * - limit: Số lượng khách hàng cần lấy (mặc định: 10)
     */
    @GetMapping("/customers/top")
    public ResponseEntity<List<CustomerStatsDTO>> getTopCustomers(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(dashboardService.getTopCustomers(limit));
    }

    /**
     * Endpoint tổng hợp cho ADMIN (tất cả thống kê)
     * Role: ADMIN only
     * Trả về tất cả thông tin cần thiết cho dashboard admin
     */
    @GetMapping("/admin/summary")
    public ResponseEntity<AdminDashboardSummaryDTO> getAdminDashboardSummary() {
        return ResponseEntity.ok(AdminDashboardSummaryDTO.builder()
                .overallStats(dashboardService.getOverallStats())
                .topSellingBooks(dashboardService.getTopSellingBooks(10))
                .orderStatsByState(dashboardService.getOrderStatsByState())
                .monthlyRevenue(dashboardService.getMonthlyRevenue())
                .topCustomers(dashboardService.getTopCustomers(10))
                .build());
    }

    /**
     * Endpoint tổng hợp cho MANAGER
     * Role: MANAGER only
     * Trả về thông tin quản lý cần thiết
     */
    @GetMapping("/manager/summary")
    public ResponseEntity<ManagerDashboardSummaryDTO> getManagerDashboardSummary() {
        return ResponseEntity.ok(ManagerDashboardSummaryDTO.builder()
                .overallStats(dashboardService.getOverallStats())
                .topSellingBooks(dashboardService.getTopSellingBooks(5))
                .orderStatsByState(dashboardService.getOrderStatsByState())
                .monthlyRevenue(dashboardService.getMonthlyRevenue())
                .build());
    }

    /**
     * Endpoint tổng hợp cho SALE
     * Role: SALE only
     * Trả về thông tin bán hàng cần thiết
     */
    @GetMapping("/sale/summary")
    public ResponseEntity<SaleDashboardSummaryDTO> getSaleDashboardSummary() {
        DashboardStatsDTO stats = dashboardService.getOverallStats();
        
        // Sale chỉ cần một số thông tin cơ bản
        SaleDashboardSummaryDTO summary = SaleDashboardSummaryDTO.builder()
                .totalOrders(stats.getTotalOrders())
                .todayOrders(stats.getTodayOrders())
                .weekOrders(stats.getWeekOrders())
                .monthOrders(stats.getMonthOrders())
                .todayRevenue(stats.getTodayRevenue())
                .weekRevenue(stats.getWeekRevenue())
                .monthRevenue(stats.getMonthRevenue())
                .pendingOrders(stats.getPendingOrders())
                .processingOrders(stats.getProcessingOrders())
                .shippingOrders(stats.getShippingOrders())
                .orderStatsByState(dashboardService.getOrderStatsByState())
                .dailyOrders(dashboardService.getDailyOrdersLastWeek())
                .topCustomers(dashboardService.getTopCustomers(10))
                .build();
        
        return ResponseEntity.ok(summary);
    }

    /**
     * DTO classes cho các summary endpoints
     */
    
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class AdminDashboardSummaryDTO {
        private DashboardStatsDTO overallStats;
        private List<TopBookDTO> topSellingBooks;
        private List<OrderStatsDTO> orderStatsByState;
        private List<RevenueByDateDTO> monthlyRevenue;
        private List<CustomerStatsDTO> topCustomers;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ManagerDashboardSummaryDTO {
        private DashboardStatsDTO overallStats;
        private List<TopBookDTO> topSellingBooks;
        private List<OrderStatsDTO> orderStatsByState;
        private List<RevenueByDateDTO> monthlyRevenue;
    }

    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class SaleDashboardSummaryDTO {
        private Long totalOrders;
        private Long todayOrders;
        private Long weekOrders;
        private Long monthOrders;
        private Long todayRevenue;
        private Long weekRevenue;
        private Long monthRevenue;
        private Long pendingOrders;
        private Long processingOrders;
        private Long shippingOrders;
        private List<OrderStatsDTO> orderStatsByState;
        private List<RevenueByDateDTO> dailyOrders;
        private List<CustomerStatsDTO> topCustomers;
    }
}
