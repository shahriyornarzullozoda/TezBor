import { useState } from 'react';

export default function ProductCard({ product, onOrderClick }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className={`product-card ${expanded ? 'is-expanded' : ''}`}>
      <button
        type="button"
        className="product-image-button"
        onClick={() => setExpanded((current) => !current)}
        aria-label={expanded ? `Свернуть описание товара ${product.name}` : `Показать описание товара ${product.name}`}
      >
        <div className="product-image-wrap">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'}
            alt={product.name}
          />
        </div>
      </button>

      <div className="product-content">
        <div className="meta-row">
          <span className="source-tag">{product.category || product.source}</span>
          <span className="price">{product.price}</span>
        </div>

        <h2>{product.name}</h2>

        {expanded && (
          <>
            <p className="product-description">{product.description}</p>
            <button type="button" className="order-btn" onClick={() => onOrderClick(product)}>
              Заказать
            </button>
          </>
        )}
      </div>
    </article>
  );
}
