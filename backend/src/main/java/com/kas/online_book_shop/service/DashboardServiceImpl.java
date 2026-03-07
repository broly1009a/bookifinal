package com.kas.online_book_shop.service;

import com.kas.online_book_shop.dto.*;
import com.kas.online_book_shop.enums.AccountState;
import com.kas.online_book_shop.enums.BookState;
import com.kas.online_book_shop.enums.OrderState;
import com.kas.online_book_shop.enums.Role;
import com.kas.online_book_shop.model.Book;
import com.kas.online_book_shop.model.Order;
import com.kas.online_book_shop.model.OrderDetail;
import com.kas.online_book_shop.model.User;
import com.kas.online_book_shop.repository.BookRepository;
import com.kas.online_book_shop.repository.OrderRepository;
import com.kas.online_book_shop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Override
    public DashboardStatsDTO getOverallStats() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfWeek = now.minusDays(7);
        LocalDateTime startOfMonth = now.minusDays(30);

        // Lấy tất cả đơn hàng (không bao gồm CART)
        List<Order> allOrders = orderRepository.findByStateNot(OrderState.CART);
        
        // Lấy tất cả sách
        List<Book> allBooks = bookRepository.findAll();
        
        // Lấy tất cả khách hàng
        List<User> allCustomers = userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.USER)
                .collect(Collectors.toList());

        // Tính tổng doanh thu
        Long totalRevenue = allOrders.stream()
                .filter(order -> order.getState() == OrderState.COMPLETED)
                .mapToLong(Order::getTotalPrice)
                .sum();

        // Thống kê theo trạng thái đơn hàng
        Long pendingOrders = countOrdersByState(allOrders, OrderState.ORDER);
        Long processingOrders = countOrdersByState(allOrders, OrderState.PROCESSING);
        Long shippingOrders = countOrdersByState(allOrders, OrderState.SHIPPING);
        Long completedOrders = countOrdersByState(allOrders, OrderState.COMPLETED);
        Long canceledOrders = countOrdersByState(allOrders, OrderState.CANCELED);

        // Thống kê sách
        Long activeBooks = allBooks.stream()
                .filter(book -> book.getState() == BookState.ACTIVE)
                .count();
        Long inactiveBooks = allBooks.stream()
                .filter(book -> book.getState() == BookState.INACTIVE)
                .count();
        Long lowStockBooks = allBooks.stream()
                .filter(book -> book.getStock() != null && book.getStock() < 10)
                .count();

        // Doanh thu theo thời gian
        Long todayRevenue = calculateRevenueByDateRange(allOrders, startOfDay, now);
        Long weekRevenue = calculateRevenueByDateRange(allOrders, startOfWeek, now);
        Long monthRevenue = calculateRevenueByDateRange(allOrders, startOfMonth, now);

        // Đơn hàng theo thời gian
        Long todayOrders = countOrdersByDateRange(allOrders, startOfDay, now);
        Long weekOrders = countOrdersByDateRange(allOrders, startOfWeek, now);
        Long monthOrders = countOrdersByDateRange(allOrders, startOfMonth, now);

        // Khách hàng mới trong tháng này
        Long newCustomersThisMonth = allCustomers.stream()
                .filter(user -> user.getState() == AccountState.ACTIVE)
                .count();
        
        Long activeCustomers = allCustomers.stream()
                .filter(user -> user.getState() == AccountState.ACTIVE)
                .count();

        return DashboardStatsDTO.builder()
                .totalBooks((long) allBooks.size())
                .totalOrders((long) allOrders.size())
                .totalCustomers((long) allCustomers.size())
                .totalRevenue(totalRevenue)
                .pendingOrders(pendingOrders)
                .processingOrders(processingOrders)
                .shippingOrders(shippingOrders)
                .completedOrders(completedOrders)
                .canceledOrders(canceledOrders)
                .activeBooks(activeBooks)
                .inactiveBooks(inactiveBooks)
                .lowStockBooks(lowStockBooks)
                .todayRevenue(todayRevenue)
                .weekRevenue(weekRevenue)
                .monthRevenue(monthRevenue)
                .todayOrders(todayOrders)
                .weekOrders(weekOrders)
                .monthOrders(monthOrders)
                .newCustomersThisMonth(newCustomersThisMonth)
                .activeCustomers(activeCustomers)
                .build();
    }

    @Override
    public List<RevenueByDateDTO> getRevenueByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<Order> orders = orderRepository.findByStateNot(OrderState.CART);
        
        Map<LocalDate, RevenueByDateDTO> revenueMap = new HashMap<>();
        
        orders.stream()
                .filter(order -> order.getCreated() != null 
                        && !order.getCreated().isBefore(startDate) 
                        && !order.getCreated().isAfter(endDate)
                        && order.getState() == OrderState.COMPLETED)
                .forEach(order -> {
                    LocalDate date = order.getCreated().toLocalDate();
                    RevenueByDateDTO dto = revenueMap.getOrDefault(date, 
                            RevenueByDateDTO.builder()
                                    .date(date)
                                    .revenue(0L)
                                    .orderCount(0L)
                                    .build());
                    dto.setRevenue(dto.getRevenue() + order.getTotalPrice());
                    dto.setOrderCount(dto.getOrderCount() + 1);
                    revenueMap.put(date, dto);
                });
        
        return revenueMap.values().stream()
                .sorted(Comparator.comparing(RevenueByDateDTO::getDate))
                .collect(Collectors.toList());
    }

    @Override
    public List<TopBookDTO> getTopSellingBooks(int limit) {
        List<Order> completedOrders = orderRepository.findByStateNot(OrderState.CART)
                .stream()
                .filter(order -> order.getState() == OrderState.COMPLETED)
                .collect(Collectors.toList());

        Map<Long, TopBookDTO> bookSalesMap = new HashMap<>();

        for (Order order : completedOrders) {
            if (order.getOrderDetails() != null) {
                for (OrderDetail detail : order.getOrderDetails()) {
                    Book book = detail.getBook();
                    Long bookId = book.getId();
                    
                    // Lấy URL ảnh đầu tiên từ danh sách images
                    String imageUrl = null;
                    if (book.getImages() != null && !book.getImages().isEmpty()) {
                        imageUrl = book.getImages().get(0).getLink();
                    }
                    
                    TopBookDTO dto = bookSalesMap.getOrDefault(bookId,
                            TopBookDTO.builder()
                                    .bookId(bookId)
                                    .bookTitle(book.getTitle())
                                    .bookISBN(book.getISBN())
                                    .soldQuantity(0L)
                                    .revenue(0L)
                                    .imageUrl(imageUrl)
                                    .build());
                    
                    dto.setSoldQuantity(dto.getSoldQuantity() + detail.getAmount());
                    dto.setRevenue(dto.getRevenue() + (detail.getSalePrice() * detail.getAmount()));
                    bookSalesMap.put(bookId, dto);
                }
            }
        }

        return bookSalesMap.values().stream()
                .sorted(Comparator.comparing(TopBookDTO::getSoldQuantity).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderStatsDTO> getOrderStatsByState() {
        List<Order> orders = orderRepository.findByStateNot(OrderState.CART);
        
        Map<OrderState, OrderStatsDTO> statsMap = new HashMap<>();
        
        for (Order order : orders) {
            OrderState state = order.getState();
            OrderStatsDTO dto = statsMap.getOrDefault(state,
                    OrderStatsDTO.builder()
                            .orderState(state)
                            .count(0L)
                            .totalRevenue(0L)
                            .build());
            
            dto.setCount(dto.getCount() + 1);
            if (state == OrderState.COMPLETED) {
                dto.setTotalRevenue(dto.getTotalRevenue() + order.getTotalPrice());
            }
            statsMap.put(state, dto);
        }
        
        return new ArrayList<>(statsMap.values());
    }

    @Override
    public List<CustomerStatsDTO> getTopCustomers(int limit) {
        List<Order> completedOrders = orderRepository.findByStateNot(OrderState.CART)
                .stream()
                .filter(order -> order.getState() == OrderState.COMPLETED)
                .collect(Collectors.toList());

        Map<Long, CustomerStatsDTO> customerStatsMap = new HashMap<>();

        for (Order order : completedOrders) {
            User user = order.getUser();
            if (user != null) {
                Long userId = user.getId();
                
                CustomerStatsDTO dto = customerStatsMap.getOrDefault(userId,
                        CustomerStatsDTO.builder()
                                .customerId(userId)
                                .customerName(user.getFullName())
                                .email(user.getEmail())
                                .phone(user.getPhone())
                                .totalOrders(0L)
                                .totalSpent(0L)
                                .build());
                
                dto.setTotalOrders(dto.getTotalOrders() + 1);
                dto.setTotalSpent(dto.getTotalSpent() + order.getTotalPrice());
                customerStatsMap.put(userId, dto);
            }
        }

        return customerStatsMap.values().stream()
                .sorted(Comparator.comparing(CustomerStatsDTO::getTotalSpent).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<RevenueByDateDTO> getMonthlyRevenue() {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusMonths(12);
        
        List<Order> orders = orderRepository.findByStateNot(OrderState.CART)
                .stream()
                .filter(order -> order.getState() == OrderState.COMPLETED)
                .filter(order -> order.getCreated() != null 
                        && !order.getCreated().isBefore(startDate))
                .collect(Collectors.toList());

        Map<YearMonth, RevenueByDateDTO> monthlyRevenueMap = new HashMap<>();

        for (Order order : orders) {
            YearMonth yearMonth = YearMonth.from(order.getCreated());
            LocalDate firstDayOfMonth = yearMonth.atDay(1);
            
            RevenueByDateDTO dto = monthlyRevenueMap.getOrDefault(yearMonth,
                    RevenueByDateDTO.builder()
                            .date(firstDayOfMonth)
                            .revenue(0L)
                            .orderCount(0L)
                            .build());
            
            dto.setRevenue(dto.getRevenue() + order.getTotalPrice());
            dto.setOrderCount(dto.getOrderCount() + 1);
            monthlyRevenueMap.put(yearMonth, dto);
        }

        return monthlyRevenueMap.values().stream()
                .sorted(Comparator.comparing(RevenueByDateDTO::getDate))
                .collect(Collectors.toList());
    }

    @Override
    public List<RevenueByDateDTO> getDailyOrdersLastWeek() {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(7);
        
        return getRevenueByDateRange(startDate, endDate);
    }

    // Helper methods
    private Long countOrdersByState(List<Order> orders, OrderState state) {
        return orders.stream()
                .filter(order -> order.getState() == state)
                .count();
    }

    private Long calculateRevenueByDateRange(List<Order> orders, LocalDateTime start, LocalDateTime end) {
        return orders.stream()
                .filter(order -> order.getState() == OrderState.COMPLETED)
                .filter(order -> order.getCreated() != null 
                        && !order.getCreated().isBefore(start) 
                        && !order.getCreated().isAfter(end))
                .mapToLong(Order::getTotalPrice)
                .sum();
    }

    private Long countOrdersByDateRange(List<Order> orders, LocalDateTime start, LocalDateTime end) {
        return orders.stream()
                .filter(order -> order.getCreated() != null 
                        && !order.getCreated().isBefore(start) 
                        && !order.getCreated().isAfter(end))
                .count();
    }
}
