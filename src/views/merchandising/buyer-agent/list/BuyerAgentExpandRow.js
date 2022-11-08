import React from 'react';

const BuyerAgentExpandRow = ( { data } ) => {
    return (
        <div
            style={{ backgroundColor: 'white', color: 'black' }} className='expandable-content p-2'

        >
            <p >
                <span ><strong>Address : </strong>{data.fullAddress}, </span>

                <span> <strong>Country :</strong> {data.country}, </span>


                <span><strong>State : </strong>{data.state},</span>


                <span > <strong>City : </strong>
                    {data.city},
                </span>

                <span > <strong>Postal Code :</strong>
                    {data.postalCode},

                </span>


            </p>

        </div>
    );
};

export default BuyerAgentExpandRow;
