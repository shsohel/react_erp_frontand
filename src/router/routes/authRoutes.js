import { lazy } from 'react';

export const authRoutes = [
    {
        path: '/roles',
        component: lazy( () => import( '../../views/auth/role/list' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/add-role',
        component: lazy( () => import( '../../views/auth/role/form/RoleAddForm' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/edit-role',
        component: lazy( () => import( '../../views/auth/role/form/RoleEditForm' ) ),
        permission: 'antonymous',

        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/users',
        component: lazy( () => import( '../../views/auth/user/list' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/add-user',
        component: lazy( () => import( '../../views/auth/user/form/UserAddForm' ) ),
        permission: 'antonymous',

        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/edit-user',
        component: lazy( () => import( '../../views/auth/user/form/UserEditForm' ) ),
        permission: 'antonymous',

        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/permissions',
        component: lazy( () => import( '../../views/auth/role/form/RolePermission' ) ),
        permission: 'antonymous',

        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/test',
        component: lazy( () => import( '../../views/TestPage' ) ),
        permission: 'antonymous',

        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/test2',
        component: lazy( () => import( '../../views/test/TestPage2' ) ),
        permission: 'antonymous',

        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/project-tech',
        component: lazy( () => import( '../../documents/read/ProjectTech' ) ),
        permission: 'antonymous',

        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/project-structure',
        component: lazy( () => import( '../../documents/read/ProjectStructure' ) ),
        permission: 'antonymous',

        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/last-update',
        component: lazy( () => import( '../../documents/read/LastUpdateSohel' ) ),
        permission: 'antonymous',

        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/modules',
        component: lazy( () => import( '../../views/apps' ) ),
        permission: 'antonymous',

        layout: 'BlankLayout',
        meta: {
            authRoute: true,
            publicRoute: false
        }
    },

    {
        path: '/settings',
        component: lazy( () => import( '../../views/user-management/settings' ) ),
        permission: 'antonymous',

        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/error',
        component: lazy( () => import( '../../views/Error' ) ),
        permission: 'antonymous',

        layout: 'BlankLayout',
        meta: {
            authRoute: true,
            publicRoute: false
        }
    }
];