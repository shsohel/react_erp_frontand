import '@custom-styles/merchandising/merchandising-core.scss';
import React from 'react';
import { useSelector } from 'react-redux';
import SetStyleList from './SetStyleList';


const SetStyles = () => {
    const { setStyles, total, queryData, isSetStyleDataLoaded } = useSelector( ( { setStyles } ) => setStyles );
    return (
        <div className='merchandising-style-list'>
            <SetStyleList setStyles={setStyles} total={total} queryData={queryData} />
        </div>
    );
};

export default SetStyles;
