import { lazy } from 'react';

export const accountRoutes = [
    {
        path: '/currency',
        component: lazy( () => import( '../../views/user-management/settings/form/CurrencyForm' ) )
    }
];