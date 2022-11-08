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
import { getDropDownBuyerDepartments } from '../../buyer-department/store/actions';
import { bindBuyerBasicInfo } from '../store/actions';

const BuyerDepartmentForm = ( { buyerDepartmentByBuyer, handleRemoveBuyerDepartmentFromTable, handleDropdown } ) => {
    const dispatch = useDispatch();
    const { buyerBasicInfo } = useSelector( ( { buyers } ) => buyers );
    const { dropDownBuyerDepartments, isDropDownBuyerDepartmentsLoaded } = useSelector( ( { buyerDepartments } ) => buyerDepartments );
    const nonExitingBuyerDepartment = dropDownBuyerDepartments?.filter( a => !buyerBasicInfo?.buyerDepartment?.some( i => i.id === a.value && i.isDeleted === false ) );

    const handleDepartmentOnFocus = () => {
        dispatch( getDropDownBuyerDepartments() );

    };

    const handleDepartmentCreation = ( newValue ) => {
        const submittedObj = {
            name: newValue,
            description: newValue
        };
        baseAxios.post( `${merchandisingApi.buyerDepartment.root}`, submittedObj )
            .then( response => {
                if ( response.status === status.success ) {
                    const obj = {
                        id: response.data,
                        name: newValue,
                        description: newValue,
                        isNew: true,
                        isDeleted: false
                    };
                    const updatedObj = {
                        ...buyerBasicInfo,
                        buyerDepartment: [...buyerBasicInfo.buyerDepartment, obj]
                    };
                    dispatch( bindBuyerBasicInfo( updatedObj ) );
                    dispatch( getDropDownBuyerDepartments() );

                } else {
                    notify( 'error', 'The Department  has been added Failed!' );
                }
            } );
    };
    return (
        <div >
            <Row>
                <Col xs={12}>
                    <FormGroup>
                        <Label for='department'>
                            Buyer Department
                        </Label>
                        <CreatableSelect
                            id='departmentIds'
                            isMulti
                            isLoading={!isDropDownBuyerDepartmentsLoaded}
                            name="buyerDepartment"
                            isSearchable
                            isClearable
                            theme={selectThemeColors}
                            options={nonExitingBuyerDepartment}
                            classNamePrefix='dropdown'
                            className="erp-dropdown-select"
                            value={buyerBasicInfo.departments}
                            onChange={( data, e ) => {
                                handleDropdown( data, e );
                            }}
                            onCreateOption={data => { handleDepartmentCreation( data ); }}
                            onFocus={() => { handleDepartmentOnFocus(); }}
                        />
                    </FormGroup>
                </Col>
                <Col xs={12}>
                    <DataTable
                        noHeader
                        dense
                        pagination
                        paginationTotalRows={buyerDepartmentByBuyer.filter( d => d.isDeleted === false ).length}
                        className='react-custom-dataTable'
                        data={buyerDepartmentByBuyer.filter( d => d.isDeleted === false )}
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
                                cell: row => row?.name
                            },
                            {
                                name: 'Description',
                                minWidth: '200px',
                                selector: 'description',
                                sortable: true,
                                cell: row => row?.description
                            },
                            {
                                name: 'Actions',
                                maxWidth: '100px',
                                center: true,
                                cell: row => (
                                    <>
                                        <Button.Ripple
                                            tag={Label}
                                            for="buyerDepartmentId"
                                            onClick={() => { handleRemoveBuyerDepartmentFromTable( row.id ); }}
                                            className='btn-icon p-0'
                                            color='flat-danger'
                                        >
                                            <Trash2 id="buyerDepartmentId" color="red" size={16} />
                                        </Button.Ripple>
                                    </>
                                )

                            }

                        ]}
                        sortIcon={<ChevronDown size={10} />}

                    />
                </Col>

            </Row>
        </div>
    );
};

export default BuyerDepartmentForm;
