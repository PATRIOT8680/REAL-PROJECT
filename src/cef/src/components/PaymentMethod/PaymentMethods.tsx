import './assets/styles/compiled-css/Index.css'

interface IPaymentMethods {
  onClick: (method: 'cash' | 'bank') => void
}

const PaymentMethods = ({ onClick }: IPaymentMethods) => {
  return (
    <div className="payment-methods">
      <button className="btn-method" onClick={() => onClick('cash')}>Наличными</button>
      <button className="btn-method" onClick={() => onClick('bank')}>Картой</button>
    </div>
  )
}

export default PaymentMethods