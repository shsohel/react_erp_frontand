import React from 'react';
import { useSelector } from 'react-redux';
import CostingList from './CostingList';

const Costings = () => {
    const { costings, total, queryData, selectedCosting } = useSelector( ( { costings } ) => costings );

    return (
        <div>
            <CostingList
                costings={costings}
                queryData={queryData}
                total={total}
                selectedCosting={selectedCosting}
            />
        </div>
    );
};

export default Costings;
