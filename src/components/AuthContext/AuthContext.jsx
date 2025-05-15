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

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const login = async (email, password) => {
    await setPersistence(auth, browserLocalPersistence) // Persist across sessions
    return signInWithEmailAndPassword(auth, email, password)
  }

  const register = async (email, password, profile) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid

    await setDoc(doc(db, 'users', uid), {
      name: profile.name,
      profileImage: profile.profileImage || '',
      email: email,
    })

    // onAuthStateChanged will set user
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>

  )
}
