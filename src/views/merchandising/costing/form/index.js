import '@custom-styles/merchandising/form/costing-form.scss';

import '@custom-styles/merchandising/others/custom-table.scss';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { defaultUnitId } from '../../../../utility/enums';
import { getDefaultUOMDropdownByUnitId } from '../../../inventory/unit-sets/store/actions';
import CostingAddForm from './CostingAddForm';


const Costing = () => {
    const dispatch = useDispatch();
    useEffect( () => {
        dispatch( getDefaultUOMDropdownByUnitId( defaultUnitId ) );
    }, [] );


    return (
        <div>
            <CostingAddForm />
        </div>
    );
};

export default Costing;
