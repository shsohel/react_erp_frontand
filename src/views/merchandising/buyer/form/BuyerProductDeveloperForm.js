import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { Button, Col, FormGroup, Label, Row } from 'reactstrap';
import { baseAxios } from '../../../../services';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import { notify } from '../../../../utility/custom/notifications';
import { status } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
import BuyerProductDeveloperInstantCreateForm from '../../buyer-product-developer/form/BuyerProductDeveloperInstantCreateForm';
import { bindProductDeveloperBasicInfo, getDropDownBuyerProductDevelopers } from '../../buyer-product-developer/store/actions';
import { bindBuyerBasicInfo } from '../store/actions';

const BuyerProductDeveloperForm = ( { handleRemoveBuyerProductDeveloperFromTable, handleDropdown, buyerProductDeveloper } ) => {
    const dispatch = useDispatch();
    const { buyerBasicInfo } = useSelector( ( { buyers } ) => buyers );

    const [openBuyerProductDeveloper, setOpenBuyerProductDeveloper] = useState( false );
    const { dropDownProductDevelopers, productDeveloperBasicInfo, isDropDownProductDevelopersLoaded } = useSelector( ( { productDevelopers } ) => productDevelopers );
    const toggleSidebar = () => setOpenBuyerProductDeveloper( !openBuyerProductDeveloper );

    const nonExitingBuyerProductDeveloper = dropDownProductDevelopers?.filter( a => !buyerBasicInfo?.buyerProductDeveloper?.some( i => i.id === a.value && i.isDeleted === false ) );

    const handleBuyerProductDeveloperDropdownOnFocus = () => {
        dispatch( getDropDownBuyerProductDevelopers() );
    };

    const handleProductDeveloperCreationSubmit = ( productDeveloperObj ) => {
        baseAxios.post( `${merchandisingApi.productDeveloper.root}`, productDeveloperObj )
            .then( response => {
                if ( response.status === status.success ) {
                    const obj = {
                        ...productDeveloperObj,
                        id: response.data,
                        isNew: true,
                        isDeleted: false
                    };
                    const updatedObj = {
                        ...buyerBasicInfo,
                        buyerProductDeveloper: [...buyerBasicInfo.buyerProductDeveloper, obj]
                    };
                    dispatch( bindBuyerBasicInfo( updatedObj ) );
                    dispatch( getDropDownBuyerProductDevelopers() );
                    toggleSidebar();

                } else {
                    notify( 'error', 'The Agents  has been added Failed!' );
                }
            } );
    };

    const handleProductDeveloperCreation = ( newValue ) => {
        const updatedObj = {
            ...productDeveloperBasicInfo,
            name: newValue
        };
        dispatch( bindProductDeveloperBasicInfo( updatedObj ) );
        toggleSidebar();
    };

    return (
        <div>
            <Row>
                <Col xs={12}>
                    <FormGroup>
                        <Label for='department'>
                            Buyer Product Developer
                        </Label>
                        <CreatableSelect
                            id='buyerProductDeveloperId'
                            name="buyerProductDeveloper"
                            isMulti
                            isLoading={!isDropDownProductDevelopersLoaded}
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={nonExitingBuyerProductDeveloper}
                            classNamePrefix='dropdown'
                            className="erp-dropdown-select"
                            value={buyerBasicInfo.productDevelopers}
                            onChange={( data, e ) => {
                                handleDropdown( data, e );
                            }}
                            onCreateOption={data => { handleProductDeveloperCreation( data ); }}
                            onFocus={() => { handleBuyerProductDeveloperDropdownOnFocus(); }}
                        />
                    </FormGroup>
                </Col>
                <Col xs={12}>
                    <DataTable
                        noHeader
                        dense={true}
                        pagination
                        paginationTotalRows={buyerProductDeveloper.filter( dev => dev.isDeleted === false ).length}
                        className='react-custom-dataTable'

                        columns={[
                            {
                                name: '#',
                                width: '30px',
                                selector: 'name',
                                sortable: true,
                                cell: ( row, index ) => index + 1
                            },
                            {
                                name: 'Name',
                                minWidth: '120px',
                                selector: 'name',
                                sortable: true,
                                cell: row => row.name
                            },

                            {
                                name: 'Email',
                                minWidth: '120px',
                                selector: 'email',
                                sortable: true,
                                cell: row => row.email
                            },
                            {
                                name: 'Phone',
                                minWidth: '120px',
                                selector: 'phoneNumber',
                                sortable: true,
                                cell: row => row.phoneNumber
                            },
                            {
                                name: 'Actions',
                                maxWidth: '100px',
                                center: true,
                                cell: row => (
                                    <>
                                        <Button.Ripple
                                            className='btn-icon p-0'
                                            color='flat-danger'
                                            tag={Label}
                                            for="buyerProductDeveloperByBuyerId"
                                            onClick={() => { handleRemoveBuyerProductDeveloperFromTable( row.id ); }} >
                                            <Trash2 id="buyerProductDeveloperByBuyerId" color="red" size={16} />
                                        </Button.Ripple>
                                    </>
                                )

                            }
                        ]}
                        sortIcon={<ChevronDown size={10} />}
                        data={buyerProductDeveloper.filter( dev => dev.isDeleted === false )}
                    />
                </Col>
                {openBuyerProductDeveloper &&
                    <BuyerProductDeveloperInstantCreateForm
                        open={openBuyerProductDeveloper}
                        toggleSidebar={toggleSidebar}
                        handleProductDeveloperCreationSubmit={handleProductDeveloperCreationSubmit}
                    />
                }

            </Row>
        </div>
    );
};

export default BuyerProductDeveloperForm;
