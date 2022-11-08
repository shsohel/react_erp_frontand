/* eslint-disable no-case-declarations */

import { AUTH_TOKEN_STORE, GET_AUTHENTICATE_USER, GET_AUTHENTICATE_USER_PERMISSION, IS_USER_LOGGED_IN, LOGIN, LOGOUT } from "../../action-types";

// **  Initial State
const initialState = {
  authToken: null,
  userData: {},
  authenticateUser: null,
  authenticateUserPermission: [],
  isUserLoggedIn: true,
  userPermission: {}
};

const authReducer = ( state = initialState, action ) => {
  switch ( action.type ) {
    case LOGIN:
      return {
        ...state,
        userData: action.data
      };
    case LOGOUT:
      return {
        ...state,
        authenticateUser: action.authenticateUser,
        authenticateUserPermission: action.authenticateUserPermission,
        userPermission: action.userPermission
      };

    case AUTH_TOKEN_STORE:
      return { ...state, authToken: action.authToken };

    case GET_AUTHENTICATE_USER:
      return { ...state, authenticateUser: action.authenticateUser };

    case GET_AUTHENTICATE_USER_PERMISSION:
      return {
        ...state,
        authenticateUserPermission: action.authenticateUserPermission,
        userPermission: action.userPermission
      };

    case IS_USER_LOGGED_IN:
      return { ...state, isUserLoggedIn: action.isUserLoggedIn };
    default:
      return state;
  }
};

export default authReducer;
