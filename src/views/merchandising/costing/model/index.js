import moment from "moment";

export const costingBasicInfoModel = {
    costingNumber: '',
    userCostingNumber: '',
    order: null, //Extra
    orderId: "",
    orderNo: "",
    style: null, //Extra
    styleNo: "",
    styleId: "",
    costingQuantity: 1,
    setStyleStyle: null, //Extra
    setStyleStyleNo: "",
    setStyleStyleId: "",
    styleDescription: "",
    styleCategory: "",
    sizeGroups: [],
    colorsArray: [],
    colors: [],
    buyer: null, //Extra
    buyerId: "",
    buyerName: "",
    costingUOMValue: null, //Extra
    costingUOM: "",
    //  relativeFactor: 0,
    costingTermValue: null, //Extra
    costingTerm: "",
    shipmentModeValue: null,
    shipmentMode: "",
    shipmentDate: moment().format( 'yyyy-MM-DD' ),

    currencyValue: null, ///Extra
    currency: "",
    totalQuotedPrice: 0,
    perUnitQuotedPrice: 0,
    expectedQuantity: 0,
    fobAmount: 0,
    statusValue: null,
    status: { value: 'Draft', label: 'Draft' },
    updateStatus: null,
    cm: 0,
    effectiveCM: 0,
    uomRelativeFactor: 0,
    uom: null,
    remarks: "",
    additionalInstruction: "",
    costOfMakingPercentage: 0,
    itSetStyle: false,
    isAllCostingCompleted: false,
    isCostingNumberInput: false,
    styleOrderDetails: [],
    isEditCosting: false,
    merchandiser: null
};

export const setCostingBasicInfo = {
    buyer: null,
    stylePurchaseOrderDetails: []
};

export const cmCalculationForSMV = {
    smv: 0,
    efficiency: 0,
    perMinCost: 0,
    pcs: 0,
    cm: 0
};
export const cmCalculationForMachine = {
    noOfMachine: 0,
    productivity: 0,
    perMinCost: 0,
    pcs: 0,
    cm: 0
};


export const costingGroupsSummaryModel = [
    {
        id: 1,
        name: "Fabric",
        buyerAmount: 0,
        inHouseAmount: 0,
        inPercentage: 0,
        isCalculateInPercentage: false

    },
    {
        id: 2,
        name: "Accessories",
        buyerAmount: 0,
        inHouseAmount: 0,
        inPercentage: 0,
        isCalculateInPercentage: false

    },
    {
        id: 3,
        name: "CM",
        buyerAmount: 0,
        inHouseAmount: 0,
        inPercentage: 0,
        isCalculateInPercentage: false
    },
    {
        id: 4,
        name: "Profit",
        buyerAmount: 0,
        inHouseAmount: 0,
        inPercentage: 0,
        isCalculateInPercentage: true
    },

    {
        id: 5,
        name: "Print",
        buyerAmount: 0,
        inHouseAmount: 0,
        inPercentage: 0,
        isCalculateInPercentage: false
    },
    {
        id: 6,
        name: "Commercial Expense",
        buyerAmount: 0,
        inHouseAmount: 0,
        inPercentage: 0,
        isCalculateInPercentage: true
    },
    {
        id: 7,
        name: "BH Commission",
        buyerAmount: 0,
        inHouseAmount: 0,
        inPercentage: 0,
        isCalculateInPercentage: true
    },
    {
        id: 8,
        name: "Logistics & Transportation",
        buyerAmount: 0,
        inHouseAmount: 0,
        inPercentage: 0,
        isCalculateInPercentage: false
    },
    {
        id: 9,
        name: "Embroidery ",
        buyerAmount: 0,
        inHouseAmount: 0,
        inPercentage: 0,
        isCalculateInPercentage: false
    },
    {
        id: 10,
        name: "Wash",
        buyerAmount: 0,
        inHouseAmount: 0,
        inPercentage: 0,
        isCalculateInPercentage: false
    },
    {
        id: 11,
        name: "Others",
        buyerAmount: 0,
        inHouseAmount: 0,
        inPercentage: 0,
        isCalculateInPercentage: false
    },
    {
        id: 12,
        name: "Total",
        buyerAmount: 0,
        inHouseAmount: 0,
        inPercentage: 0
    }
];