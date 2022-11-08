import moment from "moment";
import { randomIdGenerator } from "../../../../utility/Utils";

export const proformaInvoiceModel = {
    id: '',
    supplier: null,
    piNumber: '',
    sysId: '',
    piDate: moment().format( 'yyyy-MM-DD' ),
    purchaser: null,
    buyer: null,
    styleNo: '',
    supplierPO: '',
    purpose: null,
    tradeTerm: null,
    payTerm: null,
    source: null,
    currency: null,
    conversionRate: 0,
    conversionCurrencyCode: '',

    itemValue: 0,
    serviceCharge: 0,
    additionalCharge: 0,
    deductionAmount: 0,
    piValue: 0,
    files: [],
    fileUrls: [],
    ///
    supplierId: "",
    /// currencyCode: "string",
    /// currencyRate: 0,
    shipmentMode: null,
    shipmentDate: moment().format( 'yyyy-MM-DD' ),
    etaDate: moment().format( 'yyyy-MM-DD' ),
    termsAndConditions: "",
    purchaseRequisitionIds: [],
    isDeleteItemExiting: false,
    status: { value: 'Draft', label: 'Draft' }

};


export const sOrderArrayModel = [
    {
        id: 1,
        fieldId: randomIdGenerator(),
        orderNumber: 'PRO_6548',
        supplier: 'Azim',
        buyer: 'HM',
        warehouse: 'WARE- 01',
        orderQuantity: 650,
        isSelected: false
    },
    {
        id: 2,
        fieldId: randomIdGenerator(),
        orderNumber: 'PRO_2548',
        supplier: 'Azim',
        buyer: 'HM',
        warehouse: 'WARE- 01',
        orderQuantity: 150,
        isSelected: false
    }

];