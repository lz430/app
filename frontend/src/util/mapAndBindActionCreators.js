import mapValues from './mapValues'
import { bindActionCreators } from 'redux'

export default function mapAndBindActionCreators(actionCreators) {
    return dispatch => mapValues(actionCreators, actionCreator => bindActionCreators(actionCreator, dispatch))
}

export function withDispatch(mapDispatchToProps) {
    return dispatch => {
        const mappedDispatchProps = mapDispatchToProps(dispatch);

        return {...mappedDispatchProps, dispatch}
    }
}
