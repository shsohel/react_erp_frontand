
import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import axios from "axios";
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { convertQueryString } from "../../../../../utility/Utils";
import { ADD_SAMPLE_ASSIGNEE, BIND_SAMPLE_ASSIGNEE_BASIC_INFO, DELETE_SAMPLE_ASSIGNEE, DELETE_SAMPLE_ASSIGNEE_BY_RANGE, GET_SAMPLE_ASSIGNEES, GET_SAMPLE_ASSIGNEES_BY_QUERY, GET_SAMPLE_ASSIGNEE_BY_ID, GET_SAMPLE_ASSIGNEE_DROPDOWN, IS_SAMPLE_ASSIGNEE_DATA_LOADED, OPEN_SAMPLE_ASSIGNEE_EDIT_SIDEBAR, OPEN_SAMPLE_ASSIGNEE_SIDEBAR, SAMPLE_ASSIGNEE_IMAGE_UPLOADING, SELECTED_SAMPLE_ASSIGNEE_NULL, UPDATE_SAMPLE_ASSIGNEE } from "../actionTypes";

import { baseUrl, status } from "../../../../../utility/enums";
import { sampleAssigneeModel } from "../../model";

const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};

//Open Sample Assignee Sidebar
export const handleOpenSampleAssigneeSidebar = ( condition ) => {
    return async ( dispatch ) => {
        await dispatch( {
            type: OPEN_SAMPLE_ASSIGNEE_SIDEBAR,
            openSampleAssigneeSidebar: condition
        } );
    };
};

//Open Sample Assignee Sidebar
export const handleOpenSampleAssigneeSidebarForEdit = ( condition ) => {
    return async ( dispatch ) => {
        await dispatch( {
            type: OPEN_SAMPLE_ASSIGNEE_EDIT_SIDEBAR,
            openSampleAssigneeEditSidebar: condition
        } );
    };
};

export const handleSampleAssigneeDataLoaded = ( condition ) => dispatch => {
    dispatch( {
        type: IS_SAMPLE_ASSIGNEE_DATA_LOADED,
        isSampleAssigneeDataLoaded: condition
    } );
};

///Get All without Query
export const getAllSampleAssignees = () => {
    return async ( dispatch ) => {
        await axios
            .get( `${merchandisingApi.sampleAssignee.get_sample_assignees}` )
            .then( ( response ) => {
                dispatch( {
                    type: GET_SAMPLE_ASSIGNEES,
                    sampleAssignees: response.data
                } );
            } );

    };

};
export const bindSampleAssigneeBasicInfo = ( sampleAssigneeBasicInfo ) => dispatch => {
    if ( sampleAssigneeBasicInfo ) {
        dispatch( {
            type: BIND_SAMPLE_ASSIGNEE_BASIC_INFO,
            sampleAssigneeBasicInfo
        } );
    } else {
        dispatch( {
            type: BIND_SAMPLE_ASSIGNEE_BASIC_INFO,
            sampleAssigneeBasicInfo: sampleAssigneeModel
        } );
    }

};

