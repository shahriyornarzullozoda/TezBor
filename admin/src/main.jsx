import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const blankForm = {
  name: '',
  price: '',
  category: 'Электроника',
  url: 'https://tezbor/',
  image: '',
  description: ''
};

const initialBanners = [
  { id: 1, title: 'Главный баннер', subtitle: 'Новая коллекция 2026', color: 'violet' },
  { id: 2, title: 'Скидки до 40%', subtitle: 'Осенние предложения', color: 'blue' },
  { id: 3, title: 'Flash Sale', subtitle: 'Только сегодня', color: 'orange' }
];

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [banners, setBanners] = useState(initialBanners);
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');
  const [view, setView] = useState('dashboard');

  async function loadProducts() {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) throw new Error('Failed to load products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setStatus('Не удалось загрузить товары');
    }
  }

  async function loadOrders() {
    try {
      const response = await fetch('http://localhost:5000/api/orders');
      if (!response.ok) throw new Error('Failed to load orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      setStatus('Не удалось загрузить заказы');
    }
  }

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  const analytics = useMemo(() => ({
    products: products.length,
    customers: new Set(orders.map((order) => order.customerName)).size,
    orders: orders.length,
    revenue: `${(orders.length * 12500).toLocaleString('ru-RU')} ₽`
  }), [orders, products]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.price.trim()) {
      setStatus('Название и цена обязательны');
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      price: form.price.trim(),
      category: form.category.trim() || 'Электроника',
      url: form.url.trim() || 'https://tezbor/',
      description: form.description.trim()
    };

    const endpoint = editingId ? `http://localhost:5000/api/products/${editingId}` : 'http://localhost:5000/api/products';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Save failed');
      setForm(blankForm);
      setEditingId(null);
      setStatus(editingId ? 'Товар обновлён' : 'Товар добавлен');
      await loadProducts();
    } catch (error) {
      setStatus('Ошибка сохранения товара');
    }
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Delete failed');
      setStatus('Товар удалён');
      if (editingId === id) {
        setEditingId(null);
        setForm(blankForm);
      }
      await loadProducts();
    } catch (error) {
      setStatus('Ошибка удаления товара');
    }
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category || product.source || 'Электроника',
      url: product.url,
      image: product.image,
      description: product.description
    });
    setStatus('Редактирование товара');
  }

  return (
    <main className="admin-layout">
      <aside className="sidebar">
        <div className="brand-box">
          <div className="brand-mark">T</div>
          <div>
            <p className="brand-name">TezBor</p>
            <span>Store panel</span>
          </div>
        </div>

        <nav className="nav-menu">
          {['dashboard', 'products', 'banners', 'analytics', 'orders'].map((item) => (
            <button
              key={item}
              className={`nav-item ${view === item ? 'active' : ''}`}
              onClick={() => setView(item)}
              type="button"
            >
              {item === 'dashboard' && 'Dashboard'}
              {item === 'products' && 'Products'}
              {item === 'banners' && 'Banners'}
              {item === 'analytics' && 'Analytics'}
              {item === 'orders' && 'Orders'}
            </button>
          ))}
        </nav>

        <div className="sidebar-card">
          <p>Sales target</p>
          <strong>78%</strong>
          <span>Growth this month</span>
        </div>
      </aside>

      <section className="content-area">
        {view === 'dashboard' && (
          <>
            <header className="topbar">
              <div>
                <p className="top-label">Overview</p>
                <h1>Dashboard</h1>
              </div>
              <button className="primary-btn" onClick={() => setView('products')}>+ Add product</button>
            </header>

            <section className="stats-grid">
              <div className="stat-card">
                <span>Total products</span>
                <strong>{analytics.products}</strong>
                <small>+12% this week</small>
              </div>
              <div className="stat-card">
                <span>Customers</span>
                <strong>{analytics.customers}</strong>
                <small>+8% this week</small>
              </div>
              <div className="stat-card">
                <span>Orders</span>
                <strong>{analytics.orders}</strong>
                <small>+15% this week</small>
              </div>
              <div className="stat-card">
                <span>Revenue</span>
                <strong>{analytics.revenue}</strong>
                <small>+20% this month</small>
              </div>
            </section>

            <section className="main-grid">
              <div className="panel product-panel">
                <div className="section-head">
                  <h2>Products</h2>
                  <button type="button" className="ghost-btn" onClick={() => setView('products')}>Manage</button>
                </div>
                <div className="banner-list compact">
                  {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="mini-product-row dashboard-mini">
                      <img src={product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'} alt={product.name} />
                      <div className="mini-info">
                        <strong>{product.name}</strong>
                        <span>{product.category || product.source}</span>
                      </div>
                      <div className="mini-price">{product.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel banner-panel">
                <div className="section-head">
                  <h2>Banners</h2>
                  <button type="button" className="ghost-btn" onClick={() => setView('banners')}>Edit</button>
                </div>
                <div className="banner-list">
                  {banners.map((banner) => (
                    <div key={banner.id} className={`banner-item ${banner.color}`}>
                      <span>{banner.title}</span>
                      <strong>{banner.subtitle}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bottom-grid">
              <div className="panel table-panel">
                <div className="section-head">
                  <h2>Recent orders</h2>
                  <button type="button" className="ghost-btn" onClick={() => setView('orders')}>View all</button>
                </div>
                <div className="recent-orders-list">
                  {orders.slice(0, 4).map((order) => (
                    <div key={order.id} className="recent-order-row">
                      <div>
                        <strong>{order.customerName}</strong>
                        <small>{order.productName}</small>
                      </div>
                      <span>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel side-panel">
                <div className="section-head">
                  <h2>Customers</h2>
                  <span>Top</span>
                </div>
                <div className="customer-list">
                  {Array.from(new Set(orders.map((order) => order.customerName))).slice(0, 4).map((customerName, index) => (
                    <div key={customerName} className="customer-row">
                      <div className="avatar">{customerName.charAt(0)}</div>
                      <div>
                        <strong>{customerName}</strong>
                        <small>Buyer #{index + 1}</small>
                      </div>
                      <div className="customer-meta">
                        <span>{orders.filter((order) => order.customerName === customerName).length} orders</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {view === 'products' && (
          <>
            <header className="topbar">
              <div>
                <p className="top-label">Catalog</p>
                <h1>Products</h1>
              </div>
            </header>

            <div className="panel wide-panel">
              <form onSubmit={handleSubmit} className="product-form">
                <div className="field-row">
                  <label>
                    Name
                    <input value={form.name} onChange={(event) => updateField('name', event.target.value)} placeholder="Smart Watch X7" />
                  </label>
                  <label>
                    Price
                    <input value={form.price} onChange={(event) => updateField('price', event.target.value)} placeholder="12 900 ₽" />
                  </label>
                </div>

                <div className="field-row">
                  <label>
                    Category
                    <input value={form.category} onChange={(event) => updateField('category', event.target.value)} placeholder="Электроника" />
                  </label>
                  <label>
                    URL
                    <input value={form.url} onChange={(event) => updateField('url', event.target.value)} placeholder="https://tezbor/" />
                  </label>
                </div>

                <label>
                  Image URL
                  <input value={form.image} onChange={(event) => updateField('image', event.target.value)} placeholder="https://example.com/image.jpg" />
                </label>

                <label>
                  Description
                  <textarea value={form.description} onChange={(event) => updateField('description', event.target.value)} rows="4" placeholder="Describe the product" />
                </label>

                <div className="form-actions">
                  <button type="submit" className="primary-btn">{editingId ? 'Save changes' : 'Add product'}</button>
                  {editingId && (
                    <button type="button" className="secondary-btn" onClick={() => { setEditingId(null); setForm(blankForm); }}>
                      Cancel
                    </button>
                  )}
                </div>

                {status && <div className="status-pill">{status}</div>}
              </form>
            </div>

            <div className="panel wide-panel">
              <div className="section-head">
                <h2>Products list</h2>
                <span>{products.length} items</span>
              </div>

              <div className="product-list">
                {products.map((product) => (
                  <div key={product.id} className="mini-product-row">
                    <img src={product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'} alt={product.name} />
                    <div className="mini-info">
                      <strong>{product.name}</strong>
                      <span>{product.source}</span>
                    </div>
                    <div className="mini-price">{product.price}</div>
                    <div className="mini-actions">
                      <button type="button" className="link-btn" onClick={() => handleEdit(product)}>Edit</button>
                      <button type="button" className="danger-btn" onClick={() => handleDelete(product.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {view === 'banners' && (
          <>
            <header className="topbar">
              <div>
                <p className="top-label">Marketing</p>
                <h1>Banners</h1>
              </div>
            </header>
            <div className="panel wide-panel">
              <div className="banner-list">
                {banners.map((banner) => (
                  <div key={banner.id} className={`banner-item ${banner.color}`}>
                    <span>{banner.title}</span>
                    <strong>{banner.subtitle}</strong>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {view === 'analytics' && (
          <>
            <header className="topbar">
              <div>
                <p className="top-label">Reports</p>
                <h1>Analytics</h1>
              </div>
            </header>
            <section className="stats-grid">
              <div className="stat-card">
                <span>Products</span>
                <strong>{analytics.products}</strong>
              </div>
              <div className="stat-card">
                <span>Orders</span>
                <strong>{analytics.orders}</strong>
              </div>
              <div className="stat-card">
                <span>Customers</span>
                <strong>{analytics.customers}</strong>
              </div>
              <div className="stat-card">
                <span>Revenue</span>
                <strong>{analytics.revenue}</strong>
              </div>
            </section>
          </>
        )}

        {view === 'orders' && (
          <>
            <header className="topbar">
              <div>
                <p className="top-label">Customers</p>
                <h1>Orders</h1>
              </div>
            </header>

            <div className="panel wide-panel">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Client</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.productName}</td>
                      <td>{order.customerName}</td>
                      <td>{order.phone}</td>
                      <td>{order.city || '—'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
