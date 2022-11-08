
import history from '../../../history';
import { baseAxios } from '../../../services';
import { userManagementApi } from '../../../services/api-end-points/user-management';
import { notify } from '../../../utility/custom/notifications';
import { authCredential, cookieName, status } from '../../../utility/enums';
import { convertQueryString } from '../../../utility/Utils';
import { GET_PERMISSIONS } from '../../../views/auth/permission/store/action-types';
import { AUTH_TOKEN_STORE, GET_AUTHENTICATE_USER, GET_AUTHENTICATE_USER_PERMISSION, IS_USER_LOGGED_IN, LOGOUT } from '../../action-types';
import { bindNavigation } from '../navbar';


// ** Handle User Logout
export const handleLogout = () => dispatch => {
  dispatch( {
    type: LOGOUT,
    authenticateUser: null,
    authenticateUserPermission: [],
    userPermission: {}
  } );
  // const cookies = new Cookies();
  // cookies.remove( cookieName, { path: '/', expires: 0 } );
  localStorage.removeItem( cookieName );
  localStorage.removeItem( 'module' );
  // history.replace( '/login' );

  window.location.href = `/login`;
  // window.location.assign( `/login` );
};

export const isUserLoggedIn = ( condition ) => dispatch => {
  dispatch( {
    type: IS_USER_LOGGED_IN,
    isUserLoggedIn: condition
  } );
};

export const bindAuthUser = () => dispatch => {
  dispatch( {
    type: GET_AUTHENTICATE_USER,
    authenticateUser: null
  } );
};
export const bindAuthUserPermission = () => dispatch => {
  dispatch( {
    type: GET_AUTHENTICATE_USER_PERMISSION,
    authenticateUserPermission: [],
    userPermission: []
  } );
};

export const permittedNavigation = () => ( dispatch, getState ) => {
  const { userPermission } = getState().auth;
  const { authPermissions } = getState().permissions;
  dispatch( bindNavigation( userPermission, authPermissions ) );
};

export const getAuthUserPermission = () => dispatch => {
  const apiEndPoint = `${userManagementApi.auth}/authenticatedUser/permissions`;
  baseAxios.get( apiEndPoint ).then( response => {
    if ( response.status === status.success ) {

      const userPermission = Object.assign( {}, ...response.data.map( p => ( {
        [p.code.split( '.' ).join( "" )]: p.code
      } ) ) );
      dispatch( {
        type: GET_AUTHENTICATE_USER_PERMISSION,
        authenticateUserPermission: response.data,
        userPermission
      } );
      dispatch( permittedNavigation() );

    }
  } ).catch( ( { response } ) => {
    //
  } );
};


export const getAuthUser = ( push ) => async dispatch => {
  const token = localStorage.getItem( cookieName );
  const apiEndPoint = `${userManagementApi.auth}/authenticatedUser`;
  await baseAxios.get( apiEndPoint ).then( response => {
    if ( response.status === status.success ) {
      dispatch( {
        type: GET_AUTHENTICATE_USER,
        authenticateUser: response.data
      } );
      // dispatch( getAuthUserPermission() );
    }

  } ).catch( ( { response } ) => {
    dispatch( handleLogout() );
    // dispatch( bindAuthUserPermission() );
    // localStorage.removeItem( 'module' );
    // window.location.href = `/login`;
  } );

  // if ( token ) {
  //   const apiEndPoint = `${userManagementApi.auth}/authenticatedUser`;
  //   await baseAxios.get( apiEndPoint ).then( response => {
  //     if ( response.status === status.success ) {
  //       dispatch( {
  //         type: GET_AUTHENTICATE_USER,
  //         authenticateUser: response.data
  //       } );
  //       dispatch( getAuthUserPermission() );
  //     }

  //   } ).catch( ( { response } ) => {
  //     dispatch( bindAuthUser() );
  //     dispatch( bindAuthUserPermission() );
  //     localStorage.removeItem( 'module' );
  //     history.push( '/login' );

  //   } );
  // }
};


///After Call All App Permission is Loaded
export const getLoggedInUserPermission = ( push ) => dispatch => {

  const apiEndPoint = `${userManagementApi.auth}/authenticatedUser/permissions`;
  baseAxios.get( apiEndPoint ).then( response => {
    if ( response.status === status.success ) {

      const userPermission = Object.assign( {}, ...response.data.map( p => ( {
        [p.code.split( '.' ).join( "" )]: p.code
      } ) ) );
      dispatch( {
        type: GET_AUTHENTICATE_USER_PERMISSION,
        authenticateUserPermission: response.data,
        userPermission
      } );

      push( '/' );

      dispatch( permittedNavigation() );
    }

  } ).catch( ( { response } ) => {
    dispatch( isUserLoggedIn( true ) );

    //
  } );
};

