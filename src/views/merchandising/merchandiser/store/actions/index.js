
import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { baseUrl, status } from "../../../../../utility/enums";
import { convertQueryString } from "../../../../../utility/Utils";
import { merchandiserModel } from "../../model";
import {
    ADD_MERCHANDISER, BIND_MERCHANDISER_BASIC_INFO,
    CLEAR_MERCHANDISER_ALL_STATE,
    DELETE_MERCHANDISER,
    DELETE_MERCHANDISER_BY_RANGE,
    DROP_DOWN_MERCHANDISERS, GET_BUYER_MERCHANDISER_BY_ID, GET_MERCHANDISERS_BY_QUERY, GET_MERCHANDISER_BY_ID, IS_ASSIGN_BUYER_MODAL_OPEN, IS_MERCHANDISER_DATA_LOADED, MERCHANDISER_IMAGE_UPLOADING, OPEN_MERCHANDISER_SIDEBAR, OPEN_MERCHANDISER_SIDEBAR_FOR_EDIT, SELECTED_MERCHANDISER_NULL,
    UPDATE_MERCHANDISER
} from "../actionTypes";


const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};

export const merchandiserDataLoaded = ( condition ) => dispatch => {
    dispatch( {
        type: IS_MERCHANDISER_DATA_LOADED,
        isMerchandiserDataLoaded: condition
    } );
};

//    case IS_ASSIGN_BUYER_MODAL_OPEN:
// return { ...state, isAssignBuyerModal: action.isAssignBuyerModal };

//Open Buyer  Modal
export const handleOpenAssignBuyerModal = ( condition ) => {
    return async ( dispatch ) => {
        await dispatch( {
            type: IS_ASSIGN_BUYER_MODAL_OPEN,
            isAssignBuyerModal: condition
        } );
    };
};

//Open Merchandiser Sidebar
export const handleOpenMerchandiserSidebar = ( condition ) => {
    return async ( dispatch ) => {
        await dispatch( {
            type: OPEN_MERCHANDISER_SIDEBAR,
            openMerchandiserSidebar: condition
        } );
    };
};
//Open Merchandiser Sidebar
export const handleOpenMerchandiserSidebarForEdit = ( condition ) => {
    return async ( dispatch ) => {
        await dispatch( {
            type: OPEN_MERCHANDISER_SIDEBAR_FOR_EDIT,
            openMerchandiserEditSidebar: condition
        } );
    };
};


// ///Get All without Query
// export const getAllMerchandisers = () => {

//     return async ( dispatch ) => {
//         await baseAxios
//             .get( `${merchandisingApi.buyerAgent.get_buyer_agents}` )
//             .then( ( response ) => {
//                 dispatch( {
//                     type: GET_MERCHANDISERS,
//                     merchandisers: response.data
//                 } );
//             } );
//     };
// };


///Get All DropDown Buyer Agent without query
export const getDropDownMerchandisers = () => {
    return async ( dispatch ) => {
        await baseAxios
            .get( `${merchandisingApi.merchandiser.root}` )
            .then( ( response ) => {
                dispatch( {
                    type: DROP_DOWN_MERCHANDISERS,
                    dropDownMerchandisers: response.data.data.map( ( item ) => ( {
                        value: item.id,
                        label: item.name,
                        email: item.email,
                        phoneNumber: item.phoneNumber
                    } ) )
                } );
            } );
    };
};

export const getCascadeDropDownMerchandisers = ( id ) => {
    console.log( id );
    return async ( dispatch ) => {
        if ( id ) {
            await baseAxios
                .get( `${merchandisingApi.buyer.root}/${id}/agents` )
                .then( ( response ) => {
                    const dropDownData = response?.data?.map( ( item ) => ( {
                        value: item.id,
                        label: item.name
                    } ) );
                    dispatch( {
                        type: DROP_DOWN_MERCHANDISERS,
                        dropDownMerchandisers: dropDownData
                    } );
                } );
        } else {
            dispatch( {
                type: DROP_DOWN_MERCHANDISERS,
                dropDownMerchandisers: []
            } );
        }

    };
};


