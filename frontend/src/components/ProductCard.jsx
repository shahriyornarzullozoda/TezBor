export default function ProductCard({ product, onOrderClick, onSelect }) {
  return (
    <article className="product-card">
      <button
        type="button"
        className="product-image-button"
        onClick={() => onSelect(product.id)}
        aria-label={`Открыть товар ${product.name}`}
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
        <p className="product-summary">{product.description}</p>

        <button type="button" className="order-btn" onClick={() => onOrderClick(product)}>
          Заказать
        </button>
      </div>
    </article>
  );
}
