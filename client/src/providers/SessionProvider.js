import React, { useState, useEffect, createContext, useContext } from "react";

const SessionContext = createContext({
  user: {} /** default values */,
});

const SessionProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: "",
    image: "",
  });

  useEffect(() => {
    checkUserSessionMethod();
  }, []);

  const loginMethod = async () => {
    // const result = await loginService();
    // console.log("< LOGIN METHOD > ", result);
    // setUser(result);
  };

  const logoutMethod = async () => {
    setUser({
      name: "",
      image: "",
    });
  };

  const checkUserSessionMethod = async () => {
    const sessionUser = window?.localStorage.getItem(
      process.env.REACT_APP_USER_SESSION_NAME
    );

    if (sessionUser) {
      const parsedValue = JSON.parse(sessionUser);
      setUser(parsedValue);
      return;
    }
    if (!sessionUser && window?.location?.pathname !== "/") {
    }
    // const result = await fetchUserService();
    // console.log("< CHECK USER LOGIN > ", result);
    // setUser(result);
  };

  return (
    <SessionContext.Provider
      value={{ user, checkUserSessionMethod, loginMethod, logoutMethod }}
    >
      {children}
    </SessionContext.Provider>
  );
};

const useSession = () => {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error("useSession must be used within SessionProvider");
  }

  return context;
};

export { SessionContext, SessionProvider, useSession };
