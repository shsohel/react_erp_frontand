import { store } from '@store/storeConfig/store';
import { Box, Briefcase, File, Framer, GitCommit, Layers, List, User, Users } from 'react-feather';
import { isPermitNav } from '../utility/Utils';
const { userPermission } = store?.getState().auth;
const { authPermissions } = store?.getState().permissions;


export const inventoryNavigation = [
    {
        id: 'inventoryoperation',
        title: 'Inventory Operation',
        icon: <Framer size={20} />,
        hidden: isPermitNav( userPermission?.ProformaInvoiceList, authPermissions ),
        children: [
            {
                id: 'procurement',
                title: 'IPO',
                icon: <Briefcase size={20} />,
                navLink: '/procurements',
                // permission: navRoutePermission.ipo.list,
                hidden: isPermitNav( userPermission?.SupplierOrderList, authPermissions )

            },
            {
                id: 'pi',
                title: 'PI',
                icon: <File size={20} />,
                navLink: '/pis',
                hidden: isPermitNav( userPermission?.ProformaInvoiceList, authPermissions )
            }
        ]
    },

    {
        id: 'inventoryconfiguration',
        title: 'Inventory Configuration',
        icon: <GitCommit size={20} />,
        hidden: isPermitNav( userPermission?.ItemGroupList, authPermissions ) &&
            isPermitNav( userPermission?.SegmentList, authPermissions ) &&
            isPermitNav( userPermission?.ItemList, authPermissions ) &&
            isPermitNav( userPermission?.UnitList, authPermissions ) &&
            isPermitNav( userPermission?.WarehouseList, authPermissions ) &&
            isPermitNav( userPermission?.VendorList, authPermissions ) &&
            isPermitNav( userPermission?.VendorGroupList, authPermissions ),
        children: [
            {
                id: 'inventory-item-group',
                title: 'Item-Group',
                icon: <User size={20} />,
                navLink: '/inventory-item-group',
                hidden: isPermitNav( userPermission?.ItemGroupList, authPermissions )
            },
            {
                id: 'inventory-segment',
                title: 'Segment ',
                icon: <User size={20} />,
                navLink: '/inventory-segment',
                hidden: isPermitNav( userPermission?.SegmentList, authPermissions )
            },
            {
                id: 'inventory-item',
                title: 'Item',
                icon: <User size={20} />,
                navLink: '/inventory-item',
                hidden: isPermitNav( userPermission?.ItemList, authPermissions )
            },
            {
                id: 'unit-set',
                title: 'Unit Sets',
                icon: <Box size={20} />,
                navLink: '/unit-set',
                hidden: isPermitNav( userPermission?.UnitList, authPermissions )
            },
            {
                id: 'warehouse',
                title: 'Warehouse',
                icon: <Layers size={20} />,
                navLink: '/warehouses',
                hidden: isPermitNav( userPermission?.WarehouseList, authPermissions )
            },
            {
                id: 'vendors',
                title: 'Vendor',
                icon: <Users size={20} />,
                navLink: '/vendors',
                hidden: isPermitNav( userPermission?.VendorList, authPermissions )

            },
            {
                id: 'vendorsGroups',
                title: 'Vendor Groups',
                icon: <List size={20} />,
                navLink: '/vendor-groups',
                hidden: isPermitNav( userPermission?.VendorGroupList, authPermissions )
            }
        ]
    }
    // {
    //     id: 'lastupdate',
    //     title: 'Last Update',
    //     icon: <Layers size={20} />,
    //     navLink: '/last-update'
    // },
    // {
    //     id: 'testMe',
    //     title: 'Test Me',
    //     icon: <Eye size={20} />,
    //     navLink: '/test'
    // }
];


export const handleGetInventoryNavigation = ( userPermission, authPermissions ) => {

    const inventoryNav = [
        {
            id: 'inventoryoperation',
            title: 'Inventory Operation',
            icon: <Framer size={20} />,
            hidden: isPermitNav( userPermission?.ProformaInvoiceList, authPermissions ),
            children: [
                {
                    id: 'procurement',
                    title: 'IPO',
                    icon: <Briefcase size={20} />,
                    navLink: '/procurements',
                    // permission: navRoutePermission.ipo.list,
                    hidden: isPermitNav( userPermission?.SupplierOrderList, authPermissions )
                },
                {
                    id: 'pi',
                    title: 'PI',
                    icon: <File size={20} />,
                    navLink: '/pis',
                    hidden: isPermitNav( userPermission?.ProformaInvoiceList, authPermissions )
                }
            ]
        },

        {
            id: 'inventoryconfiguration',
            title: 'Inventory Configuration',
            icon: <GitCommit size={20} />,
            hidden: isPermitNav( userPermission?.ItemGroupList, authPermissions ) &&
                isPermitNav( userPermission?.SegmentList, authPermissions ) &&
                isPermitNav( userPermission?.ItemList, authPermissions ) &&
                isPermitNav( userPermission?.UnitList, authPermissions ) &&
                isPermitNav( userPermission?.WarehouseList, authPermissions ) &&
                isPermitNav( userPermission?.VendorList, authPermissions ) &&
                isPermitNav( userPermission?.VendorGroupList, authPermissions ),
            children: [
                {
                    id: 'inventory-item-group',
                    title: 'Item-Group',
                    icon: <User size={20} />,
                    navLink: '/inventory-item-group',
                    hidden: isPermitNav( userPermission?.ItemGroupList, authPermissions )
                },
                {
                    id: 'inventory-segment',
                    title: 'Segment ',
                    icon: <User size={20} />,
                    navLink: '/inventory-segment',
                    hidden: isPermitNav( userPermission?.SegmentList, authPermissions )
                },
                {
                    id: 'inventory-item',
                    title: 'Item',
                    icon: <User size={20} />,
                    navLink: '/inventory-item',
                    hidden: isPermitNav( userPermission?.ItemList, authPermissions )
                },
                {
                    id: 'unit-set',
                    title: 'Unit Sets',
                    icon: <Box size={20} />,
                    navLink: '/unit-set',
                    hidden: isPermitNav( userPermission?.UnitList, authPermissions )
                },
                {
                    id: 'warehouse',
                    title: 'Warehouse',
                    icon: <Layers size={20} />,
                    navLink: '/warehouses',
                    hidden: isPermitNav( userPermission?.WarehouseList, authPermissions )
                },
                {
                    id: 'vendors',
                    title: 'Vendor',
                    icon: <Users size={20} />,
                    navLink: '/vendors',
                    hidden: isPermitNav( userPermission?.VendorList, authPermissions )

                },
                {
                    id: 'vendorsGroups',
                    title: 'Vendor Groups',
                    icon: <List size={20} />,
                    navLink: '/vendor-groups',
                    hidden: isPermitNav( userPermission?.VendorGroupList, authPermissions )
                }
            ]
        }
        // {
        //     id: 'lastupdate',
        //     title: 'Last Update',
        //     icon: <Layers size={20} />,
        //     navLink: '/last-update'
        // },
        // {
        //     id: 'testMe',
        //     title: 'Test Me',
        //     icon: <Eye size={20} />,
        //     navLink: '/test'
        // }
    ];
    return inventoryNav;

};