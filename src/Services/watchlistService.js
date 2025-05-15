import { db } from '../firebaseConfig'
import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore'

export const getWatchlist = async (uid) => {
  const colRef = collection(db, 'users', uid, 'watchlist')
  const snapshot = await getDocs(colRef)
  return snapshot.docs.map(doc => doc.data())
}

export const addToWatchlist = async (uid, movie) => {
  const docRef = doc(db, 'users', uid, 'watchlist', movie.id.toString())
  await setDoc(docRef, movie)
}

export const removeFromWatchlist = async (uid, movieId) => {
  const docRef = doc(db, 'users', uid, 'watchlist', movieId.toString())
  await deleteDoc(docRef)
}
