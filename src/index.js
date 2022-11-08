// ** React Imports
// ** React Toastify
import '@styles/react/libs/toastify/toastify.scss';
// ** PrismJS
import 'prismjs';
import 'prismjs/components/prism-jsx.min';
import 'prismjs/themes/prism-tomorrow.css';
import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
// ** React Perfect Scrollbar
import 'react-perfect-scrollbar/dist/css/styles.css';
// ** Redux Imports
import { Provider } from 'react-redux';
// ** Toast & ThemeColors Context
import { ToastContainer } from 'react-toastify';
// ** Core styles
import './@core/assets/fonts/feather/iconfont.css';
// ** Ripple Button
import './@core/components/ripple-button';
// ** Spinner (Splash Screen)
import Spinner from './@core/components/spinner/Fallback-spinner';
import './@core/scss/core.scss';
// import './@fake-db';
import './assets/scss/style.scss';
// ** Service Worker
import { Router } from 'react-router-dom';
import history from './history';
import * as serviceWorker from './serviceWorker';
import { ThemeContext } from './utility/context/ThemeColors';

// ** Lazy load app
const LazyApp = lazy( () => import( './App' ) );

// if ( store?.auth?.getState()?.authenticateUser ) {
//   console.log( 'hello' );
// };
// store.dispatch( getAuthUser() );
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux/storeConfig/store';
// window.localStorage.removeItem( cookieName );
// window.onbeforeunload = function () {
//   localStorage.removeItem( cookieName );
//   return '';
// };
ReactDOM.render(

  <Router history={history} >
    <Provider store={store}>
      <PersistGate loading={<Spinner />} persistor={persistor}>
        <Suspense fallback={<Spinner />}>
          <ThemeContext>
            <LazyApp />
            <ToastContainer newestOnTop />
          </ThemeContext>
        </Suspense>
      </PersistGate>
    </Provider>
  </Router>,

  document.getElementById( 'root' )
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
