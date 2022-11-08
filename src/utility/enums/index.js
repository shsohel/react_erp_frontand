
///Base Url
const {
    REACT_APP_BASE_URL_SERVER_API,
    REACT_APP_BASE_URL_LOCAL_API,
    REACT_APP_BASE_URL_LOCAL_HOST,
    REACT_APP_BASE_URL_SERVER_LOCAL_HOST,
    REACT_APP_BASE_URL_LOCAL_API_TEST
} = process.env;

const mode = "production";

export const baseUrl = process.env.NODE_ENV === mode ? REACT_APP_BASE_URL_SERVER_API : REACT_APP_BASE_URL_LOCAL_API; // Exact API
//export const baseUrl = process.env.NODE_ENV === mode ? REACT_APP_BASE_URL_SERVER_API : REACT_APP_BASE_URL_LOCAL_API_TEST; // Exact API
export const localUrl = process.env.NODE_ENV === mode ? REACT_APP_BASE_URL_SERVER_LOCAL_HOST : REACT_APP_BASE_URL_LOCAL_HOST; ///For Default Photo or Files
// process.env.NODE_ENV === 'development' || !process.env.NODE_ENV === 'production'

export const defaultUnitId = process.env.NODE_ENV === mode ? 3 : 1;

export const authCredential = {
    userName: '',
    password: '',
    grant_type: 'password',
    client_id: 'shsohel.client',
    client_secret: 'secret_sh',
    scope: 'SHSErpAPI openid profile'
};
export const cookieName = "auth-q-cookie";

const baseModule = localStorage.getItem( 'module' );
export const baseRoute = baseModule === "Merchandising" ? "/merchandising" : baseModule === "Inventory" ? "/inventory" : baseModule === "Users" ? "/auth" : "";
// export const navRoutePermission = {
//     style: {
//         list: "Style.List"
//     },
//     purchaseOrder: {
//         list: "PurchaseOrder.List"
//     },
//     costing: {
//         list: "Costing.List"
//     },
//     consumption: {
//         list: "Consumption.List"
//     },
//     bom: {
//         list: "Bom.List"
//     },
//     budget: {
//         list: "Budget.List"
//     },
//     packaging: {
//         list: "Packaging.List"
//     },
//     ipo: {
//         list: "IPO.List"
//     },
//     ipi: {
//         list: "IPI.List"
//     },
//     buyer: {
//         list: "Buyer.List"
//     },
//     buyerAgent: {
//         list: "Agent.List"
//     },
//     buyerDepartment: {
//         list: "BuyerDepartment.List"
//     },
//     buyerProductDeveloper: {
//         list: "ProductDeveloper.List"
//     },
//     color: {
//         list: "GarmentColor.List"
//     },
//     size: {
//         list: "GarmentSize.List"
//     },
//     sizeGroup: {
//         list: "GarmentSizeGroup.List"
//     },
//     season: {
//         list: "Season.List"
//     },
//     styleCategory: {
//         list: "StyleCategory.List"
//     },
//     styleDepartment: {
//         list: "StyleDepartment.List"
//     },
//     styleDivision: {
//         list: "StyleDivision.List"
//     },
//     styleProductCategory: {
//         list: "StyleProductCategory.List"
//     },
//     media: {
//         list: "Media.List"
//     },
//     role: {
//         list: "Role.List"
//     },
//     user: {
//         list: "User.List"
//     },
//     antonymous: 'antonymous'
// };

///Style Status
export const userStatus = [
    { value: 'WaitingForConfirmation', label: 'WaitingForConfirmation' },
    { value: 'Confirmed', label: 'Confirmed' }

];
///Style Status
export const isYesNo = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }

];
export const source = [
    { value: 'Foreign LC', label: 'Foreign LC' },
    { value: 'InLand LC', label: 'InLand LC' },
    { value: 'Non LC', label: 'Non LC' },
    { value: 'FDD Local', label: 'FDD Local' },
    { value: 'TT', label: 'TT' }

];
export const styleStatus = [
    { value: 'Inquiry', label: 'Inquiry' },
    { value: 'Confirmed PO', label: 'Confirmed PO' },
    { value: 'Shipped', label: 'Shipped' },
    { value: 'Closed', label: 'Closed' },
    { value: 'In Production', label: 'In Production' }
];

export const itemGroupType = [
    { value: 'Fabric', label: 'Fabric' },
    { value: 'Accessories', label: 'Accessories' }
    // { value: 'Packaging', label: 'Packaging' }
];
///Costing Status
export const costingStatus = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Submitted', label: 'Submitted' },
    { value: 'Pre-Costing', label: 'Pre-Costing' }
];

///Procurement Status
export const procurementStatus = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Approved', label: 'Approved' }
];
///Procurement Status
export const budgetStatus = [
    { value: 'Draft', label: 'Draft' },
    { value: 'Approved', label: 'Approved' }
];
///Costing Status
export const orderStatus = [{ value: 'Approved', label: 'Approved' }];
//export const defaultUnitId = 1;
///Costing Methods
export const selectCostingMethod = [
    { value: 'LIFO', label: 'LIFO' },
    { value: 'FIFO', label: 'FIFO' },
    { value: 'WEIGHTED_AVERAGE', label: 'WEIGHTED AVERAGE' }
];

export const selectPayTerm = [
    { value: 'CFO', label: 'CFO' },
    { value: 'TT', label: 'TT' },
    { value: 'DD', label: 'DD' },
    { value: 'At-Sight', label: 'At-Sight' },
    { value: 'Usance', label: 'Usance' }
];

export const selectTerm = [
    { value: 1, label: 'FOB' },
    { value: 2, label: 'CFR' },
    { value: 3, label: 'CIF' },
    { value: 4, label: 'EXW' }
];
export const selectPurchaseTerm = [
    { value: 1, label: 'Pre-Procurement' },
    { value: 2, label: 'Post-Procurement' }
];


