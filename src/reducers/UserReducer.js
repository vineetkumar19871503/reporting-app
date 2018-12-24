export default function UserReducer(state = {}, action) {
    // const _s = Object.assign(state);
    switch(action.type) {
        case 'LOGIN': return action.payload;
        case 'LOGOUT': return {}
        default : return state;
    }
}