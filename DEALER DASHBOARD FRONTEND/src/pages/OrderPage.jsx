import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./OrderPage.css";
import { useEffect, useState } from "react";

export default function OrdersPage() {

  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    const dealerId = localStorage.getItem("dealerId");

    fetch(`http://localhost:8087/api/dashboard/${dealerId}`)
      .then(res => res.json())
      .then(data => {
        console.log("API DATA:", data);
        setDashboard(data);
      })
      .catch(err => console.error(err));
  }, []);

  if (!dashboard) return <div>Loading...</div>;

  return (
    <div className="db-root">

      {/* Sidebar */}
      <aside className="db-sidebar">

        <div className="db-sidebar-brand">
          <div className="db-logo-mark">I</div>

          <div>
            <div className="db-brand-name">Instabuy</div>
            <div className="db-brand-sub">Seller Space</div>
          </div>
        </div>

        <nav className="db-nav">

          <button className="db-nav-item" onClick={() => navigate("/dashboard")}>
            <span className="db-nav-icon">⊞</span>
            <span className="db-nav-label">Dashboard</span>
          </button>

          <button className="db-nav-item" onClick={() => navigate("/products")}>
            <span className="db-nav-icon">🗂</span>
            <span className="db-nav-label">Products</span>
          </button>

          <button className="db-nav-item" onClick={() => navigate("/lowstock")}>
            <span className="db-nav-icon">⚠</span>
            <span className="db-nav-label">Low Stock</span>
          </button>

          <button className="db-nav-item db-nav-item--active">
            <span className="db-nav-icon">📈</span>
            <span className="db-nav-label">Sales Insights</span>
          </button>

        </nav>

        <div className="db-sidebar-footer">
          <div className="db-user-card" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
            <div className="db-user-avatar">
              {(localStorage.getItem("dealerName") || "D")[0]}
            </div>

            <div>
              <div className="db-user-name">
                {localStorage.getItem("dealerName")}
              </div>
              <div className="db-user-role">Seller</div>
            </div>
          </div>
        </div>

      </aside>


      {/* MAIN */}
      <main className="db-main">

        <header className="db-header">
          <div>
            <h1 className="db-page-title">Sales Insights</h1>
            <p className="db-page-sub">
              Track product movement and smart inventory decisions
            </p>
          </div>
        </header>

        <div className="db-content">

          {/* Metrics */}
          <div className="db-stats-row">

            <div className="db-stat-card db-stat-card--green">
              <div className="db-stat-header">
                <span className="db-stat-icon">🔥</span>
                <span className="db-stat-delta db-stat-delta--green">
                  Best Seller
                </span>
              </div>

              <div className="db-stat-value">
                {dashboard.totalSold}
              </div>

              <div className="db-stat-label">
                Units sold this month
              </div>
            </div>


            <div className="db-stat-card db-stat-card--warn">
              <div className="db-stat-header">
                <span className="db-stat-icon">🐢</span>
                <span className="db-stat-delta db-stat-delta--warn">
                  Needs Action
                </span>
              </div>

              {/* FIX 1 — null safety on slowProducts.length */}
              <div className="db-stat-value">
                {(dashboard.slowProducts || []).length}
              </div>

              <div className="db-stat-label">
                Slow moving products
              </div>
            </div>


            <div className="db-stat-card db-stat-card--amber">
              <div className="db-stat-header">
                <span className="db-stat-icon">📈</span>
                <span className="db-stat-delta db-stat-delta--amber">
                  Healthy
                </span>
              </div>

              <div className="db-stat-value">
                {dashboard.turnover}%
              </div>

              <div className="db-stat-label">
                Inventory turnover rate
              </div>
            </div>

          </div>


          <div className="db-grid-two">

            {/* Top Selling */}
            <div className="db-card">

              <div className="db-card-head">
                <div>
                  <h2 className="db-card-title">Top Selling Products</h2>
                  <p className="db-card-sub">Fast moving inventory</p>
                </div>
              </div>

              <div className="db-table-wrap">

                <table className="db-table">

                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Sold</th>
                      <th>Velocity</th>
                    </tr>
                  </thead>

                  <tbody>

                    {/* FIX 2 — null safety on topProducts */}
                    {(dashboard.topProducts || []).map((p, i) => (
                      <tr key={i}>
                        <td className="db-td-name">
                          {p.productName}
                        </td>

                        <td>{p.sold}</td>

                        <td>
                          <span className="db-badge db-badge--active">
                            High
                          </span>
                        </td>
                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            </div>


            {/* Low Moving */}
            <div className="db-card">

              <div className="db-card-head">
                <div>
                  <h2 className="db-card-title">Low Moving Products</h2>
                  <p className="db-card-sub">
                    Products requiring attention
                  </p>
                </div>
              </div>

              <div className="db-table-wrap">

                <table className="db-table">

                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {/* FIX 3 — null safety on slowProducts */}
                    {(dashboard.slowProducts || []).map((p, i) => (
                      <tr key={i}>
                        <td className="db-td-name">
                          {p.productName}
                        </td>

                        <td>{p.stock}</td>

                        <td>
                          <span className="db-badge db-badge--low">
                            Slow Moving
                          </span>
                        </td>
                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          </div>


          {/* Smart Recommendations */}
          <div className="db-card insights-card">

            <div className="db-card-head">
              <div>
                <h2 className="db-card-title">Smart Recommendations</h2>
                <p className="db-card-sub">Growth suggestions</p>
              </div>
            </div>

            <div className="rec-grid">

              <div className="rec-box">
                Restock fast selling products
              </div>

              <div className="rec-box">
                Run offer on slow moving products
              </div>

              <div className="rec-box">
                Bundle products for better sales
              </div>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}