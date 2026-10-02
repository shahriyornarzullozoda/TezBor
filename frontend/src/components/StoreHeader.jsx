export default function StoreHeader({ query, onQueryChange, filter, onFilterChange, filters }) {
  return (
    <>
      <div className="brand-row dark-header">
        <div className="brand-meta">
          <span className="eyebrow">TezBor</span>
          <div className="brand-text">DANISA SHOP BOT</div>
        </div>

        <div className="header-actions">
          <button type="button" className="icon-button" aria-label="menu">
            ⋮
          </button>
          <button type="button" className="close-button" aria-label="close">
            ×
          </button>
        </div>
      </div>

      <label className="search-box" htmlFor="product-search">
        <button type="button" className="search-toggle" aria-label="menu">
          ☰
        </button>
        <span className="search-icon">⌕</span>
        <input
          id="product-search"
          type="text"
          placeholder="Я ищу..."
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <button type="button" className="search-option" aria-label="search options">
          ⌁
        </button>
      </label>

      <div className="filter-row" aria-label="Фильтры товаров">
        {filters.map((option) => (
          <button
            key={option}
            type="button"
            className={filter === option ? 'filter-btn is-active' : 'filter-btn'}
            onClick={() => onFilterChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </>
  );
}
