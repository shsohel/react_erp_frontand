import ComponentSpinner from '@core/components/spinner/Loading-spinner';
import UILoader from '@core/components/ui-loader';
import React from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Col, Label, Row } from 'reactstrap';
import CustomModal from '../../../../utility/custom/CustomModal';
import { selectThemeColors } from '../../../../utility/Utils';
import { getDropDownBuyers } from '../../buyer/store/actions';
import { bindMerchandiserBuyer, handleOpenAssignBuyerModal, updateMerchandiser } from '../store/actions';
const AssignBuyer = ( { openModal } ) => {
    const dispatch = useDispatch();
    const { merchandiserBuyers, merchandiserBasicInfo } = useSelector( ( { merchandisers } ) => merchandisers );
    const { dropDownBuyers, isBuyerDropdownLoaded } = useSelector( ( { buyers } ) => buyers );

    const nonExitingBuyers = dropDownBuyers?.filter( f => !merchandiserBuyers?.some( i => i.buyerId === f.value ) );

    const handleBuyerOnFocus = () => {
        if ( !dropDownBuyers.length ) {
            dispatch( getDropDownBuyers() );
        }
    };

    const handleDropdown = ( data ) => {
        const updatedBuyers = [
            ...merchandiserBuyers, ...data.map( d => ( {
                buyer: d.label,
                buyerId: d.value
            } ) )
        ];
        dispatch( bindMerchandiserBuyer( updatedBuyers ) );
    };

    const handleRemoveBuyerFromTable = ( buyerId ) => {
        const updatedBuyers = merchandiserBuyers.filter( b => b.buyerId !== buyerId );
        dispatch( bindMerchandiserBuyer( updatedBuyers ) );

    };

    const handleMainModelSubmit = () => {
        const submitObj = {
            buyers: merchandiserBuyers?.map( buyer => buyer.buyerId )
        };

        dispatch( updateMerchandiser( submitObj, merchandiserBasicInfo.id ) );
    };

    const handleMainModalToggleClose = () => {
        dispatch( handleOpenAssignBuyerModal( false ) );

    };
    console.log( merchandiserBuyers );

    return (
        <CustomModal
            modalTypeClass='vertically-centered-modal'
            className='modal-dialog modal-md'
            openModal={openModal}
            handleMainModelSubmit={handleMainModelSubmit}
            handleMainModalToggleClose={handleMainModalToggleClose}
            title={` Assign Buyer ( ${merchandiserBasicInfo?.name}) `}
        >
            <div>
                <UILoader blocking={false} loader={<ComponentSpinner />} >

                    <Row>
                        <Col >
                            <Row>
                                <Col lg={12}>
                                    <Label for='buyerId'>
                                        Buyers
                                    </Label>
                                    <Select
                                        id='buyerId'
                                        isMulti
                                        name="buyers"
                                        isLoading={!isBuyerDropdownLoaded}
                                        isSearchable
                                        isClearable
                                        theme={selectThemeColors}
                                        // options={dropDownBuyerAgents}
                                        options={nonExitingBuyers}
                                        classNamePrefix='dropdown'
                                        className="erp-dropdown-select"
                                        // innerRef={register( { required: true } )}
                                        value={null}
                                        onFocus={() => { handleBuyerOnFocus(); }}
                                        onChange={( data ) => {
                                            handleDropdown( data );
                                        }}
                                    />
                                </Col>

                                <Col lg={12} className="mt-1">
                                    <DataTable
                                        noHeader
                                        dense={true}
                                        pagination
                                        persistTableHead
                                        paginationTotalRows={merchandiserBuyers.length}
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
                                                id: 'buyer',
                                                name: 'Name',
                                                minWidth: '200px',
                                                selector: 'buyer',
                                                sortable: true,
                                                cell: row => row.buyer
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
                                                            for="buyerProductDeveloperByBuyerId" onClick={() => { handleRemoveBuyerFromTable( row.buyerId ); }} >
                                                            <Trash2 id="buyerProductDeveloperByBuyerId" color="red" size={16} />
                                                        </Button.Ripple>
                                                    </>
                                                )

                                            }
                                        ]}
                                        sortIcon={<ChevronDown size={10} />}

                                        //     data={buyerColors}
                                        data={merchandiserBuyers}
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
};

export default AssignBuyer;