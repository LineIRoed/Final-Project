// Import React hooks and Firebase modules
import { createContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore'
import { auth, db } from '../../firebaseConfig'

// Create and export the AuthContext for use in other components
export const AuthContext = createContext()

// AuthProvider component to manage authentication state
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Runs once on component mount to check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        const profile = userDoc.exists() ? userDoc.data() : {}
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          ...profile,
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Function to log in an existing user
  const login = async (email, password) => {
    try {
      await setPersistence(auth, browserLocalPersistence)
      return await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      throw err
    }
  }
 
  // Function to register a new user and save profile to Firestore
  const register = async (email, password, profile) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid
      await setDoc(doc(db, 'users', uid), {
        name: profile.name,
        profileImage: profile.profileImage || '',
        email: email,
      })
    } catch (err) {
      throw err
    }
  }

  // Function to log out the current user
  const logout = async () => {
    try {
      await signOut(auth)
    } catch (err) {
      console.error('Logout failed:', err)
      throw err
    }
  }

  // Provide auth context values to child components
  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  )
}
