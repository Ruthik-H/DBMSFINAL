import API from "./api";

export const loginUser = async (email, password) => {
  return await API.post("/auth/login", {
    email,
    password
  });
};

export const registerUser = async (data) => {
  return await API.post("/auth/register", data);
};