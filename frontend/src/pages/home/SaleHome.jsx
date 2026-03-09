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
        
        {/* Welcome Section */}
        <div style={{ 
          padding: '24px 32px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(245, 87, 108, 0.2)',
          color: 'white'
        }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>
            💼 Sales Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: '15px', opacity: 0.95 }}>
            Track orders, manage sales, and monitor customer relationships
          </p>
        </div>

        {/* Main Stats */}
        <div className="widgets" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <Widget type="order" amount={dashboardData?.totalOrders || 0} />
          <Widget type="earning" amount={dashboardData?.monthRevenue || 0} />
          <Widget type="order" amount={dashboardData?.pendingOrders || 0} />
          <Widget type="order" amount={dashboardData?.shippingOrders || 0} />
        </div>

        {/* Period Stats */}
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
              📊 Sales Overview
            </h2>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '24px', 
            padding: '28px' 
          }}>
            <div style={{ 
              padding: '24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.25)',
              color: 'white',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(102, 126, 234, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.25)';
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px', fontWeight: '500' }}>📅 Today</div>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>{dashboardData?.todayOrders || 0}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Orders</div>
              <div style={{ fontSize: '20px', fontWeight: '600', marginTop: '12px' }}>
                ${(dashboardData?.todayRevenue || 0).toLocaleString()}
              </div>
            </div>
            <div style={{ 
              padding: '24px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '12px',
              boxShadow: '0 8px 20px rgba(245, 87, 108, 0.25)',
              color: 'white',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(245, 87, 108, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 87, 108, 0.25)';
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px', fontWeight: '500' }}>📆 This Week</div>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>{dashboardData?.weekOrders || 0}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Orders</div>
              <div style={{ fontSize: '20px', fontWeight: '600', marginTop: '12px' }}>
                ${(dashboardData?.weekRevenue || 0).toLocaleString()}
              </div>
            </div>
            <div style={{ 
              padding: '24px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '12px',
              boxShadow: '0 8px 20px rgba(79, 172, 254, 0.25)',
              color: 'white',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 28px rgba(79, 172, 254, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(79, 172, 254, 0.25)';
            }}>
              <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '12px', fontWeight: '500' }}>🗓️ This Month</div>
              <div style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>{dashboardData?.monthOrders || 0}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Orders</div>
              <div style={{ fontSize: '20px', fontWeight: '600', marginTop: '12px' }}>
                ${(dashboardData?.monthRevenue || 0).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Stats */}
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
              📦 Order Status Overview
            </h2>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '24px', 
            padding: '28px' 
          }}>
            <div style={{ 
              padding: '24px',
              background: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '12px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 193, 7, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '14px', color: '#856404', marginBottom: '12px', fontWeight: '600' }}>⏳ Pending</div>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#856404' }}>{dashboardData?.pendingOrders || 0}</div>
            </div>
            <div style={{ 
              padding: '24px',
              background: '#d1ecf1',
              border: '2px solid #17a2b8',
              borderRadius: '12px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(23, 162, 184, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '14px', color: '#0c5460', marginBottom: '12px', fontWeight: '600' }}>⚙️ Processing</div>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#0c5460' }}>{dashboardData?.processingOrders || 0}</div>
            </div>
            <div style={{ 
              padding: '24px',
              background: '#d4edda',
              border: '2px solid #28a745',
              borderRadius: '12px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(40, 167, 69, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ fontSize: '14px', color: '#155724', marginBottom: '12px', fontWeight: '600' }}>🚚 Shipping</div>
              <div style={{ fontSize: '36px', fontWeight: '700', color: '#155724' }}>{dashboardData?.shippingOrders || 0}</div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="charts" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <Featured data={dashboardData} />
          {hasDailyOrders ? (
            <Chart title="Last 7 Days Orders" aspect={2 / 1} data={dashboardData.dailyOrders} />
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
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📈</div>
              <p style={{ color: '#9ca3af', margin: 0, fontSize: '15px' }}>
                No daily orders data available yet
              </p>
            </div>
          )}
        </div>

        {/* Order Statistics by State */}
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

export default SaleHome;
