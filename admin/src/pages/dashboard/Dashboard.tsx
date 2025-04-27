import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Line, Pie, Bar } from 'react-chartjs-2';
import "../../styles/dashboard.css"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  fetchUsers,
  fetchOrders,
  fetchPayments,
  fetchProducts,
  fetchBundles,
  fetchDiscounts,
} from '../../services/apiAdmin';
import { AdminOrderItem, AdminOrder } from '../../types/Order';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    activeDiscounts: 0,
    totalProducts: 0,
    totalBundles: 0,
  });
  const [orderTrends, setOrderTrends] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [revenueTrends, setRevenueTrends] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [discountUsage, setDiscountUsage] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [topProducts, setTopProducts] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [topBundles, setTopBundles] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [orderStatus, setOrderStatus] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] });
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Fetch users
        const users = await fetchUsers();
        const activeUsers = users.filter((user) => user.isActive).length;

        // Fetch orders
        const orders = await fetchOrders();
        const totalOrders = orders.length;

        // Fetch payments for revenue
        const payments = await fetchPayments('COMPLETED');
        const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

        // Fetch products and bundles
        const productsResult = await fetchProducts(0, 1000);
        const bundlesResult = await fetchBundles(0, 1000);
        const lowStockItems = [
          ...productsResult.content.filter((p) => p.stock < 5),
          ...bundlesResult.content.filter((b) => b.stock < 5),
        ].length;
        const totalProductsCount = productsResult.content.length;
        const totalBundlesCount = bundlesResult.content.length;

        // Fetch recent orders
        const recentOrdersData = orders
          .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
          .slice(0, 5)
          .map((order) => ({
            ...order,
            totalAmount: order.orderItems.reduce((sum, item) => sum + (item.quantity * item.price), 0),
          }));
        setRecentOrders(recentOrdersData);

        // Fetch discounts
        const discounts = await fetchDiscounts();
        const activeDiscounts = discounts.filter((d) => d.isActive).length;

        // Set metrics
        setMetrics({
          totalUsers: activeUsers,
          totalOrders,
          totalRevenue,
          lowStockItems,
          activeDiscounts,
          totalProducts: totalProductsCount,
          totalBundles: totalBundlesCount,
        });

        // Order trends (last 30 days)
        const today = new Date();
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          return date.toISOString().split('T')[0];
        }).reverse();
        const orderCounts = last30Days.map((date) => ({
          date,
          count: orders.filter((o) => o.orderDate?.startsWith(date)).length,
        }));
        setOrderTrends({
          labels: orderCounts.map((o) => o.date),
          data: orderCounts.map((o) => o.count),
        });

        // Revenue trends (last 30 days)
        const revenueCounts = last30Days.map((date) => ({
          date,
          amount: payments
            .filter((p) => p.paymentDate?.startsWith(date))
            .reduce((sum, p) => sum + (p.amount || 0), 0),
        }));
        setRevenueTrends({
          labels: revenueCounts.map((r) => r.date),
          data: revenueCounts.map((r) => r.amount),
        });

        // Discount usage
        const discountMap = new Map();
        discounts.forEach((d) => discountMap.set(d.code, 0));
        discountMap.set('No Discount', 0);
        orders.forEach((order) => {
          const key = order.discountCode || 'No Discount';
          discountMap.set(key, (discountMap.get(key) || 0) + 1);
        });
        const discountUsageData = Array.from(discountMap.entries()).map(([code, count]) => ({
          code,
          count,
        }));
        setDiscountUsage({
          labels: discountUsageData.map((d) => d.code),
          data: discountUsageData.map((d) => d.count),
        });

        // Top-selling products (by revenue)
        const productSales = new Map();
        orders.forEach((order) => {
          order.orderItems.forEach((item) => {
            if (item.productName) {
              const currentSales = productSales.get(item.productName) || 0;
              productSales.set(item.productName, currentSales + item.quantity * item.price);
            }
          });
        });
        const sortedProducts = Array.from(productSales.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        setTopProducts({
          labels: sortedProducts.map(([name]) => name),
          data: sortedProducts.map(([, sales]) => sales),
        });

        // Top-selling bundles (by revenue)
        const bundleSales = new Map();
        orders.forEach((order) => {
          order.orderItems.forEach((item) => {
            if (item.bundleName) {
              const currentSales = bundleSales.get(item.bundleName) || 0;
              bundleSales.set(item.bundleName, currentSales + item.quantity * item.price);
            }
          });
        });
        console.log('Bundle Sales Map:', Object.fromEntries(bundleSales)); // Debug log
        const sortedBundles = Array.from(bundleSales.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5);
        setTopBundles({
          labels: sortedBundles.map(([name]) => name),
          data: sortedBundles.map(([, sales]) => sales),
        });

        // Order status distribution
        const statusCounts = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => ({
          status,
          count: orders.filter((o) => o.status === status).length,
        }));
        setOrderStatus({
          labels: statusCounts.map((s) => s.status),
          data: statusCounts.map((s) => s.count),
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  // Chart options
  const chartOptions = {
    line: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {},
          border: { display: false },
        },
        x: {
          grid: { display: false },
        },
      },
    },
    bar: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {},
          border: { display: false },
        },
        x: {
          grid: { display: false },
        },
      },
    },
    pie: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' as 'right' },
      },
    },
  };

  // Order trends line chart
  const orderTrendsChart = {
    labels: orderTrends.labels,
    datasets: [
      {
        label: 'Orders',
        data: orderTrends.data,
        borderColor: '#4B0082',
        backgroundColor: 'rgba(75, 0, 130, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: '#4B0082',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
      },
    ],
  };

  // Revenue trends line chart
  const revenueTrendsChart = {
    labels: revenueTrends.labels,
    datasets: [
      {
        label: 'Revenue (NPR)',
        data: revenueTrends.data,
        borderColor: '#DAA520',
        backgroundColor: 'rgba(218, 165, 32, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        pointBackgroundColor: '#DAA520',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
      },
    ],
  };

  // Discount usage pie chart
  const discountUsageChart = {
    labels: discountUsage.labels,
    datasets: [
      {
        data: discountUsage.data,
        backgroundColor: ['#4B0082', '#DAA520', '#228B22', '#B22222', '#6A5ACD', '#C71585'],
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  // Top products bar chart
  const topProductsChart = {
    labels: topProducts.labels,
    datasets: [
      {
        label: 'Sales (NPR)',
        data: topProducts.data,
        backgroundColor: 'rgba(75, 0, 130, 0.7)',
        borderColor: '#4B0082',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Top bundles bar chart
  const topBundlesChart = {
    labels: topBundles.labels,
    datasets: [
      {
        label: 'Sales (NPR)',
        data: topBundles.data,
        backgroundColor: 'rgba(218, 165, 32, 0.7)',
        borderColor: '#DAA520',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Order status pie chart
  const orderStatusChart = {
    labels: orderStatus.labels,
    datasets: [
      {
        data: orderStatus.data,
        backgroundColor: ['#DAA520', '#4682B4', '#4B0082', '#228B22', '#B22222'],
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="dashboard">
        {/* Header */}
        <div className="header">
          <h1>Pujakriti Admin Dashboard</h1>
          <div className="timestamp">Last updated: {new Date().toLocaleString()}</div>
        </div>

        {/* Metrics Cards */}
        <div className="metrics">
          <div className="metric-card">
            <p>Total Users</p>
            <h3>{metrics.totalUsers}</h3>
          </div>
          <div className="metric-card">
            <p>Total Orders</p>
            <h3>{metrics.totalOrders}</h3>
          </div>
          <div className="metric-card">
            <p>Total Revenue</p>
            <h3>NPR {metrics.totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="metric-card">
            <p>Low Stock Items</p>
            <h3>{metrics.lowStockItems}</h3>
          </div>
          <div className="metric-card">
            <p>Active Discounts</p>
            <h3>{metrics.activeDiscounts}</h3>
          </div>
          <div className="metric-card">
            <p>Total Products</p>
            <h3>{metrics.totalProducts}</h3>
          </div>
          <div className="metric-card">
            <p>Total Bundles</p>
            <h3>{metrics.totalBundles}</h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions">
            <Link to="/admin/users">Manage Users</Link>
            <Link to="/admin/products">Manage Products</Link>
            <Link to="/admin/bundles">Manage Bundles</Link>
            <Link to="/admin/orders">View Orders</Link>
            <Link to="/admin/discounts">Manage Discounts</Link>
            <Link to="/admin/reviews">Manage Reviews</Link>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts">
          <h2>Analytics Overview</h2>
          {/* Line Charts */}
          <div className="chart-row">
            <div className="chart-card">
              <h3>Order Trends (Last 30 Days)</h3>
              <div className="chart-container">
                <Line data={orderTrendsChart} options={chartOptions.line} />
              </div>
            </div>
            <div className="chart-card">
              <h3>Revenue Trends (Last 30 Days)</h3>
              <div className="chart-container">
                <Line data={revenueTrendsChart} options={chartOptions.line} />
              </div>
            </div>
          </div>
          {/* Bar Charts */}
          <div className="chart-row">
            <div className="chart-card">
              <h3>Top 5 Products by Sales</h3>
              <div className="chart-container">
                <Bar data={topProductsChart} options={chartOptions.bar} />
              </div>
            </div>
            <div className="chart-card">
              <h3>Top 5 Bundles by Sales</h3>
              <div className="chart-container">
                {topBundles.labels.length > 0 ? (
                  <Bar data={topBundlesChart} options={chartOptions.bar} />
                ) : (
                  <div className="no-data">No bundle sales data available</div>
                )}
              </div>
            </div>
          </div>
          {/* Pie Charts */}
          <div className="chart-row">
            <div className="chart-card">
              <h3>Discount Code Usage</h3>
              <div className="chart-container">
                <Pie data={discountUsageChart} options={chartOptions.pie} />
              </div>
            </div>
            <div className="chart-card">
              <h3>Order Status Distribution</h3>
              <div className="chart-container">
                <Pie data={orderStatusChart} options={chartOptions.pie} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="recent-orders">
          <div className="header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders">View All Orders</Link>
          </div>
          {recentOrders.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td>#{order.orderId}</td>
                    <td>{order.userName || 'N/A'}</td>
                    <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`status ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>NPR {order.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-orders">No recent orders found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;