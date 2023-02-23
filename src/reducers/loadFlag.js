const initialState = {
    flag: false
}

const loadFlag = (state = initialState, action)=>{
    switch (action.type){
        case 'CHANGE_FLAG':
            state.flag = action.flag;
            return state
        default:
            return state
    }
}

export const selectFlag = state => state.flag;

export default loadFlag