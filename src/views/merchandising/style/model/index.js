import { randomIdGenerator } from "../../../../utility/Utils";
// const { authenticateUser } = store?.getState().auth;
export const singleStyleModel = {
    styleNo: "",
    buyer: null,
    buyerId: "",
    buyerName: "",

    agent: null,
    agentId: "",
    agentName: "",
    sampleAssignee: null,


    buyerDepartmentId: "",
    buyerDepartmentName: "",
    buyerDepartment: null,

    buyerProductDeveloperId: "",
    buyerProductDeveloperName: "",
    buyerProductDeveloper: null,

    styleDivisionId: "",
    styleDivisionName: "",
    styleDivision: null,

    styleDepartmentId: "",
    styleDepartmentName: "",
    styleDepartment: null,

    productCategoryId: "",
    productCategoryName: "",
    productCategory: null,

    styleCategoryId: "",
    styleCategoryName: "",
    styleCategory: null,


    season: null,
    year: null,

    status: { value: 'Inquiry', label: 'Inquiry' },
    description: "",
    remarks: "",
    additionalInstruction: "",

    defaultFabCatId: 0,
    defaultFabSubCatId: 0,
    defaultFabDesc: "",
    defaultFabDescValue: null,
    defaultFabDescTemplate: "",
    itemSubGroup: null,

    colors: [],
    colorIds: [],
    sizeGroupIds: [],
    exitingSizeGroups: [],
    exitingColors: [],
    sizeGroups: [],
    images: [],
    imagesUrls: [],
    files: [],
    fileUrls: [],
    merchandiser: null,
    productionProcess: null
};

export const setStyleModel = {
    styleNo: "",

    buyer: null,
    buyerId: "",
    buyerName: "",

    agent: null,
    agentId: "",
    agentName: "",

    buyerDepartmentId: "",
    buyerDepartmentName: "",
    buyerDepartment: null,

    buyerProductDeveloperId: "",
    buyerProductDeveloperName: "",
    buyerProductDeveloper: null,


    season: null,
    year: null,

    status: { value: 'Inquiry', label: 'Inquiry' },

    remarks: "",
    additionalInstruction: "",
    description: "",

    isSizeSpecific: false,
    isColorSpecific: false,
    colors: null,

    styleCombination: [
        {
            fieldId: randomIdGenerator(),
            styleNo: null,
            size: null,
            color: null,
            quantity: ''
        }
    ],

    styleDetails: [],

    images: [],
    imagesUrls: []
};