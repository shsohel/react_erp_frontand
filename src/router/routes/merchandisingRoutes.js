import { lazy } from 'react';
// import { navRoutePermission } from '../../utility/enums';
import { store } from '@store/storeConfig/store';
import { isPermitRoute } from '../../utility/Utils';
const { userPermission } = store?.getState().auth;
const { authPermissions } = store?.getState().permissions;

export const merchandisingRoutes = [

    {
        path: '/test',
        component: lazy( () => import( '../../views/TestPage' ) ),
        // permission: navRoutePermission.antonymous,
        meta: {
            authRoute: true,
            publicRoute: false
        }

    },
    {
        path: '/buyers',
        component: lazy( () => import( '../../views/merchandising/buyer/list' ) ),
        // permission: navRoutePermission.buyer.list,
        meta: {
            authRoute: isPermitRoute( userPermission?.BuyerList, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/currencies',
        component: lazy( () => import( '../../views/merchandising/currency/form/CurrencyForm' ) ),
        // permission: navRoutePermission.antonymous
        meta: {
            authRoute: true,
            publicRoute: false
        }


    },
    {
        path: '/buyer-add-form',
        component: lazy( () => import( '../../views/merchandising/buyer/form/BuyerAddForm.js' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.BuyerCreate, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/buyer-edit-form',
        component: lazy( () => import( '../../views/merchandising/buyer/form/BuyerEditForm.js' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.BuyerEdit, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/buyer-details',
        component: lazy( () => import( '../../views/merchandising/buyer/details/BuyerDetails' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.BuyerView, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/single-style-details',
        component: lazy( () => import( '../../views/merchandising/style/single-style/details/SingleStyleDetails' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.StyleView, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/set-style-details',
        component: lazy( () => import( '../../views/merchandising/style/set-style/details/SetStyleDetails' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.StyleView, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/buyer-agents',
        component: lazy( () => import( '../../views/merchandising/buyer-agent/list' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.BuyerAgentList, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/buyer-product-developers',
        component: lazy( () => import( '../../views/merchandising/buyer-product-developer/list' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.ProductDeveloperList, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/buyer-departments',
        component: lazy( () => import( '../../views/merchandising/buyer-department/list' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.BuyerDepartmentList, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/sample-assignee',
        component: lazy( () => import( '../../views/merchandising/sample-assignee/list' ) ),
        meta: {
            authRoute: true,
            publicRoute: false
        }

    },
    {
        path: '/costing-groups',
        component: lazy( () => import( '../../views/merchandising/costing-groups/list' ) ),
        meta: {
            authRoute: true,
            publicRoute: false
        }

    },
    {
        path: '/merchandisers',
        component: lazy( () => import( '../../views/merchandising/merchandiser/list/MerchandiserList' ) ),
        meta: {
            authRoute: true,
            publicRoute: false
        }

    },
    {
        path: '/divisions',
        component: lazy( () => import( '../../views/merchandising/style-master/style-division/list' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.StyleDivisionList, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/colors',
        component: lazy( () => import( '../../views/merchandising/color/list' ) ),
        // permission: navRoutePermission.color.list,
        meta: {
            authRoute: isPermitRoute( userPermission?.GarmentColorList, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/statuses',
        component: lazy( () => import( '../../views/merchandising/status/list' ) ),
        meta: {
            authRoute: true,
            publicRoute: false
        }

    },


    {
        path: '/style-department',
        component: lazy( () => import( '../../views/merchandising/style-master/style-department/list' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.StyleDepartmentList, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/style-category',
        component: lazy( () => import( '../../views/merchandising/style-master/style-category/list' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.StyleCategoryList, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/style-product-category',
        component: lazy( () => import( '../../views/merchandising/style-master/style-product-category/list' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.ProductCategoryList, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/seasons',
        component: lazy( () => import( '../../views/merchandising/season/list' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.SeasonList, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/destinations',
        component: lazy( () => import( '../../views/merchandising/destination/list/DestinationList' ) ),
        meta: {
            authRoute: true,
            publicRoute: false
        }

    },
    {
        path: '/sizes',
        component: lazy( () => import( '../../views/merchandising/size/list' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.GarmentSizeList, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/size-groups',
        component: lazy( () => import( '../../views/merchandising/size-group/list' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.GarmentSizeGroupList, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/single-styles',
        component: lazy( () => import( '../../views/merchandising/style/single-style/list/StyleList' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.StyleList, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/new-single-style',
        component: lazy( () => import( '../../views/merchandising/style/single-style/form/SingleStyleAddForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.StyleCreate, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/edit-style',
        component: lazy( () => import( '../../views/merchandising/style/single-style/form/SingleStyleEditForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.StyleEdit, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/edit-set-style/:id',
        component: lazy( () => import( '../../views/merchandising/style/set-style/form/SetStyleEditForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.StyleEdit, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/pre-costings',
        component: lazy( () => import( '../../views/merchandising/pre-costing/list' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.CostingList, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/pre-costings-edit',
        component: lazy( () => import( '../../views/merchandising/pre-costing/form/PreCostingEditForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.CostingEdit, authPermissions ),
            publicRoute: false
        }
    },

    {
        path: '/new-pre-costing',
        component: lazy( () => import( '../../views/merchandising/pre-costing/form/PreCostingAddForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.CostingCreate, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/costings',
        component: lazy( () => import( '../../views/merchandising/costing/list' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.CostingList, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/costings-details',
        component: lazy( () => import( '../../views/merchandising/costing/details/CostingDetailsForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.CostingView, authPermissions ),
            publicRoute: false
        }
    },

    {
        path: '/set-costing-details',
        component: lazy( () => import( '../../views/merchandising/costing/details/SetCostingDetails' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.CostingView, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/consumptions-details',
        component: lazy( () => import( '../../views/merchandising/consumption/details/ConsumptionDetails' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.ConsumptionView, authPermissions ),
            publicRoute: false
        }
    },

    {
        path: '/add-set-consumptions',
        component: lazy( () => import( '../../views/merchandising/consumption/form/ConsumptionSetAddForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.ConsumptionCreate, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/consumptions',
        component: lazy( () => import( '../../views/merchandising/consumption/list' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.ConsumptionList, authPermissions ),
            publicRoute: false
        }

    },
    {
        path: '/consumptions-edit',
        component: lazy( () => import( '../../views/merchandising/consumption/form/ConsumptionEditForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.ConsumptionEdit, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/consumptions-details',
        component: lazy( () => import( '../../views/merchandising/consumption/details/ConsumptionDetails' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.ConsumptionEdit, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/set-consumptions-edit',
        component: lazy( () => import( '../../views/merchandising/consumption/form/ConsumptionSetEditForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.ConsumptionEdit, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/consumption-packaging',
        component: lazy( () => import( '../../views/merchandising/consumption/form/ConsumptionPackagingForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.ConsumptionCreate, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/edit-consumption-packaging',
        component: lazy( () => import( '../../views/merchandising/consumption/form/ConsumptionPackagingEditForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.ConsumptionEdit, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/costings-edit',
        component: lazy( () => import( '../../views/merchandising/costing/form/CostingEditForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.CostingEdit, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/set-costings-edit',
        component: lazy( () => import( '../../views/merchandising/costing/form/SetCostingEditForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.CostingEdit, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/new-costing',
        component: lazy( () => import( '../../views/merchandising/costing/form/index' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.CostingCreate, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/clone-costing',
        component: lazy( () => import( '../../views/merchandising/costing/form/CostingCloneForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.CostingCreate, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/new-set-costing',
        component: lazy( () => import( '../../views/merchandising/costing/form/SetCostingAddForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.CostingCreate, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/new-consumption',
        component: lazy( () => import( '../../views/merchandising/consumption/form/ConsumptionAddForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.ConsumptionCreate, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/clone-consumption',
        component: lazy( () => import( '../../views/merchandising/consumption/form/ConsumptionCloneForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.ConsumptionCreate, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/new-purchase-order',
        component: lazy( () => import( '../../views/merchandising/purchase-order/form/PurchaseOrderAddForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.PurchaseOrderCreate, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/purchase-order-details',
        component: lazy( () => import( '../../views/merchandising/purchase-order/details/PurchaseOrderDetails' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.PurchaseOrderView, authPermissions ),
            publicRoute: false
        }
    },

    {
        path: '/purchase-order-edit',
        component: lazy( () => import( '../../views/merchandising/purchase-order/form/PurchaseOrderEditForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.PurchaseOrderEdit, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/stye-purchase-order',
        component: lazy( () => import( '../../views/merchandising/purchase-order/form/StylePurchaseOrderAddForm' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.PurchaseOrderList, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/style-purchase-order-new',
        component: lazy( () => import( '../../views/merchandising/purchase-order/form/StylePurchaseOrderAddFormNew' ) ),
        meta: {
            authRoute: isPermitRoute( userPermission?.PurchaseOrderList, authPermissions ),
            publicRoute: false
        }
    },
    {
        path: '/set-styles',
        component: lazy( () => import( '../../views/merchandising/style/set-style/list' ) )
        // permission: navRoutePermission.style.list

    },
    {
        path: '/new-set-style',
        component: lazy( () => import( '../../views/merchandising/style/set-style/form//SetStyleAddFormNew' ) )
    },
    {
        path: '/budget',
        component: lazy( () => import( '../../views/merchandising/budget/list' ) )
        // permission: navRoutePermission.budget.list

    },
    {
        path: '/add-budget',
        component: lazy( () => import( '../../views/merchandising/budget/form/BudgetAddForm' ) )
    },
    {
        path: '/edit-budget',
        component: lazy( () => import( '../../views/merchandising/budget/form/BudgetEditForm' ) )
    },
    {
        path: '/budget-details',
        component: lazy( () => import( '../../views/merchandising/budget/details/BudgetDetails' ) )
    },
    {
        path: '/bom',
        component: lazy( () => import( '../../views/merchandising/bom/list' ) )
        // permission: navRoutePermission.bom.list
    },
    {
        path: '/add-bom',
        component: lazy( () => import( '../../views/merchandising/bom/form/BOMAddForm' ) )
        // permission: navRoutePermission.bom.list
    },
    {
        path: '/bom-view',
        component: lazy( () => import( '../../views/merchandising/bom/details/BOMView' ) )
    },
    {
        path: '/bom-generate-and-view',
        component: lazy( () => import( '../../views/merchandising/bom/details/BOMGenerateAndView' ) )
    },
    {
        path: '/purchase-order',
        component: lazy( () => import( '../../views/merchandising/purchase-order/list' ) )
        // permission: navRoutePermission.purchaseOrder.list

    },
    {
        path: '/new-single-packaging',
        component: lazy( () => import( '../../views/merchandising/packaging/form/PackagingForSingleStyle' ) )
        // permission: navRoutePermission.packaging.list
    },
    {
        path: '/new-set-packaging',
        component: lazy( () => import( '../../views/merchandising/packaging/form/PackagingForSetStyle' ) )
        // permission: navRoutePermission.packaging.list

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
        path: '/procurement-details',
        component: lazy( () => import( '../../views/merchandising/procurement/details/ProcurementDetails' ) )
    },
    {
        path: '/independent-procurement-details',
        component: lazy( () => import( '../../views/merchandising/procurement/details/NormalProcurementDetails' ) )
    },
    {
        path: '/edit-independent-procurement',
        component: lazy( () => import( '../../views/merchandising/procurement/form/NormalProcurementEditForm' ) )
    },
    {
        path: '/pis',
        component: lazy( () => import( '../../views/inventory/proforma-invoice/list/PiList' ) )
        // permission: navRoutePermission.ipi.list

    },
    {
        path: '/new-pi',
        component: lazy( () => import( '../../views/inventory/proforma-invoice/form/PiAddForm' ) )
    },
    {
        path: '/edit-pi',
        component: lazy( () => import( '../../views/inventory/proforma-invoice/form/PiEditForm' ) )
    },
    {
        path: '/pi-details',
        component: lazy( () => import( '../../views/inventory/proforma-invoice/details/PiDetails' ) )
    }


];