import { notify } from "@custom/notifications";
import { baseAxios } from '@services';
import { inventoryApi } from "@services/api-end-points/inventory";
import { status } from "../../../../../utility/enums";
import { bindSegmentDescriptionArray, getItemSegmentValueByItemGroupId, itemGroupDataOnSubmitProgress } from "../../../item-group/store/actions";
import { bindItemGroupSegmentWithValueInput } from "../../../segment/store/actions";
import { UPDATE_ITEM_SEGMENT_VALUE } from "../action-types";


export const segmentValueOnFocus = ( fieldId, itemGroupId, segmentId ) => ( dispatch, getState ) => {
    const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
    baseAxios.get( endPoint ).then( response => {
        const { itemSegmentsArray } = getState().itemGroups;
        const updatedData = itemSegmentsArray.map( i => {
            if ( fieldId === i.fieldId ) {
                i.segmentValues = response.data.map( i => ( {
                    label: i.value,
                    value: i.id
                } ) );
            }
            return i;
        } );
        dispatch( bindSegmentDescriptionArray( updatedData ) );
    } );
};
//Update Segment
export const updateItemSegmentValue = ( itemGroupId, segmentId, itemSegmentValues, fieldId, data ) => async ( dispatch, getState ) => {
    const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
    dispatch( itemGroupDataOnSubmitProgress( true ) );
    baseAxios.put( endPoint, itemSegmentValues ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: UPDATE_ITEM_SEGMENT_VALUE,
                itemSegmentValues
            } );
            // dispatch( ( handleOpenAssignItemSegmentValueModal( false ) ) );
            dispatch( getItemSegmentValueByItemGroupId( itemGroupId, segmentId ) );
            if ( fieldId ) {
                const { itemSegmentsArray } = getState().itemGroups;
                dispatch( segmentValueOnFocus( fieldId, itemGroupId, segmentId ) );

                const updatedData = itemSegmentsArray.map( i => {
                    if ( fieldId === i.fieldId ) {
                        i.value = { label: data, value: data };
                    }
                    return i;
                } );
                console.log( updatedData );
                dispatch( bindSegmentDescriptionArray( updatedData ) );

            }

            if ( !fieldId ) {
                notify( 'success', `The Segment's value has been updated Successfully!` );
            }
            dispatch( itemGroupDataOnSubmitProgress( false ) );

        }
    } ).catch( ( ( { response } ) => {
        dispatch( itemGroupDataOnSubmitProgress( false ) );

        if ( response.status === status.badRequest ) {
            notify( 'error', `${response.data.errors.join( ', ' )}` );
        }
        if ( response.status === status.notFound || response.status === status.severError ) {
            notify( 'error', 'Please contact with Software Developer!' );
        }
        if ( response.status === status.conflict ) {
            notify( 'warning', `${response.statusText}` );
        }
    } ) );
};

const segmentLoading = ( segmentId, loading ) => ( dispatch, getState ) => {
    const { itemGroupSegmentsWithValue } = getState().segments;

    const updatedData = itemGroupSegmentsWithValue.map( segment => {
        if ( segment.segmentId === segmentId ) {
            segment['isValueLoading'] = loading;
        }
        return segment;
    } );
    dispatch( bindItemGroupSegmentWithValueInput( updatedData ) );
};


export const handleSegmentValueOnFocus = ( itemGroupId, segmentId ) => ( dispatch, getState ) => {
    const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
    dispatch( segmentLoading( segmentId, true ) );
    baseAxios.get( endPoint )
        .then( response => {
            if ( response.status === status.success ) {
                const { itemGroupSegmentsWithValue } = getState().segments;

                const segmentValues = response.data?.map( res => ( {
                    ...res,
                    label: res.value,
                    value: res.id
                }
                ) );
                const updatedData = itemGroupSegmentsWithValue.map( segment => {
                    if ( segment.segmentId === segmentId ) {
                        segment['segmentValues'] = segmentValues;
                    }
                    return segment;
                } );
                dispatch( bindItemGroupSegmentWithValueInput( updatedData ) );
                dispatch( segmentLoading( segmentId, false ) );

            }
        } ).catch( ( { response } ) => {
            dispatch( segmentLoading( segmentId, false ) );
        } );


};

export const updateStyleItemSegmentValue = ( itemGroupId, segmentId, itemSegmentValues, data, type ) => async ( dispatch, getState ) => {
    const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
    dispatch( segmentLoading( segmentId, true ) );

    baseAxios.put( endPoint, itemSegmentValues ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: UPDATE_ITEM_SEGMENT_VALUE,
                itemSegmentValues
            } );
            // dispatch( ( handleOpenAssignItemSegmentValueModal( false ) ) );
            dispatch( getItemSegmentValueByItemGroupId( itemGroupId, segmentId ) );
            if ( segmentId ) {
                const { itemGroupSegmentsWithValue } = getState().segments;
                dispatch( handleSegmentValueOnFocus( itemGroupId, segmentId ) );

                const updatedData = itemGroupSegmentsWithValue.map( i => {
                    if ( segmentId === i.segmentId ) {
                        i.value = { label: data, value: data };
                    }
                    return i;
                } );
                console.log( data );
                dispatch( bindItemGroupSegmentWithValueInput( updatedData ) );

            }
        }

    } ).catch( ( { response } ) => {
        dispatch( segmentLoading( segmentId, false ) );
    } );

};


export const getItemSegmentValueDropdown = ( itemGroupId, segmentId ) => async dispatch => {
    const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
    await baseAxios.get( endPoint ).then( response => {
        console.log( response );
    } );
};
