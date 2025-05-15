import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../components/AuthContext/AuthContext'
import { auth, db } from '../../firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import { updatePassword } from 'firebase/auth'
import styles from './Profile.module.css'
import Button from '../../components/Buttons/Buttons'

const avatarOptions = [
  'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar1',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar2',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar3',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=avatar4',
]

export default function Profile() {
  const { user, setUser } = useContext(AuthContext)
  const [selectedAvatar, setSelectedAvatar] = useState(user?.profileImage || '')
  const [dob, setDob] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setSelectedAvatar(user?.profileImage || '')
    setDob(user?.dob || '') // if you want to store dob too
  }, [user])
  
  const calculateAge = (dobString) => {
    const today = new Date()
    const birthDate = new Date(dobString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const handleAvatarChange = async (avatarUrl) => {
    if (!user) return
    const userRef = doc(db, 'users', user.uid)
    await updateDoc(userRef, { profileImage: avatarUrl })
    setUser({ ...user, profileImage: avatarUrl })
    setSelectedAvatar(avatarUrl)
    setMessage('Avatar updated successfully.')
  }

  const handleProfileSave = async () => {
    setMessage('')
    setError('')
    try {
      const age = calculateAge(dob)
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, { age, dob }) // save both dob and calculated age if desired
      setUser({ ...user, age, dob })
      setMessage('Profile updated successfully.')
    } catch (err) {
      setError('Failed to update profile.')
    }
  }

  const handlePasswordChange = async () => {
    setMessage('')
    setError('')
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    try {
      await updatePassword(auth.currentUser, newPassword)
      setNewPassword('')
      setMessage('Password updated successfully.')
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setError('Please log in again to change your password.')
      } else {
        setError('Failed to update password.')
      }
    }
  }

  if (!user) return <p>Loading user info...</p>

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileContainer}>
        <h2>Your Profile</h2>

        <div className={styles.profileContentContainer}>
          <div className={styles.containerAvatar}>
            <img src={selectedAvatar || '/default-avatar.png'} alt="Profile Avatar" className={styles.avatar} />
            <h3>Change Avatar</h3>
            <div className={styles.avatarOptions}>
              {avatarOptions.map((avatar) => (
                <img
                  key={avatar}
                  src={avatar}
                  alt="avatar option"
                  className={`${styles.avatarOption} ${selectedAvatar === avatar ? styles.selected : ''}`}
                  onClick={() => handleAvatarChange(avatar)}
                />
              ))}
            </div>
          </div>

          <div className={styles.containerInfo}>
            <ul className={styles.liContainer}>
              <li className={styles.liItem}>
                <p><strong className={styles.infoTitle}>Name:</strong><br /> {user.name}</p>
              </li>
              <li className={styles.liItem}>
                <p><strong className={styles.infoTitle}>Email:</strong><br /> {user.email}</p>
              </li>
            </ul>
            
            <label className={styles.ageInputContainer}>
              <strong className={styles.infoTitle}>Date of Birth:</strong>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={styles.input}
                max={new Date().toISOString().split('T')[0]}
              />
            </label>

            {user.age && (
              <p className={styles.displayAge}>
                <strong className={styles.infoTitle}>Age:</strong> {user.age} years
              </p>
            )}

            <div className={styles.passwordContainer}>
              <label className={styles.passwordInputContainer}>
                <strong className={styles.infoTitle}>New Password:</strong>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.passwordInput}
                />
              </label>

              <button onClick={handlePasswordChange} className={styles.passwordBtn}>Change Password</button>

              {message && <p className={styles.success}>{message}</p>}
              {error && <p className={styles.error}>{error}</p>}
            </div>
            <Button onClick={handleProfileSave} className={styles.saveBtn}>Save Profile</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
