import React, { Suspense, lazy } from 'react'
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
/** style */
import * as El from './Layout.style'
/** components */
import Loading from '../components/Loading/Loading.js'
const Home = lazy(() => import('../pages/Home'))
const Room = lazy(() => import('../pages/Room'))

const Routes = () => {
  
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

        <El.LayoutContent>
          <Suspense fallback={ <Loading text="Loading..." /> }>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/room/:name" component={Room} />
              {/* <PrivateRoute exact path="/timeline" component={Timeline} /> */}
              <Redirect push to="/" />
            </Switch>
          </Suspense>
        </El.LayoutContent>

      </El.LayoutWrapper>
    </BrowserRouter>
  )
}

export default Routes
