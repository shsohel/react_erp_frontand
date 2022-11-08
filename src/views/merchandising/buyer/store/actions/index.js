import { merchandisingApi } from '@api/merchandising';
import { notify } from '@custom/notifications';
import { baseAxios } from '@services';
import { confirmDialog } from '../../../../../utility/custom/ConfirmDialog';
import { baseUrl, status } from '../../../../../utility/enums';
import { convertQueryString } from '../../../../../utility/Utils';
import { buyerBasicModel } from '../../models';
import { ADD_BUYER, BIND_BUYER_BASIC_INFO, BUYER_IMAGE_UPLOAD, BUYER_IMAGE_UPLOAD_LOADING, BUYER_STYLE_DROPDOWN, CLEAR_ALL_BUYER_STATE, DELETE_BUYER, DELETE_BUYERS_BY_RANGE, DROP_DOWN_BUYERS, GET_BUYERS, GET_BUYERS_BY_QUERY, GET_BUYER_AGENT_BY_BUYER_ID, GET_BUYER_BY_ID, GET_BUYER_COLOR_BY_BUYER_ID, GET_BUYER_DEPARTMENT_BY_BUYER_ID, GET_BUYER_DROPDOWN_COLOR_BY_BUYER_ID, GET_BUYER_DROPDOWN_SIZE_GROUPS_BY_BUYER_ID, GET_BUYER_PRODUCT_DEVELOPER_BY_BUYER_ID, GET_BUYER_SIZE_GROUPS_BY_BUYER_ID, IS_ASSIGN_AGENT, IS_ASSIGN_PRODUCT_DEVELOPER, IS_BUYER_DATA_LOADED, IS_BUYER_DATA_ON_PROGRESS, IS_BUYER_DATA_SUBMIT_PROGRESS, OPEN_BUYER_SIDEBER, SELECTED_BUYER_NULL, UPDATE_BUYER } from '../actionTypes';

const confirmObj = {
  title: 'Are you sure?',
  text: 'You won\'t be able to revert this!',
  confirmButtonText: 'Yes !',
  cancelButtonText: 'No'
};

// case IS_BUYER_DATA_ON_PROGRESS:
// return { ...state, isBuyerDataOnProgress: action.isBuyerDataOnProgress };

//     case IS_BUYER_DATA_SUBMIT_PROGRESS:
// return { ...state, isBuyerDataSubmitProgress: action.isBuyerDataSubmitProgress };
export const isBuyerDataLoad = ( condition ) => dispatch => {
  dispatch( {
    type: IS_BUYER_DATA_LOADED,
    isBuyerDataLoaded: condition
  } );
};

export const buyerDataOnProgress = ( condition ) => dispatch => {
  dispatch( {
    type: IS_BUYER_DATA_ON_PROGRESS,
    isBuyerDataOnProgress: condition
  } );
};

export const buyerDataSubmitProgress = ( condition ) => dispatch => {
  dispatch( {
    type: IS_BUYER_DATA_SUBMIT_PROGRESS,
    isBuyerDataSubmitProgress: condition
  } );
};

/// Get All wtihout Query
export const getAllBuyers = () => {
  return async dispatch => {
    await baseAxios.get( `${merchandisingApi.buyer.get_buyers}` ).then( response => {
      dispatch( {
        type: GET_BUYERS,
        buyers: response.data
      } );
    } );
  };
};

