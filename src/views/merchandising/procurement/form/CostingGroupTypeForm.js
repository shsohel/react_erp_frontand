import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ChevronDown } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import { Col, CustomInput, Input, Row } from 'reactstrap';
import TableFilterInsideRow from '../../../../utility/custom/TableFilterInsideRow';
import { getDropDownItemSubGroups } from '../../../inventory/item-sub-group/store/actions';
import { bindBudgetItemDetailsOnChange } from '../../budget/store/actions';
import { ProcurementItemGroupForm } from './ProcurementItemGroupForm';


const CostingGroupTypeForm = () => {
    const dispatch = useDispatch();
    const [allRowSelected, setAllRowSelected] = useState( false );
    const { buyerBudgetItemDetails } = useSelector( ( { budgets } ) => budgets );

    const [filterObj, setFilterObj] = useState( {
        itemSubGroup: '',
        itemGroup: ''
    } );
    useEffect( () => {
        dispatch( getDropDownItemSubGroups() );
    }, [] );


    const handleFilter = ( e ) => {
        const { name, value, type } = e.target;
        setFilterObj( {
            ...filterObj,
            [name]: type === 'number' ? Number( value ) : value
        } );
    };

    const handleAllRowSelect = ( e ) => {
        const { checked } = e.target;
        setAllRowSelected( checked );
        const updatedData = buyerBudgetItemDetails.map( subGroup => ( {
            ...subGroup,
            isSelected: checked,
            items: subGroup.items.map( iGroup => ( { ...iGroup, isSelected: checked } ) )
        } ) );
        dispatch( bindBudgetItemDetailsOnChange( updatedData ) );
    };
    const handleSelectSingleRow = ( e, itemSubGroupFieldId ) => {
        const { name, checked } = e.target;
        const updatedData = buyerBudgetItemDetails.map( subGroup => {
            if ( itemSubGroupFieldId === subGroup.fieldId ) {
                subGroup[name] = checked;
                subGroup['items'] = subGroup.items.map( iGroup => ( { ...iGroup, isSelected: checked } ) );
            }
            return subGroup;
        } );
        dispatch( bindBudgetItemDetailsOnChange( updatedData ) );

        const isAllRowSelected = updatedData.some( so => !so.isSelected === true );
        setAllRowSelected( !isAllRowSelected );
    };


    const randersData = () => {
        let filtered = [];
        if (
            filterObj.itemSubGroup.length
            || filterObj.itemGroup.length

        ) {
            filtered = buyerBudgetItemDetails.filter(
                wh => wh.itemSubGroup?.toLowerCase().includes( filterObj.itemSubGroup?.toLowerCase() ) &&
                    wh.itemGroup?.toLowerCase().includes( filterObj.itemGroup?.toLowerCase() )
            );
        } else {
            filtered = buyerBudgetItemDetails;
        }
        return filtered;
    };


    const filterArray = [
        {
            name: '',
            width: '113px'

        },
        {
            id: "itemSubGroupId",
            name: <Input
                id="itemSubGroupId"
                bsSize="sm"
                name="itemSubGroup"
                value={filterObj.itemSubGroup}
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '200px',
            cell: row => row?.itemSubGroup
        },
        {
            name: <Input
                id="itemGroupId"
                name="itemGroup"
                bsSize="sm"
                value={filterObj.itemGroup}
                onChange={( e ) => { handleFilter( e ); }}
            />,
            minWidth: '200px',
            id: "itemGroupId"


        }

    ];
    return <div>
        <div >
            <Row>
                <Col>
                    <TableFilterInsideRow rowId="prentItemModalId" tableId="pro-item-dt" filterArray={filterArray} />
                    <div>
                        <DataTable
                            noHeader

                            dense={true}
                            pagination
                            paginationServer
                            expandableRows
                            className='react-custom-dataTable-other pro-item-dt'
                            data={randersData()}
                            persistTableHead
                            paginationTotalRows={randersData().length}
                            columns={[
                                {
                                    name: <CustomInput
                                        type='checkbox'
                                        className='custom-control-Primary p-0'
                                        id="myId"
                                        name='isSelectedAll'
                                        htmlFor="myId"
                                        checked={allRowSelected}
                                        inline
                                        onChange={( e ) => handleAllRowSelect( e )}
                                    />,
                                    id: 'isSelectedItem',
                                    width: '65px',
                                    selector: row => row.isSelected,
                                    center: true,
                                    sortable: false,
                                    cell: row => (
                                        <CustomInput
                                            type='checkbox'
                                            className='custom-control-Primary p-0'
                                            id={row.fieldId.toString()}
                                            name='isSelected'
                                            htmlFor={row.fieldId.toString()}
                                            checked={row.isSelected}
                                            inline
                                            onChange={( e ) => handleSelectSingleRow( e, row.fieldId )}
                                        />
                                    )
                                },
                                {
                                    name: 'Item Sub Group',
                                    minWidth: '200px',
                                    selector: 'itemSubGroup',
                                    sortable: true,
                                    cell: row => row?.itemSubGroup
                                },
                                {
                                    name: 'Item Group',
                                    minWidth: '200px',
                                    selector: 'itemGroup',
                                    sortable: true,
                                    cell: row => row?.itemGroup
                                }
                            ]}
                            expandableRowsComponent={<ProcurementItemGroupForm
                                data={( data ) => data}
                                setAllRowSelected={setAllRowSelected}
                            />}
                            sortIcon={<ChevronDown size={2} />}
                        />
                    </div>
                </Col>

            </Row>
        </div>

    </div>;

};

export default CostingGroupTypeForm;
