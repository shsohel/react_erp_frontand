import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import { notify } from '@custom/notifications';
import { baseAxios } from '@services';
import _ from 'lodash';

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { Button, Col, Label, Row } from 'reactstrap';
import { merchandisingApi } from '../../../../../services/api-end-points/merchandising';
import CustomModal from '../../../../../utility/custom/CustomModal';
import { status } from '../../../../../utility/enums';
import { selectThemeColors } from '../../../../../utility/Utils';
import { bindBuyerColorsOnChange, getBuyerColorsByBuyerById, updateBuyerColor } from '../../../buyer/store/actions';
import { getDropDownColors } from '../../../color/store/actions';
function AssignBuyerColorModal( { openModal, setOpenModal, buyerId } ) {
    const dispatch = useDispatch();
    const { buyerColors, isBuyerDataSubmitProgress } = useSelector( ( { buyers } ) => buyers );
    const [colorSidebarOpen, setColorSidebarOpen] = useState( false );
    const [iseColorCreating, setIsColorCreating] = useState( false );


    const { dropDownColors, isDropDownColorsLoaded } = useSelector( ( { colors } ) => colors );
    const nonExitingColors = dropDownColors?.filter( f => !buyerColors?.some( i => i.colorId === f.value && i.isDeleted === false ) );

    const toggleSidebar = () => setColorSidebarOpen( !colorSidebarOpen );


    const handleColorOnFocus = () => {
        if ( !dropDownColors.length ) {
            dispatch( getDropDownColors() );
        }

    };
    useEffect( () => {
        dispatch( getBuyerColorsByBuyerById( buyerId ) );
    }, [dispatch, buyerId] );

    const handleDropdown = ( data ) => {
        const updatedBuyerColor = [
            ...buyerColors, ...data.map( i => ( {
                colorId: i.value,
                colorName: i.label,
                description: i.description,
                isNew: true,
                isDeleted: false
            } ) )
        ];
        dispatch( bindBuyerColorsOnChange( updatedBuyerColor ) );
    };

    const handleColorCreation = ( newValue ) => {
        const colorObj = {
            name: newValue,
            hexCode: '#FFFFF'
        };
        setIsColorCreating( true );

        baseAxios.post( `${merchandisingApi.color.root}`, colorObj )
            .then( response => {
                if ( response.status === status.success ) {
                    const obj = {
                        id: response.data,
                        colorName: colorObj.name,
                        isNew: true,
                        isDeleted: false
                    };

                    const updatedColor = [...buyerColors, obj];

                    dispatch( bindBuyerColorsOnChange( updatedColor ) );
                    dispatch( getDropDownColors() );

                    notify( 'success', 'The Color  has been created successfully' );
                    setIsColorCreating( false );
                }
            } ).catch( ( { response } ) => {
                setIsColorCreating( false );
                if ( response === undefined || response?.status === status.severError ) {
                    notify( 'error', `Please contact the support team!!!` );
                } else {
                    notify( 'warning', `${response?.data?.errors?.join( ', ' )}` );
                }
            } );
    };


    const handleRemoveBuyerColorFromTable = ( id ) => {
        const updatedBuyerColors = buyerColors.map( color => {
            if ( id === color.colorId ) {
                color['isDeleted'] = true;
            }
            return color;
        } );
        dispatch( bindBuyerColorsOnChange( updatedBuyerColors ) );
    };

    const handleModelSubmit = () => {
        //For Colors
        const deletedColors = buyerColors.filter( dd => dd.isDeleted ).map( d => ( { colorId: d.colorId, isDeleted: d.isDeleted } ) );
        const addedColors = buyerColors.filter( dd => dd.isNew ).map( d => ( { colorId: d.colorId, isDeleted: d.isDeleted } ) );
        const updatedColors = [...addedColors, ...deletedColors];
        const submittedColor = _.uniqBy( updatedColors, 'colorId' );
        console.log( 'updatedColors', JSON.stringify( submittedColor, null, 2 ) );
        dispatch( updateBuyerColor( submittedColor, buyerId ) );
    };
    const handleModalToggleClose = () => {
        setOpenModal( !openModal );
    };

    return (
        <CustomModal
            modalTypeClass='vertically-centered-modal'
            className='modal-dialog modal-md'
            openModal={openModal}
            setOpenModal={setOpenModal}
            handleMainModelSubmit={handleModelSubmit}
            handleMainModalToggleClose={handleModalToggleClose}
            title="Assign Buyer Color"
        >
            <div>
                <UILoader blocking={iseColorCreating || isBuyerDataSubmitProgress} loader={<ComponentSpinner />} >

                    <Row>
                        <Col >
                            <Row>
                                <Col lg={12}>
                                    <Label for='department'>
                                        Colors
                                    </Label>
                                    <CreatableSelect
                                        id='buyerAgentId'
                                        isMulti
                                        isLoading={!isDropDownColorsLoaded}
                                        name="buyerColors"
                                        isSearchable
                                        isClearable
                                        theme={selectThemeColors}
                                        // options={dropDownBuyerAgents}
                                        options={nonExitingColors}
                                        classNamePrefix='dropdown'
                                        className="erp-dropdown-select"
                                        // innerRef={register( { required: true } )}
                                        value={null}
                                        onFocus={() => { handleColorOnFocus(); }}
                                        onChange={( data ) => {
                                            handleDropdown( data );
                                        }}

                                        onCreateOption={data => { handleColorCreation( data ); }}

                                    />
                                </Col>

                                <Col lg={12} className="mt-1">
                                    <DataTable
                                        noHeader
                                        dense={true}
                                        pagination
                                        paginationTotalRows={buyerColors.filter( c => c.isDeleted === false ).length}
                                        className='react-custom-dataTable'
                                        columns={[
                                            {
                                                id: 'sl',
                                                name: '#',
                                                width: '40px',
                                                selector: '#',
                                                sortable: true,
                                                center: true,
                                                cell: ( row, index ) => index + 1
                                            },
                                            {
                                                id: 'colorName',
                                                name: 'Name',
                                                minWidth: '200px',
                                                selector: 'colorName',
                                                sortable: true,
                                                cell: row => row.colorName
                                            },
                                            {
                                                id: 'actions',
                                                name: 'Actions',
                                                center: true,
                                                width: '100px',
                                                cell: row => (
                                                    <>
                                                        <Button.Ripple
                                                            className='btn-icon p-0'
                                                            color='flat-danger' tag={Label}
                                                            for="buyerProductDeveloperByBuyerId" onClick={() => { handleRemoveBuyerColorFromTable( row.colorId ); }} >
                                                            <Trash2 id="buyerProductDeveloperByBuyerId" color="red" size={16} />
                                                        </Button.Ripple>
                                                    </>
                                                )

                                            }
                                        ]}
                                        sortIcon={<ChevronDown size={10} />}

                                        //     data={buyerColors}
                                        data={buyerColors.filter( c => c.isDeleted === false )}
                                    />
                                </Col>

                            </Row>
                        </Col>

                    </Row>
                    {/* <ColorInstantCreateForm
                open={colorSidebarOpen}
                handleCreateColorSubmit={handleCreateColorSubmit}
                toggleSidebar={toggleSidebar}
            /> */}
                </UILoader>
            </div>
        </CustomModal>
    );
}

export default AssignBuyerColorModal;