/// Get All wtihout Query
export const getDropDownBuyers = () => async dispatch => {
  dispatch( {
    type: DROP_DOWN_BUYERS,
    dropDownBuyers: [],
    isBuyerDropdownLoaded: false
  } );
  await baseAxios.get( `${merchandisingApi.buyer.root}` )
    .then( response => {
      if ( response.status === status.success ) {
        dispatch( {
          type: DROP_DOWN_BUYERS,
          dropDownBuyers: response.data.data.map( item => ( { value: item.id, label: item.name } ) ),
          isBuyerDropdownLoaded: true

        } );
      }

    } ).catch( ( { response } ) => {
      dispatch( {
        type: DROP_DOWN_BUYERS,
        dropDownBuyers: [],
        isBuyerDropdownLoaded: true
      } );
      if ( response.status === status.badRequest || response.status === status.severError ) {
        notify( 'error', 'Please contact the support team.' );
      }
    } );
};
/// Get All wtihout Query
export const getBuyersStyles = ( buyerId ) => async dispatch => {
  if ( buyerId ) {
    dispatch( {
      type: BUYER_STYLE_DROPDOWN,
      buyerStylesDropdown: [],
      isBuyerStylesDropdownLoaded: false
    } );
    await baseAxios.get( `${merchandisingApi.buyer.root}/${buyerId}/styles` )
      .then( response => {
        if ( response.status === status.success ) {
          dispatch( {
            type: BUYER_STYLE_DROPDOWN,
            buyerStylesDropdown: response?.data.map( style => ( {
              ...style,
              value: style.id,
              label: style.styleNo,
              isSetStyle: style.isSetStyle,
              isSizeSpecific: style.isSizeSpecific
            } ) ),
            isBuyerStylesDropdownLoaded: true
          } );
        }
      } ).catch( ( { response } ) => {
        dispatch( {
          type: BUYER_STYLE_DROPDOWN,
          buyerStylesDropdown: [],
          isBuyerStylesDropdownLoaded: false
        } );
      } );
  } else {
    dispatch( {
      type: BUYER_STYLE_DROPDOWN,
      buyerStylesDropdown: [],
      isBuyerStylesDropdownLoaded: true

    } );
  }

};


//Get Data by Query
export const getBuyerByQuery = ( params, queryData ) => {
  return async dispatch => {
    dispatch( isBuyerDataLoad( false ) );
    await baseAxios.post( `${merchandisingApi.buyer.root}/grid?${convertQueryString( params )}`, queryData ).then( response => {
      console.log( response );

      if ( response.status === status.success ) {
        dispatch( {
          type: GET_BUYERS_BY_QUERY,
          buyers: response?.data.data,
          totalPages: response?.data.totalRecords,
          params
        } );
      }
      dispatch( isBuyerDataLoad( true ) );

    } ).catch( ( { response } ) => {
      dispatch( isBuyerDataLoad( true ) );
      if ( response.status === status.badRequest || response.status === status.severError ) {
        notify( 'error', 'Please contact the support team.' );
      }
    } );
  };
};


export const bindBuyerBasicInfo = ( buyerBasicInfo ) => dispatch => {
  dispatch( {
    type: BIND_BUYER_BASIC_INFO,
    //  selectedBuyer: buyerBasicInfo,
    buyerBasicInfo
  } );
};

// ** Get Buyer by Id
export const getAgentByBuyerById = ( id ) => async ( dispatch, getState ) => {
  const endPoint = `${merchandisingApi.buyer.root}/${id}/agents`;
  await baseAxios
    .get( endPoint )
    .then( response => {
      if ( response.status === status.success ) {
        const { buyerBasicInfo } = getState().buyers;
        const updatedObj = {
          ...buyerBasicInfo,
          buyerAgent: response.data ? response.data?.map( d => ( { ...d, isDeleted: false, isNew: false } ) ) : []
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );
        dispatch( {
          type: GET_BUYER_AGENT_BY_BUYER_ID,
          buyerAgentsByBuyerId: response.data ? response.data?.map( d => ( { ...d, isDeleted: false, isNew: false } ) ) : []
        } );

      } else {
        notify( 'error', `'The Buyer Department couldn't find'` );
      }
    } )
    .catch( err => console.log( err ) );

};

