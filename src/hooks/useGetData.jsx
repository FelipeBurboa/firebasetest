export const getData = async (url, method, authToken = null) => {
  if (!url || !method) {
    throw new Error("Faltan parámetros necesarios");
  }

  const allowedMethods = ["GET"];
  if (!allowedMethods.includes(method.toUpperCase())) {
    throw new Error(`Método HTTP: ${method}. No es permitido o incorrecto`);
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  const options = {
    method: method,
  };

  //Si se le entrega el tercer atributo authToken, entonces se mandara con el token.
  //Importante porque puede que algunos endpoints GET solo puedan ser vistos por administradores
  if (authToken) {
    options.headers = headers;
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    return response;
  } catch (error) {
    console.error("Error en modifyData:", error);
    throw error;
  }
};
