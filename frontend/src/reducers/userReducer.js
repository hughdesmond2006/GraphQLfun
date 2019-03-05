const userReducer = (state = {
    userId: null
}, action) => {
    switch(action.type){
        case "SET_USER":
            state = {
                ...state,
                age: action.payload
            };
            break;
    }
    return state;
};
export default userReducer;