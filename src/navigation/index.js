import { anonymousNavigation } from "./anonymousNavigation";
import { handleGetAuthNavigation } from "./authNavigation";
import { handleGetInventoryNavigation } from "./inventoryNavigation";
import { handleGetMerchandisingNavigation } from "./merchandisingNavigation";


export const getHorizontalNavigation = ( userPermission, authPermissions ) => {
    const baseModule = localStorage.getItem( 'module' );

    const inventoryNavigation = handleGetInventoryNavigation( userPermission, authPermissions );
    const merchandisingNavigation = handleGetMerchandisingNavigation( userPermission, authPermissions );
    const authNavigation = handleGetAuthNavigation( userPermission, authPermissions );


    const horizontalNav = baseModule === "Merchandising" ? [...anonymousNavigation, ...merchandisingNavigation] : baseModule === "Inventory" ? [...anonymousNavigation, ...inventoryNavigation] : baseModule === "Users" ? [...anonymousNavigation, ...authNavigation] : [...anonymousNavigation];


    return horizontalNav;
};

export const getVerticalNavigation = ( userPermission, authPermissions ) => {
    const baseModule = localStorage.getItem( 'module' );

    const inventoryNavigation = handleGetInventoryNavigation( userPermission, authPermissions );
    const merchandisingNavigation = handleGetMerchandisingNavigation( userPermission, authPermissions );
    const authNavigation = handleGetAuthNavigation( userPermission, authPermissions );

    const verticalNav = baseModule === "Merchandising" ? [
        {
            header: 'Merchandising'
        }, ...merchandisingNavigation
    ] : baseModule === "Inventory" ? [
        {
            header: 'Inventory'
        }, ...inventoryNavigation
    ] : baseModule === "Users" ? [
        {
            header: 'User Management'
        }, ...authNavigation
    ] : [...anonymousNavigation];

    return verticalNav;
};