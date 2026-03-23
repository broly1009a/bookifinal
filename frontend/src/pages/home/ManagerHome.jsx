import { useState, useEffect } from "react";
import SidebarManager from "../../components/sidebar/SidebarManager";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";
import DashboardService from "../../service/DashboardService";
import { getAllCollections } from "../../service/CollectionService";
import { getAllAuthors } from "../../service/AuthorService";

const ManagerHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCollections, setTotalCollections] = useState(0);
  const [totalAuthors, setTotalAuthors] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [dashboardRes, collectionsRes, authorsRes] = await Promise.all([
          DashboardService.getManagerSummary(),
          getAllCollections(),
          getAllAuthors(), // 👈 thêm
        ]);

        setDashboardData(dashboardRes.data);
        setTotalCollections(collectionsRes.data.length);
        setTotalAuthors(authorsRes.data.length); // 👈 thêm

        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
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
  const hasMonthlyRevenue =
    dashboardData?.monthlyRevenue && dashboardData.monthlyRevenue.length > 0;
  const hasTopBooks =
    dashboardData?.topSellingBooks && dashboardData.topSellingBooks.length > 0;
  const hasOrderStats =
    dashboardData?.orderStatsByState &&
    dashboardData.orderStatsByState.length > 0;

  return (
    <div className="home">
      <SidebarManager />
      <div className="homeContainer">
        <Navbar />

        {/* Welcome Section */}
        <div
          style={{
            padding: "24px 32px",
            marginBottom: "24px",
            background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(67, 233, 123, 0.2)",
            color: "white",
          }}
        >
          <h1
            style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "700" }}
          >
            📊 Manager Dashboard
          </h1>
          <p style={{ margin: 0, fontSize: "15px", opacity: 0.95 }}>
            Manage inventory, analyze sales trends, and optimize operations
          </p>
        </div>

        {/* Key Metrics */}
        <div
          className="widgets"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            marginBottom: "32px",
          }}
        >
          <Widget type="product" amount={overallStats.totalBooks || 0} />
          <Widget type="author" amount={totalAuthors} />
          <Widget type="collection" amount={totalCollections} /> {/* 👈 thêm */}
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;
