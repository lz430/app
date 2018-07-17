import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Line from './Line';
import Label from './Label';

class Rebates extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        dealPricing: PropTypes.object,
        selectedConditionalRoles: PropTypes.array,
    };

    static defaultProps = {
        onChange: () => {},
    };

    handleChange(role) {
        this.props.onChange(role);
    }

    isRoleChecked(role) {
        return this.props.selectedConditionalRoles.includes(role);
    }

    renderConditionRoleSelection(role) {
        return (
            <Line key={role} style={{ margin: '.125em 0 .125em .25em' }}>
                <Label key={role} style={{ fontSize: '.9em' }}>
                    <input
                        key={role}
                        name="discountType"
                        value={role}
                        type="checkbox"
                        checked={this.isRoleChecked(role)}
                        onChange={e => this.handleChange(role)}
                    />
                    {role}
                </Label>
            </Line>
        );
    }

    render() {
        const quote = this.props.dealPricing.quote();
        if (!quote || !quote.selections || !quote.selections.conditionalRoles) {
            return false;
        }

        return (
            <div>
                {quote.selections.conditionalRoles.map(role => {
                    return this.renderConditionRoleSelection(role);
                })}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedConditionalRoles:
            state.pages.dealDetails.selectDiscount.conditionalRoles,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Rebates);
