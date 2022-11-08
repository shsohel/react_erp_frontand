
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
const navArray = baseModule === "Merchandising" ? [
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
export default navArray;
