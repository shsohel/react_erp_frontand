import React from 'react';
import { useSelector } from 'react-redux';

const PurchaseOrderMainForm = () => {
    const { isItSetOrder, purchaseOrders, total, queryData, selectedPurchaseOrder, openPurchaseOrderForm } = useSelector( ( { purchaseOrders } ) => purchaseOrders );

    return (
        <div>

        </div>
    );
};

export default PurchaseOrderMainForm;
