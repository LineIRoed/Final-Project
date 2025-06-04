// Import CSS module styles
import styles from './PasswordModal.module.css'

// Modal component accepts isOpen, onClose, and children props
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        {children}
      </div>
    </div>
  )
}
