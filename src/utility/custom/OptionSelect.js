import '@custom-styles/basic/option-select.scss';
import { PropTypes } from 'prop-types';
import React from 'react';
import Select, { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { Button } from 'reactstrap';


const OptionSelect = ( { isCreatable = false, buttonPosition, btnAction, isBtnVisible, buttonLabel, ...props } ) => {
    const ReactSelect = isCreatable ? CreatableSelect : Select;
    const MenuList = ( { ...props } ) => {
        return (
            <>
                {
                    ( buttonPosition === "top" && isBtnVisible ) && (
                        <div
                            className="btn-action"
                        >
                            <Button.Ripple
                                size="sm"

                                onClick={btnAction}
                            >
                                {buttonLabel}
                            </Button.Ripple>
                        </div>

                    )
                }
                <components.MenuList {...props} style={{ marginBottom: '2rem' }}>
                    {props.children}
                </components.MenuList>
                {
                    ( buttonPosition === "bottom" && isBtnVisible ) && (
                        <div
                            className="btn-action"
                        >
                            <Button.Ripple
                                size="sm"

                                onClick={btnAction}
                            >
                                {buttonLabel}
                            </Button.Ripple>
                        </div>
                    )
                }
            </>

        );
    };
    return (
        <div className='option-select'>
            <ReactSelect
                maxMenuHeight={200}
                components={{
                    MenuList
                }}
                {...props}
            />
        </div>
    );
};

export default OptionSelect;

// ** Default Props
OptionSelect.defaultProps = {
    isCreatable: false,
    buttonPosition: 'bottom',
    isBtnVisible: true
};

// ** PropTypes
OptionSelect.propTypes = {
    isCreatable: PropTypes.bool,
    isBtnVisible: PropTypes.bool,
    buttonPosition: PropTypes.string,
    btnAction: PropTypes.func.isRequired,
    buttonLabel: PropTypes.string.isRequired
};
