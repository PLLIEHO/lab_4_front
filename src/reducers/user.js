const initialState = {
    user: "unknown"
}

const user = (state = initialState, action)=>{
    switch (action.type){
        case 'CURRENT_USER':
            state.user = action.user;
            return state
        default:
            return state
    }
}

export default user