const initialState = {
    flag: false
}

const tableFlag = (state = initialState, action)=>{
    switch (action.type){
        case 'CHANGE_TABLE_FLAG':
            state.flag = action.flag;
            return state
        default:
            return state
    }
}

export default tableFlag