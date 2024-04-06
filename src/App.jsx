import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { getData } from "./hooks/useGetData";
import { useAuth } from "./utils/authContext";

const App = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [emailGoogle, setEmailGoogle] = useState("");

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const idToken = await userCredential.user.getIdToken();

        if (idToken) {
          return fetch("http://localhost:3000/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((user) => {
              console.log(user);
            })
            .catch((error) => {
              console.error("Error during fetch:", error);
            });
        }
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
      .then(async (userCredential) => {
        const idToken = await userCredential.user.getIdToken();
        const uid = userCredential.user.uid;
        if (idToken) {
          return fetch(`https://c16-backend.onrender.com/api/users/${uid}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              setCurrentUser(userCredential.user);
              return response.json();
            })
            .catch((error) => {
              console.error("Error during fetch:", error);
            });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        setEmailGoogle(result.user.email);
        const idToken = await result.user.getIdToken();

        if (idToken) {
          return fetch("https://c16-backend.onrender.com/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((user) => {
              console.log(user);
            })
            .catch((error) => {
              console.error("Error during fetch:", error);
            });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  //CODIGO PARA RECIBIR Y DESCARGAR EXCEL RECIBIDO DESDE EL ENDPOINT
  //Estoy usando import { getData } from "./hooks/useGetData";
  const handleClick = async () => {
    try {
      const response = await getData(
        "http://localhost:3000/api/users/downloadExcel",
        "GET"
      );

      if (!response.ok) {
        throw new Error("Failed to download Excel file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Usuarios.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };
  //AQUI TERMINA

  //CODIGO DE LOGOUT PARA CERRAR SESION FIREBASE Y BORRAR USER LOCALMENTE
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  //Por lo que entendi cada vez que yo uso getIdToken firebase mismo se preocupa de darme un token valido
  //Sobretodo si expiro. Pero mi currentUser guardado en el localStorage no expira.
  const getToken = async () => {
    try {
      const idToken = await currentUser.getIdToken();
      console.log(idToken);
    } catch (error) {
      console.error("Error getting ID token:", error);
    }
  };

  //AQUI TERMINA
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-5">
        <h1 className="text-3xl font-bold mb-5">Excel</h1>
        <div className="border p-4  border-sky-500 mb-2 w-[400px] flex flex-col">
          <button onClick={handleClick} className="btn-primary bg-sky-500">
            Descargar Excel
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-5">Sesiones</h1>

        {/* Codigo para cerrar sesion si el usuario ya ha iniciado sesion */}
        {currentUser && (
          <div className="border p-4 border-sky-500 mb-5 w-[400px] flex flex-col">
            <button className="btn-primary bg-sky-500" onClick={getToken}>
              Test get ID, fijate en el consolelog
            </button>
            <div>
              <h1 className="text-xl font-bold mb-2">Cerrar sesion</h1>
              <p className="mb-2">
                Email: <span className="font-bold">{currentUser?.email}</span>
              </p>
              <p className="mb-2">
                UID: <span className="font-bold">{currentUser?.uid}</span>
              </p>
            </div>
            <button onClick={handleLogout} className="btn-primary bg-sky-500">
              Logout
            </button>
          </div>
        )}
        {/* Aqui termina */}

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
