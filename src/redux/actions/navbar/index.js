import axios from 'axios';
import { anonymousNavigation } from '../../../navigation/anonymousNavigation';
import { handleGetAuthNavigation } from '../../../navigation/authNavigation';
import { handleGetInventoryNavigation } from '../../../navigation/inventoryNavigation';
import { handleGetMerchandisingNavigation } from '../../../navigation/merchandisingNavigation';
import { BIND_AUTH_NAVIGATION } from '../../action-types';
import { isUserLoggedIn } from '../auth';

// ** Get Bookmarks Array from @fakeDB
// export const getBookmarks = () => {
//   return dispatch => {
//     return axios.get('/api/bookmarks/data').then(response => {
//       dispatch({
//         type: 'GET_BOOKMARKS',
//         data: response.data.suggestions,
//         bookmarks: response.data.bookmarks
//       })
//     })
//   }
// }

const dataBookmarks = [
  {
    icon: "Grid",
    id: 3,
    isBookmarked: true,
    link: "/modules",
    target: "modules",
    title: "Modules"
  },
  {
    icon: "List",
    id: 3,
    isBookmarked: false,
    link: "/modules",
    target: "todo",
    title: "Todo"
  }
];

export const getBookmarks = () => {
  return dispatch => {
    dispatch( {
      type: 'GET_BOOKMARKS',
      data: dataBookmarks,
      bookmarks: dataBookmarks
    } );

  };
};

// ** Update & Get Updated Bookmarks Array
export const updateBookmarked = id => {
  return dispatch => {
    return axios.post( '/api/bookmarks/update', { id } ).then( () => {
      dispatch( { type: 'UPDATE_BOOKMARKED', id } );
    } );
  };
};

// ** Handle Bookmarks & Main Search Queries
export const handleSearchQuery = val => dispatch => dispatch( { type: 'HANDLE_SEARCH_QUERY', val } );


export const bindNavigation = ( userPermission, authPermissions ) => async ( dispatch, getState ) => {
  // const { userPermission } = getState().auth;
  // const { authPermissions } = getState().permissions;

  const inventoryNavigation = handleGetInventoryNavigation( userPermission, authPermissions );
  const merchandisingNavigation = handleGetMerchandisingNavigation( userPermission, authPermissions );
  const authNavigation = handleGetAuthNavigation( userPermission, authPermissions );

  const baseModule = localStorage.getItem( 'module' );

  const horizontalNav = baseModule === "Merchandising" ? [...anonymousNavigation, ...merchandisingNavigation] : baseModule === "Inventory" ? [...anonymousNavigation, ...inventoryNavigation] : baseModule === "Users" ? [...anonymousNavigation, ...authNavigation] : [...anonymousNavigation];

  const verticalNav = baseModule === "Merchandising" ? [
    {
      header: 'Merchandising'
    }, ...merchandisingNavigation
  ] : baseModule === "Inventory" ? [
    {
      header: 'Inventory'
    }, ...inventoryNavigation
  ] : baseModule === "Users" ? [
    {
      header: 'User Management'
    }, ...authNavigation
  ] : [...anonymousNavigation];

  dispatch( {
    type: BIND_AUTH_NAVIGATION,
    horizontalNavigation: horizontalNav,
    verticalNavigation: verticalNav
  } );
  dispatch( isUserLoggedIn( true ) );
};
