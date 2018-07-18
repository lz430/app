import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import Line from '../../../../components/pricing/Line';
import Label from '../../../../components/pricing/Label';
import Value from '../../../../components/pricing/Value';

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

    isAnyRoleChecked() {
        return this.props.selectedConditionalRoles.length || false;
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
                description: null,
            },
            military: {
                title: 'Active Military/Veteran',
                description: 'Thank you for your service.',
            },
            conquest: {
                title: 'Conquest',
                description: null,
            },
            loyal: {
                title: 'Loyalty',
                description: null,
            },
        };

        return map[role];
    }

    renderConditionRoleSelection(programId, role) {
        const labels = this.roleLabels(role['role']);
        return (
            <Line style={{ margin: '.125em 0 .125em .25em' }}>
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

    renderConditionalRebates() {
        const quote = this.props.dealPricing.quote();

        return (
            <div>
                {this.isAnyRoleChecked() && (
                    <div
                        style={{
                            fontStyle: 'italic',
                            fontSize: '.75em',
                            marginLeft: '.25em',
                        }}
                    >
                        Proof of eligibility required.
                    </div>
                )}

                {Object.keys(quote.selections.conditionalRoles).map(key => (
                    <div key={key}>
                        {this.renderConditionRoleSelection(
                            key,
                            quote.selections.conditionalRoles[key]
                        )}
                    </div>
                ))}
            </div>
        );
    }

    render() {
        const dealPricing = this.props.dealPricing;

        return (
            <div>
                {/*
                Conditional Rebates Selection
                */}

                {this.shouldRenderConditionalSelection() &&
                    this.renderConditionalRebates()}

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
