
import React from 'react';
import { MoreVertical } from 'react-feather';
import DropdownToggle from 'reactstrap/lib/DropdownToggle';
import UncontrolledDropdown from 'reactstrap/lib/UncontrolledDropdown';

const statusObj = {
    active: 'light-success',
    inactive: 'light-secondary'
};
const changePosition = {
    upArrow: true,
    downArrow: false
};


export const CostingGroupTableColumns = [
    {
        name: 'Costing Group',
        minWidth: '200px',
        selector: 'name',
        sortable: true,
        cell: row => row.name
    },
    {
        name: 'Description',
        minWidth: '200px',
        selector: 'description',
        sortable: true,
        cell: row => row.description
    },
    // {
    //     name: 'Is Internal Cost',
    //     minWidth: '200px',
    //     selector: 'isInternalCost',
    //     sortable: true,
    //     cell: row => row.isInternalCost
    // },
    // {
    //     name: 'Change Position',
    //     minWidth: '200px',
    //     selector: 'changePosition',
    //     sortable: true,
    //     cell: row => (
    //         <>
    //             <div>
    //                 <Button.Ripple
    //                     className='btn-icon'
    //                     color='success'
    //                     size="sm"
    //                     disabled
    //                 >
    //                     <ArrowUp size={14}
    //                     />
    //                 </Button.Ripple>
    //             </div>

    //             <div>
    //                 <Button.Ripple className='btn-icon ml-1' color='warning' size="sm" onClick={() => console.log( 'click' )}><ArrowDown size={14} /></Button.Ripple>
    //             </div>
    //         </>
    //     )

    // },


    {
        name: 'Actions',
        maxWidth: '100px',
        cell: row => (
            <UncontrolledDropdown>
                <DropdownToggle tag='div' className='btn btn-sm'>
                    <MoreVertical size={14} className='cursor-pointer' />
                </DropdownToggle>
                {/*   <DropdownMenu right>
                    <DropdownItem
                        tag={Link}
                        to={`/apps/user/view/${row.id}`}
                        className='w-100'
                        onClick={() => { }}

                    >
                        <FileText color='skyBlue' size={14} className='mr-50' />
                        <span color='primary' className='align-middle'>Details</span>

                    </DropdownItem> */}

                {/* <DropdownItem
                        className='w-100'
                        onClick={() => { store.dispatch( getCostingGroupById( row.id ) ); store.dispatch( handleOpenCostingGroupSidebarForEdit( true ) ); }}
                    >
                        <Edit color='green' size={14} className='mr-50' />
                        <span className='align-middle'>Edit</span>
                    </DropdownItem>

                    <DropdownItem
                        className='w-100'
                        onClick={() => store.dispatch( deleteCostingGroup( row.id ) )}
                    >
                        <Trash2 color='red' size={14} className='mr-50' />
                        <span className='align-middle'>Delete</span>
                    </DropdownItem>
                </DropdownMenu>*/}
            </UncontrolledDropdown>
        )
    }

];
