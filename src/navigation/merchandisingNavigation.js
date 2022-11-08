
import { store } from '@store/storeConfig/store';
import { Box, Briefcase, DollarSign, Framer, GitCommit, MapPin, Maximize, Paperclip, PenTool, Plus, PlusSquare, Umbrella, UserCheck, UserPlus } from 'react-feather';
import { isPermitNav } from '../utility/Utils';
import { handleGetMerchandisingReports } from './reportingNavigation';
const { userPermission } = store?.getState().auth;
const { authPermissions } = store?.getState().permissions;

export const merchandisingNavigation = [
    {
        id: 'operation',
        title: 'Operation',
        icon: <Framer size={20} />,
        hidden: isPermitNav( userPermission?.StyleList, authPermissions ) &&
            isPermitNav( userPermission?.BOMList, authPermissions ) &&
            isPermitNav( userPermission?.BudgetList, authPermissions ),

        children: [
            {
                id: 'styles',
                title: 'Styles',
                icon: <PenTool size={20} />,
                // permission: navRoutePermission.style.list,
                hidden: isPermitNav( userPermission?.StyleList, authPermissions ),
                children: [
                    {
                        id: 'singleStyle',
                        title: 'Single Style',
                        icon: <PenTool size={20} />,
                        navLink: '/single-styles',
                        // permission: navRoutePermission.style.list,
                        hidden: isPermitNav( userPermission?.StyleList, authPermissions )

                    }

                    // {
                    //     id: 'setStyle',
                    //     title: 'Set Style',
                    //     icon: <PenTool size={20} />,
                    //     navLink: '/set-styles',
                    //     // permission: navRoutePermission.style.list,
                    //     hidden: isPermitNav( userPermission?.StyleList, authPermissions )
                    // }
                ]
            },

            {
                id: 'bom',
                title: 'BOM',
                icon: <Paperclip size={20} />,
                navLink: '/add-bom',
                // permission: navRoutePermission.bom.list,
                hidden: isPermitNav( userPermission?.BOMList, authPermissions )
            },
            {
                id: 'budget',
                title: 'Budgets',
                icon: <Briefcase size={20} />,
                navLink: '/budget',
                // permission: navRoutePermission.budget.list,
                hidden: isPermitNav( userPermission?.BudgetList, authPermissions )
            }
        ]
    },

    {
        id: 'packaging',
        title: 'Packaging',
        icon: <Box size={20} />,
        hidden: isPermitNav( userPermission?.PackagingList, authPermissions ),
        children: [
            {
                id: 'singlePackaging',
                title: 'Single Packaging',
                icon: <Box size={20} />,
                navLink: 'new-single-packaging',
                // permission: navRoutePermission.packaging.list,
                hidden: isPermitNav( userPermission?.PackagingList, authPermissions )
            },
            {
                id: 'setPackaging',
                title: 'Set Packaging',
                icon: <Box size={20} />,
                navLink: 'new-set-packaging',
                // permission: navRoutePermission.packaging.list,
                hidden: isPermitNav( userPermission?.PackagingList, authPermissions )
            }
        ]
    },
    {
        id: 'orderRequisition',
        title: 'Order Requisition',
        icon: <Briefcase size={20} />,
        hidden: isPermitNav( userPermission?.SupplierOrderList, authPermissions ) &&
            isPermitNav( userPermission?.ProformaInvoiceList, authPermissions ),
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
                title: 'IPI',
                icon: <Briefcase size={20} />,
                navLink: '/pis',
                // permission: navRoutePermission.ipi.list,
                hidden: isPermitNav( userPermission?.ProformaInvoiceList, authPermissions )
            }
        ]
    },
    {
        id: 'configuration',
        title: 'Configuration',
        icon: <GitCommit size={20} />,
        hidden: isPermitNav( userPermission?.BuyerList, authPermissions ) &&
            isPermitNav( userPermission?.BuyerAgentList, authPermissions ) &&
            isPermitNav( userPermission?.BuyerDepartmentList, authPermissions ) &&
            isPermitNav( userPermission?.ProductDeveloperList, authPermissions ),
        children: [
            {
                id: 'buyermanage',
                title: 'Buyer Management',
                icon: <UserPlus size={20} />,
                // permission: navRoutePermission.antonymous,
                hidden: isPermitNav( userPermission?.BuyerList, authPermissions ) &&
                    isPermitNav( userPermission?.BuyerAgentList, authPermissions ) &&
                    isPermitNav( userPermission?.BuyerDepartmentList, authPermissions ) &&
                    isPermitNav( userPermission?.ProductDeveloperList, authPermissions ),
                children: [
                    {
                        id: 'buyers',
                        title: 'Buyers',
                        icon: <UserCheck size={20} />,
                        navLink: '/buyers',
                        // permission: navRoutePermission.buyer.list,
                        hidden: isPermitNav( userPermission?.BuyerList, authPermissions )
                    },
                    {
                        id: 'buyeragents',
                        title: 'Buyer Agents',
                        icon: <UserCheck size={20} />,
                        navLink: '/buyer-agents',
                        // permission: navRoutePermission.buyerAgent.list,
                        hidden: isPermitNav( userPermission?.BuyerAgentList, authPermissions )
                    },
                    {
                        id: 'buyer-departments',
                        title: 'Buyer Department',
                        icon: <UserCheck size={20} />,
                        navLink: '/buyer-departments',
                        // permission: navRoutePermission.buyerDepartment.list,
                        hidden: isPermitNav( userPermission?.BuyerDepartmentList, authPermissions )
                    },

                    {
                        id: 'buyer-product-developers',
                        title: 'Buyer Product Developer',
                        icon: <UserCheck size={20} />,
                        navLink: '/buyer-product-developers',
                        // permission: navRoutePermission.buyerProductDeveloper.list,
                        hidden: isPermitNav( userPermission?.ProductDeveloperList, authPermissions )
                    }
                ]
            },

            {
                id: 'style-management',
                title: 'Style Management',
                icon: <PlusSquare size={20} />,
                // permission: navRoutePermission.antonymous,
                hidden: isPermitNav( userPermission?.StyleDivisionList, authPermissions ) &&
                    isPermitNav( userPermission?.StyleDivisionList, authPermissions ) &&
                    isPermitNav( userPermission?.ProductCategoryList, authPermissions ) &&
                    isPermitNav( userPermission?.StyleCategoryList, authPermissions ),

                children: [
                    {
                        id: 'division',
                        title: 'Style Division',
                        icon: <Plus size={20} />,
                        navLink: '/divisions',
                        // permission: navRoutePermission.styleDivision.list,
                        hidden: isPermitNav( userPermission?.StyleDivisionList, authPermissions )
                    },
                    {
                        id: 'department',
                        title: 'Style Department',
                        icon: <Plus size={20} />,
                        navLink: '/style-department',
                        // permission: navRoutePermission.styleDepartment.list,
                        hidden: isPermitNav( userPermission?.StyleDepartmentList, authPermissions )

                    },
                    {
                        id: 'product-category',
                        title: 'Product Category',
                        icon: <Plus size={20} />,
                        navLink: '/style-product-category',
                        // permission: navRoutePermission.styleProductCategory.list,
                        hidden: isPermitNav( userPermission?.ProductCategoryList, authPermissions )

                    },
                    {
                        id: 'style-category',
                        title: 'Style Category',
                        icon: <Plus size={20} />,
                        navLink: '/style-category',
                        // permission: navRoutePermission.styleCategory.list,
                        hidden: isPermitNav( userPermission?.StyleCategoryList, authPermissions )
                    }
                ]
            },
            {
                id: 'seasons',
                title: 'Seasons',
                icon: <Umbrella size={20} />,
                navLink: '/seasons',
                // permission: navRoutePermission.season.list,
                hidden: isPermitNav( userPermission?.SeasonList, authPermissions )
            },
            {
                id: 'currencies',
                title: 'Currency',
                icon: <DollarSign size={20} />,
                navLink: '/currencies',
                // permission: navRoutePermission.season.list,
                hidden: false
            },
            {
                id: 'destinations',
                title: 'Destination',
                icon: <MapPin size={20} />,
                navLink: '/destinations',
                // permission: navRoutePermission.season.list,
                hidden: false
            },


            {
                id: 'sizemanagement',
                title: 'Garments Size Management',
                icon: <Maximize size={20} />,
                hidden: isPermitNav( userPermission?.GarmentSizeList, authPermissions ) &&
                    isPermitNav( userPermission?.GarmentSizeGroupList, authPermissions ),
                children: [
                    {
                        id: 'sizes',
                        title: 'Sizes',
                        icon: <Maximize size={20} />,
                        navLink: '/sizes',
                        // permission: navRoutePermission.size.list,
                        hidden: isPermitNav( userPermission?.GarmentSizeList, authPermissions )
                    },
                    {
                        id: 'sizegroups',
                        title: 'Size Groups',
                        icon: <Maximize size={20} />,
                        navLink: '/size-groups',
                        // permission: navRoutePermission.sizeGroup.list,
                        hidden: isPermitNav( userPermission?.GarmentSizeGroupList, authPermissions )
                    }
                ]
            },
            {
                id: 'colors',
                title: 'Garments Colors',
                icon: <PenTool size={20} />,
                navLink: '/colors',
                // permission: navRoutePermission.color.list,
                hidden: isPermitNav( userPermission?.GarmentColorList, authPermissions )
            }

        ]
    }

];


