import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "./firebase";

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [emailGoogle, setEmailGoogle] = useState("");

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        //ACCESSTOKEN
        const token = userCredential.user.accessToken;
        console.log("ACCESSTOKEN:", token);
        //UID
        const id = user.uid;
        console.log("UID:", id);
        //EMAIL
        const mail = user.email;
        console.log("EMAIL:", mail);

        //Lo que se manda al endpoint
        const newUser = {
          userId: user.uid,
          email: email,
          userCompleted: false,
        };
        console.log(newUser);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      .then((userCredential) => {
        //ACCESSTOKEN
        const token = userCredential.user.accessToken;
        console.log("ACCESSTOKEN:", token);
        //UID
        const id = userCredential.user.uid;
        console.log("UID:", id);
        //EMAIL
        const mail = userCredential.user.email;
        console.log("EMAIL:", mail);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((result) => {
      setEmailGoogle(result.user.email);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      //ACCESSTOKEN
      const token = credential.accessToken;
      console.log("ACCESSTOKEN:", token);
      //UID
      const id = result.user.uid;
      console.log("UID:", id);
      //EMAIL
      const mail = result.user.email;
      console.log("EMAIL:", mail);

      //Lo que se manda al endpoint
      //Devolveria nuevo user solo si no existe en la base de datos
      //Pero si existe, devuelve el user existente
      const newUser = {
        userId: result.user.uid,
        email: result.user.email,
        userCompleted: false,
      };
      console.log(newUser);
    });
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="border p-4  border-sky-500 mb-5 w-[400px]">
          <div>
            <h1 className="text-xl font-bold mb-2">
              Crear usuario con email y password propio
            </h1>
          </div>
          <form onSubmit={signUp} className="flex flex-col">
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
            />
            <button type="submit" className="btn-primary bg-sky-500">
              Registrarse
            </button>
          </form>
        </div>

        <div className="border p-4  border-sky-500 w-[400px] mb-4">
          <div>
            <h1 className="text-xl font-bold mb-2">
              Iniciar sesion con email y password propio
            </h1>
          </div>
          <form onSubmit={signIn} className="flex flex-col">
            <input
              type="email"
              placeholder="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="mb-4"
            />
            <input
              type="password"
              placeholder="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="mb-4"
            />
            <button type="submit" className="btn-primary bg-sky-500">
              Login
            </button>
          </form>
        </div>

        <div className="border p-4  border-sky-500 w-[400px]">
          <div className="flex flex-col">
            <p className="mb-4">
              Logeado con el siguiente correo: {emailGoogle}
            </p>
            <div>
              <h1 className="text-xl font-bold mb-2">Usa google!</h1>
            </div>
            <button
              onClick={() => signInWithGoogle()}
              className="btn-primary bg-sky-500"
            >
              Google
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
