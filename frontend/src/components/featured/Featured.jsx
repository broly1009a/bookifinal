import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

const Featured = ({ data }) => {
  // Extract data from props or use defaults
  const todayRevenue = data?.todayRevenue || 0;
  const weekRevenue = data?.weekRevenue || 0;
  const monthRevenue = data?.monthRevenue || 0;
  const totalRevenue = data?.totalRevenue || 0;
  const todayOrders = data?.todayOrders || 0;
  const weekOrders = data?.weekOrders || 0;
  const monthOrders = data?.monthOrders || 0;

  // Calculate percentage (e.g., today's revenue vs week's average)
  const weeklyTarget = monthRevenue / 4; // Simple target: monthly revenue / 4 weeks
  const percentage = weeklyTarget > 0 ? Math.min(Math.round((weekRevenue / weeklyTarget) * 100), 100) : 0;

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };

  // Determine if values are positive or negative compared to previous period
  const weekTrend = weekRevenue >= weeklyTarget ? 'positive' : 'negative';
  const monthTrend = monthRevenue > 0 ? 'positive' : 'neutral';

  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Revenue</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={percentage} text={`${percentage}%`} strokeWidth={5} />
        </div>
        <p className="title">Total sales made today</p>
        <p className="amount">{formatCurrency(todayRevenue)}</p>
        <p className="desc">
          {todayOrders} order{todayOrders !== 1 ? 's' : ''} today. Last payments may not be included.
        </p>
        <div className="summary">
          <div className="item">
            <div className="itemTitle">Target (Week Avg)</div>
            <div className={`itemResult ${weeklyTarget > 0 ? 'neutral' : 'negative'}`}>
              {weeklyTarget > 0 ? <KeyboardArrowUpOutlinedIcon fontSize="small"/> : <KeyboardArrowDownIcon fontSize="small"/>}
              <div className="resultAmount">{formatCurrency(weeklyTarget)}</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Week</div>
            <div className={`itemResult ${weekTrend}`}>
              {weekTrend === 'positive' ? <KeyboardArrowUpOutlinedIcon fontSize="small"/> : <KeyboardArrowDownIcon fontSize="small"/>}
              <div className="resultAmount">{formatCurrency(weekRevenue)}</div>
            </div>
          </div>
          <div className="item">
            <div className="itemTitle">Last Month</div>
            <div className={`itemResult ${monthTrend}`}>
              {monthRevenue > 0 ? <KeyboardArrowUpOutlinedIcon fontSize="small"/> : <KeyboardArrowDownIcon fontSize="small"/>}
              <div className="resultAmount">{formatCurrency(monthRevenue)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
