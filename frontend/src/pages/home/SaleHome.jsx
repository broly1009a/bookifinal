import { useState, useEffect } from "react";
import SidebarSale from "../../components/sidebar/SidebarSale";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import DashboardService from "../../service/DashboardService";

const SaleHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await DashboardService.getSaleSummary();
        setDashboardData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching sale dashboard data:", err);
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
        <SidebarSale />
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
        <SidebarSale />
        <div className="homeContainer">
          <Navbar />
          <div className="error">{error}</div>
        </div>
      </div>
    );
  }

  const hasDailyOrders = dashboardData?.dailyOrders && dashboardData.dailyOrders.length > 0;
  const hasOrderStats = dashboardData?.orderStatsByState && dashboardData.orderStatsByState.length > 0;
  const hasTopCustomers = dashboardData?.topCustomers && dashboardData.topCustomers.length > 0;

  return (
    <div className="home">
      <SidebarSale />
      <div className="homeContainer">
        <Navbar />
        
        {/* Main Stats */}
        <div className="widgets">
          <Widget type="order" amount={dashboardData?.totalOrders || 0} />
          <Widget type="earning" amount={dashboardData?.monthRevenue || 0} />
          <Widget type="order" amount={dashboardData?.pendingOrders || 0} />
          <Widget type="order" amount={dashboardData?.shippingOrders || 0} />
        </div>

        {/* Period Stats */}
        <div className="listContainer">
          <div className="listTitle">Sales Overview</div>
          <div className="statsGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px' }}>
            <div className="statCard" style={{ padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
              <h4>Today</h4>
              <p>Orders: {dashboardData?.todayOrders || 0}</p>
              <p>Revenue: ${(dashboardData?.todayRevenue || 0).toLocaleString()}</p>
            </div>
            <div className="statCard" style={{ padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
              <h4>This Week</h4>
              <p>Orders: {dashboardData?.weekOrders || 0}</p>
              <p>Revenue: ${(dashboardData?.weekRevenue || 0).toLocaleString()}</p>
            </div>
            <div className="statCard" style={{ padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
              <h4>This Month</h4>
              <p>Orders: {dashboardData?.monthOrders || 0}</p>
              <p>Revenue: ${(dashboardData?.monthRevenue || 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Order Status Stats */}
        <div className="listContainer">
          <div className="listTitle">Order Status</div>
          <div className="statsGrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', padding: '20px' }}>
            <div className="statCard" style={{ padding: '15px', background: '#fff3cd', borderRadius: '8px' }}>
              <h4>Pending</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboardData?.pendingOrders || 0}</p>
            </div>
            <div className="statCard" style={{ padding: '15px', background: '#d1ecf1', borderRadius: '8px' }}>
              <h4>Processing</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboardData?.processingOrders || 0}</p>
            </div>
            <div className="statCard" style={{ padding: '15px', background: '#d4edda', borderRadius: '8px' }}>
              <h4>Shipping</h4>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{dashboardData?.shippingOrders || 0}</p>
            </div>
          </div>
        </div>

        <div className="charts">
          <Featured data={dashboardData} />
          {hasDailyOrders ? (
            <Chart title="Last 7 Days Orders" aspect={2 / 1} data={dashboardData.dailyOrders} />
          ) : (
            <div className="chart" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              <p>No daily orders data available yet</p>
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

export default SaleHome;
