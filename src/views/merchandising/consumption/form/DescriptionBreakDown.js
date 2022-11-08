import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { randomIdGenerator } from '../../../../utility/Utils';

const DescriptionBreakDown = ( { fabric } ) => {
    const dispatch = useDispatch();
    const { itemSegmentsArray } = useSelector( ( { itemGroups } ) => itemGroups );
    const {
        consumptionFabricDetails,
        consumptionAccessoriesDetails,
        consumptionBasicInfo
    } = useSelector( ( { consumptions } ) => consumptions );
    //  console.log( itemSegmentsArray );


    const itemDecExit = fabric.itemDescriptionTemplate ? JSON.parse( fabric.itemDescriptionTemplate ) : [];

    const getExitingSegmentValue = ( segmentId ) => {
        const value = { label: itemDecExit.find( i => i.id === segmentId )?.value, value: itemDecExit.find( i => i.id === segmentId )?.value };
        console.log( value );

        return value;
    };

    const itemSegmentArray = itemSegmentsArray?.map( rd => ( {
        fieldId: randomIdGenerator(),
        itemGroupId: fabric.itemGroupId,
        isColorSensitive: rd.isColorSensitive,
        isSizeSensitive: rd.isSizeSensitive,
        segment: rd,
        segmentValues: [],
        value: getExitingSegmentValue( rd.segment.segmentId )?.label?.length ? getExitingSegmentValue( rd.segment.segmentId ) : null
    } ) );
    console.log( itemSegmentArray );

    // const updatedData = consumptionFabricDetails.map( i => {
    //     if ( fabric?.fieldId === i.fieldId ) {
    //         i['itemSegments'] = itemSegmentArray;
    //     }
    //     return i;
    // } );
    // dispatch( bindConsumptionFabricDetails( updatedData ) );
    return (
        <Fragment>
            <td></td>
            <td></td>
            <td></td>
        </Fragment>
    );
};

export default DescriptionBreakDown;