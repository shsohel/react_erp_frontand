// ** React Imports
import { useLayout } from '@hooks/useLayout';
import { useRouterTransition } from '@hooks/useRouterTransition';
// ** Layouts
import BlankLayout from '@src/layouts/BlankLayout';
// ** Custom Components
// import Spinner from '@components/spinner/Loading-spinner' // Uncomment if your require content fallback
// import LayoutWrapper from '@layouts/components/layout-wrapper';
import LayoutWrapper from '@src/layouts/components/layout-wrapper';
import HorizontalLayout from '@src/layouts/HorizontalLayout';
import VerticalLayout from '@src/layouts/VerticalLayout';
// ** Utils
import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
// ** Router Components
import { BrowserRouter as AppRouter, Redirect, Route, Switch } from 'react-router-dom';
// ** Routes & Default Routes
import { baseRoute, Routes } from './routes';

const Router = () => {
  const [layout, setLayout] = useLayout();
  const [transition, setTransition] = useRouterTransition();

  // ** Default Layout
  const DefaultLayout = layout === 'horizontal' ? 'HorizontalLayout' : 'VerticalLayout';

  // ** All of the available layouts
  const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout };

  // ** Current Active Item
  const currentActiveItem = null;

  // ** Return Filtered Array of Routes & Paths
  const LayoutRoutesAndPaths = layout => {
    const LayoutRoutes = [];
    const LayoutPaths = [];


    if ( Routes ) {
      Routes.filter( route => {
        // ** Checks if Route layout or Default layout matches current layout
        if ( ( route.layout === layout || ( route.layout === undefined && DefaultLayout === layout ) ) ) {
          LayoutRoutes.push( route );
          LayoutPaths.push( route.path );
        }
      } );
    }
    // && route?.meta?.authRoute
    return { LayoutRoutes, LayoutPaths };
  };

  const NotAuthorized = lazy( () => import( '@src/views/auth/NotAuthorized' ) );

  const Error = lazy( () => import( '@src/views/Error' ) );

  const FinalRoute = props => {
    const { authenticateUser } = useSelector( ( { auth } ) => auth );

    const route = props.route;
    let action, resource;


    // ** Assign vars based on route meta
    if ( route.meta ) {
      action = route.meta.action ? route.meta.action : null;
      resource = route.meta.resource ? route.meta.resource : null;
    }
    if ( !authenticateUser && route.meta?.publicRoute ) {
      return <route.component {...props} />;
    } else if ( authenticateUser && route?.path === "/login" ) {
      return <Redirect to="/home" />;

    } else if ( authenticateUser ) {
      return <route.component {...props} />;

    } else if ( !authenticateUser ) {
      return <Redirect to="/login" />;
    } else {
      return <route.component {...props} />;
    }

    // } else if ( !authenticateUser && !route.meta?.authRoute ) {
    //   return <Redirect to="/not-authorized" />;
  };

  // const handleNavigationRoutePermit = ( routes, navPermission ) => {
  //   const permittedRoute = routes.map( pRoute => {
  //     console.log( 'rtu', pRoute.permission === navPermission.code );
  //     if ( pRoute.permission === navPermission.code ) {
  //       pRoute['hidden'] = false;
  //     } else {
  //       pRoute['hidden'] = true;
  //     }
  //     return pRoute;
  //   } );
  //   console.log( 'route', permittedRoute );
  // };

  // ** Return Route to Render
  const ResolveRoutes = () => {
    return Object.keys( Layouts ).map( ( layout, index ) => {
      // ** Convert Layout parameter to Layout Component
      // ? Note: make sure to keep layout and component name equal
      const LayoutTag = Layouts[layout];

      // ** Get Routes and Paths of the Layout
      const { LayoutRoutes, LayoutPaths } = LayoutRoutesAndPaths( layout );


      // console.log( 'route', LayoutRoutes );
      const routerProps = {};

      return (
        <Route path={LayoutPaths} key={index}>
          <LayoutTag
            routerProps={routerProps}
            layout={layout}
            setLayout={setLayout}
            transition={transition}
            setTransition={setTransition}
            currentActiveItem={currentActiveItem}
          >
            <Switch>
              {LayoutRoutes?.map( route => {
                return (
                  <Route
                    key={route.path}
                    path={route.path}
                    exact={route.exact === true}
                    render={props => {
                      // ** Assign props to routerProps
                      Object.assign( routerProps, {
                        ...props,
                        meta: route.meta
                      } );


                      return (
                        <Suspense fallback={null}>
                          {/* Layout Wrapper to add classes based on route's layout, appLayout and className */}
                          <LayoutWrapper
                            layout={DefaultLayout}
                            transition={transition}
                            setTransition={setTransition}
                            /* Conditional props */
                            /*eslint-disable */
                            {...( route.appLayout
                              ? {
                                appLayout: route.appLayout
                              }
                              : {} )}
                            {...( route.meta
                              ? {
                                routeMeta: route.meta
                              }
                              : {} )}
                            {...( route.className
                              ? {
                                wrapperClass: route.className
                              }
                              : {} )}
                          /*eslint-enable */
                          >

                            {/* {authenticateUser ? <FinalRoute route={route} {...props} /> : <route.component {...props} />} */}
                            <FinalRoute route={route} {...props} />

                          </LayoutWrapper>
                        </Suspense>
                      );
                    }}
                  />
                );
              } )}
            </Switch>
          </LayoutTag>
        </Route>
      );
    } );
  };


  return (
    <AppRouter basename={baseRoute}>
      <Switch>
        {/* If user is logged in Redirect user to DefaultRoute else to login */}
        {/* <Route
          exact
          path='/'
          render={() => {
            return authenticateUser ? <Redirect to="/home" /> : <Redirect to='/login' />;
          }}
        />
        <Route
          exact
          path='/'
          render={() => {
            return <Redirect to={DefaultRoute} />;
          }}
        />
        <Route
          exact
          path='/not-authorized'
          render={props => (
            <Layouts.BlankLayout>
              <NotAuthorized />
            </Layouts.BlankLayout>
          )}
        />
        */}
        <Route
          exact
          path='/'
          render={() => {
            return <Redirect to="/home" />;
          }}
        />
        {ResolveRoutes()}
        {/* NotFound Error page */}
        <Route path='*' component={Error} />/
      </Switch>
    </AppRouter>
  );
};

export default Router;
