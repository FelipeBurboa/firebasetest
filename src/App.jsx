import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "./firebase";
import { getData } from "./hooks/useGetData";

const App = () => {
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
        console.log(idToken);
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
  //AQUI TERMINA. El boton esta abajito

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
