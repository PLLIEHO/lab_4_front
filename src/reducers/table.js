const initialState = {
    table: []
}

const table = (state = initialState, action)=>{
    switch (action.type){
        case 'LOAD':
            state.table = action.table;
            return state
        case 'ADD':
            state.table.push([action.x, action.y, action.r, action.result]);
            return state
        default:
            return state
    }
}

export const selectTable = state => state.table;

export default table