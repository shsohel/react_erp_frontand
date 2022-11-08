import { lazy } from 'react';


export const inventoryRoutes = [

    {
        path: '/inventory-item-group',
        component: lazy( () => import( '../../views/inventory/item-group/list' ) )
    },
    {
        path: '/inventory-item-sub-group',
        component: lazy( () => import( '../../views/inventory/item-sub-group/list' ) )
    },
    {
        path: '/inventory-segment',
        component: lazy( () => import( '../../views/inventory/segment/list' ) )
    },
    {
        path: '/inventory-item',
        component: lazy( () => import( '../../views/inventory/item/list' ) )
    },
    {
        path: '/unit-set',
        component: lazy( () => import( '../../views/inventory/unit-sets/list' ) )

    },
    {
        path: '/unit-set-assign-unit',
        component: lazy( () => import( '../../views/inventory/unit-sets/form/AssignUnitsForm' ) )
    },
    {
        path: '/warehouses',
        component: lazy( () => import( '../../views/inventory/warehouse/list' ) )
    },
    {
        path: '/new-warehouse',
        component: lazy( () => import( '../../views/inventory/warehouse/form/WarehouseAddForm' ) )
    },
    {
        path: '/edit-warehouse',
        component: lazy( () => import( '../../views/inventory/warehouse/form/WarehouseEditForm' ) )
    },
    {
        path: '/vendors',
        component: lazy( () => import( '../../views/inventory/vendor/list' ) )
    },
    {
        path: '/new-vendor',
        component: lazy( () => import( '../../views/inventory/vendor/form' ) )
    },
    {
        path: '/edit-vendor',
        component: lazy( () => import( '../../views/inventory/vendor/form/VendorEditForm' ) )
    },
    {
        path: '/vendor-groups',
        component: lazy( () => import( '../../views/inventory/vendor-group/form/VendorGroups' ) )
    },
    {
        path: '/procurements',
        component: lazy( () => import( '../../views/merchandising/procurement/list' ) )
        // permission: navRoutePermission.ipo.list

    },
    {
        path: '/new-procurement',
        component: lazy( () => import( '../../views/merchandising/procurement/form/ProcurementAddForm' ) )
    },
    {
        path: '/new-independent-procurement',
        component: lazy( () => import( '../../views/merchandising/procurement/form/NormalProcurementAddForm' ) )
    },
    {
        path: '/edit-procurement',
        component: lazy( () => import( '../../views/merchandising/procurement/form/ProcurementEditForm' ) )
    },
    {
        path: '/edit-independent-procurement',
        component: lazy( () => import( '../../views/merchandising/procurement/form/NormalProcurementEditForm' ) )
    },
    {
        path: '/pis',
        component: lazy( () => import( '../../views/inventory/proforma-invoice/list/PiList' ) )
    },
    {
        path: '/new-pi',
        component: lazy( () => import( '../../views/inventory/proforma-invoice/form/PiAddForm' ) )
    },
    {
        path: '/edit-pi',
        component: lazy( () => import( '../../views/inventory/proforma-invoice/form/PiEditForm' ) )
    }
];