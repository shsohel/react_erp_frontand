/*
     Title: Common Helper function
     Description: Common Helper function
     Author: Alamgir Kabir
     Date: 19-February-2022
     Modified: 27-March-2022
*/

import { useEffect, useState } from 'react';
import { ToWords } from 'to-words';
import { consoleType } from './enums';
export const mapArrayToDropdown = ( arr = [], label, value ) => {
  return arr.map( item => ( {
    ...item,
    label: item[label],
    value: item[value]
  } ) );
};

// declar a function for serial Number
export const mapSerialToDropdown = ( start, end ) => {
  const ddl = [];
  for ( let i = start; i <= end; i++ ) {
    ddl.push( { label: i, value: i } );
  }
  return ddl;
};

export const HexaColorCode = ( colorName, colorCode ) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span>{colorName}</span>
      <div style={{ width: 15, height: 15, backgroundColor: colorCode, borderRadius: 3 }}></div>
    </div>
  );
};

export const sleep = ms => new Promise( resolve => setTimeout( resolve, ms ) );

export const stringifyConsole = ( data, type ) => {
  if ( process.env.NODE_ENV === 'development' ) {
    if ( type === consoleType.normal ) {
      console.log( data );
    } else {
      console.log( JSON.stringify( data, null, 2 ) );
    }
  }
};

export const useDebounce = ( value, delay ) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState( '' );

  useEffect(
    () => {
      // Set debouncedValue to value (passed in) after the specified delay
      const handler = setTimeout( () => {
        setDebouncedValue( value );
      }, delay );

      // Return a cleanup function that will be called every time ...
      // ... useEffect is re-called. useEffect will only be re-called ...
      // ... if value changes (see the inputs array below).
      // This is how we prevent debouncedValue from changing if value is ...
      // ... changed within the delay period. Timeout gets cleared and restarted.
      // To put it in context, if the user is typing within our app's ...
      // ... search box, we don't want the debouncedValue to update until ...
      // ... they've stopped typing for more than 500ms.
      return () => {
        clearTimeout( handler );
      };
    },
    // Only re-call effect if value changes
    // You could also add the "delay" var to inputs array if you ...
    // ... need to be able to change that dynamically.
    [value, delay]
  );

  return debouncedValue;
};

export const ensureOnlyNumber = e => {
  if ( e.key === '.' || e.key === 'e' ) {
    e.preventDefault();
  }
};

// total / sum
export const customSum = array => {
  return array?.reduce( ( acc, curr ) => {
    return ( acc += curr );
  }, 0 );
};
/** Change Log
 * 27-March-2022 (Iqbal): Create A function for Serial Number in Dropdown
 */
export const decimalToWord = ( number ) => {
  const toWords = new ToWords();
  return toWords.convert( number );
};