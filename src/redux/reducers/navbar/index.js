/* eslint-disable no-case-declarations */
// ** Initial State

import { BIND_AUTH_NAVIGATION } from "../../action-types";

const initialState = {
  suggestions: [],
  bookmarks: [],
  query: '',
  horizontalNavigation: [],
  verticalNavigation: []
};

const navbarReducer = ( state = initialState, action ) => {

  switch ( action.type ) {
    case BIND_AUTH_NAVIGATION:
      return {
        ...state,
        horizontalNavigation: action.horizontalNavigation,
        verticalNavigation: action.verticalNavigation
      };

    case 'HANDLE_SEARCH_QUERY':
      return { ...state, query: action.val };

    case 'GET_BOOKMARKS':
      return { ...state, suggestions: action.data, bookmarks: action.bookmarks };
    case 'UPDATE_BOOKMARKED':
      let objectToUpdate;

      // ** find & update object
      state.suggestions.find( item => {
        if ( item.id === action.id ) {
          item.isBookmarked = !item.isBookmarked;
          objectToUpdate = item;
        }
      } );

      // ** Get index to add or remove bookmark from array
      const bookmarkIndex = state.bookmarks.findIndex( x => x.id === action.id );

      if ( bookmarkIndex === -1 ) {
        state.bookmarks.push( objectToUpdate );
      } else {
        state.bookmarks.splice( bookmarkIndex, 1 );
      }

      return { ...state };
    default:
      return state;
  }
};

export default navbarReducer;