//Get Data by Query
export const getMerchandiserByQuery = ( params, queryData ) => async dispatch => {
    dispatch( merchandiserDataLoaded( false ) );
    await baseAxios
        .post( `${merchandisingApi.merchandiser.root}/grid?${convertQueryString( params )}`, queryData )
        //   .get( `${merchandisingApi.merchandiser.root}?${convertQueryString( params )}` )
        .then( response => {
            const { data } = response;
            if ( data.succeeded ) {
                dispatch( {
                    type: GET_MERCHANDISERS_BY_QUERY,
                    merchandisers: data.data,
                    totalPages: data.totalPages,
                    params
                } );
            } else {
                notify( "error", "Something gonna Wrong!" );
            }
            dispatch( merchandiserDataLoaded( true ) );
        } )
        .catch( ( { response } ) => {
            dispatch( merchandiserDataLoaded( true ) );
            console.log( response );
            if ( response?.status === status.severError || response?.status === status.badRequest ) {
                notify( 'error', `Please contact the support team!!!` );
            }
        } );
};

//  case GET_BUYER_MERCHANDISER_BY_ID:
// return { ...state, merchandiserBuyers: action.merchandiserBuyers };

export const getMerchandiserBuyer = ( merchandiserId ) => dispatch => {
    const apiEndPoint = `${merchandisingApi.merchandiser.root}/${merchandiserId}`;
    baseAxios.get( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const { data } = response;
            dispatch( {
                type: GET_BUYER_MERCHANDISER_BY_ID,
                merchandiserBuyers: data.buyers
            } );
            dispatch( {
                type: GET_MERCHANDISER_BY_ID,
                merchandiserBasicInfo: data
            } );
            dispatch( handleOpenAssignBuyerModal( true ) );
        }
    } ).catch( ( { response } ) => {
        if ( response.status === status.severError ) {
            notify( 'error', `Please contact the support team!!!` );
        } else {
            notify( 'warning', `${response.data.errors.join( ', ' )}` );
        }
    } );
};

export const bindMerchandiserBuyer = ( buyers ) => dispatch => {
    dispatch( {
        type: GET_BUYER_MERCHANDISER_BY_ID,
        merchandiserBuyers: buyers
    } );
};

//Get Merchandiser By ID
export const getMerchandiserById = ( id ) => async ( dispatch ) => {
    await baseAxios
        .get( `${merchandisingApi.merchandiser.root}/${id}` )
        .then( response => {
            if ( response.status === status.success ) {
                const { data } = response;
                console.log( data );
                dispatch( {
                    type: GET_MERCHANDISER_BY_ID,
                    merchandiserBasicInfo: response.data ? {
                        ...data,
                        buyers: data.buyers.map( buyer => ( {
                            label: buyer.buyer,
                            value: buyer.buyerId
                        } ) ),
                        permissibleProcess: data.permissibleProcesses?.map( p => ( { value: p, label: p } ) ),
                        imageUrl: data.imageUrl ? `${baseUrl}/${data.imageUrl}` : '',
                        imageEditUrl: data.imageUrl ? `${baseUrl}/${data.imageUrl}` : ''
                    } : null
                } );

                dispatch( handleOpenMerchandiserSidebarForEdit( true ) );
            }
        } )
        .catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

export const bindMerchandiserBasicInfo = ( merchandiserBasicInfo ) => dispatch => {
    if ( merchandiserBasicInfo ) {
        dispatch( {
            type: BIND_MERCHANDISER_BASIC_INFO,
            merchandiserBasicInfo
        } );
    } else {
        dispatch( {
            type: BIND_MERCHANDISER_BASIC_INFO,
            merchandiserBasicInfo: merchandiserModel
        } );
    }

};
///Selected Buyer Agent Null after Edit or Cancel
export const selectedMerchandiserNull = () => {
    return async ( dispatch ) => {
        await dispatch( {
            type: SELECTED_MERCHANDISER_NULL,
            selectedMerchandiser: null
        } );
    };
};

// Add new merchandiser
export const addMerchandiser = ( merchandiser ) => async ( dispatch, getState ) => {
    await baseAxios.post( `${merchandisingApi.merchandiser.root}`, merchandiser )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_MERCHANDISER,
                    merchandiser
                } );
                notify( "success", "The merchandiser has been added Successfully!" );
                dispatch( getMerchandiserByQuery( getState().merchandisers.params, [] ) );
                dispatch( handleOpenMerchandiserSidebar( false ) );
                dispatch( bindMerchandiserBasicInfo( null ) );

            } else {
                notify( "error", "The merchandiser has been added Failed!" );
            }
        } )
        .catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