// ** Get Buyer by Id
export const getBuyerDepartmentByBuyerById = ( id ) => async ( dispatch, getState ) => {
  const endPoint = `${merchandisingApi.buyer.root}/${id}/departments`;
  await baseAxios
    .get( endPoint )
    .then( response => {
      if ( response.status === status.success ) {
        const { buyerBasicInfo } = getState().buyers;
        const updatedObj = {
          ...buyerBasicInfo,
          buyerDepartment: response.data ? response.data?.map( d => ( { ...d, isDeleted: false, isNew: false } ) ) : []
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );

        dispatch( {
          type: GET_BUYER_DEPARTMENT_BY_BUYER_ID,
          buyerDepartmentByBuyerId: response.data ? response.data?.map( d => ( { ...d, isDeleted: false, isNew: false } ) ) : null
        } );

      } else {
        notify( 'error', `'The Buyer Department couldn't find'` );
      }
    } )
    .catch( err => console.log( err ) );
};
export const bindBuyerDepartmentOnChange = ( buyerDepartments ) => async dispatch => {
  await dispatch( {
    type: GET_BUYER_DEPARTMENT_BY_BUYER_ID,
    buyerDepartmentByBuyerId: buyerDepartments
  } );

};
export const bindBuyerAgentOnChange = ( buyerAgents ) => async dispatch => {
  await dispatch( {
    type: GET_BUYER_AGENT_BY_BUYER_ID,
    buyerAgentsByBuyerId: buyerAgents
  } );

};
export const bindBuyerProductDeveloperOnChange = ( buyerProductDevelopers ) => async dispatch => {
  await dispatch( {
    type: GET_BUYER_PRODUCT_DEVELOPER_BY_BUYER_ID,
    buyerProductDeveloperByBuyerId: buyerProductDevelopers
  } );

};
export const bindBuyerSizeGroupsOnChange = ( buyerSizeGroups ) => async dispatch => {
  await dispatch( {
    type: GET_BUYER_SIZE_GROUPS_BY_BUYER_ID,
    buyerSizeGroups
  } );

};
export const bindBuyerColorsOnChange = ( buyerColors ) => async dispatch => {
  await dispatch( {
    type: GET_BUYER_COLOR_BY_BUYER_ID,
    buyerColors
  } );

};

// ** Get Buyer by Id
export const getBuyerProductDeveloperByBuyerById = ( id ) => async ( dispatch, getState ) => {
  const endPoint = `${merchandisingApi.buyer.root}/${id}/productDevelopers`;
  await baseAxios
    .get( endPoint )
    .then( response => {
      if ( response.status === status.success ) {
        const { buyerBasicInfo } = getState().buyers;
        const updatedObj = {
          ...buyerBasicInfo,
          buyerProductDeveloper: response.data ? response.data?.map( d => ( { ...d, isDeleted: false, isNew: false } ) ) : []
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );

        dispatch( {
          type: GET_BUYER_PRODUCT_DEVELOPER_BY_BUYER_ID,
          buyerProductDeveloperByBuyerId: response.data ? response.data?.map( d => ( { ...d, isDeleted: false, isNew: false } ) ) : null
        } );

      } else {
        notify( 'error', `'The Buyer Department couldn't find'` );
      }
    } )
    .catch( err => console.log( err ) );

};
// ** Get Buyer Size Group by Id
export const getBuyerSizeGroupsByBuyerById = ( id ) => async ( dispatch, getState ) => {
  const endPoint = `${merchandisingApi.buyer.root}/${id}/sizeGroups`;
  await baseAxios
    .get( endPoint )
    .then( response => {
      if ( response.status === status.success ) {
        const { buyerBasicInfo } = getState().buyers;
        const updatedObj = {
          ...buyerBasicInfo,
          buyerSizeGroups: response.data ? response.data?.map( d => ( {
            ...d,
            name: d.sizeGroupName,
            id: d.sizeGroupId,
            isDeleted: false,
            isNew: false
          } ) ) : []
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );
        dispatch( {
          type: GET_BUYER_SIZE_GROUPS_BY_BUYER_ID,
          buyerSizeGroups: response.data ? response.data?.map( d => ( { ...d, isDeleted: false, isNew: false } ) ) : null
        } );

      } else {
        notify( 'error', `'The Buyer Department couldn't find'` );
      }
    } )
    .catch( err => console.log( err ) );

};