///Get All DropDown Sample Assignee without query
export const getDropDownSampleAssignees = () => async dispatch => {
    dispatch( {
        type: GET_SAMPLE_ASSIGNEE_DROPDOWN,
        dropDownSampleAssignees: [],
        isDropDownSampleAssigneesLoaded: false
    } );
    await baseAxios
        .get( `${merchandisingApi.sampleAssignee.root}` )
        .then( ( response ) => {
            dispatch( {
                type: GET_SAMPLE_ASSIGNEE_DROPDOWN,
                dropDownSampleAssignees: response.data.data.map( ( item ) => ( {
                    value: item.id,
                    label: item.name
                } ) ),
                isDropDownSampleAssigneesLoaded: true
            } );
        } ).catch( ( { response } ) => {
            dispatch( {
                type: GET_SAMPLE_ASSIGNEE_DROPDOWN,
                dropDownSampleAssignees: [],
                isDropDownSampleAssigneesLoaded: true
            } );
            if ( response === undefined || response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

//Get Data by Query
export const getBuyerSampleAssigneeByQuery = ( params, queryData ) => async dispatch => {
    dispatch( handleSampleAssigneeDataLoaded( false ) );
    const apiEndPoint = `${merchandisingApi.sampleAssignee.root}/grid?${convertQueryString( params )}`;
    await baseAxios
        .post( apiEndPoint, queryData )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                console.log( response.data.data );
                dispatch( {
                    type: GET_SAMPLE_ASSIGNEES_BY_QUERY,
                    sampleAssignees: response.data.data,
                    totalPages: response.data.totalPages,
                    params
                } );
                dispatch( handleSampleAssigneeDataLoaded( true ) );
            }

        } ).catch( ( { response } ) => {
            dispatch( handleSampleAssigneeDataLoaded( true ) );
            console.log( response );
            if ( response?.status === status.severError || response?.status === status.badRequest ) {
                notify( 'error', `Please contact the support team!!!` );
            }
        } );
};

//Get Sample Assignee By ID
export const getSampleAssigneeById = ( id ) => {
    return async ( dispatch ) => {
        await baseAxios
            .get( `${merchandisingApi.sampleAssignee.root}/${id}` )
            .then( ( response ) => {
                if ( response.status === status.success ) {
                    console.log( response.data );
                    const { data } = response;

                    dispatch( {
                        type: GET_SAMPLE_ASSIGNEE_BY_ID,
                        sampleAssigneeBasicInfo: response.data ? {
                            ...data,
                            city: data.city ? { label: data.city, value: data.city } : null,
                            state: data.state ? { label: data.state, value: data.state } : null,
                            country: data.country ? { label: data.country, value: data.country } : null,
                            imageUrl: data.imageUrl.length ? `${baseUrl}/${data.imageUrl}` : '',
                            imageEditUrl: ''
                        } : null
                    } );
                    dispatch( handleOpenSampleAssigneeSidebarForEdit( true ) );
                }

            } )
            .catch( ( err ) => console.log( err ) );
    };
};

///Selected Sample Assignee Null after Edit or Cancel
export const selectedSampleAssigneeNull = () => {
    return async ( dispatch ) => {
        await dispatch( {
            type: SELECTED_SAMPLE_ASSIGNEE_NULL,
            selectedSampleAssignee: null
        } );
    };
};


// Add new Buyer Agent
export const addSampleAssignee = ( sampleAssignee ) => async ( dispatch, getState ) => {
    await baseAxios.post( `${merchandisingApi.sampleAssignee.root}`, sampleAssignee )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_SAMPLE_ASSIGNEE,
                    sampleAssignee
                } );
                notify( "success", "The Sample Assignee has been added Successfully!" );
                dispatch( getBuyerSampleAssigneeByQuery( getState().sampleAssignees.params, [] ) );
                dispatch( handleOpenSampleAssigneeSidebar( false ) );
                dispatch( bindSampleAssigneeBasicInfo( null ) );

            } else {
                notify( "error", "The Sample Assignee has been added Failed!" );
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

// ** Update BuyerAgent
export const updateSampleAssignee = ( sampleAssignee, sampleAssigneeId ) => async ( dispatch, getState ) => {
    await baseAxios
        .put( `${merchandisingApi.sampleAssignee.root}/${sampleAssigneeId}`, sampleAssignee )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_SAMPLE_ASSIGNEE,
                    sampleAssignee
                } );
                notify( "success", "The Sample Assignee has been updated Successfully!" );
                dispatch( getBuyerSampleAssigneeByQuery( getState().sampleAssignees.params, [] ) );
                dispatch( handleOpenSampleAssigneeSidebarForEdit( false ) );
            } else {
                notify( "error", "The Sample Assignee has been updated Failed!" );
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

//Delete BuyerAgent
export const deleteSampleAssignee = ( id ) => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios
                    .put( `${merchandisingApi.sampleAssignee.root}/archives/${id}` )
                    .then( response => {
                        if ( response.status === status.success ) {
                            dispatch( {
                                type: DELETE_SAMPLE_ASSIGNEE
                            } );
                            notify( "success", "The Buyer Agent has been updated Successfully!" );
                            dispatch( getBuyerSampleAssigneeByQuery( getState().sampleAssignees.params, [] ) );
                        } else {
                            notify( "error", "The Buyer Agent DELETE request  has been failed!" );
                        }
                    } )
                    .catch( ( err ) => console.log( err ) );

            }
        } );

    };
};

//Delete Sample Assignee by Range
export const deleteRangeSampleAssignee = ( ids ) => {
    return ( dispatch, getState ) => {

        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                axios
                    .delete( `${merchandisingApi.sampleAssignee.delete_sample_assignee_by_range}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_SAMPLE_ASSIGNEE_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( "success", "The Sample Assignee has been deleted Successfully!" );
                        dispatch( getBuyerSampleAssigneeByQuery( getState().sampleAssignee.params ) );
                        dispatch( getAllSampleAssignees() );
                    } );
            }
        } );

    };
};


export const sampleAssigneeImageUploadLoading = () => async ( dispatch, getState ) => {
    const { isSampleAssigneeImageUploading } = getState().sampleAssignees;
    dispatch( {
        type: SAMPLE_ASSIGNEE_IMAGE_UPLOADING,
        isSampleAssigneeImageUploading: !isSampleAssigneeImageUploading
    } );

};

export const sampleAssigneeImageUpload = ( file, formData ) => async ( dispatch, getState ) => {
    dispatch( sampleAssigneeImageUploadLoading() );
    const path = `/api/merchandising/medias/upload/image`;
    // const apiEndPoint = `${merchandisingApi.buyer.root}/uploadImage`;
    await baseAxios.post( path, formData )
        .then( response => {
            console.log( response );
            if ( response.status === status.success ) {
                const { sampleAssigneeBasicInfo } = getState().sampleAssignees;
                const updatedObj = {
                    ...sampleAssigneeBasicInfo,
                    imageEditUrl: URL.createObjectURL( file ),
                    image: response.data
                };
                dispatch( bindSampleAssigneeBasicInfo( updatedObj ) );
                // dispatch( {
                //     type: AGENT_IMAGE_UPLOADING
                // } );
                dispatch( sampleAssigneeImageUploadLoading() );
            }
        } ).catch( ( { response } ) => {
            // if ( response.status === status.severError ) {
            //     notify( 'error', `Please contact the support team!!!` );
            // } else {
            //     notify( 'error', `${response.data.errors.join( ', ' )}` );
            // }
            dispatch( sampleAssigneeImageUploadLoading() );
        } );
};