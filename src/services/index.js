// import  store  from '@store/storeConfig/store';
import axios from "axios";
import { baseUrl, cookieName } from "../utility/enums";

export const baseAxios = axios.create( {
    baseURL: baseUrl
} );

// const cookies = new Cookies();
// const accessToken = cookies.get( cookieName )?.access_token;
const accessToken = JSON.parse( localStorage.getItem( cookieName ) )?.access_token;
// console.log( accessToken );
if ( accessToken ) {
    baseAxios.defaults.headers.common['Authorization'] = `bearer ${accessToken}`;
}
