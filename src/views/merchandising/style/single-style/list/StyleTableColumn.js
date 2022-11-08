
import { store } from '@store/storeConfig/store';

import { Eye, MoreVertical, Trash2 } from 'react-feather';
import { Link } from 'react-router-dom';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { isPermit } from '../../../../../utility/Utils';
import { handleNewStylePurchaseOrder, handleSingleStyleMovement } from '../../../purchase-order/store/actions';
import { deleteStyle } from '../store/actions';


export const handleGetStyleColumns = ( userPermission, authPermissions ) => {
    const stylesTableColumn = [
        {
            name: 'Actions',
            maxWidth: '100px',
            center: true,
            cell: row => (
                <UncontrolledDropdown>
                    <DropdownToggle tag='div' className='btn btn-sm'>
                        <MoreVertical size={14} className='cursor-pointer' />
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem
                            hidden={!row.isActive || !isPermit( userPermission?.PurchaseOrderList, authPermissions )}

                            tag={Link}
                            // target="_blank"
                            className='w-100'
                            to={{
                                pathname: `/stye-purchase-order`,
                                state: {
                                    id: row.id,
                                    styleNo: row.styleNo
                                }
                            }}
                            // onClick={() => store.dispatch( handleNewStylePurchaseOrder( row.id, row.styleNo, row.buyerName, row?.buyerId, 'single-styles', false, row.status ) )}
                            onClick={() => store.dispatch( handleNewStylePurchaseOrder( row ) )}

                        >
                            <Eye color="green" size={14} className='mr-50' />
                            <span className='align-middle'>Purchase Order</span>
                        </DropdownItem>

                        <DropdownItem
                            hidden={!row.isActive || !isPermit( userPermission?.CostingList, authPermissions )}
                            tag={Link}
                            // target="_blank"
                            className='w-100'
                            to={{
                                pathname: `/costings`,
                                state: {
                                    column: "styleId",
                                    operator: "string",
                                    value: row.id,
                                    isSetStyle: false
                                }
                            }}
                            onClick={() => store.dispatch( handleSingleStyleMovement( row ) )}

                        >
                            <Eye color="green" size={14} className='mr-50' />
                            <span className='align-middle'>Costing</span>
                        </DropdownItem>

                        <DropdownItem
                            hidden={!row.isActive || !isPermit( userPermission?.ConsumptionList, authPermissions )}

                            tag={Link}
                            //  target="_blank"
                            className='w-100'
                            to={{
                                pathname: `/consumptions`,
                                state: {
                                    column: "styleId",
                                    operator: "string",
                                    value: row.id,
                                    isSetStyle: false
                                }
                            }}
                            onClick={() => store.dispatch( handleSingleStyleMovement( row ) )}

                        >
                            <Eye color="green" size={14} className='mr-50' />
                            <span className='align-middle'>Consumption</span>
                        </DropdownItem>
                        <DropdownItem
                            hidden={!row.isActive || !isPermit( userPermission?.BudgetList, authPermissions )}

                            tag={Link}
                            //  target="_blank"
                            className='w-100'
                            to='/budget'
                            onClick={() => store.dispatch( handleSingleStyleMovement( row ) )}

                        >
                            <Eye color="green" size={14} className='mr-50' />
                            <span className='align-middle'>Budget</span>
                        </DropdownItem>

                        <DropdownItem
                            hidden={!row.isActive || !isPermit( userPermission?.SupplierOrderList, authPermissions )}

                            tag={Link}
                            //  target="_blank"
                            className='w-100'
                            to='/procurements'
                            onClick={() => store.dispatch( handleSingleStyleMovement( row ) )}

                        >
                            <Eye color="green" size={14} className='mr-50' />
                            <span className='align-middle'>IPO</span>
                        </DropdownItem>


                        {/* <DropdownItem
                            hidden={!row.isActive || !isPermit( userPermission?.StyleEdit, authPermissions )}

                            tag={Link}
                            // to={`/edit-style/${row.id}`}
                            to={{ pathname: `/edit-style`, state: `${row.id}` }}

                            className='w-100'
                        >
                            <Edit color="green" size={14} className='mr-50' />
                            <span className='align-middle'>Edit</span>
                        </DropdownItem> */}
                        <DropdownItem
                            hidden={!row.isActive || !isPermit( userPermission?.StyleView, authPermissions )}

                            tag={Link}
                            // to={`/edit-style/${row.id}`}
                            to={{ pathname: `/single-style-details`, state: `${row.id}` }}

                            className='w-100'
                        >
                            <Eye color="green" size={14} className='mr-50' />
                            <span className='align-middle'>View</span>
                        </DropdownItem>

                        <DropdownItem className='w-100'
                            hidden={!row.isActive || !isPermit( userPermission?.StyleDelete, authPermissions )}
                            onClick={() => store.dispatch( deleteStyle( row ) )}
                        >
                            <Trash2 color="red" size={14} className='mr-50' />
                            <span className='align-middle'>Delete</span>
                        </DropdownItem>


                    </DropdownMenu>
                </UncontrolledDropdown >
            )
        },
        {
            name: 'SYS ID',
            maxWidth: '150px',
            selector: 'sysId',
            sortable: true,
            cell: row => row.sysId
        },
        {
            name: 'Style No',
            minWidth: '200px',
            selector: 'styleNo',
            sortable: true,
            cell: row => row.styleNo
        },
        {
            name: 'Description',
            minWidth: '200px',
            selector: 'description',
            sortable: true,
            cell: row => row.description
        },
        {
            name: 'Buyer',
            minWidth: '200px',
            selector: 'buyerName',
            sortable: true,
            cell: row => row.buyerName
        },
        {
            name: 'Style Category',
            minWidth: '200px',
            selector: 'styleCategory',
            sortable: true,
            cell: row => row.styleCategory
        },
        {
            name: 'Product Category',
            minWidth: '200px',
            selector: 'productCategory',
            sortable: true,
            cell: row => row.productCategory
        },
        {
            name: 'Merchandiser',
            minWidth: '200px',
            selector: 'merchandiser',
            sortable: true,
            cell: row => row.merchandiser
        },
        {
            name: 'Season',
            width: '150px',
            selector: 'season',
            sortable: true,
            cell: row => row.season
        },
        {
            name: 'Year',
            width: '100px',
            selector: 'year',
            sortable: true,
            center: true,
            cell: row => row.year


        },

        {
            name: 'Status',
            minWidth: '150px',
            selector: 'status',
            sortable: true,
            center: true,
            cell: row => row.status
        }


    ];
    return stylesTableColumn;
};