import React from 'react';

const StatusExpandRow = ( { data } ) => {
    return (
        <div
            style={{ backgroundColor: 'white', color: 'black' }} className='expandable-content p-2'

        >
            <p >
                <span className='font-weight-bold'>Status For :</span>
                {data.statusFor}


            </p>

        </div>
    );
};

export default StatusExpandRow;