export const selectGroupType = [
    { value: 1, label: 'Fabric' },
    { value: 2, label: 'Accessories' },
    { value: 3, label: 'Packaging' }
];


export const selectPurchaseType = [
    {
        value: 'IMPORT',
        label: 'IMPORT'
    },
    {
        value: 'LOCAL',
        label: 'LOCAL'
    }
];


export const selectSupplier = [
    {
        value: 1,
        label: 'Milon'
    },
    {
        value: 2,
        label: 'Devid'
    }
];
///Accessories Type

export const selectAccessoriesType = [
    { value: 'Poly', label: 'Poly' },
    { value: 'Box', label: 'Box' }
];


// Currency
export const selectCurrency = [
    { value: 1, label: 'BDT' },
    { value: 2, label: 'USD' },
    { value: 3, label: 'EURO' },
    { value: 4, label: 'JPY' },
    { value: 5, label: 'INR' },
    { value: 6, label: 'GBP' },
    { value: 7, label: 'AUD' },
    { value: 8, label: 'CAD' }
];

///Year
export const selectYear = [
    { value: '2020', label: '2020' },
    { value: '2021', label: '2021' },
    { value: '2022', label: '2022' },
    { value: '2023', label: '2023' },
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    { value: '2026', label: '2026' },
    { value: '2027', label: '2027' }
];
export const selectStyleNo = [
    { value: '4369SMS32-1', label: '4369SMS32-1' },
    { value: '4369SMS32-2', label: '4369SMS32-2' },
    { value: '4369SMS32-3', label: '4369SMS32-3' }

];
///Destination
export const selectDestination = [
    { value: 'Bangladesh', label: 'Bangladesh' },
    { value: 'Australia', label: 'Australia' },
    { value: 'China', label: 'China' },
    { value: 'Japan', label: 'Japan' },
    { value: 'India', label: 'India' }
];
///Unit

export const selectUnit = [
    {
        value: 'PCS',
        label: 'PCS'
    },
    {
        value: 'DZN',
        label: 'DZN'
    },
    {
        value: 'Pair',
        label: 'Pair'
    }
];

export const selectExporter = [
    {
        value: 'RDM',
        label: 'RDM'
    },
    {
        value: 'YOUNG ONE',
        label: 'YOUNG ONE'
    }
];

export const selectShipmentMode = [
    {
        value: 'AIR',
        label: 'AIR'
    },
    {
        value: 'SEA',
        label: 'SEA'
    },
    {
        value: 'ROAD',
        label: 'ROAD'
    }
];

export const selectActionStatus = [
    {
        value: 'APPROVED',
        label: 'APPROVED'
    },
    {
        value: 'PENDING',
        label: 'PENDING'
    },
    {
        value: 'CONFIRMED',
        label: 'CONFIRMED'
    }
];
export const status = {
    success: 200,
    badRequest: 400,
    notFound: 404,
    severError: 500,
    conflict: 409,
    methodNotAllow: 405
};

//Country Array Demo
export const selectedCountry = [
    { value: 'bangladesh', label: 'Bangladesh' },
    { value: 'india', label: 'India' },
    { value: 'pakistan', label: 'pakistan' },
    { value: 'nepal', label: 'Nepal' }
];

export const consoleType = {
    normal: 'normal',
    stringify: 'stringify'
};
//State Array Demo
export const selectedState = [
    { value: 'bangladesh', label: 'Bangladesh' },
    { value: 'india', label: 'India' },
    { value: 'pakistan', label: 'pakistan' },
    { value: 'nepal', label: 'Nepal' }
];


//Country Array Demo
export const selectedCity = [
    { value: 'chittagong', label: 'Chittagong' },
    { value: 'dhaka', label: 'Dhaka' },
    { value: 'rajshahi', label: 'Rajshahi' },
    { value: 'feni', label: 'Feni' }
];
//Country Array Demo
export const selectColor = [
    { value: 'BLUE', label: 'BLUE' },
    { value: 'RED', label: 'RED' },
    { value: 'GREEN', label: 'GREEN' }
];
//Country Array Demo
export const selectSize = [
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XLL', label: 'XLL' }
];
//Country Array Demo
export const selectSetStyles = [
    { value: 'SF21MW5504-A', label: 'F21MW5504-A' },
    { value: 'F21MW5504-B', label: 'F21MW5504-B' },
    { value: 'F21MW5504-C', label: 'F21MW5504-C' },
    { value: 'F21MW5504-D', label: 'F21MW5504-D' },
    { value: 'S21MW1504-A', label: 'S21MW1504-A' }
];
export const selectStyles = [
    { value: 'SF21MW5501', label: 'F21MW5501' },
    { value: 'F21MW5502', label: 'F21MW5502' },
    { value: 'F21MW5503', label: 'F21MW5503' },
    { value: 'F21MW5504', label: 'F21MW5504' },
    { value: 'S21MW1505', label: 'S21MW1505' }
];

// ** Season Status filter options: Demo Array
export const statusOptions = [
    { value: true, label: 'Active', number: 1 },
    { value: false, label: 'Inactive', number: 2 }
];

export const statusFor = [
    { value: 'Buyer', label: 'Buyer' },
    { value: 'Buyer Agent', label: 'Buyer Agent' }
];

