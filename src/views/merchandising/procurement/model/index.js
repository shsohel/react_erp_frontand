import moment from "moment";

export const procurementBasicInfoModel = {
    id: '',
    sysId: '',
    orderNumber: '',
    buyer: null,
    budgetNo: '',
    exportedPONo: '',
    styleNo: '',
    subGroup: '',
    budget: [],
    supplier: null,
    orderDate: moment().format( 'yyyy-MM-DD' ),
    receivedDate: moment().format( 'yyyy-MM-DD' ),
    // currency: { value: 'USD', label: 'USD' },
    currency: null,
    shipmentMode: null,
    purchaseOrderNature: null,

    itemValue: 0,
    serviceChargeAmount: 0,
    additionalChargeAmount: 0,
    deductionAmount: 0,
    totalAmount: 0,

    conversionRate: 0,
    conversionCurrencyCode: "",
    warehouse: null,
    shippingTerm: null,
    requisitionNature: null,
    payTerm: null,
    source: null,
    itemGroupType: null,
    remarks: '',
    isNormalOrder: false,
    status: { value: 'Draft', label: 'Draft' },
    updateStatus: null,
    termsAndConditions: '',
    isDeleteItemExiting: false,
    purchaser: null
};