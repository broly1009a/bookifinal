# Dashboard API Documentation

## Tổng quan

Hệ thống Dashboard API cung cấp các endpoint thống kê cho 3 role: **ADMIN**, **MANAGER**, và **SALE**.

> **⚠️ LƯU Ý QUAN TRỌNG:** Tất cả các endpoint `/api/v1/dashboard/**` hiện đã được cấu hình **KHÔNG CẦN XÁC THỰC JWT**. Điều này giúp dễ dàng test và phát triển. Nếu cần bảo mật, hãy xem phần "Cấu hình phân quyền" bên dưới.

## Cấu trúc Files

### DTO Classes (dto/)
- `DashboardStatsDTO.java` - Thống kê tổng quan
- `RevenueByDateDTO.java` - Doanh thu theo ngày
- `TopBookDTO.java` - Sách bán chạy nhất
- `OrderStatsDTO.java` - Thống kê đơn hàng theo trạng thái
- `CustomerStatsDTO.java` - Thống kê khách hàng

### Service Layer (service/)
- `DashboardService.java` - Interface định nghĩa các phương thức
- `DashboardServiceImpl.java` - Implementation logic thống kê

### Controller (controller/)
- `DashboardController.java` - REST API endpoints

## API Endpoints

### Base URL
```
/api/v1/dashboard
```

### 1. Thống kê tổng quan
**Endpoint:** `GET /stats/overall`  
**Roles:** ADMIN, MANAGER  
**Mô tả:** Lấy thống kê tổng quan về sách, đơn hàng, khách hàng, doanh thu

**Response:**
```json
{
  "totalBooks": 1000,
  "totalOrders": 500,
  "totalCustomers": 200,
  "totalRevenue": 50000000,
  "pendingOrders": 10,
  "processingOrders": 5,
  "shippingOrders": 8,
  "completedOrders": 450,
  "canceledOrders": 27,
  "activeBooks": 950,
  "inactiveBooks": 50,
  "lowStockBooks": 15,
  "todayRevenue": 1000000,
  "weekRevenue": 7000000,
  "monthRevenue": 30000000,
  "todayOrders": 5,
  "weekOrders": 35,
  "monthOrders": 150,
  "newCustomersThisMonth": 20,
  "activeCustomers": 180
}
```

### 2. Doanh thu theo khoảng thời gian
**Endpoint:** `GET /revenue/by-date-range`  
**Roles:** ADMIN, MANAGER, SALE  
**Parameters:**
- `startDate` (required): yyyy-MM-dd'T'HH:mm:ss
- `endDate` (required): yyyy-MM-dd'T'HH:mm:ss

**Example:**
```
GET /revenue/by-date-range?startDate=2024-01-01T00:00:00&endDate=2024-01-31T23:59:59
```

**Response:**
```json
[
  {
    "date": "2024-01-01",
    "revenue": 1000000,
    "orderCount": 10
  },
  {
    "date": "2024-01-02",
    "revenue": 1500000,
    "orderCount": 15
  }
]
```

### 3. Doanh thu theo tháng (12 tháng gần nhất)
**Endpoint:** `GET /revenue/monthly`  
**Roles:** ADMIN, MANAGER  

**Response:**
```json
[
  {
    "date": "2024-01-01",
    "revenue": 30000000,
    "orderCount": 150
  }
]
```

### 4. Đơn hàng trong 7 ngày gần nhất
**Endpoint:** `GET /orders/daily-last-week`  
**Roles:** ADMIN, MANAGER, SALE  

### 5. Sách bán chạy nhất
**Endpoint:** `GET /books/top-selling`  
**Roles:** ADMIN, MANAGER  
**Parameters:**
- `limit` (optional, default: 10): Số lượng sách

**Response:**
```json
[
  {
    "bookId": 1,
    "bookTitle": "Sách ABC",
    "bookISBN": "978-123-456",
    "soldQuantity": 100,
    "revenue": 5000000,
    "imageUrl": "https://..."
  }
]
```

### 6. Thống kê đơn hàng theo trạng thái
**Endpoint:** `GET /orders/stats-by-state`  
**Roles:** ADMIN, MANAGER, SALE  

**Response:**
```json
[
  {
    "orderState": "COMPLETED",
    "count": 450,
    "totalRevenue": 50000000
  },
  {
    "orderState": "PROCESSING",
    "count": 5,
    "totalRevenue": 0
  }
]
```

### 7. Khách hàng mua nhiều nhất
**Endpoint:** `GET /customers/top`  
**Roles:** ADMIN, MANAGER, SALE  
**Parameters:**
- `limit` (optional, default: 10): Số lượng khách hàng

**Response:**
```json
[
  {
    "customerId": 1,
    "customerName": "Nguyễn Văn A",
    "email": "a@example.com",
    "phone": "0123456789",
    "totalOrders": 20,
    "totalSpent": 10000000
  }
]
```

### 8. Dashboard tổng hợp cho ADMIN
**Endpoint:** `GET /admin/summary`  
**Roles:** ADMIN only  
**Mô tả:** Lấy tất cả thông tin cần thiết cho dashboard admin trong 1 request

