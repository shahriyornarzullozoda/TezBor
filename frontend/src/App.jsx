import { useEffect, useMemo, useState } from 'react';
import StoreHeader from './components/StoreHeader';
import ProductCard from './components/ProductCard';
import ProductDetail from './components/ProductDetail';

const fallbackProducts = [
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

const filterOptions = ['Все', 'Электроника', 'Для дома', 'Аксессуары', 'Красота'];

export default function App() {
  const [products, setProducts] = useState(fallbackProducts);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Все');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Failed to load products');

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      } catch (error) {
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();

    return products.filter((product) => {
      const productCategory = product.category || product.source || 'Без категории';
      const matchesFilter = activeFilter === 'Все' || productCategory === activeFilter;
      if (!matchesFilter) return false;

      if (!term) return true;

      const haystack = `${product.name} ${product.description} ${productCategory}`.toLowerCase();
      return haystack.includes(term);
    });
  }, [products, query, activeFilter]);

  function handleOrderClick(product) {
    const targetUrl = product?.url || 'https://tezbor/';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }

  const selectedProduct = products.find((product) => product.id === selectedProductId) || null;

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProductId(null)}
        onOrderClick={handleOrderClick}
      />
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <StoreHeader
          query={query}
          onQueryChange={setQuery}
          filter={activeFilter}
          onFilterChange={setActiveFilter}
          filters={filterOptions}
        />
      </header>

      <div className="catalog-intro">
        <p className="intro-label">Новый сезон</p>
        <h1>Качественные товары для жизни и стиля</h1>
      </div>

      <section className="product-grid">
        {loading ? (
          <div className="empty-state">Загрузка товаров...</div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOrderClick={handleOrderClick}
              onSelect={(id) => setSelectedProductId(id)}
            />
          ))
        ) : (
          <div className="empty-state">Товар не найден</div>
        )}
      </section>
    </main>
  );
}
