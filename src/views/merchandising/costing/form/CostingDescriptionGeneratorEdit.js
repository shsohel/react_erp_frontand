import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { baseAxios } from "@services";
import { inventoryApi } from '@services/api-end-points/inventory';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { Col, Row, Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { status } from '../../../../utility/enums';
import { isPermit, selectThemeColors } from '../../../../utility/Utils';
import { bindSegmentDescriptionArray } from '../../../inventory/item-group/store/actions';
import { updateItemSegmentValue } from "../../../inventory/item-segment-value/store/actions";
import { bindCostingFabricDetails } from "../store/action";
const CostingDescriptionGeneratorEdit = ( { descriptionModalObj, openModal, setOpenModal } ) => {
    const dispatch = useDispatch();
    const { itemSegmentsArray, isItemSegmentsArrayLoaded, isItemGroupDataSubmitProgress } = useSelector( ( { itemGroups } ) => itemGroups );
    const { costingFabricDetails } = useSelector( ( { costings } ) => costings );
    const { userPermission } = useSelector( ( { auth } ) => auth );
    const { authPermissions } = useSelector( ( { permissions } ) => permissions );
    const handleMainModalToggleClose = ( params ) => {
        setOpenModal( !openModal );
        dispatch( bindSegmentDescriptionArray( null ) );

    };


    const handleModalSubmit = () => {
        const createDescriptionWithValue = itemSegmentsArray?.filter( i => !!i.value ).map( i => ` ${i.value?.label ? i.value?.label : ''}` ).join( '' );
        const descriptionTemplate = itemSegmentsArray.map( isa => ( {
            id: isa.segment.segmentId,
            name: isa.segment.segmentName,
            value: isa?.value?.label ?? ''
        } ) );
        const descriptionObj = { value: createDescriptionWithValue, label: createDescriptionWithValue };

        const isValueArrayExiting = costingFabricDetails.map( fd => fd.itemDescriptionArray.some( ida => ida.value === createDescriptionWithValue.trim() ) ).some( isTrue => isTrue === true );
        const isValueExiting = costingFabricDetails.some( fd => fd.itemDescription === createDescriptionWithValue.trim() );
        const updatedData = costingFabricDetails.map( i => {
            if ( descriptionModalObj.costingFieldId === i.fieldId ) {
                if ( !isValueArrayExiting && !isValueExiting ) {
                    i['itemDescriptionTemplate'] = JSON.stringify( descriptionTemplate );
                    i['itemDescription'] = createDescriptionWithValue.trim();
                    i['itemDescriptionArray'] = [...i.itemDescriptionArray, descriptionObj];
                    i['itemDescriptionValue'] = descriptionObj;
                    setOpenModal( !openModal );
                } else {
                    // notify( 'error', 'The Description already exited!!' );
                    setOpenModal( !openModal );
                }
            }
            return i;
        } );
        dispatch( bindCostingFabricDetails( updatedData ) );
    };


    const handleSegmentValueOnFocus = ( fieldId, itemGroupId, segmentId, values ) => {
        if ( !values.length ) {
            const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
            const updatedData = itemSegmentsArray.map( i => {
                if ( fieldId === i.fieldId ) {
                    i.segmentValues = [];
                    i.isSegmentValuesLoaded = false;
                }
                return i;
            } );
            dispatch( bindSegmentDescriptionArray( updatedData ) );
            baseAxios.get( endPoint ).then( response => {
                if ( response.status === status.success ) {
                    const updatedData = itemSegmentsArray.map( i => {
                        if ( fieldId === i.fieldId ) {
                            i.segmentValues = response.data.map( i => ( {
                                label: i.value,
                                value: i.id
                            } ) );
                            i.isSegmentValuesLoaded = true;
                        }
                        return i;
                    } );
                    dispatch( bindSegmentDescriptionArray( updatedData ) );
                }

            } );
        }

    };

    const handleSegmentValueChange = ( fieldId, data ) => {
        const updatedData = itemSegmentsArray.map( i => {
            if ( fieldId === i.fieldId ) {
                i.value = data;
            }
            return i;
        } );
        dispatch( bindSegmentDescriptionArray( updatedData ) );
    };

    const handleInstantCreateSegmentValue = ( data, itemGroupId, segmentId, fieldId ) => {
        const obj = [
            {
                value: data,
                isDeleted: false
            }
        ];
        dispatch( updateItemSegmentValue( itemGroupId, segmentId, obj, fieldId, data ) );
    };

    console.log( isItemSegmentsArrayLoaded );


    return (
        <div>
            <CustomModal
                modalTypeClass='vertically-centered-modal'
                className='modal-dialog-centered modal-md'
                openModal={openModal}
                setOpenModal={setOpenModal}
                handleMainModalToggleClose={handleMainModalToggleClose}
                handleMainModelSubmit={handleModalSubmit}
                title="Item Description"
            >
                <UILoader blocking={!isItemSegmentsArrayLoaded} loader={<ComponentSpinner />} >
                    <div style={{ minHeight: '200px' }}>
                        <Row className=''>
                            <Col className='item-segment-custom-table' xs={12} sm={12} md={12} lg={12} xl={12}>
                                <div className="font-weight-bold d-flex justify-content-start ">
                                    <div className="pr-2"> Group : <label className="font-weight-bolder pl-1 " >{descriptionModalObj?.itemGroup}</label>  </div>
                                    <div> Sub Group :<label className="font-weight-bolder pl-1">{descriptionModalObj?.itemSubGroup}</label>   </div>
                                </div>
                                <Table className="text-center mt-1">
                                    <thead>
                                        <tr>
                                            <th>Segment</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemSegmentsArray?.filter( itemSegment => itemSegment.isColorSensitive === false &&
                                            itemSegment.isSizeSensitive === false ).map( i => (
                                                <tr key={i.fieldId}>
                                                    <td>
                                                        {i.segment?.segmentName}
                                                    </td>
                                                    <td className="text-left">
                                                        <CreatableSelect
                                                            id={`segmentValueId${i.fieldId}`}
                                                            name="segmentValue"
                                                            placeholder="Select Value"
                                                            isLoading={!i.isSegmentValuesLoaded || isItemGroupDataSubmitProgress}
                                                            isSearchable
                                                            isClearable
                                                            isValidNewOption={( inputValue ) => {
                                                                const isPermitted = isPermit( userPermission?.ItemGroupCreateSegmentValue, authPermissions ) && inputValue.trim().length;
                                                                return isPermitted;
                                                            }}
                                                            menuPosition="fixed"
                                                            theme={selectThemeColors}
                                                            options={i.segmentValues}
                                                            classNamePrefix='dropdown'
                                                            className="erp-dropdown-select"
                                                            value={i.value}
                                                            onFocus={() => { handleSegmentValueOnFocus( i.fieldId, i.itemGroupId, i.segment.segmentId, i.segmentValues ); }}
                                                            onChange={data => {
                                                                handleSegmentValueChange( i.fieldId, data );
                                                            }}
                                                            onCreateOption={( data ) => {
                                                                handleInstantCreateSegmentValue( data, i.itemGroupId, i.segment.segmentId, i.fieldId );
                                                            }}
                                                        />
                                                    </td>

                                                </tr>
                                            ) )}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </div>

                </UILoader>
            </CustomModal>
        </div>
    );
};

export default CostingDescriptionGeneratorEdit;
