import { baseAxios } from "@services";
import { inventoryApi } from '@services/api-end-points/inventory';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { Col, Row, Table } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { isPermit, selectThemeColors } from '../../../../utility/Utils';
import { bindSegmentDescriptionArray } from '../../../inventory/item-group/store/actions';
import { updateItemSegmentValue } from "../../../inventory/item-segment-value/store/actions";
import { bindPackagingAccessoriesDetails } from "../store/action";

const PackagingItemDescriptionGenerator = ( { descriptionModalObj, openModal, setOpenModal } ) => {
    const dispatch = useDispatch();
    const { itemSegmentsArray } = useSelector( ( { itemGroups } ) => itemGroups );
    const { singlePackagingAccessoriesDetails } = useSelector( ( { packaging } ) => packaging );

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

        const isValueArrayExiting = singlePackagingAccessoriesDetails.map( fd => fd.itemDescriptionArray.some( ida => ida.value === createDescriptionWithValue.trim() ) ).some( isTrue => isTrue === true );
        const isValueExiting = singlePackagingAccessoriesDetails.some( fd => fd.itemDescription === createDescriptionWithValue.trim() );
        const updatedData = singlePackagingAccessoriesDetails.map( i => {
            if ( descriptionModalObj.fieldId === i.fieldId ) {
                if ( !isValueArrayExiting && !isValueExiting ) {
                    i['itemDescriptionTemplate'] = JSON.stringify( descriptionTemplate );
                    i['itemDescription'] = createDescriptionWithValue.trim();
                    i['itemDescriptionArray'] = [...i.itemDescriptionArray, descriptionObj];
                    i['itemDescriptionValue'] = descriptionObj;
                    setOpenModal( !openModal );
                } else {
                    //  notify( 'error', 'The Description already exited!!' );
                    setOpenModal( !openModal );
                }
            }
            return i;
        } );
        dispatch( bindPackagingAccessoriesDetails( updatedData ) );
    };

    // useEffect( () => {
    //     dispatch( getItemSegmentArrayByItemGroupId( descriptionModalObj?.itemGroupId ) );
    // }, [dispatch, descriptionModalObj?.itemGroupId] );

    const handleSegmentValueOnFocus = ( fieldId, itemGroupId, segmentId ) => {
        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
        baseAxios.get( endPoint ).then( response => {
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
                <Row className=' mt-1'>
                    <Col className='item-segment-custom-table' xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Table size="sm" bordered className="text-center">
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
                                            <td>
                                                <CreatableSelect
                                                    id={`segmentValueId${i.fieldId}`}
                                                    name="segmentValue"
                                                    placeholder="Select Value"
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
                                                    className={classnames( 'erp-dropdown-select' )}
                                                    value={i.value}
                                                    onFocus={() => { handleSegmentValueOnFocus( i.fieldId, i.itemGroupId, i.segment.segmentId ); }}
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
            </CustomModal>
        </div>
    );
};

export default PackagingItemDescriptionGenerator;
