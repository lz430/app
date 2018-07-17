import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Line from './Line';
import Label from './Label';
import Group from './Group';
import Header from './Header';
import Value from './Value';

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
        this.props.onChange(role['role']);
    }

    isRoleChecked(role) {
        return this.props.selectedConditionalRoles.includes(role['role']);
    }

    shouldRenderConditionalSelection() {
        const quote = this.props.dealPricing.quote();
        if (!quote || !quote.selections || !quote.selections.conditionalRoles) {
            return false;
        }

        return true;
    }

    roleLabels(role) {
        const map = {
            college: {
                title: 'College Student/Recent Grad',
                description: 'Proof of eligibility required.',
            },
            military: {
                title: 'Active Military/Veteran',
                description:
                    'Thank you for your service. Proof of eligibility required.',
            },
            conquest: {
                title: 'Conquest',
                description: 'Proof of eligibility required.',
            },
            loyal: {
                title: 'Loyalty',
                description: 'Proof of eligibility required.',
            },
        };

        return map[role];
    }
    renderConditionRoleSelection(programId, role) {
        const labels = this.roleLabels(role['role']);

        return (
            <Line
                key={role['role']}
                style={{ margin: '.125em 0 .125em .25em' }}
            >
                <Label key={role['role']} style={{ fontSize: '.9em' }}>
                    <input
                        key={role['role']}
                        name="discountType"
                        value={role['role']}
                        type="checkbox"
                        checked={this.isRoleChecked(role)}
                        onChange={e => this.handleChange(role)}
                    />
                    {labels.title}
                </Label>
                <Value isNegative={true} showIf={this.isRoleChecked(role)}>
                    ${role.value}
                </Value>
                {this.isRoleChecked(role) &&
                    labels.description && (
                        <div
                            style={{
                                fontStyle: 'italic',
                                fontSize: '.75em',
                                marginLeft: '.25em',
                            }}
                        >
                            {labels.description}
                        </div>
                    )}
            </Line>
        );
    }

    render() {
        const dealPricing = this.props.dealPricing;
        const quote = this.props.dealPricing.quote();

        return (
            <div>
                {/*
                Conditional Rebates Selection
                */}
                {this.shouldRenderConditionalSelection() &&
                    Object.keys(quote.selections.conditionalRoles).map(key =>
                        this.renderConditionRoleSelection(
                            key,
                            quote.selections.conditionalRoles[key]
                        )
                    )}

                {/*
                Total Rebates
                */}
                {dealPricing.hasRebatesApplied() || (
                    <Line>
                        <Label>No rebates applied</Label>
                    </Line>
                )}

                {dealPricing.hasRebatesApplied() && (
                    <Line>
                        <Label>Applied</Label>
                        <Value
                            isNegative={true}
                            isLoading={dealPricing.dealQuoteIsLoading()}
                        >
                            {dealPricing.bestOffer()}
                        </Value>
                    </Line>
                )}
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
