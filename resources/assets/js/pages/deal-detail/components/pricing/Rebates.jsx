import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import Line from 'components/pricing/Line';
import Label from 'components/pricing/Label';
import Value from 'components/pricing/Value';
import RebatesRole from './RebatesRole';

class Rebates extends React.Component {
    static propTypes = {
        onChange: PropTypes.func.isRequired,
        dealPricing: PropTypes.object,
        selectedConditionalRoles: PropTypes.array,
    };

    static defaultProps = {
        onChange: () => {},
    };

    state = {
        conditionalProgramsOpened: false,
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
                <div className="form-group form-check">
                    {Object.keys(quote.selections.conditionalRoles).map(key => (
                        <RebatesRole
                            key={key}
                            isRoleChecked={this.isRoleChecked(
                                quote.selections.conditionalRoles[key]
                            )}
                            role={quote.selections.conditionalRoles[key]}
                            onChange={this.handleChange.bind(this)}
                        />
                    ))}
                </div>
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