export const getBuyerColorsDropdownByBuyerById = ( id ) => async dispatch => {
  if ( id ) {
    dispatch( {
      type: GET_BUYER_DROPDOWN_COLOR_BY_BUYER_ID,
      dropdownBuyerColors: [],
      isDropdownBuyerColorsLoaded: false
    } );
    const endPoint = `${merchandisingApi.buyer.root}/${id}/colors`;
    await baseAxios
      .get( endPoint )
      .then( response => {
        if ( response.status === status.success ) {
          const dropdownBuyerColors = response?.data.map( color => ( {
            value: color.colorId,
            label: color.colorName
          } ) );

          dispatch( {
            type: GET_BUYER_DROPDOWN_COLOR_BY_BUYER_ID,
            dropdownBuyerColors: response.data ? dropdownBuyerColors : [],
            isDropdownBuyerColorsLoaded: true
          } );

        } else {
          notify( 'error', `'The Buyer Color couldn't find'` );
        }
      } )
      .catch( err => console.log( err ) );
  } else {
    dispatch( {
      type: GET_BUYER_DROPDOWN_COLOR_BY_BUYER_ID,
      dropdownBuyerColors: [],
      isDropdownBuyerColorsLoaded: true

    } );
  }

};
export const getBuyerSizeGroupsDropdownByBuyerById = ( id ) => async dispatch => {
  if ( id ) {
    dispatch( {
      type: GET_BUYER_DROPDOWN_SIZE_GROUPS_BY_BUYER_ID,
      dropdownBuyerSizeGroups: [],
      isDropdownBuyerSizeGroupsLoaded: false
    } );
    const endPoint = `${merchandisingApi.buyer.root}/${id}/sizeGroups`;
    await baseAxios
      .get( endPoint )
      .then( response => {
        if ( response.status === status.success ) {
          const dropdownBuyerSizeGroups = response?.data?.map( group => ( {
            value: group.sizeGroupId,
            label: group.sizeGroupName
          } ) );

          dispatch( {
            type: GET_BUYER_DROPDOWN_SIZE_GROUPS_BY_BUYER_ID,
            dropdownBuyerSizeGroups: response.data ? dropdownBuyerSizeGroups : [],
            isDropdownBuyerSizeGroupsLoaded: true
          } );

        }
      } )
      .catch( ( { response } ) => {
        if ( response === undefined || response?.status === status.severError ) {
          notify( 'error', `Please contact the support team!!!` );
        } else {
          notify( 'warning', `${response?.data?.errors?.join( ', ' )}` );

        }
      } );
  } else {
    dispatch( {
      type: GET_BUYER_DROPDOWN_SIZE_GROUPS_BY_BUYER_ID,
      dropdownBuyerSizeGroups: [],
      isDropdownBuyerSizeGroupsLoaded: true

    } );
  }

};


// ** Get Buyer Colors by Id
export const getBuyerColorsByBuyerById = ( id ) => async ( dispatch, getState ) => {
  const endPoint = `${merchandisingApi.buyer.root}/${id}/colors`;
  await baseAxios
    .get( endPoint )
    .then( response => {
      if ( response.status === status.success ) {

        const { buyerBasicInfo } = getState().buyers;
        const updatedObj = {
          ...buyerBasicInfo,
          buyerColors: response.data ? response.data?.map( d => ( {
            ...d,
            id: d.colorId,
            name: d.colorName,
            isDeleted: false,
            isNew: false
          } ) ) : []
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );
        dispatch( {
          type: GET_BUYER_COLOR_BY_BUYER_ID,
          buyerColors: response.data ? response.data?.map( d => ( { ...d, isDeleted: false, isNew: false } ) ) : null
        } );

      } else {
        notify( 'error', `'The Buyer Department couldn't find'` );
      }
    } )
    .catch( err => console.log( err ) );

};
export const getBuyerDestinationByBuyerId = ( id ) => async ( dispatch, getState ) => {
  const endPoint = `${merchandisingApi.buyer.root}/${id}/destinations`;
  await baseAxios
    .get( endPoint )
    .then( response => {
      if ( response.status === status.success ) {

        const { buyerBasicInfo } = getState().buyers;
        const updatedObj = {
          ...buyerBasicInfo,
          buyerDestinations: response.data ? response.data?.map( d => ( {
            id: d,
            name: d,
            isDeleted: false,
            isNew: false
          } ) ) : []
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );

        // dispatch( {
        //   type: GET_BUYER_COLOR_BY_BUYER_ID,
        //   buyerColors: response.data ? response.data?.map( d => ( { ...d, isDeleted: false, isNew: false } ) ) : null
        // } );
        dispatch( buyerDataOnProgress( false ) );


      } else {
        notify( 'error', `'The Buyer Destination couldn't find'` );
      }
    } )
    .catch( ( { response } ) => {
      dispatch( buyerDataOnProgress( false ) );
      if ( response.status === status.severError ) {
        notify( 'error', `Please contact the support team!!!` );
      } else {
        notify( 'warning', `${response.data.errors?.join( ', ' )}` );
      }
    } );

};