const selectDivision = [
    {
        value: 'knit',
        label: 'Knit',
        styleDepartment: [
            {
                value: 'man',
                label: 'Man',
                productCategory: [
                    {
                        value: 'top',
                        label: 'Top',
                        styleCategory: [{ value: 't-shirt', label: 'T-Shirt' }]
                    },
                    {
                        value: 'bottom',
                        label: 'Bottom',
                        styleCategory: [{ value: 'short', label: 'Short' }]
                    }
                ]
            },
            {
                value: 'ladies',
                label: 'Ladies',
                productCategory: [
                    { value: 'top', label: 'Top Ladies', styleCategory: [{ value: 'bra', label: 'Bra' }] },
                    { value: 'bottom', label: 'Bottom Ladies', styleCategory: [{ value: 'capri', label: 'Capri' }] }
                ]
            },
            {
                value: 'kid',
                label: 'Kid',
                productCategory: [
                    { value: 'top', label: 'Top Kids', styleCategory: [{ value: 't-shirt', label: 'T-shirt' }] },
                    { value: 'bottom', label: 'Bottom Kids', styleCategory: [{ value: 'pants', label: 'Pants' }] }
                ]
            }

        ]
    }
];


const selectBuyer = [
    {
        value: 'youngLimited',
        label: 'Young Ltd',
        buyerAgent: [{ value: 'youngagent', label: 'Young Agent' }],
        buyerDepartment: [{ value: 'wildfox', label: 'Wild Fox' }],
        buyerProductdeveloper: [{ value: 'abdulKarim', label: 'Abdul Karim' }]
    }
];

export const selectSizeGroups = [
    { value: 'S-M', label: 'S-M' },
    { value: 'S-X', label: 'S-X' },
    { value: 'S-XXL', label: 'S-XXK' },
    { value: 'M-XLL', label: 'M-XLL' }
];