**Response:**
```json
{
  "overallStats": { ... },
  "topSellingBooks": [ ... ],
  "orderStatsByState": [ ... ],
  "monthlyRevenue": [ ... ],
  "topCustomers": [ ... ]
}
```

### 9. Dashboard tổng hợp cho MANAGER
**Endpoint:** `GET /manager/summary`  
**Roles:** MANAGER only  
**Mô tả:** Lấy thông tin quản lý cần thiết

**Response:**
```json
{
  "overallStats": { ... },
  "topSellingBooks": [ ... ],
  "orderStatsByState": [ ... ],
  "monthlyRevenue": [ ... ]
}
```

### 10. Dashboard tổng hợp cho SALE
**Endpoint:** `GET /sale/summary`  
**Roles:** SALE only  
**Mô tả:** Lấy thông tin bán hàng cần thiết

**Response:**
```json
{
  "totalOrders": 500,
  "todayOrders": 5,
  "weekOrders": 35,
  "monthOrders": 150,
  "todayRevenue": 1000000,
  "weekRevenue": 7000000,
  "monthngOrders": 8,
  "orderStatsByState": [ ... ],
  "dailyOrders": [ ... ],
  "topCustomers": [ ... ]
}
```

Revenue": 30000000,
"pendingOrders": 10,
"processingOrders": 5,
"shippi## Phân quyền theo Role

### ADMIN (Toàn quyền)
- ✅ Tất cả endpoints

### MANAGER (Quản lý)
- ✅ `/stats/overall` - Thống kê tổng quan
- ✅ `/revenue/by-date-range` - Doanh thu theo khoảng thời gian
- ✅ `/revenue/monthly` - Doanh thu theo tháng
- ✅ `/orders/daily-last-week` - Đơn hàng 7 ngày
- ✅ `/books/top-selling` - Sách bán chạy
- ✅ `/orders/stats-by-state` - Thống kê đơn hàng
- ✅ `/customers/top` - Top khách hàng
- ✅ `/manager/summary` - Dashboard manager

### SALE (Nhân viên bán hàng)
- ✅ `/revenue/by-date-range` - Doanh thu theo khoảng thời gian
- ✅ `/orders/daily-last-week` - Đơn hàng 7 ngày
- ✅ `/orders/stats-by-state` - Thống kê đơn hàng
- ✅ `/customers/top` - Top khách hàng
- ✅ `/sale/summary` - Dashboard sale

## Cách cấu hình phân quyền (Security)

Để cấu hình phân quyền cho các endpoints, bạn cần update `SecurityConfiguration.java`:

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(auth -> auth
            // Dashboard endpoints cho ADMIN
            .requestMatchers("/api/v1/dashboard/admin/**").hasAuthority("ADMIN")
            .requestMatchers("/api/v1/dashboard/stats/overall").hasAnyAuthority("ADMIN", "MANAGER")
            .requestMatchers("/api/v1/dashboard/books/top-selling").hasAnyAuthority("ADMIN", "MANAGER")
            .requestMatchers("/api/v1/dashboard/revenue/monthly").hasAnyAuthority("ADMIN", "MANAGER")
            
            // Dashboard endpoints cho MANAGER
            .requestMatchers("/api/v1/dashboard/manager/**").hasAnyAuthority("ADMIN", "MANAGER")
            
            // Dashboard endpoints cho SALE
            .requestMatchers("/api/v1/dashboard/sale/**").hasAnyAuthority("ADMIN", "MANAGER", "SALE")
            .requestMatchers("/api/v1/dashboard/orders/**").hasAnyAuthority("ADMIN", "MANAGER", "SALE")
            .requestMatchers("/api/v1/dashboard/customers/**").hasAnyAuthority("ADMIN", "MANAGER", "SALE")
            .requestMatchers("/api/v1/dashboard/revenue/by-date-range").hasAnyAuthority("ADMIN", "MANAGER", "SALE")
            
            // Các endpoints khác
            .requestMatchers("/**").permitAll()
            .anyRequest().authenticated()
        )
        .sessionManagement(management -> management
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authenticationProvider(authenticationProvider)
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
}
```

## Testing

### Sử dụng Postman hoặc curl

1. **Lấy token đăng nhập:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

2. **Gọi dashboard API:**
```bash
curl -X GET http://localhost:8080/api/v1/dashboard/admin/summary \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Lưu ý

1. **Security Configuration**: Hiện tại SecurityConfiguration cho phép tất cả requests (`permitAll()`). Bạn cần cập nhật để thêm phân quyền thực sự.

2. **Data Validation**: Đảm bảo kiểm tra dữ liệu đầu vào, đặc biệt là các tham số date.

3. **Performance**: Với dữ liệu lớn, nên cân nhắc:
   - Thêm caching cho các thống kê
   - Sử dụng pagination cho top lists
   - Tối ưu queries với native SQL

4. **Timezone**: Hiện tại sử dụng LocalDateTime, cân nhắc xử lý timezone cho multi-region.

5. **Testing**: Nên viết unit tests và integration tests cho các service methods.
