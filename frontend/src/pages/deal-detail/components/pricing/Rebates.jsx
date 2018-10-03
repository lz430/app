import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import Line from 'components/pricing/Line';
import Label from 'components/pricing/Label';
import Value from 'components/pricing/Value';
import RebatesRole from './RebatesRole';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';

class Rebates extends React.Component {
    static propTypes = {
        onChange: PropTypes.func,
        pricing: PropTypes.object.isRequired,
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
        const quote = this.props.pricing.quote();

        if (!quote || !quote.selections || !quote.selections.conditionalRoles) {
            return false;
        }

        return true;
    }

    renderConditionalRebates() {
        const quote = this.props.pricing.quote();

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
                <div className="form-group">
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
        const pricing = this.props.pricing;

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
                {pricing.hasRebatesApplied() || (
                    <Line>
                        <Label>No rebates applied</Label>
                    </Line>
                )}

                {pricing.hasRebatesApplied() && (
                    <Line>
                        <Label>Applied</Label>
                        <Value
                            isNegative={true}
                            isLoading={pricing.quoteIsLoading()}
                        >
                            <DollarsAndCents value={pricing.rebates()} />
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
