import React from 'react';
import UnitSetList from './UnitSetList';
const breadcrumb = [
    {
        id: 'home',
        name: 'Home',
        link: "/",
        isActive: false
    },
    {
        id: 'unitSetList',
        name: 'Unit Sets',
        link: "/unit-set",
        isActive: true
    }
];

const UnitSets = () => {
    return (
        <div>
            <UnitSetList />
        </div>
    );
};

export default UnitSets;
