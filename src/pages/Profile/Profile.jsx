// Imports
import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../components/AuthContext/AuthContext'
import { auth, db } from '../../firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import { updatePassword } from 'firebase/auth'
import styles from './Profile.module.css'
import Button from '../../components/Buttons/Buttons'
import Modal from '../../components/PasswordModal/PasswordModal.jsx'

// Helper function to generate avatar URL using Dicebear API
const generateAvatarUrl = (seed) =>
  `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`

// Helper to generate a random seed for avatars
const randomSeed = () => Math.random().toString(36).substring(2, 10)

export default function Profile() {
  const { user, setUser } = useContext(AuthContext)

  const [avatarSeed, setAvatarSeed] = useState('')
  const [dob, setDob] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [profileMessage, setProfileMessage] = useState('')
  const [profileError, setProfileError] = useState('')
  const [passwordMessage, setPasswordMessage] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  // Initialize avatar and date of birth from user context
  useEffect(() => {
    if (user?.profileImage) {
      const match = user.profileImage.match(/seed=([^&]+)/)
      setAvatarSeed(match ? match[1] : randomSeed())
    }
    if (user?.dob) {
      setDob(user.dob)
    }
  }, [user])

  // Calculate age from date of birth
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

  // Change avatar by generating a new seed
  const handleAvatarShuffle = () => {
    const newSeed = randomSeed()
    setAvatarSeed(newSeed)
  }

  // Save updated profile info to Firestore and update local context
  const handleProfileSave = async () => {
    setProfileMessage('')
    setProfileError('')
    try {
      const age = calculateAge(dob)
      const newAvatar = generateAvatarUrl(avatarSeed)

      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, { age, dob, profileImage: newAvatar })
      setUser({ ...user, age, dob, profileImage: newAvatar })
      setProfileMessage('Profile updated successfully.')
    } catch (err) {
      setProfileError('Failed to update profile.')
    }
  }

  // Validate password input
  const getPasswordValidation = (password) => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  })
  const validation = getPasswordValidation(newPassword)

  // Handle password change request
  const handlePasswordChange = async () => {
    setPasswordMessage('')
    setPasswordError('')

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
    if (!passwordRegex.test(newPassword)) {
      setPasswordError('Password must be at least 8 characters, include an uppercase letter and a symbol.')
      return
    }

    try {
      await updatePassword(auth.currentUser, newPassword)
      setNewPassword('')
      setPasswordMessage('Password updated successfully.')
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        setPasswordError('Please log in again to change your password.')
      } else {
        setPasswordError('Failed to update password.')
      }
    }
  }

  // Show loading message if user context is not ready
  if (!user) return <p>Loading user info...</p>

  return (
    <div className={styles.pageContainer}>
      <div className={styles.profileContainer}>
        <h2>Your Profile</h2>

        <div className={styles.profileContentContainer}>
          {/* Avatar Display & Shuffle Button */}
          <div className={styles.containerAvatar}>
            <img
              src={generateAvatarUrl(avatarSeed)}
              alt="Profile Avatar"
              className={styles.avatar}
            />
            <Button onClick={handleAvatarShuffle} className={styles.shuffleButton}>
              Shuffle Avatar
            </Button>
          </div>

          {/* Profile Info Section */}
          <div className={styles.containerInfo}>
            <ul className={styles.liContainer}>
              <li className={styles.liItem}>
                <p><strong className={styles.infoTitle}>Name:</strong ><br/> {user.name}</p>
              </li>
              <li className={styles.liItem}>
                <p className={styles.emailText}><strong className={styles.infoTitle}>Email:</strong> <br /> {user.email}</p>
              </li>
            </ul>

            {/* Date of Birth Input */}
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

            {/* Display Calculated Age */}
            {user.age && (
              <p className={styles.displayAge}>
                <strong className={styles.infoTitle}>Age:</strong> {user.age} years
              </p>
            )}

            {/* Password Change Button */}
            <Button onClick={() => setShowPasswordModal(true)} className={styles.passwordBtn}>
              Change Password
            </Button>

            {/* Save Profile Button */}
            <Button onClick={handleProfileSave} className={styles.saveBtn}>
              Save Profile
            </Button>

            {/* Profile Save Messages */}
            {profileMessage && <p className={styles.success}>{profileMessage}</p>}
            {profileError && <p className={styles.error}>{profileError}</p>}

            {/* Change password Modal */}
            <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
              <h3>Change Password</h3>
              <label className={styles.passwordLabel}>
                New Password:
                <br />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.passwordInput}
                />
              </label>

              {/* Password Requirements */}
              <div className={styles.validation}>
                <p className={validation.length ? styles.valid : styles.invalid}>
                  {validation.length ? '✅' : '❌'} At least 8 characters
                </p>
                <p className={validation.uppercase ? styles.valid : styles.invalid}>
                  {validation.uppercase ? '✅' : '❌'} Contains an uppercase letter
                </p>
                <p className={validation.symbol ? styles.valid : styles.invalid}>
                  {validation.symbol ? '✅' : '❌'} Contains a symbol (e.g. @, #, !)
                </p>
              </div>

              {/* Submit Password Change */}
              <Button onClick={handlePasswordChange} className={styles.saveBtn}>
                Update Password
              </Button>

              {/* Password Change Feedback */}
              {passwordMessage && <p className={styles.success}>{passwordMessage}</p>}
              {passwordError && <p className={styles.error}>{passwordError}</p>}
            </Modal>
          </div>
        </div>
      </div>
    </div>
  )
}
