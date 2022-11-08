import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown, Trash2 } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Button, Col, Label, Row } from 'reactstrap';
import { baseAxios } from '../../../../services';
import { merchandisingApi } from '../../../../services/api-end-points/merchandising';
import { notify } from '../../../../utility/custom/notifications';
import { countries, status } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
import { colorModel } from '../../color/model';
import { bindColorData, getDropDownColors } from '../../color/store/actions';
import { getDropDownDestinationsByCountryName } from '../../destination/store/actions';
import { bindBuyerBasicInfo } from '../store/actions';

const BuyerDestinationForm = ( { handleDropdown, buyerDestinations, handleRemoveBuyerDestinationsFromTable } ) => {
    const dispatch = useDispatch();
    const { buyerBasicInfo } = useSelector( ( { buyers } ) => buyers );
    const { destinationDropdownCountryWise, isDestinationDropdownCountryWiseLoaded } = useSelector( ( { destinations } ) => destinations );
    const { color } = useSelector( ( { colors } ) => colors );
    const [colorSidebarOpen, setColorSidebarOpen] = useState( false );

    const nonExitingColors = destinationDropdownCountryWise?.filter( f => !buyerBasicInfo.buyerDestinations?.some( i => i.id === f.value && i.isDeleted === false ) );

    const toggleSidebar = () => setColorSidebarOpen( !colorSidebarOpen );


    const handleDestinationOnFocus = ( countryName ) => {
        if ( countryName ) {
            dispatch( getDropDownDestinationsByCountryName( countryName ) );
        }
    };

    const handleCountryDropdown = ( data ) => {

        const updatedObj = {
            ...buyerBasicInfo,
            countries: data
        };
        dispatch( bindBuyerBasicInfo( updatedObj ) );
        dispatch( getDropDownDestinationsByCountryName( null ) );

    };


    const handleDestinationCreation = ( newValue, country ) => {

        const submittedObj = {
            country,
            destination: newValue
        };

        const apiEndPoint = `${merchandisingApi.destination.root}`;
        baseAxios.post( apiEndPoint, submittedObj )
            .then( response => {
                if ( response.status === status.success ) {
                    const obj = {
                        id: response.data,
                        name: submittedObj.destination,
                        isNew: true,
                        isDeleted: false
                    };
                    const updatedObj = {
                        ...buyerBasicInfo,
                        buyerDestinations: [...buyerBasicInfo.buyerDestinations, obj]
                    };
                    dispatch( bindBuyerBasicInfo( updatedObj ) );
                }
            } );
    };


    // [
    //     ...buyerDestinations, ...data.map( i => ( {
    //         id: i.value,
    //         name: i.label,
    //         isNew: true,
    //         isDeleted: false
    //     } ) )

    // ** Add new Destination
    // export const addDestination = destination => async ( dispatch, getState ) => {
    //     const apiEndPoint = `${merchandisingApi.destination.root}`;
    //     await baseAxios
    //         .post( apiEndPoint, destination )
    //         .then( response => {
    //             if ( response.status === status.success ) {
    //                 dispatch( {
    //                     type: ADD_DESTINATION,
    //                     destination
    //                 } );
    //                 notify( 'success', 'The Destination has been added Successfully!' );
    //                 dispatch( getDestinationByQuery( getState().destinations.params, [] ) );
    //                 dispatch( handleOpenDestinationSidebar( false ) );
    //             } else {
    //                 notify( 'error', 'The Destination has been added Failed!' );
    //             }
    //         } )
    //         .catch( ( { response } ) => {
    //             if ( response.status === status.severError ) {
    //                 notify( 'error', `Please contact the support team!!!` );
    //             } else {
    //                 notify( 'warning', `${response.data.errors.join( ', ' )}` );
    //             }
    //         } );
    // };

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
                        <Col lg={6}>
                            <Label for='country'>
                                Country
                            </Label>
                            <Select
                                id='countryId'
                                name="buyerDestinations"
                                isSearchable
                                isClearable
                                theme={selectThemeColors}
                                // options={dropDownBuyerAgents}
                                options={countries}
                                classNamePrefix='dropdown'
                                className="erp-dropdown-select"
                                // innerRef={register( { required: true } )}
                                value={buyerBasicInfo.countries}
                                onChange={( data ) => {
                                    handleCountryDropdown( data );
                                }}

                            />
                        </Col>
                        <Col lg={6}>
                            <Label for='destination'>
                                Destination
                            </Label>
                            <CreatableSelect
                                id='buyerAgentId'
                                isMulti
                                name="buyerDestinations"
                                isLoading={!isDestinationDropdownCountryWiseLoaded}
                                isSearchable
                                isClearable
                                theme={selectThemeColors}
                                isDisabled={!buyerBasicInfo.countries}
                                // options={dropDownBuyerAgents}
                                options={nonExitingColors}
                                classNamePrefix='dropdown'
                                className="erp-dropdown-select"
                                // innerRef={register( { required: true } )}
                                value={buyerBasicInfo.destinations}
                                onFocus={() => { handleDestinationOnFocus( buyerBasicInfo?.countries?.value ); }}
                                onChange={( data, e ) => {
                                    handleDropdown( data, e );
                                }}
                                onCreateOption={( data ) => { handleDestinationCreation( data, buyerBasicInfo.countries?.value ); }}

                            />
                        </Col>

                        <Col lg={12} className="mt-1">
                            <DataTable
                                noHeader
                                dense={true}
                                pagination
                                paginationTotalRows={buyerDestinations.filter( c => c.isDeleted === false ).length}
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
                                                    for="buyerDestinationByBuyerId"
                                                    onClick={() => { handleRemoveBuyerDestinationsFromTable( row.id ); }}
                                                >
                                                    <Trash2 id="buyerDestinationByBuyerId" color="red" size={16} />
                                                </Button.Ripple>
                                            </>
                                        )

                                    }
                                ]}
                                sortIcon={<ChevronDown size={10} />}

                                //     data={buyerColors}
                                data={buyerDestinations.filter( c => c.isDeleted === false )}
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
        </div>
    );
};

export default BuyerDestinationForm;