///Call after Auth User Authenticated
export const getAppAllPermissions = ( push ) => dispatch => {
  const apiEndPoint = `${userManagementApi.auth}/permissions`;
  baseAxios.get( apiEndPoint ).then( response => {
    if ( response.status === status.success ) {
      const permissions = response.data?.map( permission => ( {
        ...permission,
        subModules: permission.subModules.map( subModule => ( {
          ...subModule,
          isExpanded: false,
          isAll: false
        } ) )

      } ) );

      const authPermissions = permissions.map( permission => permission.subModules.map( subModule => subModule.permissions ).flat() ).flat().map( p => p.code );
      dispatch( {
        type: GET_PERMISSIONS,
        permissions,
        authPermissions
      } );

      dispatch( getLoggedInUserPermission( push ) );
      //    dispatch( isUserLoggedIn( true ) );

    }
  } );
};


///Call after user Login
export const getLoggedInUser = ( push ) => dispatch => {
  dispatch( isUserLoggedIn( false ) );

  const apiEndPoint = `${userManagementApi.auth}/authenticatedUser`;
  baseAxios.get( apiEndPoint ).then( response => {
    if ( response.status === status.success ) {
      dispatch( {
        type: GET_AUTHENTICATE_USER,
        authenticateUser: response.data
      } );
      // dispatch( getLoggedInUserPermission() );
      // dispatch( getAppPermissions() );
      dispatch( getAppAllPermissions( push ) );

    }

  } ).catch( ( { response } ) => {
    dispatch( isUserLoggedIn( true ) );
    dispatch( bindAuthUser() );
    dispatch( bindAuthUserPermission() );

    localStorage.removeItem( cookieName );

    notify( 'error', `You are not Authorized!!!` );


  } );
};


// ** Handle User Login
export const handleLogin = ( data, push ) => dispatch => {
  dispatch( isUserLoggedIn( false ) );

  const userCredential = {
    ...authCredential,
    userName: data?.userName,
    password: data?.password
  };
  const apiEndPoint = `${userManagementApi.tokenUrl}`;
  try {
    baseAxios.post( apiEndPoint, convertQueryString( userCredential ) ).then( response => {
      if ( response.status === status.success ) {
        const accessToken = response.data.access_token;
        const tokenStorageTime = Date.now();
        baseAxios.defaults.headers.common['Authorization'] = `bearer ${accessToken}`;
        localStorage.setItem( cookieName, JSON.stringify( { ...response.data, tokenStorageTime } ) );

        dispatch( {
          type: AUTH_TOKEN_STORE,
          authToken: { ...response.data, tokenStorageTime }
        } );

        dispatch( getLoggedInUser( push ) );

        localStorage.removeItem( 'module' );
      }

    } ).catch( ( { response } ) => {
      console.log( response );
      dispatch( isUserLoggedIn( true ) );

      if ( response?.status === status?.severError ) {
        notify( 'error', `Please contact the support team!!!` );
      } else if ( response === undefined ) {
        notify( 'warning', `Log in Failed , Please try again!!!` );
      } else {
        notify( 'error', `${response?.data.error_description}` );
      }
    } );
  } catch ( error ) {

    //

  }

};
export const handleInstantLogin = ( data ) => dispatch => {
  const userCredential = {
    ...authCredential,
    userName: data?.userName,
    password: data?.password
  };
  const apiEndPoint = `${userManagementApi.tokenUrl}`;
  try {
    baseAxios.post( apiEndPoint, convertQueryString( userCredential ) ).then( response => {
      if ( response.status === status.success ) {
        const accessToken = response.data.access_token;
        const tokenStorageTime = Date.now();
        baseAxios.defaults.headers.common['Authorization'] = `bearer ${accessToken}`;
        localStorage.setItem( cookieName, JSON.stringify( { ...response.data, tokenStorageTime } ) );

        dispatch( {
          type: AUTH_TOKEN_STORE,
          authToken: { ...response.data, tokenStorageTime }
        } );
        notify( 'success', ` You are successfully logged in!` );
      }

    } ).catch( ( { response } ) => {

      if ( response?.status === status?.severError ) {
        notify( 'error', `Please contact the support team!!!` );
      } else if ( response === undefined ) {
        notify( 'warning', `Log in Failed , Please try again!!!` );
      } else {
        notify( 'error', `${response?.data.error_description}` );
      }
    } );
  } catch ( error ) {

    //

  }

};


export const handleForgotPassword = ( userName ) => async dispatch => {
  const apiEndPoint = `${userManagementApi.auth}/authenticatedUser/${userName}/forgotPassword`;
  await baseAxios.post( apiEndPoint ).then( response => {
    if ( response.status === status.success ) {
      notify( 'success', `Check your mail to reset password` );
      history.push( '/login' );
    }

  } );
};
