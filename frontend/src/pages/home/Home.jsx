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
        
        {/* Welcome Section */}
        <div style={{ 
          padding: '24px 32px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)',
          color: 'white'
        }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>
            👋 Welcome to Admin Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: '15px', opacity: 0.95 }}>
            Monitor your business performance and manage operations efficiently
          </p>
        </div>

        {/* Key Metrics */}
        <div className="widgets" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <Widget type="user" amount={overallStats.totalCustomers || 0} />
          <Widget type="order" amount={overallStats.totalOrders || 0} />
          <Widget type="earning" amount={overallStats.totalRevenue || 0} />
          <Widget type="balance" amount={overallStats.monthRevenue || 0} />
        </div>

        {/* Charts Section */}
        <div className="charts" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <Featured data={overallStats} />
          {hasMonthlyRevenue ? (
            <Chart title="Last 12 Months Revenue" aspect={2 / 1} data={dashboardData.monthlyRevenue} />
          ) : (
            <div style={{ 
              padding: '40px 20px',
              textAlign: 'center',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
              <p style={{ color: '#9ca3af', margin: 0, fontSize: '15px' }}>
                No revenue data available yet
              </p>
            </div>
          )}
        </div>

        {/* Top Selling Books */}
        <div style={{ 
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          marginBottom: '24px',
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <div style={{ 
            padding: '24px 28px',
            borderBottom: '1px solid #f0f0f0',
            background: 'linear-gradient(to right, #f9fafb, #ffffff)'
          }}>
            <h2 style={{ 
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📚 Top Selling Books
            </h2>
          </div>
          <div style={{ padding: '20px' }}>
            {hasTopBooks ? (
              <Table type="books" data={dashboardData.topSellingBooks} />
            ) : (
              <div style={{ 
                padding: '40px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '15px' }}>
                  No selling data available yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Statistics */}
        <div style={{ 
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          marginBottom: '24px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '24px 28px',
            borderBottom: '1px solid #f0f0f0',
            background: 'linear-gradient(to right, #f9fafb, #ffffff)'
          }}>
            <h2 style={{ 
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              📍 Order Statistics by State
            </h2>
          </div>
          <div style={{ padding: '20px' }}>
            {hasOrderStats ? (
              <Table type="orderStats" data={dashboardData.orderStatsByState} />
            ) : (
              <div style={{ 
                padding: '40px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '15px' }}>
                  No order statistics available
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Customers */}
        <div style={{ 
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          marginBottom: '24px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '24px 28px',
            borderBottom: '1px solid #f0f0f0',
            background: 'linear-gradient(to right, #f9fafb, #ffffff)'
          }}>
            <h2 style={{ 
              margin: 0,
              fontSize: '20px',
              fontWeight: '700',
              color: '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              ⭐ Top Customers
            </h2>
          </div>
          <div style={{ padding: '20px' }}>
            {hasTopCustomers ? (
              <Table type="customers" data={dashboardData.topCustomers} />
            ) : (
              <div style={{ 
                padding: '40px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '15px' }}>
                  No customer data available yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