export const selectStatus = [
    { value: 'Approved', label: 'Approved' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Cancel', label: 'Cancel' }
];
export const selectPurpose = [
    { value: 'Material', label: 'Material' },
    { value: 'Service', label: 'Service' }
];
export const selectPurchaser = [{ value: 'RDM APPARELS LTD.', label: 'RDM APPARELS LTD.' }];


export const selectSampleAssignee = [
    { value: 'SohagAbdullah', label: 'Sohag Abdullah' },
    { value: 'MilonMahmud', label: 'Milon Mahmud' }
];
export const selectProductionProcess = [
    { value: 'CSF', label: 'CSF(Cutting, Swing, Finishing)' },
    { value: 'CSDF', label: 'CSDF(Cutting, Swing,Dyeing, Finishing)' }
];


export const selectDocCategory = [
    { value: 'ApprovalLetter', label: 'Approval Letter' },
    { value: 'StyleArtwork', label: 'Style Artwork' },
    { value: 'StyleSampleDoc', label: 'Style Sample Doc' }
];
export const confirmObj = {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    html: 'You can use <b>bold text</b>',
    confirmButtonText: 'Yes !',
    cancelButtonText: 'No'
};

export const costingConsumptionBodyParts = [
    { value: 'Body', label: 'Body' },
    { value: 'Contrast-1', label: 'Contrast-1' },
    { value: 'Contrast-2', label: 'Contrast-2' },
    { value: 'Contrast-3', label: 'Contrast-3' },
    { value: 'Contrast-4', label: 'Contrast-4' }
];


///For Size  Combination of Set Packaging
export const selectSizeType = [
    { label: 'Solid Size', value: 1 },
    { label: 'Assort Size', value: 2 }
];
export const sizeTypeEnumObj = {
    SolidSize: 'Solid Size',
    assortSize: 'Assort Size'
};

///For Size Color Combination  of Solid Packaging
export const selectSizeColorType = [
    { label: 'Solid Color and Solid Size', value: 1 },
    { label: 'Solid Color and Assort Size', value: 2 },
    { label: 'Assort Color and Solid Size', value: 3 },
    { label: 'Assort Color and Assort Size', value: 4 }
];
export const sizeColorTypeEnumObj = {
    solidColorAndAssortSize: 'Solid Color and Assort Size',
    solidColorAndSolidSize: 'Solid Color and Solid Size',
    assortColorAndSolidSize: 'Assort Color and Solid Size',
    assortColorAndAssortSize: 'Assort Color and Assort Size'
};

export const permissibleProcess = [
    { label: 'Costing', value: 'Costing' },
    { label: 'Consumption', value: 'Consumption' },
    { label: 'Budget', value: 'Budget' },
    { label: 'IPO', value: 'IPO' },
    { label: 'IPI', value: 'IPI' }
];

export const permissibleProcessObj = {
    costing: "Costing",
    consumption: "Consumption",
    budget: "Budget",
    ipo: "IPO",
    ipi: "IPI"
};

export const countries = [
    {
        name: "Afghanistan",
        code: "AF",
        label: "Afghanistan",
        value: "Afghanistan"
    },
    {
        name: "Åland Islands",
        code: "AX",
        label: "Åland Islands",
        value: "Åland Islands"
    },
    {
        name: "Albania",
        code: "AL",
        label: "Albania",
        value: "Albania"
    },
    {
        name: "Algeria",
        code: "DZ",
        label: "Algeria",
        value: "Algeria"
    },
    {
        name: "American Samoa",
        code: "AS",
        label: "American Samoa",
        value: "American Samoa"
    },
    {
        name: "AndorrA",
        code: "AD",
        label: "AndorrA",
        value: "AndorrA"
    },
    {
        name: "Angola",
        code: "AO",
        label: "Angola",
        value: "Angola"
    },
    {
        name: "Anguilla",
        code: "AI",
        label: "Anguilla",
        value: "Anguilla"
    },
    {
        name: "Antarctica",
        code: "AQ",
        label: "Antarctica",
        value: "Antarctica"
    },
    {
        name: "Antigua and Barbuda",
        code: "AG",
        label: "Antigua and Barbuda",
        value: "Antigua and Barbuda"
    },
    {
        name: "Argentina",
        code: "AR",
        label: "Argentina",
        value: "Argentina"
    },
    {
        name: "Armenia",
        code: "AM",
        label: "Armenia",
        value: "Armenia"
    },
    {
        name: "Aruba",
        code: "AW",
        label: "Aruba",
        value: "Aruba"
    },
    {
        name: "Australia",
        code: "AU",
        label: "Australia",
        value: "Australia"
    },
    {
        name: "Austria",
        code: "AT",
        label: "Austria",
        value: "Austria"
    },
    {
        name: "Azerbaijan",
        code: "AZ",
        label: "Azerbaijan",
        value: "Azerbaijan"
    },
    {
        name: "Bahamas",
        code: "BS",
        label: "Bahamas",
        value: "Bahamas"
    },
    {
        name: "Bahrain",
        code: "BH",
        label: "Bahrain",
        value: "Bahrain"
    },
    {
        name: "Bangladesh",
        code: "BD",
        label: "Bangladesh",
        value: "Bangladesh"
    },
    {
        name: "Barbados",
        code: "BB",
        label: "Barbados",
        value: "Barbados"
    },
    {
        name: "Belarus",
        code: "BY",
        label: "Belarus",
        value: "Belarus"
    },
    {
        name: "Belgium",
        code: "BE",
        label: "Belgium",
        value: "Belgium"
    },
    {
        name: "Belize",
        code: "BZ",
        label: "Belize",
        value: "Belize"
    },
    {
        name: "Benin",
        code: "BJ",
        label: "Benin",
        value: "Benin"
    },
    {
        name: "Bermuda",
        code: "BM",
        label: "Bermuda",
        value: "Bermuda"
    },
    {
        name: "Bhutan",
        code: "BT",
        label: "Bhutan",
        value: "Bhutan"
    },
    {
        name: "Bolivia",
        code: "BO",
        label: "Bolivia",
        value: "Bolivia"
    },
    {
        name: "Bosnia and Herzegovina",
        code: "BA",
        label: "Bosnia and Herzegovina",
        value: "Bosnia and Herzegovina"
    },
    {
        name: "Botswana",
        code: "BW",
        label: "Botswana",
        value: "Botswana"
    },
    {
        name: "Bouvet Island",
        code: "BV",
        label: "Bouvet Island",
        value: "Bouvet Island"
    },
    {
        name: "Brazil",
        code: "BR",
        label: "Brazil",
        value: "Brazil"
    },
    {
        name: "British Indian Ocean Territory",
        code: "IO",
        label: "British Indian Ocean Territory",
        value: "British Indian Ocean Territory"
    },
    {
        name: "Brunei Darussalam",
        code: "BN",
        label: "Brunei Darussalam",
        value: "Brunei Darussalam"
    },
    {
        name: "Bulgaria",
        code: "BG",
        label: "Bulgaria",
        value: "Bulgaria"
    },
    {
        name: "Burkina Faso",
        code: "BF",
        label: "Burkina Faso",
        value: "Burkina Faso"
    },
    {
        name: "Burundi",
        code: "BI",
        label: "Burundi",
        value: "Burundi"
    },
    {
        name: "Cambodia",
        code: "KH",
        label: "Cambodia",
        value: "Cambodia"
    },
    {
        name: "Cameroon",
        code: "CM",
        label: "Cameroon",
        value: "Cameroon"
    },
    {
        name: "Canada",
        code: "CA",
        label: "Canada",
        value: "Canada"
    },
    {
        name: "Cape Verde",
        code: "CV",
        label: "Cape Verde",
        value: "Cape Verde"
    },
    {
        name: "Cayman Islands",
        code: "KY",
        label: "Cayman Islands",
        value: "Cayman Islands"
    },
    {
        name: "Central African Republic",
        code: "CF",
        label: "Central African Republic",
        value: "Central African Republic"
    },
    {
        name: "Chad",
        code: "TD",
        label: "Chad",
        value: "Chad"
    },
    {
        name: "Chile",
        code: "CL",
        label: "Chile",
        value: "Chile"
    },
    {
        name: "China",
        code: "CN",
        label: "China",
        value: "China"
    },
    {
        name: "Christmas Island",
        code: "CX",
        label: "Christmas Island",
        value: "Christmas Island"
    },
    {
        name: "Cocos (Keeling) Islands",
        code: "CC",
        label: "Cocos (Keeling) Islands",
        value: "Cocos (Keeling) Islands"
    },
    {
        name: "Colombia",
        code: "CO",
        label: "Colombia",
        value: "Colombia"
    },
    {
        name: "Comoros",
        code: "KM",
        label: "Comoros",
        value: "Comoros"
    },
    {
        name: "Congo",
        code: "CG",
        label: "Congo",
        value: "Congo"
    },
    {
        name: "Congo, The Democratic Republic of the",
        code: "CD",
        label: "Congo, The Democratic Republic of the",
        value: "Congo, The Democratic Republic of the"
    },
    {
        name: "Cook Islands",
        code: "CK",
        label: "Cook Islands",
        value: "Cook Islands"
    },
    {
        name: "Costa Rica",
        code: "CR",
        label: "Costa Rica",
        value: "Costa Rica"
    },
    {
        name: "Cote D'Ivoire",
        code: "CI",
        label: "Cote D'Ivoire",
        value: "Cote D'Ivoire"
    },
    {
        name: "Croatia",
        code: "HR",
        label: "Croatia",
        value: "Croatia"
    },
    {
        name: "Cuba",
        code: "CU",
        label: "Cuba",
        value: "Cuba"
    },
    {
        name: "Cyprus",
        code: "CY",
        label: "Cyprus",
        value: "Cyprus"
    },
    {
        name: "Czech Republic",
        code: "CZ",
        label: "Czech Republic",
        value: "Czech Republic"
    },
    {
        name: "Denmark",
        code: "DK",
        label: "Denmark",
        value: "Denmark"
    },
    {
        name: "Djibouti",
        code: "DJ",
        label: "Djibouti",
        value: "Djibouti"
    },
    {
        name: "Dominica",
        code: "DM",
        label: "Dominica",
        value: "Dominica"
    },
    {
        name: "Dominican Republic",
        code: "DO",
        label: "Dominican Republic",
        value: "Dominican Republic"
    },
    {
        name: "Ecuador",
        code: "EC",
        label: "Ecuador",
        value: "Ecuador"
    },
    {
        name: "Egypt",
        code: "EG",
        label: "Egypt",
        value: "Egypt"
    },
    {
        name: "El Salvador",
        code: "SV",
        label: "El Salvador",
        value: "El Salvador"
    },
    {
        name: "Equatorial Guinea",
        code: "GQ",
        label: "Equatorial Guinea",
        value: "Equatorial Guinea"
    },
    {
        name: "Eritrea",
        code: "ER",
        label: "Eritrea",
        value: "Eritrea"
    },
    {
        name: "Estonia",
        code: "EE",
        label: "Estonia",
        value: "Estonia"
    },
    {
        name: "Ethiopia",
        code: "ET",
        label: "Ethiopia",
        value: "Ethiopia"
    },
    {
        name: "Falkland Islands (Malvinas)",
        code: "FK",
        label: "Falkland Islands (Malvinas)",
        value: "Falkland Islands (Malvinas)"
    },
    {
        name: "Faroe Islands",
        code: "FO",
        label: "Faroe Islands",
        value: "Faroe Islands"
    },
    {
        name: "Fiji",
        code: "FJ",
        label: "Fiji",
        value: "Fiji"
    },
    {
        name: "Finland",
        code: "FI",
        label: "Finland",
        value: "Finland"
    },
    {
        name: "France",
        code: "FR",
        label: "France",
        value: "France"
    },
    {
        name: "French Guiana",
        code: "GF",
        label: "French Guiana",
        value: "French Guiana"
    },
    {
        name: "French Polynesia",
        code: "PF",
        label: "French Polynesia",
        value: "French Polynesia"
    },
    {
        name: "French Southern Territories",
        code: "TF",
        label: "French Southern Territories",
        value: "French Southern Territories"
    },
    {
        name: "Gabon",
        code: "GA",
        label: "Gabon",
        value: "Gabon"
    },
    {
        name: "Gambia",
        code: "GM",
        label: "Gambia",
        value: "Gambia"
    },
    {
        name: "Georgia",
        code: "GE",
        label: "Georgia",
        value: "Georgia"
    },
    {
        name: "Germany",
        code: "DE",
        label: "Germany",
        value: "Germany"
    },
    {
        name: "Ghana",
        code: "GH",
        label: "Ghana",
        value: "Ghana"
    },
    {
        name: "Gibraltar",
        code: "GI",
        label: "Gibraltar",
        value: "Gibraltar"
    },
    {
        name: "Greece",
        code: "GR",
        label: "Greece",
        value: "Greece"
    },
    {
        name: "Greenland",
        code: "GL",
        label: "Greenland",
        value: "Greenland"
    },
    {
        name: "Grenada",
        code: "GD",
        label: "Grenada",
        value: "Grenada"
    },
    {
        name: "Guadeloupe",
        code: "GP",
        label: "Guadeloupe",
        value: "Guadeloupe"
    },
    {
        name: "Guam",
        code: "GU",
        label: "Guam",
        value: "Guam"
    },
    {
        name: "Guatemala",
        code: "GT",
        label: "Guatemala",
        value: "Guatemala"
    },
    {
        name: "Guernsey",
        code: "GG",
        label: "Guernsey",
        value: "Guernsey"
    },
    {
        name: "Guinea",
        code: "GN",
        label: "Guinea",
        value: "Guinea"
    },
    {
        name: "Guinea-Bissau",
        code: "GW",
        label: "Guinea-Bissau",
        value: "Guinea-Bissau"
    },
    {
        name: "Guyana",
        code: "GY",
        label: "Guyana",
        value: "Guyana"
    },
    {
        name: "Haiti",
        code: "HT",
        label: "Haiti",
        value: "Haiti"
    },
    {
        name: "Heard Island and Mcdonald Islands",
        code: "HM",
        label: "Heard Island and Mcdonald Islands",
        value: "Heard Island and Mcdonald Islands"
    },
    {
        name: "Holy See (Vatican City State)",
        code: "VA",
        label: "Holy See (Vatican City State)",
        value: "Holy See (Vatican City State)"
    },
    {
        name: "Honduras",
        code: "HN",
        label: "Honduras",
        value: "Honduras"
    },
    {
        name: "Hong Kong",
        code: "HK",
        label: "Hong Kong",
        value: "Hong Kong"
    },
    {
        name: "Hungary",
        code: "HU",
        label: "Hungary",
        value: "Hungary"
    },
    {
        name: "Iceland",
        code: "IS",
        label: "Iceland",
        value: "Iceland"
    },
    {
        name: "India",
        code: "IN",
        label: "India",
        value: "India"
    },
    {
        name: "Indonesia",
        code: "ID",
        label: "Indonesia",
        value: "Indonesia"
    },
    {
        name: "Iran, Islamic Republic Of",
        code: "IR",
        label: "Iran, Islamic Republic Of",
        value: "Iran, Islamic Republic Of"
    },
    {
        name: "Iraq",
        code: "IQ",
        label: "Iraq",
        value: "Iraq"
    },
    {
        name: "Ireland",
        code: "IE",
        label: "Ireland",
        value: "Ireland"
    },
    {
        name: "Isle of Man",
        code: "IM",
        label: "Isle of Man",
        value: "Isle of Man"
    },
    {
        name: "Israel",
        code: "IL",
        label: "Israel",
        value: "Israel"
    },
    {
        name: "Italy",
        code: "IT",
        label: "Italy",
        value: "Italy"
    },
    {
        name: "Jamaica",
        code: "JM",
        label: "Jamaica",
        value: "Jamaica"
    },
    {
        name: "Japan",
        code: "JP",
        label: "Japan",
        value: "Japan"
    },
    {
        name: "Jersey",
        code: "JE",
        label: "Jersey",
        value: "Jersey"
    },
    {
        name: "Jordan",
        code: "JO",
        label: "Jordan",
        value: "Jordan"
    },
    {
        name: "Kazakhstan",
        code: "KZ",
        label: "Kazakhstan",
        value: "Kazakhstan"
    },
    {
        name: "Kenya",
        code: "KE",
        label: "Kenya",
        value: "Kenya"
    },
    {
        name: "Kiribati",
        code: "KI",
        label: "Kiribati",
        value: "Kiribati"
    },
    {
        name: "Korea, Democratic People'S Republic of",
        code: "KP",
        label: "Korea, Democratic People'S Republic of",
        value: "Korea, Democratic People'S Republic of"
    },
    {
        name: "Korea, Republic of",
        code: "KR",
        label: "Korea, Republic of",
        value: "Korea, Republic of"
    },
    {
        name: "Kuwait",
        code: "KW",
        label: "Kuwait",
        value: "Kuwait"
    },
    {
        name: "Kyrgyzstan",
        code: "KG",
        label: "Kyrgyzstan",
        value: "Kyrgyzstan"
    },
    {
        name: "Lao People'S Democratic Republic",
        code: "LA",
        label: "Lao People'S Democratic Republic",
        value: "Lao People'S Democratic Republic"
    },
    {
        name: "Latvia",
        code: "LV",
        label: "Latvia",
        value: "Latvia"
    },
    {
        name: "Lebanon",
        code: "LB",
        label: "Lebanon",
        value: "Lebanon"
    },
    {
        name: "Lesotho",
        code: "LS",
        label: "Lesotho",
        value: "Lesotho"
    },
    {
        name: "Liberia",
        code: "LR",
        label: "Liberia",
        value: "Liberia"
    },
    {
        name: "Libyan Arab Jamahiriya",
        code: "LY",
        label: "Libyan Arab Jamahiriya",
        value: "Libyan Arab Jamahiriya"
    },
    {
        name: "Liechtenstein",
        code: "LI",
        label: "Liechtenstein",
        value: "Liechtenstein"
    },
    {
        name: "Lithuania",
        code: "LT",
        label: "Lithuania",
        value: "Lithuania"
    },
    {
        name: "Luxembourg",
        code: "LU",
        label: "Luxembourg",
        value: "Luxembourg"
    },
    {
        name: "Macao",
        code: "MO",
        label: "Macao",
        value: "Macao"
    },
    {
        name: "Macedonia, The Former Yugoslav Republic of",
        code: "MK",
        label: "Macedonia, The Former Yugoslav Republic of",
        value: "Macedonia, The Former Yugoslav Republic of"
    },
    {
        name: "Madagascar",
        code: "MG",
        label: "Madagascar",
        value: "Madagascar"
    },
    {
        name: "Malawi",
        code: "MW",
        label: "Malawi",
        value: "Malawi"
    },
    {
        name: "Malaysia",
        code: "MY",
        label: "Malaysia",
        value: "Malaysia"
    },
    {
        name: "Maldives",
        code: "MV",
        label: "Maldives",
        value: "Maldives"
    },
    {
        name: "Mali",
        code: "ML",
        label: "Mali",
        value: "Mali"
    },
    {
        name: "Malta",
        code: "MT",
        label: "Malta",
        value: "Malta"
    },
    {
        name: "Marshall Islands",
        code: "MH",
        label: "Marshall Islands",
        value: "Marshall Islands"
    },
    {
        name: "Martinique",
        code: "MQ",
        label: "Martinique",
        value: "Martinique"
    },
    {
        name: "Mauritania",
        code: "MR",
        label: "Mauritania",
        value: "Mauritania"
    },
    {
        name: "Mauritius",
        code: "MU",
        label: "Mauritius",
        value: "Mauritius"
    },
    {
        name: "Mayotte",
        code: "YT",
        label: "Mayotte",
        value: "Mayotte"
    },
    {
        name: "Mexico",
        code: "MX",
        label: "Mexico",
        value: "Mexico"
    },
    {
        name: "Micronesia, Federated States of",
        code: "FM",
        label: "Micronesia, Federated States of",
        value: "Micronesia, Federated States of"
    },
    {
        name: "Moldova, Republic of",
        code: "MD",
        label: "Moldova, Republic of",
        value: "Moldova, Republic of"
    },
    {
        name: "Monaco",
        code: "MC",
        label: "Monaco",
        value: "Monaco"
    },
    {
        name: "Mongolia",
        code: "MN",
        label: "Mongolia",
        value: "Mongolia"
    },
    {
        name: "Montserrat",
        code: "MS",
        label: "Montserrat",
        value: "Montserrat"
    },
    {
        name: "Morocco",
        code: "MA",
        label: "Morocco",
        value: "Morocco"
    },
    {
        name: "Mozambique",
        code: "MZ",
        label: "Mozambique",
        value: "Mozambique"
    },
    {
        name: "Myanmar",
        code: "MM",
        label: "Myanmar",
        value: "Myanmar"
    },
    {
        name: "Namibia",
        code: "NA",
        label: "Namibia",
        value: "Namibia"
    },
    {
        name: "Nauru",
        code: "NR",
        label: "Nauru",
        value: "Nauru"
    },
    {
        name: "Nepal",
        code: "NP",
        label: "Nepal",
        value: "Nepal"
    },
    {
        name: "Netherlands",
        code: "NL",
        label: "Netherlands",
        value: "Netherlands"
    },
    {
        name: "Netherlands Antilles",
        code: "AN",
        label: "Netherlands Antilles",
        value: "Netherlands Antilles"
    },
    {
        name: "New Caledonia",
        code: "NC",
        label: "New Caledonia",
        value: "New Caledonia"
    },
    {
        name: "New Zealand",
        code: "NZ",
        label: "New Zealand",
        value: "New Zealand"
    },
    {
        name: "Nicaragua",
        code: "NI",
        label: "Nicaragua",
        value: "Nicaragua"
    },
    {
        name: "Niger",
        code: "NE",
        label: "Niger",
        value: "Niger"
    },
    {
        name: "Nigeria",
        code: "NG",
        label: "Nigeria",
        value: "Nigeria"
    },
    {
        name: "Niue",
        code: "NU",
        label: "Niue",
        value: "Niue"
    },
    {
        name: "Norfolk Island",
        code: "NF",
        label: "Norfolk Island",
        value: "Norfolk Island"
    },
    {
        name: "Northern Mariana Islands",
        code: "MP",
        label: "Northern Mariana Islands",
        value: "Northern Mariana Islands"
    },
    {
        name: "Norway",
        code: "NO",
        label: "Norway",
        value: "Norway"
    },
    {
        name: "Oman",
        code: "OM",
        label: "Oman",
        value: "Oman"
    },
    {
        name: "Pakistan",
        code: "PK",
        label: "Pakistan",
        value: "Pakistan"
    },
    {
        name: "Palau",
        code: "PW",
        label: "Palau",
        value: "Palau"
    },
    {
        name: "Palestinian Territory, Occupied",
        code: "PS",
        label: "Palestinian Territory, Occupied",
        value: "Palestinian Territory, Occupied"
    },
    {
        name: "Panama",
        code: "PA",
        label: "Panama",
        value: "Panama"
    },
    {
        name: "Papua New Guinea",
        code: "PG",
        label: "Papua New Guinea",
        value: "Papua New Guinea"
    },
    {
        name: "Paraguay",
        code: "PY",
        label: "Paraguay",
        value: "Paraguay"
    },
    {
        name: "Peru",
        code: "PE",
        label: "Peru",
        value: "Peru"
    },
    {
        name: "Philippines",
        code: "PH",
        label: "Philippines",
        value: "Philippines"
    },
    {
        name: "Pitcairn",
        code: "PN",
        label: "Pitcairn",
        value: "Pitcairn"
    },
    {
        name: "Poland",
        code: "PL",
        label: "Poland",
        value: "Poland"
    },
    {
        name: "Portugal",
        code: "PT",
        label: "Portugal",
        value: "Portugal"
    },
    {
        name: "Puerto Rico",
        code: "PR",
        label: "Puerto Rico",
        value: "Puerto Rico"
    },
    {
        name: "Qatar",
        code: "QA",
        label: "Qatar",
        value: "Qatar"
    },
    {
        name: "Reunion",
        code: "RE",
        label: "Reunion",
        value: "Reunion"
    },
    {
        name: "Romania",
        code: "RO",
        label: "Romania",
        value: "Romania"
    },
    {
        name: "Russian Federation",
        code: "RU",
        label: "Russian Federation",
        value: "Russian Federation"
    },
    {
        name: "RWANDA",
        code: "RW",
        label: "RWANDA",
        value: "RWANDA"
    },
    {
        name: "Saint Helena",
        code: "SH",
        label: "Saint Helena",
        value: "Saint Helena"
    },
    {
        name: "Saint Kitts and Nevis",
        code: "KN",
        label: "Saint Kitts and Nevis",
        value: "Saint Kitts and Nevis"
    },
    {
        name: "Saint Lucia",
        code: "LC",
        label: "Saint Lucia",
        value: "Saint Lucia"
    },
    {
        name: "Saint Pierre and Miquelon",
        code: "PM",
        label: "Saint Pierre and Miquelon",
        value: "Saint Pierre and Miquelon"
    },
    {
        name: "Saint Vincent and the Grenadines",
        code: "VC",
        label: "Saint Vincent and the Grenadines",
        value: "Saint Vincent and the Grenadines"
    },
    {
        name: "Samoa",
        code: "WS",
        label: "Samoa",
        value: "Samoa"
    },
    {
        name: "San Marino",
        code: "SM",
        label: "San Marino",
        value: "San Marino"
    },
    {
        name: "Sao Tome and Principe",
        code: "ST",
        label: "Sao Tome and Principe",
        value: "Sao Tome and Principe"
    },
    {
        name: "Saudi Arabia",
        code: "SA",
        label: "Saudi Arabia",
        value: "Saudi Arabia"
    },
    {
        name: "Senegal",
        code: "SN",
        label: "Senegal",
        value: "Senegal"
    },
    {
        name: "Serbia and Montenegro",
        code: "CS",
        label: "Serbia and Montenegro",
        value: "Serbia and Montenegro"
    },
    {
        name: "Seychelles",
        code: "SC",
        label: "Seychelles",
        value: "Seychelles"
    },
    {
        name: "Sierra Leone",
        code: "SL",
        label: "Sierra Leone",
        value: "Sierra Leone"
    },
    {
        name: "Singapore",
        code: "SG",
        label: "Singapore",
        value: "Singapore"
    },
    {
        name: "Slovakia",
        code: "SK",
        label: "Slovakia",
        value: "Slovakia"
    },
    {
        name: "Slovenia",
        code: "SI",
        label: "Slovenia",
        value: "Slovenia"
    },
    {
        name: "Solomon Islands",
        code: "SB",
        label: "Solomon Islands",
        value: "Solomon Islands"
    },
    {
        name: "Somalia",
        code: "SO",
        label: "Somalia",
        value: "Somalia"
    },
    {
        name: "South Africa",
        code: "ZA",
        label: "South Africa",
        value: "South Africa"
    },
    {
        name: "South Georgia and the South Sandwich Islands",
        code: "GS",
        label: "South Georgia and the South Sandwich Islands",
        value: "South Georgia and the South Sandwich Islands"
    },
    {
        name: "Spain",
        code: "ES",
        label: "Spain",
        value: "Spain"
    },
    {
        name: "Sri Lanka",
        code: "LK",
        label: "Sri Lanka",
        value: "Sri Lanka"
    },
    {
        name: "Sudan",
        code: "SD",
        label: "Sudan",
        value: "Sudan"
    },
    {
        name: "Suriname",
        code: "SR",
        label: "Suriname",
        value: "Suriname"
    },
    {
        name: "Svalbard and Jan Mayen",
        code: "SJ",
        label: "Svalbard and Jan Mayen",
        value: "Svalbard and Jan Mayen"
    },
    {
        name: "Swaziland",
        code: "SZ",
        label: "Swaziland",
        value: "Swaziland"
    },
    {
        name: "Sweden",
        code: "SE",
        label: "Sweden",
        value: "Sweden"
    },
    {
        name: "Switzerland",
        code: "CH",
        label: "Switzerland",
        value: "Switzerland"
    },
    {
        name: "Syrian Arab Republic",
        code: "SY",
        label: "Syrian Arab Republic",
        value: "Syrian Arab Republic"
    },
    {
        name: "Taiwan, Province of China",
        code: "TW",
        label: "Taiwan, Province of China",
        value: "Taiwan, Province of China"
    },
    {
        name: "Tajikistan",
        code: "TJ",
        label: "Tajikistan",
        value: "Tajikistan"
    },
    {
        name: "Tanzania, United Republic of",
        code: "TZ",
        label: "Tanzania, United Republic of",
        value: "Tanzania, United Republic of"
    },
    {
        name: "Thailand",
        code: "TH",
        label: "Thailand",
        value: "Thailand"
    },
    {
        name: "Timor-Leste",
        code: "TL",
        label: "Timor-Leste",
        value: "Timor-Leste"
    },
    {
        name: "Togo",
        code: "TG",
        label: "Togo",
        value: "Togo"
    },
    {
        name: "Tokelau",
        code: "TK",
        label: "Tokelau",
        value: "Tokelau"
    },
    {
        name: "Tonga",
        code: "TO",
        label: "Tonga",
        value: "Tonga"
    },
    {
        name: "Trinidad and Tobago",
        code: "TT",
        label: "Trinidad and Tobago",
        value: "Trinidad and Tobago"
    },
    {
        name: "Tunisia",
        code: "TN",
        label: "Tunisia",
        value: "Tunisia"
    },
    {
        name: "Turkey",
        code: "TR",
        label: "Turkey",
        value: "Turkey"
    },
    {
        name: "Turkmenistan",
        code: "TM",
        label: "Turkmenistan",
        value: "Turkmenistan"
    },
    {
        name: "Turks and Caicos Islands",
        code: "TC",
        label: "Turks and Caicos Islands",
        value: "Turks and Caicos Islands"
    },
    {
        name: "Tuvalu",
        code: "TV",
        label: "Tuvalu",
        value: "Tuvalu"
    },
    {
        name: "Uganda",
        code: "UG",
        label: "Uganda",
        value: "Uganda"
    },
    {
        name: "Ukraine",
        code: "UA",
        label: "Ukraine",
        value: "Ukraine"
    },
    {
        name: "United Arab Emirates",
        code: "AE",
        label: "United Arab Emirates",
        value: "United Arab Emirates"
    },
    {
        name: "United Kingdom",
        code: "GB",
        label: "United Kingdom",
        value: "United Kingdom"
    },
    {
        name: "United States",
        code: "US",
        label: "United States",
        value: "United States"
    },
    {
        name: "United States Minor Outlying Islands",
        code: "UM",
        label: "United States Minor Outlying Islands",
        value: "United States Minor Outlying Islands"
    },
    {
        name: "Uruguay",
        code: "UY",
        label: "Uruguay",
        value: "Uruguay"
    },
    {
        name: "Uzbekistan",
        code: "UZ",
        label: "Uzbekistan",
        value: "Uzbekistan"
    },
    {
        name: "Vanuatu",
        code: "VU",
        label: "Vanuatu",
        value: "Vanuatu"
    },
    {
        name: "Venezuela",
        code: "VE",
        label: "Venezuela",
        value: "Venezuela"
    },
    {
        name: "Viet Nam",
        code: "VN",
        label: "Viet Nam",
        value: "Viet Nam"
    },
    {
        name: "Virgin Islands, British",
        code: "VG",
        label: "Virgin Islands, British",
        value: "Virgin Islands, British"
    },
    {
        name: "Virgin Islands, U.S.",
        code: "VI",
        label: "Virgin Islands, U.S.",
        value: "Virgin Islands, U.S."
    },
    {
        name: "Wallis and Futuna",
        code: "WF",
        label: "Wallis and Futuna",
        value: "Wallis and Futuna"
    },
    {
        name: "Western Sahara",
        code: "EH",
        label: "Western Sahara",
        value: "Western Sahara"
    },
    {
        name: "Yemen",
        code: "YE",
        label: "Yemen",
        value: "Yemen"
    },
    {
        name: "Zambia",
        code: "ZM",
        label: "Zambia",
        value: "Zambia"
    },
    {
        name: "Zimbabwe",
        code: "ZW",
        label: "Zimbabwe",
        value: "Zimbabwe"
    }
];