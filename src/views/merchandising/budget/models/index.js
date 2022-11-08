export const budgetBasicModel = {
    buyer: null,
    budgetCategory: '',
    budgetCurrentCategory: '',
    budgetNumber: '',
    approvedDate: '',
    approvedBy: '',
    bomIsRegenerateState: false,
    status: { label: 'Draft', value: 'Draft' },
    updateStatus: null,
    dataAlreadyLoaded: false
};

export const serviceCostSummaryModel = [
    {
        id: 1,
        serviceGroup: "Embroidery ",
        totalBuyerCost: 0,
        totalInHouseCost: 0,
        approvedAmount: 0
    },
    {
        id: 2,
        serviceGroup: "Print",
        totalBuyerCost: 0,
        totalInHouseCost: 0,
        approvedAmount: 0
    },
    {
        id: 3,
        serviceGroup: "Wash",
        totalBuyerCost: 0,
        totalInHouseCost: 0,
        approvedAmount: 0
    }
];