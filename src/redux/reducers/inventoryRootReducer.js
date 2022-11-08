import { default as categories, default as itemGroups } from '@src/views/inventory/item-group/store/reducers';
import itemSegments from '@src/views/inventory/item-segment/store/reducers';
import itemSubGroups from '@src/views/inventory/item-sub-group/store/reducers';
import items from '@src/views/inventory/item/store/reducers';
import pis from '@src/views/inventory/proforma-invoice/store/reducers';
import segments from '@src/views/inventory/segment/store/reducers';
import unitSets from '@src/views/inventory/unit-sets/store/reducers';
import vendorGroups from '@src/views/inventory/vendor-group/store/reducers';
import vendors from '@src/views/inventory/vendor/store/reducers';
import warehouses from '@src/views/inventory/warehouse/store/reducers';
export const inventoryReducer =
{
    categories,
    segments,
    itemSegments,
    itemGroups,
    itemSubGroups,
    items,
    unitSets,
    warehouses,
    vendorGroups,
    vendors,
    pis
};
