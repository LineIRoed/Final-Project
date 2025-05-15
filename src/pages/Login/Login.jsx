import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../components/AuthContext/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import styles from './Login.module.css'
import Button from '../../components/Buttons/Buttons'

export default function Login() {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError('Please fill out both email and password')
      return
    }

    setIsLoading(true)
    try {
      await login(email, password)
      setTimeout(() => navigate('/'), 500)
    } catch (err) {
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

  const { user } = useContext(AuthContext)

  useEffect(() => {
    if (user) navigate('/')
  }, [user])

  return (
    <div className={styles.logInContainer}>
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.logInForm}>
          <h2>Login</h2>
          {error && <p className={styles.error}>{error}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className={styles.loginBtn} type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Login'}
          </Button>

          <p className={styles.register}>
            Don’t have an account? <br/> <Link to="/register" className={styles.registerLink}>Register here</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
