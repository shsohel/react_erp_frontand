import React from 'react';
import { useSelector } from 'react-redux';
import PreCostingList from './PreCostingList';

const PreCositngs = () => {
    const { preCostings, total, queryData, selectedPreCosting } = useSelector( ( { preCostings } ) => preCostings );

    return (
        <div>
            <PreCostingList
                preCostings={preCostings}
                queryData={queryData}
                total={total}
                selectedPreCosting={selectedPreCosting}
            />
        </div>
    );
};

export default PreCositngs;
