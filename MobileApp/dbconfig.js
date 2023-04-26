import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDoc,doc,setDoc, } from 'firebase/firestore';

export const dbconfig = {
  apiKey: "AIzaSyC1tpseNHoWw9ksSlopxOWCFB4LvBY-qi0",
  authDomain: "safestride-655dd.firebaseapp.com",
  projectId: "safestride-655dd",
  storageBucket: "safestride-655dd.appspot.com",
  messagingSenderId: "485999909084",
  appId: "1:485999909084:web:8f37313fe268cf3f6b7c19"
};

const app = initializeApp(dbconfig)
const db = getFirestore(app)

export {db}