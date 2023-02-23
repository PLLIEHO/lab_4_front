import {combineReducers} from "redux";
import TableReducer from "./table";
import loadFlag from "./loadFlag";
import user from "./user";
import tableFlag from "./tableFlag";

const allReducers = combineReducers({
   user: user,
   table: TableReducer,
   loadFlag: loadFlag,
   tableFlag: tableFlag
});

export default allReducers;