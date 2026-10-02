require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const products = [
  {
    id: 1,
    name: 'Смарт-часы X7',
    price: '12 900 ₽',
    category: 'Электроника',
    url: 'https://tezbor/',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80',
    description: 'Надёжные часы с большим дисплеем и спортивным дизайном.'
  },
  {
    id: 2,
    name: 'Беспроводные наушники Pro',
    price: '8 450 ₽',
    category: 'Аксессуары',
    url: 'https://tezbor/',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    description: 'Чистый звук, удобная посадка и долгое время работы.'
  },
  {
    id: 3,
    name: 'Портативная колонка Mini',
    price: '5 990 ₽',
    category: 'Для дома',
    url: 'https://tezbor/',
    image: 'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?auto=format&fit=crop&w=900&q=80',
    description: 'Мощный звук для дома, поездок и активного отдыха.'
  }
];

const banners = [
  { id: 1, title: 'Главный баннер', subtitle: 'Новая коллекция 2026', color: 'violet' },
  { id: 2, title: 'Скидки до 40%', subtitle: 'Осенние предложения', color: 'blue' },
  { id: 3, title: 'Flash Sale', subtitle: 'Только сегодня', color: 'orange' }
];

const orders = [
  {
    id: 1,
    productId: 1,
    productName: 'Смарт-часы X7',
    customerName: 'Иван Петров',
    phone: '+7 900 000-00-00',
    city: 'Москва',
    notes: 'Нужна доставка до дома',
    createdAt: new Date().toISOString()
  }
];

let nextProductId = products.length + 1;
let nextOrderId = orders.length + 1;

function normalizeProduct(payload) {
  const name = String(payload?.name || '').trim();
  const price = String(payload?.price || '').trim();
  const category = String(payload?.category || payload?.source || 'Электроника').trim() || 'Электроника';
  const url = String(payload?.url || 'https://tezbor/').trim() || 'https://tezbor/';
  const image = String(payload?.image || '').trim();
  const description = String(payload?.description || '').trim();

  if (!name || !price) return null;

  return { name, price, category, url, image, description };
}

function normalizeOrder(payload) {
  const customerName = String(payload?.customerName || '').trim();
  const phone = String(payload?.phone || '').trim();
  const city = String(payload?.city || '').trim();
  const productId = Number(payload?.productId || 0);
  const productName = String(payload?.productName || '').trim();

  if (!customerName || !phone || !productId || !productName) return null;

  return {
    customerName,
    phone,
    city,
    productId,
    productName,
    notes: String(payload?.notes || '').trim(),
    createdAt: new Date().toISOString()
  };
}

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'tezbor-backend' }));

app.get('/api/products', (_req, res) => res.json(products));
app.get('/api/banners', (_req, res) => res.json(banners));
app.get('/api/orders', (_req, res) => res.json(orders));
app.get('/api/analytics', (_req, res) => {
  const totalRevenue = orders.length * 12500;
  res.json({
    totalProducts: products.length,
    totalOrders: orders.length,
    totalCustomers: new Set(orders.map((order) => order.customerName)).size,
    totalRevenue: `${totalRevenue.toLocaleString('ru-RU')} ₽`
  });
});

app.post('/api/products', (req, res) => {
  const payload = normalizeProduct(req.body);
  if (!payload) return res.status(400).json({ error: 'name and price are required' });

  const product = { id: nextProductId++, ...payload };
  products.unshift(product);
  return res.status(201).json(product);
});

app.put('/api/products/:id', (req, res) => {
  const productId = Number(req.params.id);
  const payload = normalizeProduct(req.body);
  if (!payload) return res.status(400).json({ error: 'name and price are required' });

  const index = products.findIndex((product) => product.id === productId);
  if (index === -1) return res.status(404).json({ error: 'product not found' });

  products[index] = { ...products[index], ...payload };
  return res.json(products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const productId = Number(req.params.id);
  const index = products.findIndex((product) => product.id === productId);
  if (index === -1) return res.status(404).json({ error: 'product not found' });

  const [removed] = products.splice(index, 1);
  return res.json({ success: true, removed });
});

app.post('/api/orders', (req, res) => {
  const payload = normalizeOrder(req.body);
  if (!payload) return res.status(400).json({ error: 'customerName, phone, productId and productName are required' });

  const order = { id: nextOrderId++, ...payload };
  orders.unshift(order);
  return res.status(201).json(order);
});

const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

async function start() {
  if (uri) await mongoose.connect(uri);
  app.listen(port, () => console.log(`TezBor API running on http://localhost:${port}`));
}
start().catch(err => { console.error(err); process.exit(1); });
