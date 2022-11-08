import { baseAxios } from '@services';
import { userManagementApi } from "../../../../../services/api-end-points/user-management";
import { BIND_PERMISSION, GET_PERMISSIONS } from "../action-types";

export const bindPermissions = ( permissions ) => dispatch => {
    dispatch( {
        type: BIND_PERMISSION,
        permissions
    } );
};

export const getAppPermissions = () => async dispatch => {
    const apiEndPoint = `${userManagementApi.auth}/permissions`;
    await baseAxios.get( apiEndPoint ).then( response => {
        const permissions = response.data?.map( permission => ( {
            ...permission,
            subModules: permission.subModules.map( subModule => ( {
                ...subModule,
                isExpanded: false,
                isAll: false
            } ) )

        } ) );

        const authPermissions = permissions.map( permission => permission.subModules.map( subModule => subModule.permissions ).flat() ).flat().map( p => p.code );
        dispatch( {
            type: GET_PERMISSIONS,
            permissions,
            authPermissions
        } );
    } );
};