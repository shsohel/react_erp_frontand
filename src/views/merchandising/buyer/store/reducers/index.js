import { buyerBasicModel } from '../../models';
import { ADD_BUYER, BIND_BUYER_BASIC_INFO, BUYER_IMAGE_UPLOAD_LOADING, BUYER_STYLE_DROPDOWN, CLEAR_ALL_BUYER_STATE, DELETE_BUYER, DELETE_BUYERS_BY_RANGE, DROP_DOWN_BUYERS, GET_BUYERS, GET_BUYERS_BY_QUERY, GET_BUYER_AGENT_BY_BUYER_ID, GET_BUYER_BY_ID, GET_BUYER_COLOR_BY_BUYER_ID, GET_BUYER_DEPARTMENT_BY_BUYER_ID, GET_BUYER_DROPDOWN_COLOR_BY_BUYER_ID, GET_BUYER_DROPDOWN_SIZE_GROUPS_BY_BUYER_ID, GET_BUYER_PRODUCT_DEVELOPER_BY_BUYER_ID, GET_BUYER_SIZE_GROUPS_BY_BUYER_ID, IS_ASSIGN_AGENT, IS_ASSIGN_PRODUCT_DEVELOPER, IS_BUYER_DATA_LOADED, IS_BUYER_DATA_ON_PROGRESS, IS_BUYER_DATA_SUBMIT_PROGRESS, OPEN_BUYER_SIDEBER, SELECTED_BUYER_NULL, UPDATE_BUYER } from '../actionTypes';

// export const IS_BUYER_DATA_ON_PROGRESS = "IS_BUYER_DATA_ON_PROGRESS";
// export const IS_BUYER_DATA_SUBMIT_PROGRESS = "IS_BUYER_DATA_SUBMIT_PROGRESS";

const initialState = {
  isBuyerDataLoaded: true,
  isBuyerDataOnProgress: false,
  isBuyerDataSubmitProgress: false,
  buyers: [],
  queryData: [],
  total: 1,
  params: {},
  selectedBuyer: null,
  openBuyerSidebar: false,
  dropDownBuyers: [],
  isBuyerDropdownLoaded: true,
  assignAgentOpen: null,
  assignProductDeveloperOpen: null,
  buyerAgentsByBuyerId: [],
  buyerProductDeveloperByBuyerId: [],
  buyerSizeGroups: [],
  buyerColors: [],
  buyerDepartmentByBuyerId: [],
  buyerStylesDropdown: [],
  isBuyerStylesDropdownLoaded: true,
  buyerBasicInfo: buyerBasicModel,
  isImageUploading: false,

  dropdownBuyerColors: [],
  isDropdownBuyerColorsLoaded: true,
  dropdownBuyerSizeGroups: [],
  isDropdownBuyerSizeGroupsLoaded: true
};

const buyerReduces = ( state = initialState, action ) => {
  switch ( action.type ) {

    case IS_BUYER_DATA_LOADED:
      return { ...state, isBuyerDataLoaded: action.isBuyerDataLoaded };
    case IS_BUYER_DATA_ON_PROGRESS:
      return { ...state, isBuyerDataOnProgress: action.isBuyerDataOnProgress };

    case IS_BUYER_DATA_SUBMIT_PROGRESS:
      return { ...state, isBuyerDataSubmitProgress: action.isBuyerDataSubmitProgress };

    case DROP_DOWN_BUYERS:
      return {
        ...state,
        dropDownBuyers: action.dropDownBuyers,
        isBuyerDropdownLoaded: action.isBuyerDropdownLoaded
      };

    case BUYER_STYLE_DROPDOWN:
      return {
        ...state,
        buyerStylesDropdown: action.buyerStylesDropdown,
        isBuyerStylesDropdownLoaded: action.isBuyerStylesDropdownLoaded
      };

    case GET_BUYERS:
      return { ...state, buyers: action.buyers };

    case GET_BUYER_BY_ID:
      return { ...state, buyerBasicInfo: action.buyerBasicInfo };

    case BIND_BUYER_BASIC_INFO:
      return { ...state, buyerBasicInfo: action.buyerBasicInfo };

    case GET_BUYER_DEPARTMENT_BY_BUYER_ID:
      return { ...state, buyerDepartmentByBuyerId: action.buyerDepartmentByBuyerId };

    case GET_BUYER_AGENT_BY_BUYER_ID:
      return { ...state, buyerAgentsByBuyerId: action.buyerAgentsByBuyerId };

    case GET_BUYER_PRODUCT_DEVELOPER_BY_BUYER_ID:
      return { ...state, buyerProductDeveloperByBuyerId: action.buyerProductDeveloperByBuyerId };

    case GET_BUYER_SIZE_GROUPS_BY_BUYER_ID:
      return { ...state, buyerSizeGroups: action.buyerSizeGroups };

    case GET_BUYER_COLOR_BY_BUYER_ID:
      return { ...state, buyerColors: action.buyerColors };

    case GET_BUYER_DROPDOWN_COLOR_BY_BUYER_ID:
      return {
        ...state,
        dropdownBuyerColors: action.dropdownBuyerColors,
        isDropdownBuyerColorsLoaded: action.isDropdownBuyerColorsLoaded
      };

    case GET_BUYER_DROPDOWN_SIZE_GROUPS_BY_BUYER_ID:
      return {
        ...state,
        dropdownBuyerSizeGroups: action.dropdownBuyerSizeGroups,
        isDropdownBuyerSizeGroupsLoaded: action.isDropdownBuyerSizeGroupsLoaded
      };

    case SELECTED_BUYER_NULL:
      return { ...state, selectedBuyer: action.selectedBuyer };

    case OPEN_BUYER_SIDEBER:
      return { ...state, openBuyerSidebar: action.openBuyerSidebar };

    case IS_ASSIGN_AGENT:
      return { ...state, assignAgentOpen: action.assignAgentOpen };

    case IS_ASSIGN_PRODUCT_DEVELOPER:
      return { ...state, assignProductDeveloperOpen: action.assignProductDeveloperOpen };

    case GET_BUYERS_BY_QUERY:
      return {
        ...state,
        queryData: action.buyers,
        total: action.totalPages,
        params: action.params
      };

    case ADD_BUYER:
      return { ...state };

    case UPDATE_BUYER:
      return { ...state };

    case DELETE_BUYER:
      return { ...state };

    case DELETE_BUYERS_BY_RANGE:
      return { ...state };

    case BUYER_IMAGE_UPLOAD_LOADING:
      return { ...state, isImageUploading: action.isImageUploading };

    case CLEAR_ALL_BUYER_STATE:
      return {
        ...state,
        buyers: [],
        queryData: [],
        total: 1,
        params: {},
        selectedBuyer: null,
        openBuyerSidebar: false,
        dropDownBuyers: [],
        assignAgentOpen: null,
        assignProductDeveloperOpen: null,
        buyerAgentsByBuyerId: [],
        buyerProductDeveloperByBuyerId: [],
        buyerSizeGroups: [],
        buyerColors: [],
        buyerDepartmentByBuyerId: [],
        buyerStylesDropdown: [],
        buyerBasicInfo: buyerBasicModel,

        dropdownBuyerColors: [],
        dropdownBuyerSizeGroups: []

      };

    default:
      return state;
  }


};

export default buyerReduces;