import { store } from '@store/storeConfig/store';
import { Activity, Settings, Users } from "react-feather";
import { isPermitNav } from "../utility/Utils";
const { userPermission } = store?.getState().auth;
const { authPermissions } = store?.getState().permissions;

export const authNavigation = [

    {
        id: 'settings',
        title: 'Settings',
        icon: <Settings size={20} />,
        navLink: '/Settings',
        hidden: isPermitNav( userPermission?.SettingsList, authPermissions )
    },
    {
        id: 'roles',
        title: 'Roles',
        icon: <Activity size={20} />,
        navLink: '/roles',
        hidden: isPermitNav( userPermission?.RoleList, authPermissions )

    },

    // {
    //     id: 'permissions',
    //     title: 'Permissions',
    //     icon: <Activity size={20} />,
    //     navLink: '/permissions'
    // },
    {
        id: 'users',
        title: 'Users',
        icon: <Users size={20} />,
        navLink: '/users',
        hidden: isPermitNav( userPermission?.UserList, authPermissions )

    }
    // {
    //     id: 'permi',
    //     title: 'permi',
    //     icon: <Video size={20} />,
    //     navLink: '/permi'
    // }

];

export const handleGetAuthNavigation = ( userPermission, authPermissions ) => {
    const authNav = [

        {
            id: 'settings',
            title: 'Settings',
            icon: <Settings size={20} />,
            navLink: '/Settings',
            hidden: isPermitNav( userPermission?.SettingsList, authPermissions )
        },
        {
            id: 'roles',
            title: 'Roles',
            icon: <Activity size={20} />,
            navLink: '/roles',
            hidden: isPermitNav( userPermission?.RoleList, authPermissions )

        },

        // {
        //     id: 'permissions',
        //     title: 'Permissions',
        //     icon: <Activity size={20} />,
        //     navLink: '/permissions'
        // },
        {
            id: 'users',
            title: 'Users',
            icon: <Users size={20} />,
            navLink: '/users',
            hidden: isPermitNav( userPermission?.UserList, authPermissions )

        }
        // {
        //     id: 'permi',
        //     title: 'permi',
        //     icon: <Video size={20} />,
        //     navLink: '/permi'
        // }

    ];
    return authNav;
};