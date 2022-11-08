import { ADD_CURRENCY, GET_CURRENCIES, GET_CURRENCY_CODE_DROPDOWN, GET_CURRENCY_DROPDOWN } from "../action-types";

const initialState = {
    currencies: [],
    currencyCodeDropdown: [],
    currencyDropdown: [],
    isCurrencyDropdownLoaded: true
};

const currencyReduces = ( state = initialState, action ) => {
    switch ( action.type ) {
        case GET_CURRENCIES:
            return { ...state, currencies: action.currencies };
        case GET_CURRENCY_CODE_DROPDOWN:
            return { ...state, currencyCodeDropdown: action.currencyCodeDropdown };
        case GET_CURRENCY_DROPDOWN:
            return {
                ...state,
                currencyDropdown: action.currencyDropdown,
                isCurrencyDropdownLoaded: action.isCurrencyDropdownLoaded
            };
        case ADD_CURRENCY:
            return { ...state };
        default:
            return state;
    }
};

export default currencyReduces;