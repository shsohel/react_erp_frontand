import React from 'react';

const ItemGroupExpandRow = ( { data } ) => {
    return (
        <div>
            <div
                style={{ backgroundColor: 'white', color: 'black' }} className='expandable-content p-2'

            >
                <p >
                    <span className='font-weight-bold'>Description :</span>
                    {data.description}


                </p>

            </div>
        </div>
    );
};

export default ItemGroupExpandRow;
