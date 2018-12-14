export default function UserReducer(state = {}, action) {
    // const _s = Object.assign(state);
    switch(action.type) {
        case 'LOGIN': return action.payload;
        default : return state;
    }
}