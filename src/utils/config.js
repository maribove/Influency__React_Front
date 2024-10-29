// config.js
export const api = "http://localhost:5000/api";
export const uploads = "http://localhost:5000/uploads";

export const requestConfig = (method, data, token, image = null) => {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Se for imagem ou `FormData`, envie como está
  if (image) {
    return {
      method,
      body: data, // `data` é o FormData aqui
      headers, // headers sem `Content-Type` para FormData funcionar
    };
  } else {
    // JSON como padrão
    headers["Content-Type"] = "application/json";
    return {
      method,
      body: data ? JSON.stringify(data) : null, // stringify para JSON
      headers,
    };
  }
};
