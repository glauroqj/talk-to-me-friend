import React, { useState, useEffect, createContext, useContext } from "react";
/** containers */
import GetUserSessionModal from "containers/modal/GetUserSessionModal";

const SessionContext = createContext({
  session: {} /** default values */,
});

const SessionProvider = ({ children }) => {
  const [session, setSession] = useState({
    name: "",
    image: "",
    isModalOpen: false,
    isLoading: true,
  });

  useEffect(() => {
    checkUserSessionMethod();
  }, []);

  // const loginMethod = async () => {
  //   // const result = await loginService();
  //   // console.log("< LOGIN METHOD > ", result);
  //   // setSession(result);
  // };

  const logoutMethod = async () => {
    setSession({
      name: "",
      image: "",
      isModalOpen: false,
      isLoading: false,
    });
  };

  const checkUserSessionMethod = async () => {
    const sessionUser = window?.localStorage.getItem(
      process.env.REACT_APP_USER_SESSION_NAME
    );

    if (sessionUser) {
      const parsedValue = JSON.parse(sessionUser);
      setSession({
        ...parsedValue,
        isModalOpen: false,
        isLoading: false,
      });
      return;
    }
    if (!sessionUser && window?.location?.pathname !== "/") {
      /** shows a modal */
      setSession({
        ...session,
        isModalOpen: true,
        isLoading: true,
      });
    }
  };

  return (
    <SessionContext.Provider
      value={{ session, checkUserSessionMethod, logoutMethod }}
    >
      <GetUserSessionModal
        isOpen={session?.isModalOpen}
        send={(payload) => {
          // console.log('< SAVE PAYLOAD > ', payload)
          window.localStorage.setItem(
            process.env.REACT_APP_USER_SESSION_NAME,
            JSON.stringify(payload)
          );
          setSession({
            ...session,
            ...payload,
            isModalOpen: false,
            isLoading: false,
          });
        }}
      />

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
