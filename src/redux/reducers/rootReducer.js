
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import allReducer from "./allReducer";

const rootReducer = combineReducers(
  allReducer
);

// export default rootReducer;

const persistConfig = {
  key: 'ERP',
  storage,
  whitelist: ["auth", "permissions"]

};

export default persistReducer( persistConfig, rootReducer );
