import { notify } from "@custom/notifications";
import { baseAxios } from '@services';
import { inventoryApi } from '../../../../../services/api-end-points/inventory';
import { confirmDialog } from "../../../../../utility/custom/ConfirmDialog";
import { status } from "../../../../../utility/enums";
import { convertQueryString } from "../../../../../utility/Utils";
import { ADD_SEGMENT, DELETE_SEGMENT, DELETE_SEGMENT_BY_RANGE, DROP_DOWN_SEGMENT, GET_ITEM_GROUP_SEGMENTS_WITH_VALUE, GET_SEGMENT, GET_SEGMENT_BY_ID, GET_SEGMENT_BY_QUERY, GET_SEGMENT_VALUE_BY_SEGMENT_ID, IS_SEGMENT_DATA_LOADED, IS_SEGMENT_DATA_ON_PROGRESS, IS_SEGMENT_DATA_SUBMIT_PROGRESS, OPEN_SEGMENT_SIDEBAR, OPEN_SEGMENT_SIDEBAR_FOR_EDIT, SELECTED_SEGMENT_NULL, UPDATE_SEGMENT } from "../action-types";

const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};

export const handleOpenSegmentEditSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_SEGMENT_SIDEBAR_FOR_EDIT,
            openSegmentEditSidebar: condition
        } );
    };
};
// Open Segment Sidebar
export const handleOpenSegmentSidebar = ( condition ) => {
    return async dispatch => {
        await dispatch( {
            type: OPEN_SEGMENT_SIDEBAR,
            openSegmentSidebar: condition
        } );
    };
};

export const segmentDataLoaded = ( condition ) => dispatch => {
    dispatch( {
        type: IS_SEGMENT_DATA_LOADED,
        isSegmentDataLoaded: condition
    } );
};
export const segmentDataOnProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_SEGMENT_DATA_ON_PROGRESS,
        isSegmentDataOnProgress: condition
    } );
};
export const segmentDataSubmitProgress = ( condition ) => dispatch => {
    dispatch( {
        type: IS_SEGMENT_DATA_SUBMIT_PROGRESS,
        isSegmentDataSubmitProgress: condition
    } );
};

// Get All Segment Without Query
export const getAllSegment = () => {
    return async dispatch => {
        await baseAxios.get( `${inventoryApi.segment.get_segment}` ).then( response => {
            dispatch( {
                type: GET_SEGMENT,
                segments: response.data
            } );
        } );
    };
};

// Get All Segment without Query
export const getDropDownSegments = () => {
    return async dispatch => {
        await baseAxios.get( `${inventoryApi.segment.root}` ).then( response => {
            console.log( response.data );
            dispatch( {
                type: DROP_DOWN_SEGMENT,
                dropDownSegments: response?.data?.data.map( item => ( {
                    value: item.id, label: item.name
                } ) )
            } );
        } );
    };
};

// Get Segment by Query
export const getSegmentByQuery = ( params, queryData ) => async dispatch => {
    dispatch( segmentDataLoaded( false ) );
    const apiEndPoint = `${inventoryApi.segment.root}/grid?${convertQueryString( params )}`;
    await baseAxios.post( apiEndPoint, queryData ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: GET_SEGMENT_BY_QUERY,
                segments: response.data.data,
                totalPages: response.data.totalRecords,
                params
            } );
            dispatch( segmentDataLoaded( true ) );

        }

    } ).catch( ( ( { response } ) => {
        dispatch( segmentDataLoaded( true ) );

        if ( response.status === status.badRequest || response.status === status.notFound || response.status === status.severError ) {
            notify( 'error', 'Please contact the support team!' );
        }
        if ( response.status === status.conflict ) {
            notify( 'warning', `${response.statusText}` );
        }
    } ) );
};

// Get Segment By Id
export const getSegmentById = id => async dispatch => {
    if ( id ) {
        dispatch( segmentDataOnProgress( true ) );
        await baseAxios.get( `${inventoryApi.segment.root}/${id}` ).then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: GET_SEGMENT_BY_ID,
                    selectedSegment: response.data ? response.data : null
                } );
                dispatch( handleOpenSegmentEditSidebar( true ) );
                dispatch( segmentDataOnProgress( false ) );
            }

        } ).catch( ( ( { response } ) => {
            dispatch( segmentDataOnProgress( false ) );
            if ( response.status === status.badRequest || response.status === status.notFound || response.status === status.severError ) {
                notify( 'error', 'Please contact the support team!' );
            }
            if ( response.status === status.conflict ) {
                notify( 'warning', `${response.statusText}` );
            }
        } ) );
    } else {
        dispatch( {
            type: GET_SEGMENT_BY_ID,
            selectedSegment: null
        } );
    }

};
// Get Segment By Id
export const getSegmentValuesBySegmentId = segmentId => async dispatch => {
    if ( segmentId ) {
        await baseAxios.get( `${inventoryApi.segment.root}/${segmentId}` ).then( response => {
            console.log( response.data );
            dispatch( {
                type: GET_SEGMENT_VALUE_BY_SEGMENT_ID,
                segmentValues: response.data ? response.data : []
            } );
        } ).catch( err => console.log( err ) );
    } else {
        dispatch( {
            type: GET_SEGMENT_VALUE_BY_SEGMENT_ID,
            segmentValues: []
        } );
    }


};

// Selected Segment Null after Edit
export const selectedSegmentNull = () => {
    return async dispatch => {
        await dispatch( {
            type: SELECTED_SEGMENT_NULL,
            selectedSegment: null
        } );
    };
};

