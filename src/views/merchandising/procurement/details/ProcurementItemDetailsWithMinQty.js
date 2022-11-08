import _ from 'lodash';
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { isZeroToFixed } from "../../../../utility/Utils";


const ProcurementItemDetailsWithMinQty = () => {
    const { itemDetailsWithMinOder } = useSelector( ( { procurements } ) => procurements );
    return (
        <DataTable
            pagination
            noHeader
            responsive
            data={_.orderBy( itemDetailsWithMinOder, ['itemGroupId', 'itemSubGroupId'] )}
            className='react-custom-dataTable-other'
            persistTableHead
            dense
            paginationTotalRows={itemDetailsWithMinOder.length}
            columns={
                [

                    {
                        id: "itemGroup",
                        name: 'Item Group',
                        minWidth: '150px',
                        selector: row => row.itemGroup,
                        center: true,
                        cell: row => row.itemGroup
                    },
                    {
                        id: "itemSubGroup",
                        name: 'Item Sub Group',
                        minWidth: '180px',
                        selector: row => row.itemSubGroup,
                        cell: row => row.itemSubGroup
                    },
                    {
                        id: row => row.itemName,
                        allowOverflow: true,
                        name: 'Item Description',

                        minWidth: '500px',
                        selector: row => row.itemName,
                        cell: row => row.itemName
                    },
                    {
                        id: "bomUom",
                        name: 'UOM',
                        minWidth: '100px',
                        center: true,
                        selector: row => row.bomUom,
                        cell: row => row.bomUom
                    },
                    {
                        id: 'totalOrderQty',
                        name: 'Order Qty',
                        minWidth: '130px',
                        center: true,
                        allowOverflow: true,
                        selector: row => row.totalOrderQty,
                        cell: row => isZeroToFixed( row?.totalOrderQty, 4 )
                    },

                    {
                        id: 'minimumOrderQty',
                        name: 'Min Order Qty',
                        minWidth: '110px',
                        center: true,
                        selector: row => row.minOrderQty,
                        cell: row => isZeroToFixed( row.minOrderQty, 4 )
                    }

                ]}
        />
    );
};

export default ProcurementItemDetailsWithMinQty;