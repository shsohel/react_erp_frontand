import { budgetBasicModel, serviceCostSummaryModel } from "../../models";
import { ADD_BUDGET, BIND_BUDGET_BASIC_INFO, BIND_SERVICE_COST_SUMMARY, BUYERS_PO_DETAILS_FOR_BUDGET, CLEAN_ALL_BUDGET_STATES, DELETE_BUDGET, DELETE_BUDGET_ORDER, GET_BUDGETS_BY_BUYER_ID, GET_BUDGETS_BY_QUERY, GET_BUDGET_BUYER_PO_BY_BUYER_ID, GET_BUDGET_BY_ID, GET_BUDGET_DERAILS, GET_BUDGET_DERAILS_BY_GROUP_TYPE, GET_BUDGET_DROPDOWN, IS_BUDGET_DATA_LOADED } from "../action-types";

const initialState = {
    isBudgetDataLoaded: true,
    budgets: [],
    queryData: [],
    queryObj: [],
    total: 1,
    params: {},
    selectedBudget: [],
    buyerPODetails: [],
    budgetBasicInfo: budgetBasicModel,
    budgetCostingAndBomSummary: [],
    budgetCostingAndBomSummaryDetails: [],
    budgetPurchaseOrderQuantityDetails: [],
    buyerBudgetsDropdown: [],
    buyerBudgerPurchaseOrder: [],
    buyerBudgetItemDetails: [],
    serviceCostSummary: serviceCostSummaryModel,
    budgetsDropdown: []
};

const budgetReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_BUDGET_BY_ID:
            return {
                ...state,
                budgetBasicInfo: action.budgetBasicInfo,
                budgetCostingAndBomSummary: action.budgetCostingAndBomSummary,
                budgetCostingAndBomSummaryDetails: action.budgetCostingAndBomSummaryDetails,
                budgetPurchaseOrderQuantityDetails: action.budgetPurchaseOrderQuantityDetails,
                serviceCostSummary: action.serviceCostSummary
            };
        case BUYERS_PO_DETAILS_FOR_BUDGET:
            return {
                ...state,
                buyerPODetails: action.buyerPODetails
            };

        case GET_BUDGETS_BY_BUYER_ID:
            return {
                ...state,
                buyerBudgetsDropdown: action.buyerBudgetsDropdown
            };

        case GET_BUDGET_DROPDOWN:
            return {
                ...state,
                budgetsDropdown: action.budgetsDropdown
            };

        case BIND_SERVICE_COST_SUMMARY:
            return {
                ...state,
                serviceCostSummary: action.serviceCostSummary
            };

        case BIND_BUDGET_BASIC_INFO:
            return {
                ...state,
                budgetBasicInfo: action.budgetBasicInfo
            };
        case GET_BUDGET_DERAILS_BY_GROUP_TYPE:
            return {
                ...state,
                budgetCostingAndBomSummaryDetails: action.budgetCostingAndBomSummaryDetails
            };

        case GET_BUDGET_BUYER_PO_BY_BUYER_ID:
            return {
                ...state,
                buyerBudgerPurchaseOrder: action.buyerBudgerPurchaseOrder,
                buyerBudgetItemDetails: action.buyerBudgetItemDetails
            };
        case GET_BUDGET_DERAILS:
            return {
                ...state,
                budgetBasicInfo: action.budgetBasicInfo,
                budgetCostingAndBomSummary: action.budgetCostingAndBomSummary,
                budgetCostingAndBomSummaryDetails: action.budgetCostingAndBomSummaryDetails,
                budgetPurchaseOrderQuantityDetails: action.budgetPurchaseOrderQuantityDetails,
                serviceCostSummary: action.serviceCostSummary
            };
        case GET_BUDGETS_BY_QUERY:
            return {
                ...state,
                queryData: action.budgets,
                total: action.totalPages,
                params: action.params,
                queryObj: action.queryObj
            };
        case DELETE_BUDGET:
            return { ...state };
        case DELETE_BUDGET_ORDER:
            return { ...state, budgetPurchaseOrderQuantityDetails: action.budgetPurchaseOrderQuantityDetails };
        case ADD_BUDGET:
            return { ...state };
        case IS_BUDGET_DATA_LOADED:
            return { ...state, isBudgetDataLoaded: action.isBudgetDataLoaded };
        case CLEAN_ALL_BUDGET_STATES:
            return {
                ...state,
                isBudgetDataLoaded: true,
                budgets: [],
                queryData: [],
                total: 1,
                params: {},
                selectedBudget: [],
                buyerPODetails: [],
                budgetBasicInfo: budgetBasicModel,
                budgetCostingAndBomSummary: [],
                budgetCostingAndBomSummaryDetails: [],
                budgetPurchaseOrderQuantityDetails: [],
                buyerBudgetsDropdown: [],
                buyerBudgerPurchaseOrder: [],
                buyerBudgetItemDetails: [],
                serviceCostSummary: serviceCostSummaryModel,
                budgetsDropdown: []
            };
        default:
            return state;
    }
};
export default budgetReduces;