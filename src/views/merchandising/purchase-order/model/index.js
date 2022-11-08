import moment from "moment";
import { randomIdGenerator } from "../../../../utility/Utils";

export const purchaseOrderBasicInfo = {
    buyerId: '',
    buyerName: '',
    buyer: null,
    agentId: '',
    agentName: '',
    agent: null,
    orderNumber: '',
    orderDate: moment( new Date() ).format( 'yy-MM-DD' ),
    season: '',
    year: '',
    currencyCode: '',
    remarks: '',
    isSetOrder: false,
    totalOrderQuantity: ''
};

export const purchaseOrderDetails = [
    {
        fieldId: randomIdGenerator(),
        style: null,
        sizeGroups: null,
        destination: null,
        orderQuantity: 0,
        orderUOM: null,
        shipmentMode: null,
        shipmentDate: moment( new Date() ).format( 'yy-MM-DD' ),
        inspectionDate: moment( new Date() ).format( 'yy-MM-DD' ),
        rate: 0,
        amount: 0,
        excessQuantity: 0,
        wastageQuantity: 0,
        // exporter: null,
        ColorSize: null,
        SizeColor: null,
        ColorRation: null,
        status: null
    }
];


export const stylePurchaseOrderModel = {
    style: null,
    buyer: null,
    agent: null,
    season: null,
    year: null,
    isSetOrder: false,
    isSizeSpecific: false,
    isColorSpecific: false,
    isSetStyle: false,
    totalOrderQuantity: 0,
    totalAmount: 0,
    status: ''
};

export const stylePurchaseOrderDetailsModel = [];


 // {
    //     orderId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //     orderNumber: "string",
    //     detailId: 0,
    //     styleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //     buyerId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //     buyerName: "string",
    //     agentId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //     agentName: "string",
    //     styleNo: "string",
    //     sizeGroupId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //     sizeGroupName: "string",
    //     orderDate: "2022-02-28T11:40:47.573Z",
    //     season: "string",
    //     year: "string",
    //     currencyCode: "string",
    //     orderUOM: "string",
    //     orderUOMRelativeFactor: 0,
    //     orderQuantity: 0,
    //     shipmentMode: "string",
    //     shipmentDate: "2022-02-28T11:40:47.573Z",
    //     inspectionDate: "2022-02-28T11:40:47.573Z",
    //     ratePerUnit: 0,
    //     excessQuantityPercentage: 0,
    //     wastageQuantityPercentage: 0,
    //     adjustedQuantity: 0,
    //     deliveryDestination: "string",
    //     status: "string",
    //     orderQuantitySizeAndColor: [
    //         {
    //             id: 0,
    //             styleId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //             styleNo: "string",
    //             sizeId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //             size: "string",
    //             colorId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    //             color: "string",
    //             quantity: 0,
    //             excessPercentage: 0,
    //             wastagePercentage: 0,
    //             sampleQuantity: 0,
    //             adjustedQuantity: 0,
    //             ratio: 0,
    //             asrtValue: 0,
    //             isInRatio: true
    //         }
    //     ]
    // }