/// Selected Buyer Null after Edit or Edit Cancel
export const selectedBuyerNull = () => {
  return async dispatch => {
    await dispatch( {
      type: SELECTED_BUYER_NULL,
      selectedBuyer: null
    } );
  };
};

// ** Get Buyer by Id
export const getBuyerById = id => async dispatch => {
  dispatch( buyerDataOnProgress( true ) );
  await baseAxios
    .get( `${merchandisingApi.buyer.get_buyer_by_id}/${id}` )
    .then( response => {
      if ( response.status === status.success ) {
        const { data } = response;
        const obj = {
          ...buyerBasicModel,
          id: data.id,
          sysId: data.sysId,
          name: data.name,
          shortName: data.shortName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          fullAddress: data.fullAddress,
          state: data.state ? { label: data.state, value: data.state } : null,
          postalCode: data.postalCode,
          city: data.city ? { label: data.city, value: data.city } : null,
          country: data.country ? { label: data.country, value: data.country } : null,
          imageUrl: data.imageUrl.length ? `${baseUrl}/${data.imageUrl}` : data.imageUrl,
          imageEditUrl: ''
        };
        dispatch( {
          type: GET_BUYER_BY_ID,
          buyerBasicInfo: response.data ? obj : null
        } );
        dispatch( getAgentByBuyerById( id ) );
        dispatch( getBuyerProductDeveloperByBuyerById( id ) );
        dispatch( getBuyerDepartmentByBuyerById( id ) );
        dispatch( getBuyerSizeGroupsByBuyerById( id ) );
        dispatch( getBuyerColorsByBuyerById( id ) );
        dispatch( getBuyerDestinationByBuyerId( id ) );
      } else {
        notify( 'error', `'The Buyer couldn't find'` );
      }
    } )
    .catch( ( { response } ) => {
      dispatch( buyerDataOnProgress( false ) );
      if ( response.status === status.severError ) {
        notify( 'error', `Please contact the support team!!!` );
      } else {
        notify( 'warning', `${response.data.errors?.join( ', ' )}` );
      }
    } );
};
// ** Add new buyer
export const addBuyer = ( buyer, push ) => async ( dispatch, getState ) => {
  dispatch( buyerDataOnProgress( true ) );
  await baseAxios
    .post( `${merchandisingApi.buyer.add_buyer}`, buyer )
    .then( response => {
      if ( response.status === status.success ) {
        dispatch( {
          type: ADD_BUYER,
          lastBuyerAdded: response.data,
          buyer
        } );
        push( { pathname: `/buyer-details`, state: `${response.data}` } );
        notify( 'success', 'The buyer has been added Successfully!' );
        // dispatch( getBuyerByQuery( getState().buyers.params, [] ) );
        dispatch( buyerDataOnProgress( false ) );

      } else {
        notify( 'error', 'The buyer has been added Failed!' );
      }
    } )
    .catch( ( { response } ) => {
      dispatch( buyerDataOnProgress( false ) );

      if ( response?.status === status.severError || response === undefined ) {
        notify( 'error', `Please contact the support team!!!` );
      } else {
        notify( 'warning', `${response?.data?.errors?.join( ', ' )}` );
      }
    } );
};


// ** Update Buyer
export const updateBuyer = ( buyerId, buyer ) => dispatch => {
  dispatch( buyerDataOnProgress( true ) );
  baseAxios
    .put( `${merchandisingApi.buyer.update_buyer}/${buyerId}`, buyer )
    .then( response => {
      if ( response.status === status.success ) {
        dispatch( {
          type: UPDATE_BUYER,
          buyer
        } );
        notify( 'success', 'The buyer has been updated Successfully!' );
        dispatch( getBuyerById( buyerId ) );
        //dispatch( getBuyerByQuery( getState().buyers.params, [] ) );
      } else {
        notify( 'error', 'The buyer has been updated Failed!' );
      }
    } )
    .catch( ( { response } ) => {
      dispatch( buyerDataOnProgress( false ) );

      if ( response.status === status.severError ) {
        notify( 'error', `Please contact the support team!!!` );
      } else {
        notify( 'error', `${response?.data?.errors?.join( ', ' )}` );
      }
    } );
};

