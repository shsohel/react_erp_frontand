export const inventoryApi = {
    itemGroup: {
        root: `/api/inventory/categories`,
        get_item_group: `/api/item_group/get-all`,
        get_item_group_by_query: `/api/item_group/get-by-query`,
        get_item_group_by_id: `/api/item_group/get-by-id`,
        add_item_group: `/api/item_group/add`,
        update_item_group: `/api/item_group/update`,
        delete_item_group: `/api/item_group/delete`,
        delete_item_group_by_range: `/api/item_group/delete-range`
    },

    itemSubGroup: {
        root: `/api/inventory/categories`,
        get_item_sub_groups: `/api/item-sub-groups/get-all`,
        get_item_sub_groups_by_query: `/api/item-sub-groups/get-by-query`,
        get_item_sub_group_by_id: `/api/item-sub-group/get-by-id`,
        add_item_sub_group: `/api/item-sub-group/add`,
        update_item_sub_group: `/api/item-sub-group/update`,
        delete_item_sub_group: `/api/item-sub-group/delete`,
        delete_item_sub_group_by_range: `/api/item-sub-group/delete-range`
    },
    segment: {
        root: `/api/inventory/segments`,
        get_segment: `/api/segment/get-all`,
        get_segment_by_query: `/api/inventory/segments`,
        // get_segment_by_query: `/api/segment/get-by-query`,
        get_segment_by_id: `/api/segment/get-by-id`,
        add_segment: `/api/segment/add`,
        update_segment: `/api/segment/update`,
        delete_segment: `/api/segment/delete`,
        delete_segment_by_range: `/api/segment/delete-range`
    },
    item: {
        root: `/api/inventory/items`
    },
    unitSet: {
        root: `/api/inventory/uomSets`
    },
    warehouse: {
        root: `/api/inventory/warehouses`
    },
    vendor: {
        root: `/api/inventory/vendors`
    },
    vendorGroup: {
        root: `/api/inventory/vendors/groups`
    },
    purchaseRequisition: {
        root: `/api/inventory/supplierOrders`
    },
    pi: {
        root: `/api/inventory/supplierProformaInvoices`
    }
};