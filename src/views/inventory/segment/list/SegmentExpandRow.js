import React from 'react';

const SegmentExpandRow = ( data ) => {
    return (
        <div
            style={{ backgroundColor: 'white', color: 'black' }} className='expandable-content p-2'

        >
            <p >
                <span className='font-weight-bold'>Description :</span>
                {data.description}


            </p>

        </div>
    );
};

export default SegmentExpandRow;
