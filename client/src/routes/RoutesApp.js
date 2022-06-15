import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
/** style */
import * as El from "./Layout.style";
/** components */
import Loading from "components/Loading/Loading";
const Home = lazy(() => import("pages/Home"));
const Room = lazy(() => import("pages/Room"));

const RoutesApp = () => {
  // const PrivateRoute = ({ component: Component, ...rest }) => {
  //   return (
  //     <Route
  //       {...rest}
  //       render={props => state.user
  //         ? <Component {...props} user={state.user} />
  //         : <Redirect push to="/" />
  //       }
  //     />
  //   )
  // }

  const SuspenseHOC = (children) => (
    <Suspense fallback={<Loading text="Loading..." />}>{children}</Suspense>
  );

  return (
    <BrowserRouter>
      <El.LayoutWrapper>
        <El.LayoutContent>
          <Routes>
            <Route path="/" element={SuspenseHOC(<Home />)} />
            <Route path="/room/:name" element={SuspenseHOC(<Room />)} />
            {/* <Route path="/room/:name" element={Room} /> */}
            {/* <Redirect push to="/" /> */}
          </Routes>
        </El.LayoutContent>
      </El.LayoutWrapper>
    </BrowserRouter>
  );
};

export default RoutesApp;
