import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Redirect } from "react-router-dom";
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

  return (
    <BrowserRouter>
      <El.LayoutWrapper>
        APP
        <El.LayoutContent>
          <Suspense fallback={<Loading text="Loading..." />}>
            <Routes>
              <Route path="/" element={Home} />
              {/* <Route path="/room/:name" element={Room} /> */}
              {/* <Redirect push to="/" /> */}
            </Routes>
          </Suspense>
        </El.LayoutContent>
      </El.LayoutWrapper>
    </BrowserRouter>
  );
};

export default RoutesApp;
