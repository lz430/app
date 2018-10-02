export default function composeReducers(...reducers) {
    return (initialState, action) => {
        let currentState = initialState;

        reducers.map((reducer) => {
            currentState = reducer(currentState, action)
        });

        return currentState
    }
}
