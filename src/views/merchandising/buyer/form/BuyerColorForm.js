import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import CreatableSelect from 'react-select/creatable';
import { Button, Col, Label, Row } from 'reactstrap';
import { baseAxios } from '../../../../services';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import { notify } from '../../../../utility/custom/notifications';
import { status } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
import ColorInstantCreateForm from '../../color/form/ColorInstantCreateForm';
import { colorModel } from '../../color/model';
import { bindColorData, getDropDownColors } from '../../color/store/actions';
import { bindBuyerBasicInfo } from '../store/actions';

const BuyerColorForm = ( { handleDropdown, buyerColors, handleRemoveBuyerColorFromTable } ) => {
    const dispatch = useDispatch();
    const { buyerBasicInfo } = useSelector( ( { buyers } ) => buyers );
    const { color, isDropDownColorsLoaded } = useSelector( ( { colors } ) => colors );
    const [colorSidebarOpen, setColorSidebarOpen] = useState( false );

    const { dropDownColors } = useSelector( ( { colors } ) => colors );
    const nonExitingColors = dropDownColors?.filter( f => !buyerBasicInfo.buyerColors?.some( i => i.id === f.value && i.isDeleted === false ) );

    const toggleSidebar = () => setColorSidebarOpen( !colorSidebarOpen );


    const handleColorOnFocus = () => {
        // if ( !dropDownColors.length ) {
        dispatch( getDropDownColors() );
        // }

    };

    const handleColorCreation = ( newValue ) => {
        const updatedObj = {
            ...color,
            name: newValue
        };
        dispatch( bindColorData( updatedObj ) );
        toggleSidebar();
    };

    const handleCreateColorSubmit = ( colorObj ) => {
        baseAxios.post( `${merchandisingApi.color.root}`, colorObj )
            .then( response => {
                console.log( response.data );
                if ( response.status === status.success ) {
                    const obj = {
                        id: response.data,
                        name: colorObj.name,
                        isNew: true,
                        isDeleted: false
                    };
                    const updatedObj = {
                        ...buyerBasicInfo,
                        buyerColors: [...buyerBasicInfo.buyerColors, obj]
                    };
                    dispatch( bindBuyerBasicInfo( updatedObj ) );
                    dispatch( getDropDownColors() );
                    dispatch( bindColorData( colorModel ) );
                    toggleSidebar();
                } else {
                    notify( 'error', 'The Color  has been added Failed!' );
                }
            } );
    };

    return (
        <div>
            <Row>
                <Col >
                    <Row>
                        <Col lg={12}>
                            <Label for='buyerColorId'>
                                Colors
                            </Label>
                            <CreatableSelect
                                id='buyerColorId'
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
                                value={buyerBasicInfo.colors}
                                onFocus={() => { handleColorOnFocus(); }}
                                onChange={( data, e ) => {
                                    handleDropdown( data, e );
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
                                        name: '#',
                                        width: '30px',
                                        selector: 'name',
                                        sortable: true,
                                        cell: ( row, index ) => index + 1
                                    },
                                    {
                                        name: 'Name',
                                        minWidth: '200px',
                                        selector: 'name',
                                        sortable: true,
                                        cell: row => row.name
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
                                                    onClick={() => { handleRemoveBuyerColorFromTable( row.id ); }} >
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
            <ColorInstantCreateForm
                open={colorSidebarOpen}
                handleCreateColorSubmit={handleCreateColorSubmit}
                toggleSidebar={toggleSidebar}
            />
        </div>
    );
};

export default BuyerColorForm;