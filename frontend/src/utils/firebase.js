import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider,} from 'firebase/auth'


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cortexai-1b8d5.firebaseapp.com",
  projectId: "cortexai-1b8d5",
  storageBucket: "cortexai-1b8d5.firebasestorage.app",
  messagingSenderId: "107009117770",
  appId: "1:107009117770:web:9514791144dfb0a28ba0b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()