// ** React Imports
import { handleContentWidth, handleMenuCollapsed, handleMenuHidden } from '@store/actions/layout';
// ** Styles
import 'animate.css/animate.css';
// ** Third Party Components
import classnames from 'classnames';
import { Fragment, useEffect } from 'react';
// ** Store & Actions
import { getAuthUser, getAuthUserPermission, handleLogout } from '@src/redux/actions/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { confirmDialog } from '../../../utility/custom/ConfirmDialog';
import { confirmObj, cookieName } from '../../../utility/enums';
import { daysToMilliseconds } from '../../../utility/Utils';
// import { cookieName } from 'utility/enums';


const LayoutWrapper = props => {
  // ** Props
  const { layout, children, appLayout, wrapperClass, transition, routeMeta } = props;

  const dispatch = useDispatch();
  const { push } = useHistory();
  const store = useSelector( state => state );
  const navbarStore = store.navbar;
  const contentWidth = store.layout.contentWidth;

  const Tag = layout === 'HorizontalLayout' && !appLayout ? 'div' : Fragment;


  const cleanUp = () => {
    if ( routeMeta ) {
      if ( routeMeta.contentWidth ) {
        dispatch( handleContentWidth( 'full' ) );
      }
      if ( routeMeta.menuCollapsed ) {
        dispatch( handleMenuCollapsed( !routeMeta.menuCollapsed ) );
      }
      if ( routeMeta.menuHidden ) {
        dispatch( handleMenuHidden( !routeMeta.menuHidden ) );
      }
    }
  };

  const token = JSON.parse( localStorage.getItem( cookieName ) );
  const isTokenExpired = token?.expires_in < ( Date.now() - token?.tokenStorageTime ) / 1000;
  const tokenExpiredTime = token?.expires_in ? token?.expires_in * 1000 : daysToMilliseconds( 365 );


  // console.log( token?.expires_in );
  useEffect( () => {
    if ( token ) {
      dispatch( getAuthUserPermission() );
      if ( isTokenExpired ) {
        dispatch( getAuthUser() );
      }
    }
  }, [] );


  const updateAuthUser = () => {
    //  dispatch( getAuthUser() );
    console.count( 'helelo' );
  };

  useEffect( () => {
    const clear = setInterval( updateAuthUser, tokenExpiredTime );
    return () => clearInterval( clear );
  }, [tokenExpiredTime] );

  const checkPermission = () => {
    // window.alert( 'Your session is out!!! Do you want to Instant Login?' );
    confirmDialog(
      {
        ...confirmObj,
        title: 'Your Session is Out!',
        text: `<h5 class="text-primary mb-0">Do you want to instant Login here? </h5> `
      }
    ).then( async e => {
      if ( e.isConfirmed ) {
        console.log( 'Yes I do' );

      } else {
        dispatch( handleLogout() );
      }
    } );
    console.count( 'permission' );
  };

  useEffect( () => {
    // const clear = setInterval( checkPermission, 5000 );
    // return () => clearInterval( clear );
  }, [10000] );


  // ** ComponentDidMount
  useEffect( () => {
    if ( routeMeta ) {
      if ( routeMeta.contentWidth ) {
        dispatch( handleContentWidth( routeMeta.contentWidth ) );
      }
      if ( routeMeta.menuCollapsed ) {
        dispatch( handleMenuCollapsed( routeMeta.menuCollapsed ) );
      }
      if ( routeMeta.menuHidden ) {
        dispatch( handleMenuHidden( routeMeta.menuHidden ) );
      }
    }
    return () => cleanUp();
  }, [] );


  return (
    <div
      className={classnames( 'app-content content overflow-hidden', {
        [wrapperClass]: wrapperClass,
        'show-overlay': 0
      } )}
    >
      <div className='content-overlay'></div>
      <div className='header-navbar-shadow' />
      <div
        className={classnames( {
          'content-wrapper': !appLayout,
          'content-area-wrapper': appLayout,
          'container p-0': contentWidth === 'boxed',
          [`animate__animated animate__${transition}`]: transition !== 'none' && transition.length
        } )}
      >
        <Tag
          /*eslint-disable */
          {...( layout === 'HorizontalLayout' && !appLayout
            ? { className: classnames( { 'content-body': !appLayout } ) }
            : {} )}
        /*eslint-enable */
        >
          {children}
        </Tag>
      </div>
    </div>
  );
};

export default LayoutWrapper;
