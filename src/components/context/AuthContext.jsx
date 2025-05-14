import { createContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore'
import { auth, db } from '../../firebaseConfig'  // ✅ Make sure this path is correct

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // Track auth state
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
    })

    return () => unsubscribe()
  }, [])

  // Register a new user
  const register = async (email, password, profile) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid

    await setDoc(doc(db, 'users', uid), {
      name: profile.name,
      profileImage: profile.profileImage || '',
      email: email,
    })

    // onAuthStateChanged will update user
  }

  // Login existing user
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  // Logout
  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
