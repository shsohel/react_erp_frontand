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
import SizeGroupInstantCreateForm from '../../size-group/form/SizeGroupInstantCreateForm';
import { sizeGroupModel } from '../../size-group/model';
import { bindSizeGroupData, getDropDownSizeGroups } from '../../size-group/store/actions';
import { bindBuyerBasicInfo } from '../store/actions';

const BuyerSizeGroupForm = ( {
    handleDropdown,
    buyerSizeGroups,
    handleRemoveBuyerSizeGroupFromTable
} ) => {
    const dispatch = useDispatch();
    const { buyerBasicInfo } = useSelector( ( { buyers } ) => buyers );
    const [sizeGroupSidebarOpen, setSizeGroupSidebarOpen] = useState( false );
    const { sizeGroup, dropDownSizeGroups, isDropDownSizeGroupsLoaded } = useSelector( ( { sizeGroups } ) => sizeGroups );

    const nonExitingSizeGroups = dropDownSizeGroups?.filter( f => !buyerBasicInfo.buyerSizeGroups?.some( i => i.id === f.value && i.isDeleted === false ) );
    const toggleSidebar = () => setSizeGroupSidebarOpen( !sizeGroupSidebarOpen );

    const handleCreateSizeGroupSubmit = ( sizeGroupObj ) => {
        baseAxios.post( `${merchandisingApi.sizeGroup.root}`, sizeGroupObj )
            .then( response => {
                if ( response.status === status.success ) {
                    const obj = {
                        id: response.data,
                        name: sizeGroupObj.name,
                        isNew: true,
                        isDeleted: false
                    };
                    const updatedObj = {
                        ...buyerBasicInfo,
                        buyerSizeGroups: [...buyerBasicInfo.buyerSizeGroups, obj]
                    };
                    dispatch( bindBuyerBasicInfo( updatedObj ) );
                    dispatch( getDropDownSizeGroups() );
                    dispatch( bindSizeGroupData( sizeGroupModel ) );
                    toggleSidebar();
                } else {
                    notify( 'error', 'The SizeGroup  has been added Failed!' );
                }
            } );
    };

    const handleSizeGroupCreation = ( newValue ) => {
        const updatedObj = {
            ...sizeGroup,
            name: newValue
        };
        dispatch( bindSizeGroupData( updatedObj ) );
        toggleSidebar();
    };
    console.log( dropDownSizeGroups );
    const handleSizeGroupOnFocus = () => {
        console.log( 'SFFFF' );
        // if ( !dropDownSizeGroups.length ) {
        dispatch( getDropDownSizeGroups() );
        // }
    };

    return (
        <div>
            <Row>
                <Col >
                    <Row>
                        <Col lg={12}>
                            <Label for='department'>
                                Size Groups
                            </Label>
                            <CreatableSelect
                                id='buyerAgentId'
                                name="buyerSizeGroups"
                                isMulti
                                isLoading={!isDropDownSizeGroupsLoaded}
                                isSearchable
                                isClearable
                                theme={selectThemeColors}
                                // options={dropDownBuyerAgents}
                                options={nonExitingSizeGroups}
                                classNamePrefix='dropdown'
                                className="erp-dropdown-select"
                                // innerRef={register( { required: true } )}
                                value={buyerBasicInfo.sizeGroups}
                                onFocus={() => { handleSizeGroupOnFocus(); }}
                                onChange={( data, e ) => {
                                    handleDropdown( data, e );
                                }}
                                onCreateOption={data => { handleSizeGroupCreation( data ); }}

                            />
                        </Col>

                        <Col lg={12} className="mt-1">
                            <DataTable
                                noHeader
                                dense={true}
                                pagination
                                paginationTotalRows={buyerSizeGroups.filter( sg => sg.isDeleted === false ).length}

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
                                                    onClick={() => { handleRemoveBuyerSizeGroupFromTable( row.id ); }}
                                                >
                                                    <Trash2 id="buyerProductDeveloperByBuyerId" color="red" size={16} />
                                                </Button.Ripple>
                                            </>
                                        )

                                    }
                                ]}
                                sortIcon={<ChevronDown size={10} />}
                                //   data={buyerSizeGroups}
                                data={buyerSizeGroups.filter( sg => sg.isDeleted === false )}
                            />
                        </Col>

                    </Row>
                </Col>
                {sizeGroupSidebarOpen &&
                    <SizeGroupInstantCreateForm
                        open={sizeGroupSidebarOpen}
                        toggleSidebar={toggleSidebar}
                        handleCreateSizeGroupSubmit={handleCreateSizeGroupSubmit}
                    />
                }

            </Row>
        </div>
    );
};

export default BuyerSizeGroupForm;