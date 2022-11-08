/* eslint-disable space-in-parens */


import boms from '@src/views/merchandising/bom/store/reducers';
import budgets from '@src/views/merchandising/budget/store/reducers';
import buyerAgents from '@src/views/merchandising/buyer-agent/store/reducers';
import buyerDepartments from '@src/views/merchandising/buyer-department/store/reducers';
import productDevelopers from '@src/views/merchandising/buyer-product-developer/store/reducers';
import buyers from '@src/views/merchandising/buyer/store/reducers';
import colors from '@src/views/merchandising/color/store/reducers';
import consumptions from '@src/views/merchandising/consumption/store/reducers';
import costingGroups from '@src/views/merchandising/costing-groups/store/reducers';
import costings from '@src/views/merchandising/costing/store/reducers';
import currencies from '@src/views/merchandising/currency/store/reducers';
import destinations from '@src/views/merchandising/destination/store/reducers';
import merchandisers from '@src/views/merchandising/merchandiser/store/reducers';
import packaging from '@src/views/merchandising/packaging/store/reducers';
import preCostings from '@src/views/merchandising/pre-costing/store/reducers';
import procurements from '@src/views/merchandising/procurement/store/reducers';
import purchaseOrders from '@src/views/merchandising/purchase-order/store/reducers';
import sampleAssignees from '@src/views/merchandising/sample-assignee/store/reducers';
import seasons from '@src/views/merchandising/season/store/reducers';
import sizeGroups from '@src/views/merchandising/size-group/store/reducers';
import sizes from '@src/views/merchandising/size/store/reducers';
import statuses from '@src/views/merchandising/status/store/reducers';
import styleCategories from '@src/views/merchandising/style-master/style-category/store/reducers';
import departments from '@src/views/merchandising/style-master/style-department/store/reducers';
import divisions from '@src/views/merchandising/style-master/style-division/store/reducers';
import productCategories from '@src/views/merchandising/style-master/style-product-category/store/reducers';
import setStyles from '@src/views/merchandising/style/set-style/store/reducers';
import styles from '@src/views/merchandising/style/single-style/store/reducers';
export const merchandisingReducer = {
    currencies,
    buyers,
    styles,
    setStyles,
    purchaseOrders,
    buyerAgents,
    merchandisers,
    divisions,
    seasons,
    sizes,
    sizeGroups,
    preCostings,
    costings,
    colors,
    departments,
    styleCategories,
    productCategories,
    sampleAssignees,
    productDevelopers,
    buyerDepartments,
    statuses,
    packaging,
    costingGroups,
    consumptions,
    boms,
    budgets,
    procurements,
    destinations
};
