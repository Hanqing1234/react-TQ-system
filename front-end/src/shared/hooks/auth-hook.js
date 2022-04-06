import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);
  const [name, setName] = useState(null);
  const [image, setImage] = useState(null);

  const login = useCallback((uid, token, role, image, name, expirationDate) => {
    setToken(token);
    setUserId(uid);
    setRole(role);
    setName(name);
    setImage(image);
    const tokenExpirationTime =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationTime);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        role: role,
        image: image,
        name: name,
        expiration: tokenExpirationTime.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setRole(null);
    setImage(null);
    setName(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    console.log(role)
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    }
    if (!token) {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate,role]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.role,
        storedData.image,
        storedData.name,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId, role, image, name };
};
