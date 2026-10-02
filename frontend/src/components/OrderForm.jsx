export default function OrderForm({ orderForm, status, onChange, onSubmit }) {
  return (
    <form className="order-form" onSubmit={onSubmit}>
      <h3>Оформить заказ</h3>

      <label>
        Имя
        <input
          value={orderForm.customerName}
          onChange={(event) => onChange('customerName', event.target.value)}
          placeholder="Ваше имя"
        />
      </label>

      <label>
        Телефон
        <input
          value={orderForm.phone}
          onChange={(event) => onChange('phone', event.target.value)}
          placeholder="+7 ..."
        />
      </label>

      <label>
        Город
        <input
          value={orderForm.city}
          onChange={(event) => onChange('city', event.target.value)}
          placeholder="Город"
        />
      </label>

      <label>
        Комментарий
        <textarea
          value={orderForm.notes}
          onChange={(event) => onChange('notes', event.target.value)}
          rows="4"
          placeholder="Дополнительно"
        />
      </label>

      <button type="submit" className="submit-order">
        Подтвердить заказ
      </button>

      {status && <div className="order-status">{status}</div>}
    </form>
  );
}
