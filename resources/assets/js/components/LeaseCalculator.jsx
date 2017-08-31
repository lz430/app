import React from 'react';
import util from 'src/util';
import { connect } from 'react-redux';
import * as Actions from 'actions';

class LeaseCalculator extends React.PureComponent {
    render() {
        return <div>Lease Price:</div>;
    }
}

function mapStateToProps(state) {
    return {
        zipcode: state.zipcode,
    };
}

export default connect(mapStateToProps, Actions)(LeaseCalculator);
