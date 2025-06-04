import styles from './Modal.module.css'

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  // Modal component that renders a customizable modal
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  )
}
