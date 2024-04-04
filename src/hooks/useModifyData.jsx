export const modifyData = async (url, method, authToken, body = null) => {
  if (!url || !method || !authToken) {
    throw new Error("Faltan parámetros necesarios");
  }

  const allowedMethods = ["POST", "PUT", "PATCH", "DELETE"];
  if (!allowedMethods.includes(method.toUpperCase())) {
    throw new Error(`Método HTTP: ${method}. No es permitido o incorrecto`);
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authToken}`,
  };

  const options = {
    method: method,
    headers: headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error("Error en la respuesta del servidor");
    }

    return response.json();
  } catch (error) {
    console.error("Error en modifyData:", error);
    throw error;
  }
};