export const addBuyerSpecificDepartment = ( buyerId, AssignDepartment ) => {
  return async ( dispatch, getState ) => {
    await baseAxios
      .put( `${merchandisingApi.buyer.get_buyer_specific_department_by_id}/${buyerId}/departments`, AssignDepartment )
      .then( response => {
        if ( response.status === status.success ) {
          dispatch( {
            type: UPDATE_BUYER,
            AssignDepartment
          } );
          notify( 'success', 'The buyer department has been added Successfully!' );

        } else {
          notify( 'error', 'The buyer department has been added Failed!' );
        }
      } )
      .then( () => {
        dispatch( getBuyerByQuery( getState().buyers.params, [] ) );
        // dispatch( getAllBuyers() );
      } )
      .catch( err => console.log( err ) );
  };
};

export const addBuyerSpecificAgent = ( buyerId, AssignAgent ) => {

  return ( dispatch, getState ) => {
    baseAxios
      .put( `${merchandisingApi.buyer.add_buyer_specific_agent}/${buyerId}/agents`, AssignAgent )
      .then( response => {
        if ( response.status === status.success ) {
          dispatch( {
            type: UPDATE_BUYER,
            AssignAgent
          } );
          notify( 'success', 'The buyer agent has been added Successfully!' );

        } else {
          notify( 'error', 'The buyer agent has been added Failed!' );
        }
      } )
      .then( () => {
        dispatch( getBuyerByQuery( getState().buyers.params, [] ) );
        // dispatch( getAllBuyers() );
      } )
      .catch( err => console.log( err ) );
  };
};


export const addBuyerSpecificProductDeveloper = ( buyerId, assignProductDeveloper ) => {
  return ( dispatch, getState ) => {
    baseAxios
      .put( `${merchandisingApi.buyer.add_buyer_specific_product_developer}/${buyerId}/productDevelopers`, assignProductDeveloper )
      .then( response => {
        if ( response.status === status.success ) {
          dispatch( {
            type: UPDATE_BUYER,
            assignProductDeveloper
          } );
          notify( 'success', 'The product developer has been added Successfully!' );

        } else {
          notify( 'error', 'The product developer has been added Failed!' );
        }
      } )
      .then( () => {
        dispatch( getBuyerByQuery( getState().buyers.params, [] ) );
        // dispatch( getAllBuyers() );
      } )
      .catch( err => console.log( err ) );
  };
};

// ** Delete Buyer
export const deleteBuyer = id => {
  return ( dispatch, getState ) => {
    confirmDialog( confirmObj ).then( async e => {
      if ( e.isConfirmed ) {
        await baseAxios
          .put( `${merchandisingApi.buyer.root}/archives/${id}` )
          .then( response => {
            console.log( response );
            if ( response.status === status.success ) {
              dispatch( {
                type: DELETE_BUYER
              } );
              notify( 'success', 'The Buyer has been deleted Successfully!' );
              dispatch( getBuyerByQuery( getState().buyers.params, [] ) );
            } else {
              notify( 'error', 'The request has been failed!' );
            }

          } )
          .catch( err => console.log( err ) );
      }
    } );

  };

};


// ** Delete Buyer by Range
export const deleteRangeBuyer = ids => {
  return ( dispatch, getState ) => {
    confirmDialog( confirmObj ).then( e => {
      if ( e.isConfirmed ) {
        baseAxios
          .delete( `${merchandisingApi.buyer.delete_buyer_by_range}`, { ids } )
          .then( response => {
            dispatch( {
              type: DELETE_BUYERS_BY_RANGE
            } );
          } )
          .then( () => {
            notify( 'success', 'Buyers has been deleted Successfully!' );
            dispatch( getBuyerByQuery( getState().buyers.params, [] ) );
            dispatch( getAllBuyers() );
          } );
      }
    } );

  };
};


