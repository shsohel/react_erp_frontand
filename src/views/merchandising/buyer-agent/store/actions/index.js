
import { notify } from "@custom/notifications";
import { baseAxios } from "@services";
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { baseUrl, status } from "../../../../../utility/enums";
import { convertQueryString } from "../../../../../utility/Utils";
import { agentModel } from "../../model";
import {
    ADD_BUYER_AGENT,
    AGENT_IMAGE_UPLOADING,
    BIND_AGENT_BASIC_INFO,
    CLEAR_AGENT_ALL_STATE,
    DELETE_BUYER_AGENT,
    DELETE_BUYER_AGENT_BY_RANGE,
    DROP_DOWN_BUYER_AGENTS,
    GET_BUYER_AGENTS, GET_BUYER_AGENTS_BY_QUERY, GET_BUYER_AGENT_BY_ID, IS_AGENT_DATA_LOADED, OPEN_BUYER_AGENT_SIDEBAR, OPEN_BUYER_AGENT_SIDEBAR_FOR_EDIT, SELECTED_BUYER_AGENT_NULL,
    UPDATE_BUYER_AGENT
} from "../actionTypes";


const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};

export const isAgentDataLoad = ( condition ) => dispatch => {
    dispatch( {
        type: IS_AGENT_DATA_LOADED,
        isAgentDataLoaded: condition
    } );
};

//Open Buyer Agent Sidebar
export const handleOpenBuyerAgentSidebar = ( condition ) => {
    return async ( dispatch ) => {
        await dispatch( {
            type: OPEN_BUYER_AGENT_SIDEBAR,
            openBuyerAgentSidebar: condition
        } );
    };
};
//Open Buyer Agent Sidebar
export const handleOpenBuyerAgentSidebarForEdit = ( condition ) => {
    return async ( dispatch ) => {
        await dispatch( {
            type: OPEN_BUYER_AGENT_SIDEBAR_FOR_EDIT,
            openBuyerAgentEditSidebar: condition
        } );
    };
};


///Get All without Query
export const getAllBuyerAgents = () => {

    return async ( dispatch ) => {
        await baseAxios
            .get( `${merchandisingApi.buyerAgent.get_buyer_agents}` )
            .then( ( response ) => {
                dispatch( {
                    type: GET_BUYER_AGENTS,
                    buyerAgents: response.data
                } );
            } );
    };
};


