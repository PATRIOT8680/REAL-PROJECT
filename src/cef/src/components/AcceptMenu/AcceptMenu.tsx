import './assets/styles/compiled-css/Index.css'

interface IAcceptMenu {
  title: string
  description: string
  acceptBtn: string,
  cancelBtn: string,
  onClick: () => void
  onCancel: () => void
}

const AcceptMenu = ({ title, description, acceptBtn, cancelBtn, onClick, onCancel }: IAcceptMenu) => {
  return (
    <div className="accept-menu">
      <span className="title">{title}</span>
      <span className="description">{description}</span>
      <div className="btns-action">
        <button className="accept" onClick={onClick}>{acceptBtn}</button>
        <button className="cancel" onClick={onCancel}>{cancelBtn}</button>
      </div>
    </div>
  )
}

export default AcceptMenu