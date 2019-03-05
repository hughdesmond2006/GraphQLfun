const mathReducer = (state = {
    result: 1,
    lastValues: []
}, action) => {
    switch(action.type){
        case "ADD":
            //add all properties of old state to new one, assign in immutable way
            state = {
                ...state,
                result: state.result + action.payload,
                lastValues: [...state.lastValues, action.payload]
            };
            break;
        case "SUBTRACT":
            state = {
                ...state,
                result: state.result - action.payload,
                lastValues: [...state.lastValues, action.payload]
            };
            break;
    }
    return state;
};
export default mathReducer;