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
import BuyerAgentInstantCreateForm from '../../buyer-agent/form/BuyerAgentInstantCreateForm';
import { bindAgentBasicInfo, getDropDownBuyerAgents } from '../../buyer-agent/store/actions';
import { bindBuyerBasicInfo } from '../store/actions';

const BuyerAgentForm = ( { handleRemoveBuyerAgentFromTable, handleDropdown, buyerAgents } ) => {
    const dispatch = useDispatch();
    const { buyerBasicInfo } = useSelector( ( { buyers } ) => buyers );
    const [openAgentSidebar, setOpenAgentSidebar] = useState( false );
    const { dropDownBuyerAgents, agentBasicInfo, isDropDownBuyerAgentsLoaded } = useSelector( ( { buyerAgents } ) => buyerAgents );
    const nonExitingBuyerAgents = dropDownBuyerAgents?.filter( a => !buyerBasicInfo?.buyerAgent?.some( i => i.id === a.value && i.isDeleted === false ) );
    const toggleSidebar = () => setOpenAgentSidebar( !openAgentSidebar );


    const handleBuyerAgentOnFocus = () => {
        // if ( !dropDownBuyerAgents.length ) {
        dispatch( getDropDownBuyerAgents() );
        // }
    };

    const handleAgentCreationSubmit = ( agentObj ) => {

        baseAxios.post( `${merchandisingApi.buyerAgent.root}`, agentObj )
            .then( response => {
                if ( response.status === status.success ) {
                    const obj = {
                        ...agentObj,
                        id: response.data,
                        isNew: true,
                        isDeleted: false
                    };
                    const updatedObj = {
                        ...buyerBasicInfo,
                        buyerAgent: [...buyerBasicInfo.buyerAgent, obj]
                    };
                    dispatch( bindBuyerBasicInfo( updatedObj ) );
                    dispatch( getDropDownBuyerAgents() );
                    toggleSidebar();
                } else {
                    notify( 'error', 'The Agents  has been added Failed!' );
                }
            } );
    };
    const handleAgentCreation = ( newValue ) => {
        const updatedObj = {
            ...agentBasicInfo,
            name: newValue
        };
        dispatch( bindAgentBasicInfo( updatedObj ) );
        toggleSidebar();
    };
    return (
        <div>
            <Row>
                <Col xs={12}>
                    <FormGroup>
                        <Label for='department'>
                            Buyer Agent
                        </Label>
                        <CreatableSelect
                            id='buyerAgentId'
                            name="buyerAgent"
                            isMulti
                            isSearchable
                            isClearable
                            isLoading={!isDropDownBuyerAgentsLoaded}
                            theme={selectThemeColors}
                            // options={dropDownBuyerAgents}
                            options={nonExitingBuyerAgents}
                            classNamePrefix='dropdown'
                            className="erp-dropdown-select"
                            value={buyerBasicInfo.agents}
                            onChange={( data, e ) => {
                                handleDropdown( data, e );
                            }}
                            onCreateOption={data => { handleAgentCreation( data ); }}
                            onFocus={() => { handleBuyerAgentOnFocus(); }}
                        />

                    </FormGroup>
                </Col>
                <Col xs={12}>
                    <DataTable
                        dense={true}
                        noHeader
                        pagination
                        paginationTotalRows={buyerAgents.filter( a => a.isDeleted === false ).length}
                        className='react-custom-dataTable'
                        data={buyerAgents.filter( a => a.isDeleted === false )}

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
                                            tag={Label} for="buyerAgentsByBuyerId"
                                            onClick={() => { handleRemoveBuyerAgentFromTable( row.id ); }}
                                            color='flat-danger'
                                        >
                                            <Trash2 color="red" id="buyerAgentsByBuyerId" size={16} />
                                        </Button.Ripple>
                                    </>
                                )

                            }

                        ]}

                        sortIcon={<ChevronDown size={10} />}
                    />
                </Col>
                {openAgentSidebar &&
                    <BuyerAgentInstantCreateForm
                        open={openAgentSidebar}
                        toggleSidebar={toggleSidebar}
                        handleAgentCreationSubmit={handleAgentCreationSubmit}
                    />
                }
            </Row>

        </div>
    );
};

export default BuyerAgentForm;
