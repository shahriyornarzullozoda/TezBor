export default function ProductDetail({ product, onBack, onOrderClick }) {
  const characteristics = Array.isArray(product.characteristics) && product.characteristics.length > 0
    ? product.characteristics
    : [
        { label: 'Категория', value: product.category || product.source || 'Общая' },
        { label: 'Цена', value: product.price },
        { label: 'Доставка', value: 'По всей стране' },
        { label: 'Гарантия', value: '12 месяцев' }
      ];

  return (
    <main className="product-detail-shell">
      <button type="button" className="back-link" onClick={onBack}>
        ← Назад в каталог
      </button>

      <article className="detail-card">
        <div className="detail-media">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'}
            alt={product.name}
          />
        </div>

        <div className="detail-body">
          <span className="mini-tag">{product.category || product.source}</span>
          <h2>{product.name}</h2>
          <div className="detail-price">{product.price}</div>
          <p className="detail-description">{product.description}</p>

          <div className="detail-specs">
            {characteristics.map((item) => (
              <div key={`${product.id}-${item.label}`} className="spec-row">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <button type="button" className="order-btn detail-order-btn" onClick={() => onOrderClick(product)}>
          Заказать
        </button>
      </article>
    </main>
  );
}
