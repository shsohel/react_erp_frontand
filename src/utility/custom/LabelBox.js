import React from 'react';
import './label.scss';
const LabelBox = ( { text } ) => {
    return (
        <div className='label-box'>
            {text}
        </div>
    );
};

export default LabelBox;