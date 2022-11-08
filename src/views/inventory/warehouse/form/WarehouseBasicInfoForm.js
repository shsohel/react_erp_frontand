import classnames from 'classnames';
import moment from 'moment';
import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { Col, Input, Label, Row } from 'reactstrap';
import { selectAccessoriesType } from '../../../../utility/enums';
import { selectThemeColors } from '../../../../utility/Utils';
const WarehouseBasicInfoForm = ( { warehouse, setWarehouse } ) => {

    const handleWarehouseBasicInputOnChange = ( e ) => {
        const { name, value, checked, type } = e.target;
        setWarehouse( {
            ...warehouse,
            [name]: type === 'number' ? Number( value ) : type === 'date' ? moment( value ).format( 'yy-MM-DD' ) : value
        } );
    };

    const handleBasicInfoDropdownChange = ( data, e ) => {
        const { action, name, option } = e;
        setWarehouse( {
            ...warehouse,
            [name]: data
        } );
    };

    return <div>
        <Row>
            <Col className="p-1">
                <div className='custom-form-main'>
                    <Label className='custom-form-label' for='conversionRateId'>Name</Label>
                    <Label className='custom-form-colons'> : </Label>
                    <div className='custom-form-group'>
                        <Input
                            type="text"
                            bsSize="sm"
                            name="name"
                            value={warehouse?.name}
                            onChange={( e ) => { handleWarehouseBasicInputOnChange( e ); }}
                            onFocus={( e ) => e.target.select()}
                        />
                    </div>
                </div>
                <div className='custom-form-main'>
                    <Label className='custom-form-label' for='conversionRateId'>Description</Label>
                    <Label className='custom-form-colons'> : </Label>
                    <div className='custom-form-group'>
                        <Input
                            type="text"
                            bsSize="sm"
                            name="name"
                            value={warehouse?.description}
                            onChange={( e ) => { handleWarehouseBasicInputOnChange( e ); }}
                            onFocus={( e ) => e.target.select()}
                        />
                    </div>
                </div>
                <div className='custom-form-main'>
                    <Label className='custom-form-label' for='defaultGroupId'>Default Item Group</Label>
                    <Label className='custom-form-colons'> : </Label>
                    <div className='custom-form-group'>
                        <CreatableSelect
                            id='defaultGroupId'
                            name="defaultGroup"
                            isSearchable
                            menuPosition="fixed"
                            isClearable
                            theme={selectThemeColors}
                            options={selectAccessoriesType}
                            classNamePrefix='dropdown'
                            // innerRef={register( { required: true } )}
                            className={classnames( 'erp-dropdown-select' )}
                            value={warehouse?.defaultGroup}
                            onChange={( data, e ) => {
                                handleBasicInfoDropdownChange( data, e );
                            }}
                        />
                    </div>
                </div>


            </Col>
        </Row>
    </div>;
};

export default WarehouseBasicInfoForm;
