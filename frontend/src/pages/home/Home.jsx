import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import DashboardService from "../../service/DashboardService";

const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await DashboardService.getAdminSummary();
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching admin dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar />
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar />
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  const overallStats = dashboardData?.overallStats || {};
  const hasMonthlyRevenue = dashboardData?.monthlyRevenue && dashboardData.monthlyRevenue.length > 0;
  const hasTopBooks = dashboardData?.topSellingBooks && dashboardData.topSellingBooks.length > 0;
  const hasOrderStats = dashboardData?.orderStatsByState && dashboardData.orderStatsByState.length > 0;
  const hasTopCustomers = dashboardData?.topCustomers && dashboardData.topCustomers.length > 0;
  
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="user" amount={overallStats.totalCustomers || 0} />
          <Widget type="order" amount={overallStats.totalOrders || 0} />
          <Widget type="earning" amount={overallStats.totalRevenue || 0} />
          <Widget type="balance" amount={overallStats.monthRevenue || 0} />
        </div>
        <div className="charts">
          <Featured data={overallStats} />
          {hasMonthlyRevenue ? (
            <Chart title="Last 12 Months Revenue" aspect={2 / 1} data={dashboardData.monthlyRevenue} />
          ) : (
            <div className="chart" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              <p>No revenue data available yet</p>
            </div>
          )}
        </div>
        <div className="listContainer">
          <div className="listTitle">Top Selling Books</div>
          {hasTopBooks ? (
            <Table type="books" data={dashboardData.topSellingBooks} />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              No selling data available yet
            </div>
          )}
        </div>
        <div className="listContainer">
          <div className="listTitle">Order Statistics by State</div>
          {hasOrderStats ? (
            <Table type="orderStats" data={dashboardData.orderStatsByState} />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              No order statistics available
            </div>
          )}
        </div>
        <div className="listContainer">
          <div className="listTitle">Top Customers</div>
          {hasTopCustomers ? (
            <Table type="customers" data={dashboardData.topCustomers} />
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              No customer data available yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
