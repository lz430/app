import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CompleteFinancingForm extends Component {
    static propTypes = {
        checkout: PropTypes.object.isRequired,
        onFinancingComplete: PropTypes.func.isRequired,
    };

    state = {
        method: 'cash',
    };

    handleFormSubmit(e) {
        e.preventDefault();
        this.props.onFinancingComplete();
    }

    render() {
        const { purchase } = this.props.checkout;

        return (
            <form onSubmit={this.handleFormSubmit.bind(this)}>
                <input type="hidden" name="purchase_id" value={purchase.id} />
                <input type="hidden" name="method" value={this.state.method} />
            </form>
        );
    }
}

export default CompleteFinancingForm;
