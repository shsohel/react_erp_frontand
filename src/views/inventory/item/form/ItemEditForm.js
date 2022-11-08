import Sidebar from '@components/sidebar';
import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import '@custom-styles/merchandising/others/custom-table.scss';
import { notify } from "@custom/notifications";
import { yupResolver } from '@hookform/resolvers/yup';
import { baseAxios } from '@services';
import { inventoryApi } from '@services/api-end-points/inventory';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import { Plus } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Button, Col, Form, FormFeedback, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label, Row, Table } from 'reactstrap';
import * as yup from 'yup';
import CustomModal from '../../../../utility/custom/CustomModal';
import { selectUnit } from '../../../../utility/enums';
import { isObjEmpty, randomIdGenerator, selectThemeColors } from '../../../../utility/Utils';
import { getDropDownItemGroups, getItemSegmentDropDownByItemGroupId, getSubGroupDropdownByItemId } from '../../item-group/store/actions';
import { itemBasicInfoModel } from '../model';
import { bindItemBasicInfo, updateItem } from '../store/actions';

const ItemEditForm = ( { open, toggleSidebar } ) => {
    const dispatch = useDispatch();
    const {
        dropDownItemGroups,
        dropDownItemSubGroups,
        itemSegmentsDropdown,
        isDropDownItemGroupsDataLoaded,
        isDropDownItemSubGroupsDataLoaded

    } = useSelector( ( { itemGroups } ) => itemGroups );
    const {
        itemBasicInfo,
        isItemDataSubmitProgress
    } = useSelector( ( { items } ) => items );

    // const [segmentValueDescription, setSegmentValueDescription] = useState( [] );
    const [openModal, setOpenModal] = useState( false );


    // const [itemBasicInfo, setItemBasicInfo] = useState( data );

    const validationSchema = yup.object().shape( {
        name: yup.string().required( 'Item Description is required!' ),
        sku: yup.string().required( 'SKU is required!' ),
        itemGroup: itemBasicInfo.itemGroup ? yup.string() : yup.string().required( 'Item Group is required!' ),
        itemSubGroup: itemBasicInfo.itemSubGroup ? yup.string() : yup.string().required( 'Item Sub Group  is required!' ),
        uom: itemBasicInfo.uom ? yup.string() : yup.string().required( 'UOM is required!' )
    } );

    const { register, errors, handleSubmit } = useForm( { mode: 'onChange', resolver: yupResolver( validationSchema ) } );


    useEffect( () => {
        dispatch( getDropDownItemGroups() );
    }, [] );


    const handleModalOpen = () => {
        if ( itemBasicInfo.itemGroup && itemBasicInfo.itemSubGroup ) {
            setOpenModal( !openModal );

            const itemSegments = itemSegmentsDropdown.map( i => ( {
                fieldId: randomIdGenerator(),
                itemId: itemBasicInfo.itemGroupId,
                segment: i,
                segmentValues: [],
                value: null
            } ) );
            const updatedObj = {
                ...itemBasicInfo,
                itemSegments
            };

            dispatch( bindItemBasicInfo( updatedObj ) );
        } else {
            notify( 'warning', 'Please select Item Group and Item SubGroup at First!' );
        }
    };
    const handleMainModalToggleClose = () => {
        setOpenModal( !openModal );
    };
    const handleModalSubmit = () => {
        setOpenModal( !openModal );
    };

    const handleItemGroupOnChange = ( data ) => {
        const updatedObj = {
            ...itemBasicInfo,
            itemGroup: data,
            itemGroupId: data?.value ?? 0,
            itemSubGroup: null,
            itemSubGroupId: 0
        };
        dispatch( getItemSegmentDropDownByItemGroupId( data?.value ) );


        dispatch( bindItemBasicInfo( updatedObj ) );
    };
    const handleItemSubGroupOnFocus = ( itemGroupId ) => {
        dispatch( getSubGroupDropdownByItemId( itemGroupId ) );

    };
    const handleItemSubGroupChange = ( data ) => {
        if ( data ) {
            const itemSegments = itemSegmentsDropdown.map( i => ( {
                fieldId: randomIdGenerator(),
                itemId: itemBasicInfo.itemGroupId,
                segment: i,
                segmentValues: [],
                value: null
            } ) );
            const updatedObj = {
                ...itemBasicInfo,
                itemSubGroup: data,
                itemSubGroupId: data?.value ?? 0,
                itemSegments
            };

            dispatch( bindItemBasicInfo( updatedObj ) );
        } else {
            const updatedObj = {
                ...itemBasicInfo,
                itemSubGroup: data,
                itemSubGroupId: data?.value ?? 0,
                itemSegments: []
            };
            dispatch( bindItemBasicInfo( updatedObj ) );
        }
    };

    const handleUOMChange = ( data ) => {
        const updatedObj = {
            ...itemBasicInfo,
            uom: data
        };
        dispatch( bindItemBasicInfo( updatedObj ) );
    };
    const handleInputChange = ( e ) => {
        const { value, name } = e.target;
        const updatedObj = {
            ...itemBasicInfo,
            [name]: value
        };
        dispatch( bindItemBasicInfo( updatedObj ) );
    };


    const handleSegmentValueOnFocus = ( fieldId, itemGroupId, segmentId ) => {
        const endPoint = `${inventoryApi.itemGroup.root}/${itemGroupId}/segment/${segmentId}/Values`;
        baseAxios.get( endPoint ).then( response => {
            const updatedData = itemBasicInfo?.itemSegments.map( i => {
                if ( fieldId === i.fieldId ) {
                    i.segmentValues = response.data.map( i => ( {
                        label: i.value,
                        value: i.id
                    } ) );
                }
                return i;
            } );
            const updatedObj = {
                ...itemBasicInfo,
                itemSegments: updatedData
            };
            dispatch( bindItemBasicInfo( updatedObj ) );
        } );
    };

    const handleSegmentValueChange = ( fieldId, data ) => {
        const updatedData = itemBasicInfo?.itemSegments.map( i => {
            if ( fieldId === i.fieldId ) {
                i.value = data;
            }
            return i;
        } );

        const createDescriptionWithValue = updatedData?.filter( i => !!i.value ).map( i => ` ${i.value?.label ? i.value?.label : ''}` ).join( '' );
        const updatedObj = {
            ...itemBasicInfo,
            name: createDescriptionWithValue,
            itemSegments: updatedData,
            template: ''
        };

        dispatch( bindItemBasicInfo( updatedObj ) );

    };


    const onSubmit = () => {
        if ( isObjEmpty( errors ) ) {
            const submitObj = {
                categoryId: itemBasicInfo.itemGroupId,
                subCategoryId: itemBasicInfo?.itemSubGroupId,
                name: itemBasicInfo?.name.trim(),
                sku: itemBasicInfo?.sku,
                uom: itemBasicInfo.uom.label
            };
            dispatch( updateItem( submitObj, itemBasicInfo?.id ) );
            //   console.log( JSON.stringify( submitObj, null, 2 ) );
        }
    };

    const handleCancel = () => {
        dispatch( bindItemBasicInfo( itemBasicInfoModel ) );
        toggleSidebar();
        // setItemBasicInfo( itemBasicInfoDefaultValue );
    };
    return (
        <Sidebar
            size='lg'
            open={open}
            title='Edit Item'
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
        >
            <UILoader blocking={isItemDataSubmitProgress} loader={<ComponentSpinner />} >

                <Form>
                    <FormGroup>
                        <Label className="font-weight-bolder">Item Group </Label>
                        <Select
                            id='itemGroupId'
                            name="itemGroup"
                            placeholder="Select Item Group"
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={dropDownItemGroups}
                            innerRef={register( { required: true } )}
                            classNamePrefix='dropdown'
                            className={classnames( `erp-dropdown-select ${( errors && errors.itemGroup && !itemBasicInfo.itemGroup ) && 'is-invalid'}` )}
                            value={itemBasicInfo.itemGroup}
                            onChange={data => {
                                handleItemGroupOnChange( data );
                            }}
                        />
                        {( errors && errors.itemGroup && !itemBasicInfo.itemGroup ) && <FormFeedback>{errors.itemGroup.message}</FormFeedback>}

                    </FormGroup>
                    <FormGroup>
                        <Label for="itemSubGroupId" className="font-weight-bolder">Item Sub Group </Label>
                        <Select
                            id='itemSubGroupId'
                            name="itemSubGroup"
                            placeholder="Select Item Sub Group"
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={dropDownItemSubGroups}
                            classNamePrefix='dropdown'
                            innerRef={register( { required: true } )}
                            className={classnames( `erp-dropdown-select ${( errors && errors.itemSubGroup && !itemBasicInfo.itemSubGroup ) && 'is-invalid'}` )}
                            onFocus={() => { handleItemSubGroupOnFocus( itemBasicInfo.itemGroupId ); }}
                            value={itemBasicInfo.itemSubGroup}
                            onChange={data => {
                                handleItemSubGroupChange( data );
                            }}
                        />
                        {( errors && errors.itemSubGroup && !itemBasicInfo.itemSubGroup ) && <FormFeedback>{errors.itemSubGroup.message}</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="skuId" className="font-weight-bolder">SKU</Label>
                        <Input
                            id="skuId"
                            name="sku"
                            bsSize="sm"
                            innerRef={register( { required: true } )}
                            invalid={errors.sku && true}
                            value={itemBasicInfo.sku}
                            className={classnames( { 'is-invalid': errors['sku'] } )}
                            type="text"
                            onChange={( e ) => { handleInputChange( e ); }}
                        />
                        {errors && errors.sku && <FormFeedback>{errors.sku.message}</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="uomId" className="font-weight-bolder">UOM</Label>
                        <Select
                            id='uomId'
                            name="uom"
                            placeholder="Select UOM"
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={selectUnit}
                            classNamePrefix='dropdown'
                            value={itemBasicInfo.uom}
                            className={classnames( `erp-dropdown-select ${( errors && errors.uom && !itemBasicInfo.uom ) && 'is-invalid'}` )}
                            onChange={data => {
                                handleUOMChange( data );
                            }}
                        />
                        {errors && errors.uom && !itemBasicInfo.uom && <FormFeedback>{errors.uom.message}</FormFeedback>}
                    </FormGroup>
                    <FormGroup>
                        <Label for="nameId" className="font-weight-bolder">Description </Label>
                        <InputGroup>
                            <Input
                                id="nameId"
                                name="name"
                                type="text"
                                bsSize="sm"
                                value={itemBasicInfo.name}
                                innerRef={register( { required: true } )}
                                invalid={errors.name && true}
                                onChange={( e ) => { e.preventDefault(); }}
                            />
                            <InputGroupAddon style={{ zIndex: 0 }} addonType='append'>
                                <Button.Ripple tag={InputGroupText} onClick={() => { handleModalOpen(); }} className='btn-icon pt-0 pb-0' color='primary'>
                                    <Plus size={16} />
                                </Button.Ripple>
                            </InputGroupAddon>
                        </InputGroup>
                    </FormGroup>

                    <Button.Ripple
                        onClick={handleSubmit( onSubmit )}
                        size="sm"
                        className='mr-1'
                        color='primary'
                    >
                        Save
                    </Button.Ripple>
                    <Button size="sm" className='mr-1' color='danger' outline onClick={() => { handleCancel(); }}>
                        Cancel
                    </Button>
                </Form>
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
                            <Table responsive className="text-center" size="sm" bordered >
                                <thead>
                                    <tr>
                                        <th>Segment</th>
                                        <th>Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemBasicInfo.itemSegments?.map( i => (
                                        <tr key={i.fieldId}>
                                            <td>
                                                {i.segment.label}

                                            </td>
                                            <td>
                                                <CreatableSelect
                                                    id={`segmentValueId${i.fieldId}`}
                                                    name="segmentValue"
                                                    placeholder="Select Value"
                                                    isSearchable
                                                    menuPosition="fixed"
                                                    menuPlacement="auto"
                                                    isClearable
                                                    theme={selectThemeColors}
                                                    options={i.segmentValues}
                                                    classNamePrefix='dropdown'
                                                    className={classnames( 'erp-dropdown-select' )}
                                                    value={i.value}
                                                    onFocus={() => { handleSegmentValueOnFocus( i.fieldId, i.itemId, i.segment.value ); }}
                                                    onChange={data => {
                                                        handleSegmentValueChange( i.fieldId, data );
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
            </UILoader>
        </Sidebar>
    );
};

export default ItemEditForm;