export const handleGetMerchandisingNavigation = ( userPermission, authPermissions ) => {
    const merchandisingNav = [
        {
            id: 'operation',
            title: 'Operation',
            icon: <Framer size={20} />,
            hidden: isPermitNav( userPermission?.StyleList, authPermissions ) &&
                isPermitNav( userPermission?.BOMList, authPermissions ) &&
                isPermitNav( userPermission?.BudgetList, authPermissions ),

            children: [
                {
                    id: 'styles',
                    title: 'Styles',
                    icon: <PenTool size={20} />,
                    // permission: navRoutePermission.style.list,
                    hidden: isPermitNav( userPermission?.StyleList, authPermissions ),
                    children: [
                        {
                            id: 'singleStyle',
                            title: 'Single Style',
                            icon: <PenTool size={20} />,
                            navLink: '/single-styles',
                            // permission: navRoutePermission.style.list,
                            hidden: isPermitNav( userPermission?.StyleList, authPermissions )

                        }

                        // {
                        //     id: 'setStyle',
                        //     title: 'Set Style',
                        //     icon: <PenTool size={20} />,
                        //     navLink: '/set-styles',
                        //     // permission: navRoutePermission.style.list,
                        //     hidden: isPermitNav( userPermission?.StyleList, authPermissions )
                        // }
                    ]
                },

                {
                    id: 'bom',
                    title: 'BOM',
                    icon: <Paperclip size={20} />,
                    navLink: '/add-bom',
                    // permission: navRoutePermission.bom.list,
                    hidden: isPermitNav( userPermission?.BOMList, authPermissions )
                },
                {
                    id: 'budget',
                    title: 'Budgets',
                    icon: <Briefcase size={20} />,
                    navLink: '/budget',
                    // permission: navRoutePermission.budget.list,
                    hidden: isPermitNav( userPermission?.BudgetList, authPermissions )
                }
            ]
        },

        {
            id: 'packaging',
            title: 'Packaging',
            icon: <Box size={20} />,
            hidden: isPermitNav( userPermission?.PackagingList, authPermissions ),
            children: [
                {
                    id: 'singlePackaging',
                    title: 'Single Packaging',
                    icon: <Box size={20} />,
                    navLink: 'new-single-packaging',
                    // permission: navRoutePermission.packaging.list,
                    hidden: isPermitNav( userPermission?.PackagingList, authPermissions )
                },
                {
                    id: 'setPackaging',
                    title: 'Set Packaging',
                    icon: <Box size={20} />,
                    navLink: 'new-set-packaging',
                    // permission: navRoutePermission.packaging.list,
                    hidden: isPermitNav( userPermission?.PackagingList, authPermissions )
                }
            ]
        },
        {
            id: 'orderRequisition',
            title: 'Order Requisition',
            icon: <Briefcase size={20} />,
            hidden: isPermitNav( userPermission?.SupplierOrderList, authPermissions ) &&
                isPermitNav( userPermission?.ProformaInvoiceList, authPermissions ),
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
                    title: 'IPI',
                    icon: <Briefcase size={20} />,
                    navLink: '/pis',
                    // permission: navRoutePermission.ipi.list,
                    hidden: isPermitNav( userPermission?.ProformaInvoiceList, authPermissions )
                }
            ]
        },
        {
            id: 'configuration',
            title: 'Configuration',
            icon: <GitCommit size={20} />,
            hidden: isPermitNav( userPermission?.BuyerList, authPermissions ) &&
                isPermitNav( userPermission?.BuyerAgentList, authPermissions ) &&
                isPermitNav( userPermission?.BuyerDepartmentList, authPermissions ) &&
                isPermitNav( userPermission?.ProductDeveloperList, authPermissions ),
            children: [
                {
                    id: 'buyermanage',
                    title: 'Buyer Management',
                    icon: <UserPlus size={20} />,
                    // permission: navRoutePermission.antonymous,
                    hidden: isPermitNav( userPermission?.BuyerList, authPermissions ) &&
                        isPermitNav( userPermission?.BuyerAgentList, authPermissions ) &&
                        isPermitNav( userPermission?.BuyerDepartmentList, authPermissions ) &&
                        isPermitNav( userPermission?.ProductDeveloperList, authPermissions ),
                    children: [
                        {
                            id: 'buyers',
                            title: 'Buyers',
                            icon: <UserCheck size={20} />,
                            navLink: '/buyers',
                            // permission: navRoutePermission.buyer.list,
                            hidden: isPermitNav( userPermission?.BuyerList, authPermissions )
                        },
                        {
                            id: 'buyeragents',
                            title: 'Buyer Agents',
                            icon: <UserCheck size={20} />,
                            navLink: '/buyer-agents',
                            // permission: navRoutePermission.buyerAgent.list,
                            hidden: isPermitNav( userPermission?.BuyerAgentList, authPermissions )
                        },
                        {
                            id: 'buyer-departments',
                            title: 'Buyer Department',
                            icon: <UserCheck size={20} />,
                            navLink: '/buyer-departments',
                            // permission: navRoutePermission.buyerDepartment.list,
                            hidden: isPermitNav( userPermission?.BuyerDepartmentList, authPermissions )
                        },

                        {
                            id: 'buyer-product-developers',
                            title: 'Buyer Product Developer',
                            icon: <UserCheck size={20} />,
                            navLink: '/buyer-product-developers',
                            // permission: navRoutePermission.buyerProductDeveloper.list,
                            hidden: isPermitNav( userPermission?.ProductDeveloperList, authPermissions )
                        }
                    ]
                },

                {
                    id: 'style-management',
                    title: 'Style Management',
                    icon: <PlusSquare size={20} />,
                    // permission: navRoutePermission.antonymous,
                    hidden: isPermitNav( userPermission?.StyleDivisionList, authPermissions ) &&
                        isPermitNav( userPermission?.StyleDivisionList, authPermissions ) &&
                        isPermitNav( userPermission?.ProductCategoryList, authPermissions ) &&
                        isPermitNav( userPermission?.StyleCategoryList, authPermissions ),

                    children: [
                        {
                            id: 'division',
                            title: 'Style Division',
                            icon: <Plus size={20} />,
                            navLink: '/divisions',
                            // permission: navRoutePermission.styleDivision.list,
                            hidden: isPermitNav( userPermission?.StyleDivisionList, authPermissions )
                        },
                        {
                            id: 'department',
                            title: 'Style Department',
                            icon: <Plus size={20} />,
                            navLink: '/style-department',
                            // permission: navRoutePermission.styleDepartment.list,
                            hidden: isPermitNav( userPermission?.StyleDepartmentList, authPermissions )

                        },
                        {
                            id: 'product-category',
                            title: 'Product Category',
                            icon: <Plus size={20} />,
                            navLink: '/style-product-category',
                            // permission: navRoutePermission.styleProductCategory.list,
                            hidden: isPermitNav( userPermission?.ProductCategoryList, authPermissions )

                        },
                        {
                            id: 'style-category',
                            title: 'Style Category',
                            icon: <Plus size={20} />,
                            navLink: '/style-category',
                            // permission: navRoutePermission.styleCategory.list,
                            hidden: isPermitNav( userPermission?.StyleCategoryList, authPermissions )
                        }
                    ]
                },
                {
                    id: 'seasons',
                    title: 'Seasons',
                    icon: <Umbrella size={20} />,
                    navLink: '/seasons',
                    // permission: navRoutePermission.season.list,
                    hidden: isPermitNav( userPermission?.SeasonList, authPermissions )
                },
                {
                    id: 'currencies',
                    title: 'Currency',
                    icon: <DollarSign size={20} />,
                    navLink: '/currencies',
                    // permission: navRoutePermission.season.list,
                    hidden: false
                },
                {
                    id: 'destinations',
                    title: 'Destination',
                    icon: <MapPin size={20} />,
                    navLink: '/destinations',
                    // permission: navRoutePermission.season.list,
                    hidden: false
                },
                {
                    id: 'sampleAssignee',
                    title: 'Sample Assignee',
                    icon: <UserPlus size={20} />,
                    navLink: '/sample-assignee',
                    hidden: isPermitNav( userPermission?.SampleAssigneeList, authPermissions )
                },
                {
                    id: 'merchandiser',
                    title: 'Merchandiser',
                    icon: <UserPlus size={20} />,
                    navLink: '/merchandisers',
                    hidden: isPermitNav( userPermission?.MerchandiserList, authPermissions )
                },

                {
                    id: 'sizemanagement',
                    title: 'Garments Size Management',
                    icon: <Maximize size={20} />,
                    hidden: isPermitNav( userPermission?.GarmentSizeList, authPermissions ) &&
                        isPermitNav( userPermission?.GarmentSizeGroupList, authPermissions ),
                    children: [
                        {
                            id: 'sizes',
                            title: 'Sizes',
                            icon: <Maximize size={20} />,
                            navLink: '/sizes',
                            // permission: navRoutePermission.size.list,
                            hidden: isPermitNav( userPermission?.GarmentSizeList, authPermissions )
                        },
                        {
                            id: 'sizegroups',
                            title: 'Size Groups',
                            icon: <Maximize size={20} />,
                            navLink: '/size-groups',
                            // permission: navRoutePermission.sizeGroup.list,
                            hidden: isPermitNav( userPermission?.GarmentSizeGroupList, authPermissions )
                        }
                    ]
                },
                {
                    id: 'colors',
                    title: 'Garments Colors',
                    icon: <PenTool size={20} />,
                    navLink: '/colors',
                    // permission: navRoutePermission.color.list,
                    hidden: isPermitNav( userPermission?.GarmentColorList, authPermissions )
                }

            ]
        }

    ];
    const merchandisingNavWithReportNav = [...merchandisingNav, ...handleGetMerchandisingReports( userPermission, authPermissions )];
    return merchandisingNavWithReportNav;
};