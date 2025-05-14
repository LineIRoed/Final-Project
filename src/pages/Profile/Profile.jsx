import { useContext } from 'react'
import { AuthContext } from '../../components/context/AuthContext'
import styles from './Profile.module.css'

export default function Profile() {
  const { user } = useContext(AuthContext)

  if (!user) return null

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img
          src={user.profileImage || 'https://via.placeholder.com/150'}
          alt="Profile"
          className={styles.avatar}
        />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    </div>
  )
}
