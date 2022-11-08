import { procurementBasicInfoModel } from '../../model';
import { BIND_ITEM_DETAILS_WITH_MIN_ORDER, BIND_PROCUREMENT_BASIC_INFO, BIND_PROCUREMENT_ITEMS, BIND_SELECTED_ITEMS_FOR_PROCUREMENT, CLEAR_PROCUREMENT_ALL_STATE, GET_PROCUREMENTS_BY_QUERY, GET_PROCUREMENT_BY_ID, GET_PROCUREMENT_DROP_DOWN, IS_PROCUREMENT_DATA_LOADED } from '../action-types';

const initialState = {
  isProcurementDataLoaded: true,
  procurements: [],
  queryData: [],
  queryObj: [],
  total: 1,
  params: {},
  selectedProcurementSelectedItems: [],
  itemDetailsWithMinOder: [],
  procurementItems: [],
  procurementBasicInfo: procurementBasicInfoModel,
  procurementDropdown: []
};

const procurementReduces = ( state = initialState, action ) => {
  switch ( action.type ) {
    case GET_PROCUREMENTS_BY_QUERY:
      return {
        ...state,
        queryData: action.procurements,
        total: action.totalPages,
        params: action.params,
        queryObj: action.queryObj
      };
    case GET_PROCUREMENT_BY_ID:
      return {
        ...state,
        procurementBasicInfo: action.procurementBasicInfo,
        selectedProcurementSelectedItems: action.selectedProcurementSelectedItems,
        procurementItems: action.procurementItems
      };
    case BIND_SELECTED_ITEMS_FOR_PROCUREMENT:
      return {
        ...state,
        selectedProcurementSelectedItems: action.selectedProcurementSelectedItems
      };
    case BIND_PROCUREMENT_ITEMS:
      return {
        ...state,
        procurementItems: action.procurementItems
      };
    case BIND_ITEM_DETAILS_WITH_MIN_ORDER:
      return {
        ...state,
        itemDetailsWithMinOder: action.itemDetailsWithMinOder
      };
    case IS_PROCUREMENT_DATA_LOADED:
      return {
        ...state,
        isProcurementDataLoaded: action.isProcurementDataLoaded
      };
    case BIND_PROCUREMENT_BASIC_INFO:
      return {
        ...state,
        procurementBasicInfo: action.procurementBasicInfo
      };
    case GET_PROCUREMENT_DROP_DOWN:
      return {
        ...state,
        procurementDropdown: action.procurementDropdown
      };
    case CLEAR_PROCUREMENT_ALL_STATE:
      return {
        ...state,
        isProcurementDataLoaded: true,
        procurements: [],
        queryData: [],
        total: 1,
        params: {},
        selectedProcurementSelectedItems: [],
        itemDetailsWithMinOder: [],
        procurementItems: [],
        procurementBasicInfo: procurementBasicInfoModel
      };

    default:
      return state;
  }

};
export default procurementReduces;
