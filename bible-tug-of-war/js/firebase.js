export const firebaseConfig = {
  apiKey: "AIzaSyC9Q6K3hjLR9GUkTnDjd5eMOcWNu_NTdW4",
  authDomain: "my-sunday-school-project.firebaseapp.com",
  projectId: "my-sunday-school-project",
  storageBucket: "my-sunday-school-project.firebasestorage.app",
  messagingSenderId: "670535850367",
  appId: "1:670535850367:web:9d49ac0f513f24a14ae24a",
  measurementId: "G-3XRH7JJVE7"
};

if (!firebaseConfig.apiKey) {
  alert("Please paste your Firebase config into the file.");
}

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();

export const serverTimestamp = () => firebase.firestore.FieldValue.serverTimestamp();
export const arrayUnion = (...items) => firebase.firestore.FieldValue.arrayUnion(...items);
export const arrayRemove = (...items) => firebase.firestore.FieldValue.arrayRemove(...items);
