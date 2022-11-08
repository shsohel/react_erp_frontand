import { notify } from "@custom/notifications";
import { baseAxios } from '@services';
import { inventoryApi } from "@services/api-end-points/inventory";
import { status } from "../../../../../utility/enums";
// import { status } from "utility/enums";
import { handleOpenAssignItemSegmentModal, itemGroupDataOnSubmitProgress } from "../../../item-group/store/actions";
import { UPDATE_ITEM_SEGMENT } from "../action-types";


//Update Segment
export const updateItemSegment = ( itemGroupId, itemSegments ) => async dispatch => {
    const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segments`;
    dispatch( itemGroupDataOnSubmitProgress( true ) );
    baseAxios.put( endPoint, itemSegments ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: UPDATE_ITEM_SEGMENT,
                itemSegments
            } );
            notify( 'success', 'The Segment has been updated Successfully!' );
            dispatch( handleOpenAssignItemSegmentModal( false ) );
            dispatch( itemGroupDataOnSubmitProgress( false ) );

        }

    } ).catch( ( ( { response } ) => {
        dispatch( itemGroupDataOnSubmitProgress( false ) );

        if ( response.status === status.badRequest ) {
            notify( 'error', `${response.data.errors.join( ', ' )}` );
        }
        if ( response.status === status.notFound || response.status === status.severError ) {
            notify( 'error', 'Please contact the support team!' );
        }
        if ( response.status === status.conflict ) {
            notify( 'warning', `${response.statusText}` );
        }
    } ) );

};
