import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/v1/dashboard';

// Get token from localStorage or context
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  return token;
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include token in all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle JWT errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle JWT signature errors or authentication failures
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Authentication error - Invalid or expired token');
      
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

class DashboardService {
  // 1. Get overall statistics (ADMIN, MANAGER)
  getOverallStats() {
    return axiosInstance.get('/stats/overall');
  }

  // 2. Get revenue by date range (ADMIN, MANAGER, SALE)
  getRevenueByDateRange(startDate, endDate) {
    return axiosInstance.get('/revenue/by-date-range', {
      params: { startDate, endDate }
    });
  }

  // 3. Get monthly revenue (12 months) (ADMIN, MANAGER)
  getMonthlyRevenue() {
    return axiosInstance.get('/revenue/monthly');
  }

  // 4. Get daily orders for last week (ADMIN, MANAGER, SALE)
  getDailyOrdersLastWeek() {
    return axiosInstance.get('/orders/daily-last-week');
  }

  // 5. Get top selling books (ADMIN, MANAGER)
  getTopSellingBooks(limit = 10) {
    return axiosInstance.get('/books/top-selling', {
      params: { limit }
    });
  }

  // 6. Get order stats by state (ADMIN, MANAGER, SALE)
  getOrderStatsByState() {
    return axiosInstance.get('/orders/stats-by-state');
  }

  // 7. Get top customers (ADMIN, MANAGER, SALE)
  getTopCustomers(limit = 10) {
    return axiosInstance.get('/customers/top', {
      params: { limit }
    });
  }

  // 8. Get admin dashboard summary (ADMIN only)
  getAdminSummary() {
    return axiosInstance.get('/admin/summary');
  }

  // 9. Get manager dashboard summary (MANAGER only)
  getManagerSummary() {
    return axiosInstance.get('/manager/summary');
  }

  // 10. Get sale dashboard summary (SALE only)
  getSaleSummary() {
    return axiosInstance.get('/sale/summary');
  }
}

export default new DashboardService();