// ** Update Merchandiser
export const updateMerchandiser = ( merchandiser, merchandiserId ) => async ( dispatch, getState ) => {
    await baseAxios
        .put( `${merchandisingApi.merchandiser.root}/${merchandiserId}`, merchandiser )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_MERCHANDISER,
                    merchandiser
                } );
                notify( "success", "The merchandiser has been updated Successfully!" );
                dispatch( getMerchandiserByQuery( getState().merchandisers.params, [] ) );
                dispatch( handleOpenAssignBuyerModal( false ) );
            } else {
                notify( "error", "The merchandiser has been updated Failed!" );
            }
        } )
        .catch( ( { response } ) => {
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'error', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

//Delete Merchandiser
export const deleteMerchandiser = ( id ) => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios
                    .put( `${merchandisingApi.merchandiser.root}/archives/${id}` )
                    .then( response => {
                        if ( response.status === status.success ) {
                            dispatch( {
                                type: DELETE_MERCHANDISER
                            } );
                            notify( "success", "The Buyer Agent has been updated Successfully!" );
                            dispatch( getMerchandiserByQuery( getState().merchandisers.params, [] ) );
                        } else {
                            notify( "error", "The Buyer Agent DELETE request  has been failed!" );
                        }
                    } )
                    .catch( ( err ) => console.log( err ) );

            }
        } );

    };
};

//Delete Buyer Agent by Range
export const deleteRangeMerchandiser = ( ids ) => {
    return ( dispatch, getState ) => {

        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .delete( `${merchandisingApi.buyerAgent.delete_buyer_agent_by_range}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_MERCHANDISER_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( "success", "The buyer Agent has been deleted Successfully!" );
                        dispatch( getMerchandiserByQuery( getState().merchandisers.params ) );
                        // dispatch( getAllMerchandisers() );
                    } );
            }
        } );

    };
};


export const merchandiserImageUploadLoading = () => async ( dispatch, getState ) => {
    const { isAgentImageUploading } = getState().merchandisers;
    dispatch( {
        type: MERCHANDISER_IMAGE_UPLOADING,
        isAgentImageUploading: !isAgentImageUploading
    } );

};

export const merchandiserImageUpload = ( file, formData ) => async ( dispatch, getState ) => {
    dispatch( merchandiserImageUploadLoading() );
    const path = `/api/merchandising/medias/upload/image`;
    // const apiEndPoint = `${merchandisingApi.buyer.root}/uploadImage`;
    await baseAxios.post( path, formData )
        .then( response => {
            console.log( response );
            if ( response.status === status.success ) {
                const { merchandiserBasicInfo } = getState().merchandisers;
                const updatedObj = {
                    ...merchandiserBasicInfo,
                    imageEditUrl: URL.createObjectURL( file ),
                    image: response.data
                };
                dispatch( bindMerchandiserBasicInfo( updatedObj ) );
                // dispatch( {
                //     type: MERCHANDISER_IMAGE_UPLOADING
                // } );
                dispatch( merchandiserImageUploadLoading() );
            }
        } ).catch( ( { response } ) => {
            // if ( response.status === status.severError ) {
            //     notify( 'error', `Please contact the support team!!!` );
            // } else {
            //     notify( 'error', `${response.data.errors.join( ', ' )}` );
            // }
            dispatch( merchandiserImageUploadLoading() );
        } );
};


export const clearAllAgentState = () => async dispatch => {
    await dispatch( {
        type: CLEAR_MERCHANDISER_ALL_STATE
    } );
};