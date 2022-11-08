import React from 'react';

function StyleExpandRow( { data } ) {
    return (

        <div style={{ backgroundColor: 'white', color: 'black' }} className='expandable-content p-2'>
            <p>

                <span className='font-weight-bold'>Remarks :</span> {data.remarks}
            </p>
            {/* <p>
                <span className='font-weight-bold'>Sample Images:</span>

            </p> */}

            {/* {
                data?.images?.map( ( image ) => (
                    <Fragment key={image.id}>
                        <img className='style-upload-image border border-primary img-thumbnail p-2 ' src={image.urls} alt="" />

                        <Eye className='upload-image-remove-btn' color='grey' onClick={( e ) => { e.preventDefault(); }} />

                    </Fragment>
                ) )
            } */}
        </div>
    );
}

export default StyleExpandRow;
