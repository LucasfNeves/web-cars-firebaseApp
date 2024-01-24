// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyBwz9c5bDlTwGJh6zRcBrsfjopFLN0Xehk',
  authDomain: 'webcars-4a456.firebaseapp.com',
  projectId: 'webcars-4a456',
  storageBucket: 'webcars-4a456.appspot.com',
  messagingSenderId: '1000369423597',
  appId: '1:1000369423597:web:fbb66a5ce2769daf7478e4',
  measurementId: 'G-FM0FKEMPVW',
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { db, auth, storage }
