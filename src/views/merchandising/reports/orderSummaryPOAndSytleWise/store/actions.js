/*
  Title: Actions for OrderSummaryPOAndSytleWise
  Description: Actions for OrderSummaryPOAndSytleWise
  Author: Iqbal Hossain
  Date: 07-August-2022
  Modified: 07-August-2022
*/

import { baseAxios } from '@services';
import { ORDER_SUMMARY_PO_AND_STYLE_WISE_API, STYLES_DETAILS_API } from '@services/api-end-points/merchandising/v1';
import {
  FETCH_BUYER_ORDER_SUMMARY_PO_STYLE_WISE,
  FETCH_DEPARTMENT_ORDER_SUMMARY_PO_STYLE_WISE,
  FETCH_ORDER_SUMMARY_PO_AND_STYLE_WISE,
  FETCH_SEASON_ORDER_SUMMARY_PO_STYLE_WISE,
  FETCH_STYLE_ORDER_SUMMARY_PO_STYLE_WISE,
  FETCH_YEAR_ORDER_SUMMARY_PO_STYLE_WISE
} from './actionType';

//fetch all buyer from style
export const fetchAllBuyers = () => async dispatch => {
  const response = await baseAxios.get( `${STYLES_DETAILS_API.fetch_All_Buyer}` );
  const allBuyers = response.data.data;
  dispatch( {
    type: FETCH_BUYER_ORDER_SUMMARY_PO_STYLE_WISE,
    payload: allBuyers
  } );
};

//fetch department by buyer
export const fetchDepartmentByBuyer = buyerId => async dispatch => {
  const response = await baseAxios.get( STYLES_DETAILS_API.fetch_department_by_buyer( buyerId ) );
  const departments = response.data.data;
  dispatch( {
    type: FETCH_DEPARTMENT_ORDER_SUMMARY_PO_STYLE_WISE,
    payload: departments
  } );
};

//fetch year by department
export const fetchYearByDepartment = buyerDepartmentId => async dispatch => {
  const response = await baseAxios.get( STYLES_DETAILS_API.fetch_year_by_department( buyerDepartmentId ) );
  const years = response.data.data;
  dispatch( {
    type: FETCH_YEAR_ORDER_SUMMARY_PO_STYLE_WISE,
    payload: years
  } );
};

//fetch season by buyerId, buyerDepartmentId and year
export const fetchSeasonByBuyerDepartmentAndYear = ( buyerId, buyerDepartmentId, year ) => async dispatch => {
  const response = await baseAxios.get( STYLES_DETAILS_API.fetch_season_by_buyer_department_year( buyerId, buyerDepartmentId, year ) );
  const seasons = response.data.data;
  dispatch( {
    type: FETCH_SEASON_ORDER_SUMMARY_PO_STYLE_WISE,
    payload: seasons
  } );
};

//fetch season by buyerId, buyerDepartmentId and year
export const fetchStyleByBuyerDepartmentYearAndSeason = ( buyerId, buyerDepartmentId, year, season ) => async dispatch => {
  const response = await baseAxios.get( STYLES_DETAILS_API.fetch_style_by_buyer_department_year_season( buyerId, buyerDepartmentId, year, season ) );
  const styles = response.data.data;
  dispatch( {
    type: FETCH_STYLE_ORDER_SUMMARY_PO_STYLE_WISE,
    payload: styles
  } );
};
//Get Data by Query
export const fetchOrderSummaryPOAndSytleWise = styleId => async dispatch => {
  const response = await baseAxios.get( ORDER_SUMMARY_PO_AND_STYLE_WISE_API.fetch_order_summary_po_and_style_wise( styleId ) );
  const data = response.data.data;
  dispatch( {
    type: FETCH_ORDER_SUMMARY_PO_AND_STYLE_WISE,
    payload: data
  } );
};
