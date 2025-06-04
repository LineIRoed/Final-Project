// Import necessary hooks, context, components, styles, and Firebase utilities
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../components/AuthContext/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import styles from './Login.module.css'
import Button from '../../components/Buttons/Buttons'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../firebaseConfig'
import Modal from '../../components/Modal/Modal'

export default function Login() {
  // Access login function and user from AuthContext
  const { login, user } = useContext(AuthContext)
  const navigate = useNavigate()

  // Form input states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // States for error handling and loading indicator
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // States for password reset modal
  const [resetStatus, setResetStatus] = useState('')
  const [showResetModal, setShowResetModal] = useState(false)

  // Handle password reset logic
  const handlePasswordReset = async () => {
    setResetStatus('')
    // Validate email input
    if (!email) {
      setResetStatus('Please enter your email above first.')
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      setShowResetModal(true)
    } catch (err) {
      // Display specific error messages
      if (err.code === 'auth/user-not-found') {
        setResetStatus('No account found with this email.')
      } else {
        setResetStatus('Failed to send reset email. Try again later.')
      }
    }
  }

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate form inputs
    if (!email || !password) {
      setError('Please fill out both email and password.')
      return
    }

    setIsLoading(true)
    try {
      await login(email, password)
      // Redirect happens when `user` state updates in AuthContext
    } catch (err) {
      // Display specific login errors
      switch (err.code) {
        case 'auth/invalid-email':
          setError('Please enter a valid email address.')
          break
        case 'auth/user-not-found':
          setError('No account found with this email.')
          break
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.')
          break
        case 'auth/too-many-requests':
          setError('Too many login attempts. Please try again later.')
          break
        default:
          setError('Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Redirect to home if user is logged in
  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user])

  return (
    <div className={styles.logInContainer}>
      <div className={styles.formContainer}>
        {/* Login form */}
        <form onSubmit={handleSubmit} className={styles.logInForm}>
          <h2>Login</h2>
          {error && <p className={styles.error}>{error}</p>}

          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Forgot password link */}
          <p className={styles.forgotPassword}>
            <Button type="button" onClick={handlePasswordReset} className={styles.resetBtn}>
              Forgot Password?
            </Button>
          </p>
          {/* Status message for password reset */}
          {resetStatus && <p className={styles.resetStatus}>{resetStatus}</p>}

          {/* Submit button */}
          <Button className={styles.loginBtn} type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </Button>

          {/* Link to register page */}
          <p className={styles.register}>
            Don’t have an account? <br />
            <Link to="/register" className={styles.registerLink}>Register here</Link>
          </p>
        </form>
      </div>

      {/* Password Reset Confirmation Modal */}
      <Modal isOpen={showResetModal} onClose={() => setShowResetModal(false)}>
        <h3 className={styles.resetHeader}>Password Reset Sent</h3>
        <p className={styles.resetText}>We’ve sent a password reset link to your email.</p>
        <Button onClick={() => setShowResetModal(false)} className={styles.loginBtn}>
          OK
        </Button>
      </Modal>
    </div>
  )
}