// ** Open  Buyer Siderbar
export const handleOpenBuyerSidebar = ( condition ) => {
  return async dispatch => {
    await dispatch( {
      type: OPEN_BUYER_SIDEBER,
      openBuyerSidebar: condition
    } );
  };
};

export const handleAssignAgent = ( assignAgentObj ) => async dispatch => {
  if ( assignAgentObj ) {
    await baseAxios.get( `${merchandisingApi.buyer.get_buyer_specific_agent_by_id}/${assignAgentObj.buyerId}/agents` )
      .then( response => {
        const buyerAgents = response.data?.map( a => ( { value: a.id, label: a.name } ) );
        dispatch( {
          type: IS_ASSIGN_AGENT,
          assignAgentOpen: { ...assignAgentObj, buyerAgents }
        } );
      } );
  } else {
    dispatch( {
      type: IS_ASSIGN_AGENT,
      assignAgentOpen: assignAgentObj
    } );
  }


};

export const handleAssignProductDeveloper = ( assignProductDeveloperObj ) => async dispatch => {
  if ( assignProductDeveloperObj ) {
    await baseAxios.get( `${merchandisingApi.buyer.get_buyer_specific_product_developer_by_id}/${assignProductDeveloperObj.buyerId}/productDevelopers` )
      .then( response => {
        const buyerProductDevelopers = response.data?.map( a => ( { value: a.id, label: a.name } ) );
        dispatch( {
          type: IS_ASSIGN_PRODUCT_DEVELOPER,
          assignProductDeveloperOpen: { ...assignProductDeveloperObj, buyerProductDevelopers }
        } );
      } );
  } else {
    dispatch( {
      type: IS_ASSIGN_PRODUCT_DEVELOPER,
      assignProductDeveloperOpen: assignProductDeveloperObj
    } );
  }

};

export const updateBuyerColor = ( buyerColors, buyerId ) => async dispatch => {
  dispatch( buyerDataSubmitProgress( true ) );
  const apiEndPoint = `${merchandisingApi.buyer.root}/${buyerId}/colors`;
  await baseAxios.put( apiEndPoint, buyerColors ).then( response => {
    if ( response.status === status.success ) {
      //
      notify( 'success', `The buyer colors has been successfully assign` );
      dispatch( getBuyerColorsDropdownByBuyerById( buyerId ) );
      dispatch( getBuyerColorsByBuyerById( buyerId ) );
      dispatch( buyerDataSubmitProgress( false ) );
    }
  } ).catch( ( { response } ) => {
    if ( response?.status === status.severError || response === undefined ) {
      notify( 'error', `Please contact the support team!!!` );
    } else {
      notify( 'error', `${response?.data?.errors.join( ', ' )}` );
    }
    dispatch( buyerDataSubmitProgress( false ) );
  } );

};


export const clearAllBuyerState = () => async dispatch => {
  await dispatch( {
    type: CLEAR_ALL_BUYER_STATE
  } );
};


export const buyerImageUploadLoading = () => async ( dispatch, getState ) => {
  const { isImageUploading } = getState().buyers;
  dispatch( {
    type: BUYER_IMAGE_UPLOAD_LOADING,
    isImageUploading: !isImageUploading
  } );

};

export const buyerImageUpload = ( file, formData ) => async ( dispatch, getState ) => {
  dispatch( buyerImageUploadLoading() );
  const apiEndPoint = `${merchandisingApi.media.imageUpload}`;
  await baseAxios.post( apiEndPoint, formData )
    .then( response => {
      console.log( response );
      if ( response.status === status.success ) {
        const { buyerBasicInfo } = getState().buyers;
        const updatedObj = {
          ...buyerBasicInfo,
          photo: file,
          imageEditUrl: URL.createObjectURL( file ),
          image: response.data
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );
        dispatch( {
          type: BUYER_IMAGE_UPLOAD
        } );
        dispatch( buyerImageUploadLoading() );
      }
    } ).catch( ( { response } ) => {
      if ( response.status === status.severError ) {
        notify( 'error', `Please contact the support team!!!` );
      } else {
        notify( 'error', `${response.data.errors.join( ', ' )}` );
      }
      dispatch( buyerImageUploadLoading() );
    } );
};
