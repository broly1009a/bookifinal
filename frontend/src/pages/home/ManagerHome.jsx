import { useState, useEffect } from "react";
import SidebarManager from "../../components/sidebar/SidebarManager";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import DashboardService from "../../service/DashboardService";

const ManagerHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await DashboardService.getManagerSummary();
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching manager dashboard data:", err);
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
        <SidebarManager />
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
        <SidebarManager />
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
  
  return (
    <div className="home">
      <SidebarManager />
      <div className="homeContainer">
        <Navbar />
        <div className="widgets">
          <Widget type="product" amount={overallStats.totalBooks || 0} />
          <Widget type="feedback" amount={overallStats.activeCustomers || 0} />
          <Widget type="lowstock" amount={overallStats.lowStockBooks || 0} />
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
      </div>
    </div>
  );
};

export default ManagerHome;
