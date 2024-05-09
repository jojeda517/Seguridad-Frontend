import firebase_app from "../firebase";
import { getAuth, signInWithPopup, OAuthProvider } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signInWithMicrosoft() {
  let result = null, error = null;
  try {
    const provider = new OAuthProvider('microsoft.com');

    // Abre una ventana emergente para iniciar sesión
    const response = await signInWithPopup(auth, provider);

    // Aquí obtienes el usuario si el inicio de sesión es 
    result = response.user;
  } catch (e) {
    error = e;
  }

  return { result, error };
}


