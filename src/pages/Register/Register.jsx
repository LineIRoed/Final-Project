// React hooks and context
import { useState, useContext } from 'react'
import { AuthContext } from '../../components/AuthContext/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
// Styles and UI components
import styles from './Register.module.css'
import Button from '../../components/Buttons/Buttons'

// Fallback avatar image options (not used directly in avatar generation)
const profileImageOptions = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
]

// Password validation rules
const getPasswordValidation = (password) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  }
}

export default function Register() {
  const { register } = useContext(AuthContext)

  // Form field states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  
  // Generates a random string for avatar seed
  const randomSeed = () =>
    Math.random().toString(36).substring(2, 10)

  // Avatar state
  const [profileImage, setProfileImage] = useState(profileImageOptions[0])
  const [avatarSeed, setAvatarSeed] = useState(randomSeed())

  // Feedback and validation states
  const [error, setError] = useState('')
  const validation = getPasswordValidation(password)
  const [isLoading, setIsLoading] = useState(false)

  // Avatar selection has been created using chatGpt
  const generateAvatarUrl = (seed) =>
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`
  const avatarUrl = generateAvatarUrl(avatarSeed)

  const navigate = useNavigate()

   // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Field completeness and basic validation
    if (!email || !password || !confirmPassword || !name) {
      setError('Please fill out all required fields.')
      return
    }

    // Password confirmation check
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    // Password pattern validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters, include an uppercase letter and a symbol.'
      )
      return
    }

    // Call registration function from context
    setIsLoading(true)
    try {
      await register(email, password, { name, profileImage: avatarUrl })
      navigate('/')
    } catch (err) {
      // Handle Firebase Auth errors
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.')
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak.')
      } else {
        setError('Registration failed. Please try again.')
      }
    }
  }
  

  return (
    <div className={styles.registerContainer}>
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.registerForm}>
                <h2 className={styles.formHeader}>Create Account</h2>
                {error && <p className={styles.error}>{error}</p>}

                {/* Avatar preview and shuffle button */}
                <div className={styles.avatarContainer}>
                  <img src={avatarUrl} alt="avatar" className={styles.avatarPreview} />
                  <Button
                    type="button"
                    onClick={() => setAvatarSeed(randomSeed())}
                    className={styles.shuffleButton}
                  >
                    Shuffle Avatar
                  </Button>
                </div>

                {/* Input fields */}
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

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

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {/* Password validation checklist */}
                <div className={styles.validation}>
                    <p className={validation.length ? styles.valid : styles.invalid}>
                        • At least 8 characters
                    </p>
                    <p className={validation.uppercase ? styles.valid : styles.invalid}>
                        • Contains an uppercase letter
                    </p>
                    <p className={validation.symbol ? styles.valid : styles.invalid}>
                        • Contains a symbol (e.g. @, #, !)
                    </p>
                </div>

                {/* Submit button */}
                <Button type="submit" disabled={isLoading} className={styles.registerBtn}>
                    {isLoading ? 'Registering...' : 'Register'}
                </Button>

                {/* Link to login page */}
                <p className={styles.LogIn}>
                    Already have an account? <br/> <Link to="/login" className={styles.logInLink}>Login here</Link>
                </p>
            </form>
        </div>
    </div>
  )
}
