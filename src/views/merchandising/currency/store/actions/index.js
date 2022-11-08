import { notify } from "@custom/notifications";
import { baseAxios } from "../../../../../services";
import { merchandisingApi } from "../../../../../services/api-end-points/merchandising";
import { status } from "../../../../../utility/enums";
import { randomIdGenerator } from "../../../../../utility/Utils";
import { ADD_CURRENCY, GET_CURRENCIES, GET_CURRENCY_CODE_DROPDOWN, GET_CURRENCY_DROPDOWN } from "../action-types";


export const getCurrencies = () => async dispatch => {
    const apiEndPoint = `${merchandisingApi.currencyConfigurations.root}`;
    await baseAxios.get( apiEndPoint ).then( response => {


        const currencies = response.data.data?.map( c => ( {
            id: c.id,
            fieldId: randomIdGenerator(),
            currency: c.code ? { label: `${( c.code )}`, value: `${( c.code )}` } : null,
            code: c.code,
            rate: c.rate,
            sign: c.sign,
            isBase: c.isBase,
            isEdit: false,
            isErrorField: false
        } ) );
        dispatch( {
            type: GET_CURRENCIES,
            currencies
        } );
    } );
};
export const getCurrencyCodeDropdown = () => async dispatch => {
    const apiEndPoint = `${merchandisingApi.currencyConfigurations.root}/currencyList`;
    await baseAxios.get( apiEndPoint ).then( response => {
        //    const currencyCodeDropdown = Object.keys( response.data ).map( item => ( { label: item } ) );
        const currencyCodeArray = Object.values( Object.assign( [], response.data ) );
        const currencyCodeDropdown = currencyCodeArray.map( c => (
            {
                // value: `${c.name}${( c.code )}`,
                value: c.code,
                label: `${c.name}(${c.code})`,
                code: c.code,
                decimal_digits: c.decimal_digits,
                name: c.name,
                name_plural: c.name_plural,
                rounding: c.rounding,
                symbol: c.symbol,
                symbol_native: c.symbol_native
            }
        ) );
        dispatch( {
            type: GET_CURRENCY_CODE_DROPDOWN,
            currencyCodeDropdown
        } );
    } );
};
export const getCurrencyDropdown = () => async dispatch => {
    const apiEndPoint = `${merchandisingApi.currencyConfigurations.root}`;
    dispatch( {
        type: GET_CURRENCY_DROPDOWN,
        currencyDropdown: [],
        isCurrencyDropdownLoaded: false
    } );
    await baseAxios.get( apiEndPoint ).then( response => {
        if ( response.status === status.success ) {
            const baseCurrency = response.data.data.find( c => c.isBase );
            const currencyDropdown = response.data.data.map( c => ( {
                label: c.code,
                value: c.code,
                currencySign: c.sign,
                isBaseCurrency: c.isBase,
                baseCurrencyCode: baseCurrency.code,
                baseCurrencySign: baseCurrency.sign,
                conversionRate: c.rate
            } ) );
            dispatch( {
                type: GET_CURRENCY_DROPDOWN,
                currencyDropdown,
                isCurrencyDropdownLoaded: true
            } );
        }

    } ).catch( ( { response } ) => {
        dispatch( {
            type: GET_CURRENCY_DROPDOWN,
            currencyDropdown: [],
            isCurrencyDropdownLoaded: true
        } );
        if ( response.status === status.severError ) {
            notify( 'error', `Please contact the support team!!!` );
        } else {
            notify( 'error', `${response.data.errors.join( ', ' )}` );
        }
    } );
};

export const bindCurrencies = ( currencies ) => async dispatch => {
    dispatch( {
        type: GET_CURRENCIES,
        currencies
    } );
};

export const addCurrency = ( currency ) => async dispatch => {
    const apiEndPoint = `${merchandisingApi.currencyConfigurations.root}`;
    await baseAxios.post( apiEndPoint, currency ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: ADD_CURRENCY,
                currency
            } );
            notify( 'success', 'The Currency has been added Successfully!' );
            dispatch( getCurrencies() );
        } else {
            notify( 'success', 'The Currency has been added failed!' );
        }
    } ).catch( ( { response } ) => {
        if ( response.status === status.severError ) {
            notify( 'error', `Please contact the support team!!!` );
        } else {
            notify( 'error', `${response.data.errors.join( ', ' )}` );
        }
    } );
};
export const updateCurrency = ( currency, currencyId ) => async dispatch => {
    const apiEndPoint = `${merchandisingApi.currencyConfigurations.root}/${currencyId}`;
    await baseAxios.put( apiEndPoint, currency ).then( response => {
        if ( response.status === status.success ) {
            dispatch( {
                type: ADD_CURRENCY,
                currency
            } );
            notify( 'success', 'The Currency has been updated Successfully!' );
            dispatch( getCurrencies() );
        } else {
            notify( 'error', 'The Currency update has been failed!' );
        }
    } ).catch( ( { response } ) => {
        if ( response.status === status.severError ) {
            notify( 'error', `Please contact the support team!!!` );
        } else {
            notify( 'error', `${response.data.errors.join( ', ' )}` );
        }
    } );
};