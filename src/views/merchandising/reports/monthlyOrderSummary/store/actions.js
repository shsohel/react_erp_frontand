/*
  Title: Actions for MonthlyOrderSummary
  Description: Actions for MonthlyOrderSummary
  Author: Iqbal Hossain
  Date: 10-August-2022
  Modified: 10-August-2022
*/

import { v4 as uuid } from 'uuid';
import { FETCH_MONTHLY_ORDER_SUMMARY } from './actionType';

//Get Data by Query
export const fetchMonthlyOrderSummary = () => async dispatch => {
  const data = {
    details: [
      {
        id: uuid(),
        customer: 'FAM LLC',
        styleNo: 'ELT2021S',
        buyerPoNo: 'F12697',
        confirmedQty_apr: 206976,
        fob_apr: 2.61,
        value_apr: 541187.24,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 206976,
        fob_jul: 2.61,
        value_jul: 541187.24
      },
      {
        id: uuid(),
        customer: 'FAM LLC',
        styleNo: 'ELT2021S',
        buyerPoNo: 'F12698',
        confirmedQty_apr: 206976,
        fob_apr: 2.61,
        value_apr: 541187.24,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 206976,
        fob_jul: 2.61,
        value_jul: 541187.24
      },
      {
        id: uuid(),
        customer: 'FAM LLC',
        styleNo: 'ELT2020S',
        buyerPoNo: 'F12702',
        confirmedQty_apr: 206976,
        fob_apr: 2.61,
        value_apr: 541187.24,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 206976,
        fob_jul: 2.61,
        value_jul: 541187.24
      },
      {
        id: uuid(),
        customer: 'FAM LLC',
        styleNo: 'ELT2020S',
        buyerPoNo: 'F12703',
        confirmedQty_apr: 0,
        fob_apr: 0,
        value_apr: 0,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 206976,
        fob_jul: 2.61,
        value_jul: 541187.24
      },
      {
        id: uuid(),
        customer: 'FAM LLC',
        styleNo: 'EMT7530S',
        buyerPoNo: 'F12836',
        confirmedQty_apr: 206976,
        fob_apr: 2.61,
        value_apr: 541187.24,
        confirmedQty_may: 0,
        fob_may: 0,
        value_may: 0,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 206976,
        fob_jul: 2.61,
        value_jul: 541187.24
      },
      {
        id: uuid(),
        customer: 'FAM LLC',
        styleNo: 'EMT7530S',
        buyerPoNo: 'F12837',
        confirmedQty_apr: 206976,
        fob_apr: 2.61,
        value_apr: 541187.24,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 0,
        fob_jun: 0,
        value_jun: 0,
        confirmedQty_jul: 206976,
        fob_jul: 2.61,
        value_jul: 541187.24
      },
      {
        id: uuid(),
        customer: 'FAM LLC',
        styleNo: 'ELT2020S',
        buyerPoNo: 'F12896',
        confirmedQty_apr: 206976,
        fob_apr: 2.61,
        value_apr: 541187.24,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 0,
        fob_jul: 0,
        value_jul: 0
      },
      {
        id: uuid(),
        customer: 'FAM LLC',
        styleNo: 'ELT2021S',
        buyerPoNo: 'F12897',
        confirmedQty_apr: 0,
        fob_apr: 0,
        value_apr: 0,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 206976,
        fob_jul: 2.61,
        value_jul: 541187.24
      },
      {
        id: uuid(),
        customer: 'FAM LLC',
        styleNo: 'ELT2021S',
        buyerPoNo: 'f12914',
        confirmedQty_apr: 206976,
        fob_apr: 2.61,
        value_apr: 541187.24,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 0,
        fob_jul: 0,
        value_jul: 0
      },
      {
        id: uuid(),
        customer: 'FAM LLC',
        styleNo: 'ELT2020S',
        buyerPoNo: 'F12915',
        confirmedQty_apr: 589403,
        fob_apr: 0,
        value_apr: 1876848.02,
        confirmedQty_may: 512243,
        fob_may: 0,
        value_may: 1504410.55,
        confirmedQty_jun: 584760,
        fob_jun: 0,
        value_jun: 1780879.9,
        confirmedQty_jul: 713697,
        fob_jul: 0,
        value_jul: 2523576.52
      },

      {
        id: uuid(),
        customer: 'JCORP INC.',
        styleNo: '14C8T0084A-42',
        buyerPoNo: '0000115',
        confirmedQty_apr: 206976,
        fob_apr: 2.61,
        value_apr: 541187.24,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 206976,
        fob_jul: 2.61,
        value_jul: 541187.24
      },
      {
        id: uuid(),
        customer: 'JCORP INC.',
        styleNo: '146GT0003B/42',
        buyerPoNo: '1009405',
        confirmedQty_apr: 206976,
        fob_apr: 2.61,
        value_apr: 541187.24,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 206976,
        fob_jul: 2.61,
        value_jul: 541187.24
      },
      {
        id: uuid(),
        customer: 'JCORP INC.',
        styleNo: '14C8T0084B/42',
        buyerPoNo: '100945',
        confirmedQty_apr: 206976,
        fob_apr: 2.61,
        value_apr: 541187.24,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 206976,
        fob_jul: 2.61,
        value_jul: 541187.24
      },
      {
        id: uuid(),
        customer: 'JCORP INC.',
        styleNo: '14YDT0004/42',
        buyerPoNo: 'DF00433',
        confirmedQty_apr: 0,
        fob_apr: 0,
        value_apr: 0,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 206976,
        fob_jul: 2.61,
        value_jul: 541187.24
      },
      {
        id: uuid(),
        customer: 'JCORP INC.',
        styleNo: '14YDT0005/42',
        buyerPoNo: 'DF00434',
        confirmedQty_apr: 206976,
        fob_apr: 2.61,
        value_apr: 541187.24,
        confirmedQty_may: 0,
        fob_may: 0,
        value_may: 0,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 206976,
        fob_jul: 2.61,
        value_jul: 541187.24
      },
      {
        id: uuid(),
        customer: 'JCORP INC.',
        styleNo: '14YDT0006/42',
        buyerPoNo: 'DF00435',
        confirmedQty_apr: 206976,
        fob_apr: 2.61,
        value_apr: 541187.24,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 0,
        fob_jun: 0,
        value_jun: 0,
        confirmedQty_jul: 206976,
        fob_jul: 2.61,
        value_jul: 541187.24
      },
      {
        id: uuid(),
        customer: 'JCORP INC.',
        styleNo: '14YDT0001/42',
        buyerPoNo: 'DF00436',
        confirmedQty_apr: 206976,
        fob_apr: 2.61,
        value_apr: 541187.24,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 0,
        fob_jul: 0,
        value_jul: 0
      },
      {
        id: uuid(),
        customer: 'JCORP INC.',
        styleNo: '14YDT0000/42',
        buyerPoNo: 'DF00437',
        confirmedQty_apr: 0,
        fob_apr: 0,
        value_apr: 0,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 206976,
        fob_jul: 2.61,
        value_jul: 541187.24
      },
      {
        id: uuid(),
        customer: 'JCORP INC.',
        styleNo: '14YDP0001/42',
        buyerPoNo: 'DF00438',
        confirmedQty_apr: 206976,
        fob_apr: 2.61,
        value_apr: 541187.24,
        confirmedQty_may: 206976,
        fob_may: 2.61,
        value_may: 541187.24,
        confirmedQty_jun: 206976,
        fob_jun: 2.61,
        value_jun: 541187.24,
        confirmedQty_jul: 0,
        fob_jul: 0,
        value_jul: 0
      },
      {
        id: uuid(),
        customer: 'JCORP INC.',
        styleNo: '14YDT0003/42',
        buyerPoNo: 'DF00439',
        confirmedQty_apr: 589403,
        fob_apr: 0,
        value_apr: 1876848.02,
        confirmedQty_may: 512243,
        fob_may: 0,
        value_may: 1504410.55,
        confirmedQty_jun: 584760,
        fob_jun: 0,
        value_jun: 1780879.9,
        confirmedQty_jul: 713697,
        fob_jul: 0,
        value_jul: 2523576.52
      },
      {
        id: uuid(),
        customer: 'JCORP INC.',
        styleNo: '14YDP0000/42',
        buyerPoNo: 'DF00440',
        confirmedQty_apr: 589403,
        fob_apr: 0,
        value_apr: 1876848.02,
        confirmedQty_may: 512243,
        fob_may: 0,
        value_may: 1504410.55,
        confirmedQty_jun: 584760,
        fob_jun: 0,
        value_jun: 1780879.9,
        confirmedQty_jul: 713697,
        fob_jul: 0,
        value_jul: 2523576.52
      },

      {
        id: uuid(),
        customer: 'KOUPER FKS',
        styleNo: '7309',
        buyerPoNo: '5412',
        confirmedQty_apr: 589403,
        fob_apr: 0,
        value_apr: 1876848.02,
        confirmedQty_may: 512243,
        fob_may: 0,
        value_may: 1504410.55,
        confirmedQty_jun: 584760,
        fob_jun: 0,
        value_jun: 1780879.9,
        confirmedQty_jul: 713697,
        fob_jul: 0,
        value_jul: 2523576.52
      },
      {
        id: uuid(),
        customer: 'KOUPER FKS',
        styleNo: '7133',
        buyerPoNo: '5413',
        confirmedQty_apr: 589403,
        fob_apr: 0,
        value_apr: 1876848.02,
        confirmedQty_may: 512243,
        fob_may: 0,
        value_may: 1504410.55,
        confirmedQty_jun: 584760,
        fob_jun: 0,
        value_jun: 1780879.9,
        confirmedQty_jul: 713697,
        fob_jul: 0,
        value_jul: 2523576.52
      },
      {
        id: uuid(),
        customer: 'KOUPER FKS',
        styleNo: '7305',
        buyerPoNo: '5414',
        confirmedQty_apr: 589403,
        fob_apr: 0,
        value_apr: 1876848.02,
        confirmedQty_may: 512243,
        fob_may: 0,
        value_may: 1504410.55,
        confirmedQty_jun: 584760,
        fob_jun: 0,
        value_jun: 1780879.9,
        confirmedQty_jul: 713697,
        fob_jul: 0,
        value_jul: 2523576.52
      }
    ],
    user: 'Uni User',
    reportGeneratedOn: '07-Aug-22 10:12 AM'
  };
  dispatch({
    type: FETCH_MONTHLY_ORDER_SUMMARY,
    payload: data
  });
};
