/*
  Title: pre costing sheet
  Description: pre costing sheet
  Author: Iqbal Hossain
  Date: 21-August-2022
  Modified: 21-August-2022
*/

export const PRE_COSTING_SHEET_API = {
  fetch_costing_by_style: styleId => `/api/reports/PreCostingSheets/GetCosting/Style/${styleId}`,
  fetch_pre_costing_sheet_by_style: costingId => `/api/reports/PreCostingSheets/GetPreCostSheet/Costings/${costingId}`
};
