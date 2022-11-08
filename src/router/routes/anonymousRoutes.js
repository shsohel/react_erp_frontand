import { lazy } from 'react';

export const anonymousRoutes = [
    {
        path: '/home',
        component: lazy( () => import( '../../views/Home' ) ),
        exact: true,
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/login',
        component: lazy( () => import( '../../views/auth/Login' ) ),
        layout: 'BlankLayout',
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: true
        }

    },
    {
        path: '/forgot-password',
        component: lazy( () => import( '../../views/auth/ForgotPassword' ) ),
        layout: 'BlankLayout',
        permission: 'antonymous',

        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/confirm-user',
        component: lazy( () => import( '../../views/auth/UserConfirmation' ) ),
        layout: 'BlankLayout',
        permission: 'antonymous',

        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/reset-password',
        component: lazy( () => import( '../../views/auth/ResetPassword' ) ),
        layout: 'BlankLayout',
        permission: 'antonymous',

        meta: {
            authRoute: true,
            publicRoute: true
        }
    },
    {
        path: '/user-profile',
        component: lazy( () => import( '../../views/auth/profile/UserProfile' ) ),
        permission: 'antonymous',
        meta: {
            authRoute: true,
            publicRoute: false
        }
    },
    {
        path: '/not-authorized',
        component: lazy( () => import( '../../views/auth/NotAuthorized' ) ),
        layout: 'BlankLayout',
        permission: 'antonymous',

        meta: {
            authRoute: true,
            publicRoute: true
        }
    }

];