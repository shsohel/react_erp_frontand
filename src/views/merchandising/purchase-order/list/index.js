import '@custom-styles/merchandising/merchandising-core.scss';
import '@styles/react/libs/react-select/_react-select.scss';
import React from 'react';
import { useSelector } from 'react-redux';
import PurchaseOrderList from './PurchaseOrderList';

const PurchaseOrders = () => {
    const { totalSelectedStyles, purchaseOrders, total, queryData, selectedPurchaseOrder } = useSelector( ( { purchaseOrders } ) => purchaseOrders );
    console.log( queryData );
    return (
        <>
            {
                <div>
                    <PurchaseOrderList
                        purchaseOrders={purchaseOrders}
                        total={total}
                        queryData={queryData}
                    />
                </div>
            }
        </>

    );
};

export default PurchaseOrders;
