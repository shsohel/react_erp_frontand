// import { authNavigation } from "../authNavigation";
import { anonymousNavigation } from "../anonymousNavigation";
import { authNavigation } from "../authNavigation";
import { inventoryNavigation } from "../inventoryNavigation";
import { merchandisingNavigation } from "../merchandisingNavigation";
// import { productionNavigation } from "../productionNavigation";


const baseModule = localStorage.getItem( 'module' );

// export default [
//   ...authNavigation,
//   ...merchandisingNavigation,
//   ...inventoryNavigation,
//   ...productionNavigation
// ];
const navArray = baseModule === "Merchandising" ? [...anonymousNavigation, ...merchandisingNavigation] : baseModule === "Inventory" ? [...anonymousNavigation, ...inventoryNavigation] : baseModule === "Users" ? [...anonymousNavigation, ...authNavigation] : [...anonymousNavigation];
export default navArray;
