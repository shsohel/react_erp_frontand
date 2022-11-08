import { accountReducers } from "./accountReducer";
import { authReducer } from "./authRootReducer";
import { inventoryReducer } from "./inventoryRootReducer";
import { merchandisingReducer } from "./merchandisingRootReducer";
import { productionReducer } from "./productionReducer";
import { reportingReducers } from "./reportingReducer";

export default ( {
    ...accountReducers,
    ...authReducer,
    ...inventoryReducer,
    ...merchandisingReducer,
    ...productionReducer,
    ...reportingReducers
} );