// Add new Segment
export const addSegment = segments => async ( dispatch, getState ) => {
    dispatch( segmentDataSubmitProgress( true ) );

    await baseAxios.post( `${inventoryApi.segment.root}`, segments )
        .then( response => {
            if ( response.status === status.success ) {
                dispatch( {
                    type: ADD_SEGMENT,
                    segments
                } );
                notify( 'success', 'The Segment has been added Successfully!' );
                dispatch( getSegmentByQuery( getState().segments.params, [] ) );
                dispatch( segmentDataSubmitProgress( false ) );
                dispatch( handleOpenSegmentSidebar( false ) );


            }
        } ).catch( ( { response } ) => {
            dispatch( segmentDataSubmitProgress( false ) );
            if ( response.status === status.severError ) {
                notify( 'error', `Please contact the support team!!!` );
            } else {
                notify( 'warning', `${response.data.errors?.join( ', ' )}` );
            }
        } );
};
// dispatch( getSegmentById( null ) );

//Update Segment
export const updateSegment = segments => async ( dispatch, getState ) => {
    dispatch( segmentDataSubmitProgress( true ) );
    await baseAxios.put( `${inventoryApi.segment.root}/${segments.id}`, segments ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: UPDATE_SEGMENT,
                segments
            } );
            notify( 'success', 'The Segment has been updated Successfully!' );
            dispatch( getSegmentByQuery( getState().segments.params, [] ) );
            dispatch( getSegmentById( null ) );
            dispatch( segmentDataSubmitProgress( false ) );
            dispatch( handleOpenSegmentEditSidebar( false ) );


        } else {
            notify( 'success', 'The Segment has been updated failed!' );
        }

    } ).catch( ( { response } ) => {
        dispatch( segmentDataSubmitProgress( false ) );
        if ( response.status === status.severError ) {
            notify( 'error', `Please contact the support team!!!` );
        } else {
            notify( 'warning', `${response.data.errors?.join( ', ' )}` );
        }
    } );
};

// Delete Segment
export const deleteSegment = id => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( async e => {
            if ( e.isConfirmed ) {
                await baseAxios.delete( `${inventoryApi.segment.delete_segment}`, { id } ).then( response => {
                    dispatch( {
                        type: DELETE_SEGMENT
                    } );
                } ).then( () => {
                    notify( 'success', 'The Segment has been deleted Successfully!' );
                    dispatch( getSegmentByQuery( getState().segments.params ) );
                    dispatch( getAllSegment() );
                } );
            }
        } );
    };
};

// Delete Segment Range
export const deleteRangeSegment = ids => {
    return ( dispatch, getState ) => {
        confirmDialog( confirmObj ).then( e => {
            if ( e.isConfirmed ) {
                baseAxios.delete( `${inventoryApi.segment.delete_segment_by_range}`, { ids } ).then( response => {
                    dispatch( {
                        type: DELETE_SEGMENT_BY_RANGE
                    } );
                } ).then( () => {
                    notify( 'success', 'The Segment has been deleted Successfully!' );
                    dispatch( getSegmentByQuery( getState().segments.params ) );
                    dispatch( getAllSegment() );
                } );
            }
        } );
    };
};


export const getItemGroupSegmentWithValueInput = ( itemGroupId, itemDescriptionTemplate ) => dispatch => {
    const apiEndPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segments`;
    const itemDecExit = itemDescriptionTemplate ? JSON.parse( itemDescriptionTemplate ) : [];

    const getExitingSegmentValue = ( segmentId ) => {
        const value = { label: itemDecExit.find( i => i.id === segmentId )?.value, value: itemDecExit.find( i => i.id === segmentId )?.value };
        return value;
    };
    if ( itemGroupId ) {
        dispatch( {
            type: GET_ITEM_GROUP_SEGMENTS_WITH_VALUE,
            itemGroupSegmentsWithValue: [],
            isItemGroupSegmentsWithValueLoaded: false
        } );
        baseAxios.get( apiEndPoint )
            .then( response => {
                if ( response.status === status.success ) {
                    const itemGroupSegmentsWithValue = response.data?.map( segment => (
                        {
                            ...segment,
                            itemGroupId: segment.categoryId,
                            segmentId: segment.segmentId,
                            segmentName: segment.segmentName,
                            value: getExitingSegmentValue( segment.segmentId )?.label?.length ? getExitingSegmentValue( segment.segmentId ) : null,
                            segmentValues: [],
                            isValueLoading: false
                        }
                    ) );

                    dispatch( {
                        type: GET_ITEM_GROUP_SEGMENTS_WITH_VALUE,
                        itemGroupSegmentsWithValue,
                        isItemGroupSegmentsWithValueLoaded: true
                    } );
                }
            } ).catch( ( { response } ) => {
                dispatch( {
                    type: GET_ITEM_GROUP_SEGMENTS_WITH_VALUE,
                    itemGroupSegmentsWithValue: [],
                    isItemGroupSegmentsWithValueLoaded: true
                } );
                if ( response === undefined || response.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'warning', `${response?.data?.errors?.join( ', ' )}` );
                }
            } );
    } else {
        dispatch( {
            type: GET_ITEM_GROUP_SEGMENTS_WITH_VALUE,
            itemGroupSegmentsWithValue: [],
            isItemGroupSegmentsWithValueLoaded: true
        } );
    }

};

export const bindItemGroupSegmentWithValueInput = ( itemGroupSegmentsWithValue ) => dispatch => {
    console.log( 'bind' );
    dispatch( {
        type: GET_ITEM_GROUP_SEGMENTS_WITH_VALUE,
        itemGroupSegmentsWithValue,
        isItemGroupSegmentsWithValueLoaded: true
    } );
};