///Get All DropDown Buyer Agent without query
export const getDropDownBuyerAgents = () => async ( dispatch ) => {
    dispatch( {
        type: DROP_DOWN_BUYER_AGENTS,
        dropDownBuyerAgents: [],
        isDropDownBuyerAgentsLoaded: false
    } );
    await baseAxios
        .get( `${merchandisingApi.buyerAgent.root}` )
        .then( ( response ) => {
            dispatch( {
                type: DROP_DOWN_BUYER_AGENTS,
                dropDownBuyerAgents: response.data.data.map( ( item ) => ( {
                    value: item.id,
                    label: item.name,
                    email: item.email,
                    phoneNumber: item.phoneNumber
                } ) ),
                isDropDownBuyerAgentsLoaded: true
            } );
        } ).catch( ( { response } ) => {
            dispatch( {
                type: DROP_DOWN_BUYER_AGENTS,
                dropDownBuyerAgents: [],
                isDropDownBuyerAgentsLoaded: true
            } );
            if ( response?.status === status.severError || response === undefined ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors.join( ', ' )}` );
            }
        } );
};

export const getCascadeDropDownBuyerAgents = ( id ) => {
    return async ( dispatch ) => {
        if ( id ) {
            dispatch( {
                type: DROP_DOWN_BUYER_AGENTS,
                dropDownBuyerAgents: [],
                isDropDownBuyerAgentsLoaded: false
            } );
            await baseAxios
                .get( `${merchandisingApi.buyer.root}/${id}/agents` )
                .then( ( response ) => {
                    const dropDownData = response?.data?.map( ( item ) => ( {
                        value: item.id,
                        label: item.name
                    } ) );
                    dispatch( {
                        type: DROP_DOWN_BUYER_AGENTS,
                        dropDownBuyerAgents: dropDownData,
                        isDropDownBuyerAgentsLoaded: true
                    } );
                } );
        } else {
            dispatch( {
                type: DROP_DOWN_BUYER_AGENTS,
                dropDownBuyerAgents: [],
                isDropDownBuyerAgentsLoaded: true
            } );
        }

    };
};


//Get Data by Query
export const getBuyerAgentByQuery = ( params, queryData ) => async dispatch => {
    dispatch( isAgentDataLoad( false ) );
    await baseAxios
        .post( `${merchandisingApi.buyerAgent.root}/grid?${convertQueryString( params )}`, queryData )
        .then( response => {
            const { data } = response;
            if ( data.succeeded ) {
                dispatch( {
                    type: GET_BUYER_AGENTS_BY_QUERY,
                    buyerAgents: data.data,
                    totalPages: data.totalPages,
                    params
                } );
            } else {
                notify( "error", "Something gonna Wrong!" );
            }
            dispatch( isAgentDataLoad( true ) );
        } )
        .catch( ( { response } ) => {
            dispatch( isAgentDataLoad( true ) );
            console.log( response );
            if ( response?.status === status.severError || response?.status === status.badRequest ) {
                notify( 'error', `Please contact the support team!!!` );
            }
        } );
};

//Get BuyerAgent By ID
export const getBuyerAgentById = ( id ) => {
    return async ( dispatch ) => {
        await baseAxios
            .get( `${merchandisingApi.buyerAgent.root}/${id}` )
            .then( response => {

                if ( response.status === status.success ) {
                    const { data } = response.data;
                    dispatch( {
                        type: GET_BUYER_AGENT_BY_ID,
                        agentBasicInfo: response.data.data ? {
                            ...data,
                            city: data.city ? { label: data.city, value: data.city } : null,
                            state: data.state ? { label: data.state, value: data.state } : null,
                            country: data.country ? { label: data.country, value: data.country } : null,
                            imageUrl: response.data.data.imageUrl.length ? `${baseUrl}/${response.data.data.imageUrl}` : '',
                            imageEditUrl: ''
                        } : null
                    } );

                    dispatch( handleOpenBuyerAgentSidebarForEdit( true ) );
                }
            } )
            .catch( ( err ) => console.log( err ) );
    };
};

export const bindAgentBasicInfo = ( agentBasicInfo ) => dispatch => {
    if ( agentBasicInfo ) {
        dispatch( {
            type: BIND_AGENT_BASIC_INFO,
            agentBasicInfo
        } );
    } else {
        dispatch( {
            type: BIND_AGENT_BASIC_INFO,
            agentBasicInfo: agentModel
        } );
    }

};
///Selected Buyer Agent Null after Edit or Cancel
export const selectedBuyerAgentNull = () => {
    return async ( dispatch ) => {
        await dispatch( {
            type: SELECTED_BUYER_AGENT_NULL,
            selectedBuyerAgent: null
        } );
    };
};

// Add new Buyer Agent
export const addBuyerAgent = ( buyerAgent ) => async ( dispatch, getState ) => {
    await baseAxios.post( `${merchandisingApi.buyerAgent.root}`, buyerAgent )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_BUYER_AGENT,
                    buyerAgent
                } );
                notify( "success", "The buyer agent has been added Successfully!" );
                dispatch( getBuyerAgentByQuery( getState().buyerAgents.params, [] ) );
                dispatch( handleOpenBuyerAgentSidebar( false ) );
                dispatch( bindAgentBasicInfo( null ) );

            } else {
                notify( "error", "The buyer agent has been added Failed!" );
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
export const updateBuyerAgent = ( buyerAgent, agentId ) => async ( dispatch, getState ) => {
    await baseAxios
        .put( `${merchandisingApi.buyerAgent.root}/${agentId}`, buyerAgent )
        .then( ( response ) => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: UPDATE_BUYER_AGENT,
                    buyerAgent
                } );
                notify( "success", "The buyer Agent has been updated Successfully!" );
                dispatch( getBuyerAgentByQuery( getState().buyerAgents.params, [] ) );
                dispatch( selectedBuyerAgentNull() );
                dispatch( handleOpenBuyerAgentSidebarForEdit( false ) );
            } else {
                notify( "error", "The buyer Agent has been updated Failed!" );
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
export const deleteBuyerAgent = ( id ) => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios
                    .put( `${merchandisingApi.buyerAgent.root}/archives/${id}` )
                    .then( response => {
                        if ( response.status === status.success ) {
                            dispatch( {
                                type: DELETE_BUYER_AGENT
                            } );
                            notify( "success", "The Buyer Agent has been updated Successfully!" );
                            dispatch( getBuyerAgentByQuery( getState().buyerAgents.params, [] ) );
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
export const deleteRangeBuyerAgent = ( ids ) => {
    return ( dispatch, getState ) => {

        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios
                    .delete( `${merchandisingApi.buyerAgent.delete_buyer_agent_by_range}`, { ids } )
                    .then( response => {
                        dispatch( {
                            type: DELETE_BUYER_AGENT_BY_RANGE
                        } );
                    } )
                    .then( () => {
                        notify( "success", "The buyer Agent has been deleted Successfully!" );
                        dispatch( getBuyerAgentByQuery( getState().buyerAgents.params ) );
                        // dispatch( getAllBuyerAgents() );
                    } );
            }
        } );

    };
};


export const agentImageUploadLoading = () => async ( dispatch, getState ) => {
    const { isAgentImageUploading } = getState().buyerAgents;
    dispatch( {
        type: AGENT_IMAGE_UPLOADING,
        isAgentImageUploading: !isAgentImageUploading
    } );

};

export const agentImageUpload = ( file, formData ) => async ( dispatch, getState ) => {
    dispatch( agentImageUploadLoading() );
    const path = `/api/merchandising/medias/upload/image`;
    // const apiEndPoint = `${merchandisingApi.buyer.root}/uploadImage`;
    await baseAxios.post( path, formData )
        .then( response => {
            console.log( response );
            if ( response.status === status.success ) {
                const { agentBasicInfo } = getState().buyerAgents;
                const updatedObj = {
                    ...agentBasicInfo,
                    imageEditUrl: URL.createObjectURL( file ),
                    image: response.data
                };
                dispatch( bindAgentBasicInfo( updatedObj ) );
                // dispatch( {
                //     type: AGENT_IMAGE_UPLOADING
                // } );
                dispatch( agentImageUploadLoading() );
            }
        } ).catch( ( { response } ) => {
            // if ( response.status === status.severError ) {
            //     notify( 'error', `Please contact the support team!!!` );
            // } else {
            //     notify( 'error', `${response.data.errors.join( ', ' )}` );
            // }
            dispatch( agentImageUploadLoading() );
        } );
};


export const clearAllAgentState = () => async dispatch => {
    await dispatch( {
        type: CLEAR_AGENT_ALL_STATE
    } );
};