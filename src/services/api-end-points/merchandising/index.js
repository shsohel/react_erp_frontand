export const merchandisingApi = {
    buyer: {
        root: `/api/merchandising/buyers`,
        get_buyers: `/api/buyers/get-all`,
        get_buyers_by_query: `/api/merchandising/buyers`,
        get_buyers_dropdown: `/api/merchandising/buyers`,
        get_buyer_by_id: `/api/merchandising/buyers`,
        get_buyer_specific_department_by_id: `/api/merchandising/buyers`,
        get_buyer_specific_agent_by_id: `/api/merchandising/buyers`,
        get_buyer_specific_product_developer_by_id: `/api/merchandising/buyers`,
        // get_buyer_by_id: `/api/buyer/get-by-id`,
        // add_buyer: `/userAccess/UserRegistrations`,
        add_buyer: `/api/merchandising/buyers`,
        add_buyer_specific_agent: `/api/merchandising/buyers`,
        add_buyer_specific_product_developer: `/api/merchandising/buyers`,
        update_buyer: `/api/merchandising/buyers`,
        // update_buyer: `/api/buyer/update`,
        delete_buyer: `/api/buyer/delete`,
        delete_buyer_by_range: `/api/buyer/delete-range`
    },
    status: {
        root: `/api/merchandising/statues`,
        get_statuses: `/api/statuses/get-all`,
        get_statuses_by_query: `/api/merchandising/statues`,
        get_statuses_dropdown: `/api/merchandising/statues`,

        get_status_by_id: `/api/merchandising/statues`,
        add_status: `/api/merchandising/statues`,
        update_status: `/api/merchandising/statues`,
        get_status_types: `/api/merchandising/statues/types`,
        delete_status: `/api/status/delete`,
        delete_status_by_range: `/api/status/delete-range`
    },
    buyerAgent: {
        root: `/api/merchandising/agents`,
        get_buyer_agents: `/api/get_buyer_agents/get-all`,
        get_buyer_agents_by_query: `/api/merchandising/agents`,
        get_buyer_agents_dropdown: `/api/merchandising/agents`,
        get_buyer_agents_cascade_dropdown: `/api/merchandising/buyers`,
        get_buyer_agent_by_id: `/api/merchandising/agents`,
        // get_buyer_agent_by_id: `/api/buyer_agent/get-by-id`,
        add_buyer_agent: `/api/merchandising/agents`,
        update_buyer_agent: `/api/merchandising/agents`,
        // update_buyer_agent: `/api/buyer_agent/update`,
        delete_buyer_agent: `/api/buyer_agent/delete`,
        delete_buyer_agent_by_range: `/api/buyer_agent/delete-range`
    },
    sampleAssignee: {
        root: `/api/merchandising/sampleAssignees`,
        get_sample_assignees: `/api/get_sample_assignees/get-all`,
        get_sample_assignees_by_query: `/api/sample_assignees/get-by-query`,
        get_sample_assignee_by_id: `/api/sample_assignee/get-by-id`,
        add_sample_assignee: `/api/sample_assignee/add`,
        update_sample_assignee: `/api/sample_assignee/update`,
        delete_sample_assignee: `/api/sample_assignee/delete`,
        delete_sample_assignee_by_range: `/api/sample_assignee/delete-range`
    },
    buyerDepartment: {
        root: `/api/merchandising/buyerDepartments`,
        get_buyer_departments: `/api/buyer_departments/get-all`,
        get_buyer_departments_by_query: `/api/merchandising/buyerDepartments`,
        get_buyer_departments_dropdown: `/api/merchandising/buyerDepartments`,
        get_buyers_departments_cascade_dropdown: `/api/merchandising/buyers`,

        // get_buyer_departments_by_query: `/api/buyer_departments/get-by-query`,
        get_buyer_department_by_id: `/api/merchandising/buyerDepartments`,
        // get_buyer_department_by_id: `/api/buyer_department/get-by-id`,
        add_buyer_department: `/api/merchandising/buyerDepartments`,
        // add_buyer_department: `/api/buyer_department/add`,
        update_buyer_department: `/api/merchandising/buyerDepartments`,
        // update_buyer_department: `/api/buyer_department/update`,
        delete_buyer_department: `/api/buyer_department/delete`,
        delete_buyer_department_by_range: `/api/buyer_department/delete-range`
    },
    productDeveloper: {
        root: `/api/merchandising/buyerProductDevelopers`,
        get_product_developers: `/api/get_product_developers/get-all`,
        get_product_developers_by_query: `/api/merchandising/buyerProductDevelopers`,
        get_product_developers_dropdown: `/api/merchandising/buyerProductDevelopers`,
        get_product_developers_cascade_dropdown: `/api/merchandising/buyers`,

        // get_product_developers_by_query: `/api/product_developers/get-by-query`,
        get_product_developer_by_id: `/api/merchandising/buyerProductDevelopers`,
        // get_product_developer_by_id: `/api/product_developer/get-by-id`,
        add_product_developer: `/api/merchandising/buyerProductDevelopers`,
        // add_product_developer: `/api/product_developer/add`,
        update_product_developer: `/api/merchandising/buyerProductDevelopers`,
        // update_product_developer: `/api/product_developer/update`,
        delete_product_developer: `/api/product_developer/delete`,
        delete_product_developer_by_range: `/api/product_developer/delete-range`
    },
    color: {
        root: `/api/merchandising/colors`,
        get_colors: `/api/colors/get-all`,
        get_colors_by_query: `/api/merchandising/colors`,
        get_colors_dropdown: `/api/merchandising/colors`,

        // get_colors_by_query: `/api/colors/get-by-query`,
        get_color_by_id: `/api/merchandising/colors`,
        // get_color_by_id: `/api/color/get-by-id`,
        add_color: `/api/merchandising/colors`,
        // add_color: `/api/color/add`,
        update_color: `/api/merchandising/colors`,
        // update_color: `/api/colors/update`,
        delete_color: `/api/color/delete`,
        delete_color_by_range: `/api/color/delete-range`
    },
    currencyConfigurations: {
        root: `/api/merchandising/currencyConfigurations`
    },
    destination: {
        root: `/api/merchandising/destinations`
    },

    department: {
        root: `/api/merchandising/styles/styleDepartments`,
        get_departments: `/api/departments/get-all`,
        get_departments_by_query: `/api/merchandising/styles/styleDepartments`,
        // get_departments_by_query: `/api/departments/get-by-query`,
        get_departments_dropdown: `/api/merchandising/styles/styleDepartments`,
        get_style_departments_cascade_dropdown: `/api/merchandising/styles/styleDivisions`,

        get_department_by_id: `/api/merchandising/styles/styleDepartments`,
        // get_department_by_id: `/api/department/get-by-id`,
        add_department: `/api/merchandising/styles/styleDepartments`,
        // add_department: `/api/department/add`,
        // /api/merchandising/styles/styleDepartments/{id}
        update_department: `/api/merchandising/styles/styleDepartments`,
        // update_department: `/api/department/update`,
        delete_department: `/api/department/delete`,
        delete_product_category_from_style_department: `/api/merchandising/styles/styleDepartments`,
        delete_department_by_range: `/api/department/delete-range`
    },
    division: {
        root: `/api/merchandising/styles/styleDivisions`,
        get_divisions: `/api/divisions/get-all`,
        get_divisions_by_query: `/api/merchandising/styles/styleDivisions`,
        get_divisions_dropdown: `/api/merchandising/styles/styleDivisions`,
        get_style_divisions_cascade_dropdown: `/api/merchandising/styles/styleDivisions`,

        // get_divisions_by_query: `/api/divisions/get-by-query`,
        get_division_by_id: `/api/merchandising/styles/styleDivisions`,
        // get_division_by_id: `/api/division/get-by-id`,
        add_division: `/api/merchandising/styles/styleDivisions`,
        // add_division: `/api/division/add`,
        // /api/merchandising/styles/styleDivisions/{id}
        update_division: `/api/merchandising/styles/styleDivisions`,
        // update_division: `/api/division/update`,
        delete_division: `/api/division/delete`,
        delete_style_department_from_division: `/api/merchandising/styles/styleDivisions`,
        delete_division_by_range: `/api/division/delete-range`
    },
    merchandiser: {
        root: `/api/merchandising/merchandisers`,
        get_merchandisers: `/api/get_merchandisers/get-all`,
        get_merchandisers_by_query: `/api/merchandising/merchandisers`,
        // get_merchandisers_by_query: `/api/merchandisers/get-by-query`,
        get_merchandiser_by_id: `/api/merchandiser/get-by-id`,
        add_merchandiser: `/api/merchandising/merchandisers`,
        // add_merchandiser: `/api/merchandiser/add`,
        update_merchandiser: `/api/merchandiser/update`,
        delete_merchandiser: `/api/merchandiser/delete`,
        delete_merchandiser_by_range: `/api/merchandiser/delete-range`
    },
    preCosting: {
        root: '/preCostings',
        get_pre_costings: `/api/get_pre_costings/get-all`,
        get_pre_costings_by_query: `/api/pre_costing/get-by-query`,
        get_pre_costing_by_id: `/api/pre_costing/get-by-id`,
        add_pre_costing: `/api/pre_costing/add`,
        update_pre_costing: `/api/pre_costing/update`,
        delete_pre_costing: `/api/pre_costing/delete`,
        delete_pre_costing_by_range: `/api/pre_costing/delete-range`
    },
    costing: {
        root: `/api/merchandising/costings`
    },
    consumption: {
        root: `/api/merchandising/consumptions`,
        get_consumptions: `/api/get-consumptions/get-all`,
        get_consumptions_by_query: `/api/consumptions/get-consumption-by-query`,
        get_consumption_by_id: `/api/consumptions/get-consumption-by-id`,
        add_consumption: `/api/consumptions/add`,
        update_consumption: `/api/consumptions/update`,
        delete_consumption: `/api/consumptions/delete`,
        delete_consumption_by_range: `/api/consumptions/delete-range`
    },
    season: {
        root: `/api/merchandising/seasons`,
        get_seasons: `/api/seasons/get-all`,
        get_seasons_by_query: `/api/merchandising/seasons`,
        get_seasons_dropdown: `/api/merchandising/seasons`,
        // get_seasons_by_query: `/api/seasons/get-by-query`,
        get_season_by_id: `/api/merchandising/seasons`,
        add_season: `/api/merchandising/seasons`,
        // add_season: `/api/season/add`,
        update_season: `/api/merchandising/seasons`,
        // update_season: `/api/season/update`,
        delete_season: `/api/season/delete`,
        delete_season_by_range: `/api/season/delete-range`
    },
    costingGroup: {
        root: `/api/merchandising/costingGroups`,
        get_costing_groups: `/api/costing-groups/get-all`,
        get_costing_groups_by_query: `/api/merchandising/costingGroups`,
        // get_costing_groups_by_query: `/api/costing-groups/get-by-query`,
        get_costing_group_by_id: `/api/costing-group/get-by-id`,
        add_costing_group: `/api/costing-group/add`,
        update_costing_group: `/api/costing-group/update`,
        delete_costing_group: `/api/costing-group/delete`,
        delete_costing_groups_by_range: `/api/costing-groups/delete-range`
    },

    size: {
        root: `/api/merchandising/sizes`,
        get_sizes: `/api/sizes/get-all`,
        get_sizes_by_query: `/api/merchandising/sizes`,
        // get_sizes_by_query: `/api/sizes/get-by-query`,
        get_size_by_id: `/api/merchandising/sizes`,
        get_size_for_dropdown: '/api/merchandising/sizes',
        // get_size_by_id: `/api/size/get-by-id`,
        add_size: `/api/merchandising/sizes`,
        // add_size: `/api/size/add`,
        update_size: `/api/merchandising/sizes`,
        // update_size: `/api/size/update`,
        delete_size: `/api/size/delete`,
        delete_size_by_range: `/api/size/delete-range`
    },
    sizeGroup: {
        root: `/api/merchandising/sizeGroups`,
        get_size_groups: `/api/size_groups/get-all`,
        get_size_groups_by_query: `/api/merchandising/sizeGroups`,
        get_size_groups_for_dropdown: '/api/merchandising/sizeGroups',

        // get_size_groups_by_query: `/api/size_groups/get-by-query`,
        get_size_group_by_id: `/api/merchandising/sizeGroups`,
        // get_size_group_by_id: `/api/size_group/get-by-id`,
        add_size_group: `/api/merchandising/sizeGroups`,
        // add_size_group: `/api/size_group/add`,
        update_size_group: `/api/merchandising/sizeGroups`,
        // update_size_group: `/api/size_group/update`,
        delete_size_group: `/api/size_group/delete`,
        delete_size_group_by_range: `/api/size_group/delete-range`
    },
    styleCategory: {
        root: `/api/merchandising/styles/styleCategories`,
        get_style_categories: `/api/get_style_categories/get-all`,
        get_style_categories_by_query: `/api/merchandising/styles/styleCategories`,
        get_style_categories_cascade_dropdown: `/api/merchandising/styles/productCategories`,
        get_style_categories_dropdown: `/api/merchandising/styles/styleCategories`,
        // get_style_categories_by_query: `/api/style_categories/get-by-query`,
        get_style_category_by_id: `/api/merchandising/styles/styleCategories`,
        // get_style_category_by_id: `/api/style_category/get-by-id`,
        add_style_category: `/api/merchandising/styles/styleCategories`,
        // add_style_category: `/api/style_category/add`,
        update_style_category: `/api/merchandising/styles/styleCategories`,
        // update_style_category: `/api/style_category/update`,
        delete_style_category: `/api/style_category/delete`,
        delete_style_category_by_range: `/api/style_category/delete-range`

    },
    productCategory: {
        root: `/api/merchandising/styles/productCategories`,
        get_product_categories: `/api/get_product_categories/get-all`,
        get_product_categories_by_query: `/api/merchandising/styles/productCategories`,
        // get_product_categories_by_query: `/api/product_categories/get-by-query`,
        get_product_categories_dropdown: `/api/merchandising/styles/productCategories`,
        get_product_categories_cascade_dropdown: `/api/merchandising/styles/styleDepartments`,

        get_product_category_by_id: `/api/merchandising/styles/productCategories`,
        // get_product_category_by_id: `/api/product_category/get-by-id`,
        add_product_category: `/api/merchandising/styles/productCategories`,
        // add_product_category: `/api/product_category/add`,
        update_product_category: `/api/merchandising/styles/productCategories`,
        // update_product_category: `/api/product_category/update`,
        delete_product_category: `/api/product_category/delete`,
        delete_style_category_from_product_category: `/api/merchandising/styles/productCategories`,
        delete_product_category_by_range: `/api/product_category/delete-range`
    },

    module: {
        get_modules: `/api/modules/get-all`,
        get_modules_by_query: `/api/modules/get-by-query`,
        get_module_by_id: `/api/module/get-by-id`,
        add_module: `/api/module/add`,
        update_module: `/api/module/update`,
        delete_module: `/api/module/delete`,
        delete_modules_by_range: `/api/module/delete-range`
    },
    bom: {
        root: '/api/merchandising/boms',
        get_boms: `/api/boms/get-all`,
        get_boms_by_query: `/api/boms/get-boms-by-query`,
        get_bom_by_id: `/api/bom/get-bom-by-id`,
        add_bom: `/api/bom/add`,
        update_bom: `/api/bom/update`,
        delete_bom: `/api/bom/delete`,
        delete_boms_by_range: `/api/bom/delete-range`
    },
    budget: {
        root: `/api/merchandising/budgets`,
        get_budgets: `/api/budgets/get-all`,
        get_budgets_by_query: `/api/budgets/get-budgets-by-query`,
        get_budget_by_id: `/api/budget/get-budget-by-id`,
        add_budget: `/api/budget/add`,
        update_budget: `/api/budget/update`,
        delete_budget: `/api/budget/delete`,
        delete_budgets_by_range: `/api/budget/delete-range`
    },
    user: {
        get_users: `/api/users/get-all`,
        get_users_by_query: `/api/users/get-by-query`,
        get_user_by_id: `/api/user/get-by-id`,
        add_user: `/api/user/add`,
        update_user: `/api/user/update`,
        delete_user: `/api/user/delete`,
        delete_users_by_range: `/api/user/delete-range`
    },
    role: {
        get_roles: `/api/roles/get-all`,
        get_roles_by_query: `/api/roles/get-by-query`,
        get_role_by_id: `/api/role/get-by-id`,
        add_role: `/api/role/add`,
        update_role: `/api/role/update`,
        delete_role: `/api/role/delete`,
        delete_roles_by_range: `/api/role/delete-range`
    },
    setStyle: {
        root: `/api/merchandising/setStyles`,
        get_setStyles: `/api/set-styles/get-all`,
        get_setStyles_by_query: `/api/merchandising/setStyles`,
        // get_setStyle_by_id: `/api/set-style/get-by-id`,
        get_setStyle_by_id: `/api/merchandising/setStyles`,
        add_setStyle: `/api/merchandising/setStyles`,
        // add_setStyle: `/api/set-style/add`,
        update_setStyle: `/api/set-style/update`,
        delete_setStyle: `/api/set-style/delete`,
        delete_setStyles_by_range: `/api/set-style/delete-range`
    },
    style: {
        root: `/api/merchandising/styles`,
        get_styles: `/api/merchandising/styles`,
        get_styles_by_query: `/api/merchandising/styles`,
        get_style_by_id: `/api/merchandising/styles`,
        add_style: `/api/merchandising/styles`,
        // add_style: `/api/style/add`,
        update_style: `/api/style/update`,
        delete_style: `/api/style/delete`,
        delete_styles_by_range: `/api/style/delete-range`,
        delete_styles_file: `/api/style/delete-range`,
        get_style_colors: `/api/merchandising/styles`,
        get_style_sizes: `/api/merchandising/styles`,
        get_style_sizeGroups: `/api/merchandising/styles`
    },
    purchaseOrder: {
        root: `/api/merchandising/purchaseOrders`
    },
    packaging: {
        root: '/api/merchandising/packagings',
        setRoot: `/api/merchandising/setPackagings`
    },
    procurement: {
        root: `/api/inventory/supplierOrders`
    },
    media: {
        imageUpload: `/api/merchandising/medias/upload/image`,
        fileUpload: `/api/merchandising/medias/upload/file`
    }
};
