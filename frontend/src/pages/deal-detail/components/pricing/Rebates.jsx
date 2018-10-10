import React from 'react';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import Line from 'components/pricing/Line';
import Label from 'components/pricing/Label';
import Value from 'components/pricing/Value';
import RebatesRole from './RebatesRole';
import DollarsAndCents from '../../../../components/money/DollarsAndCents';
import { sortBy, prop, map } from 'ramda';

class Rebates extends React.Component {
    static propTypes = {
        onChange: PropTypes.func,
        pricing: PropTypes.object.isRequired,
        selectedConditionalRoles: PropTypes.array,
    };

    roleLabels = {
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
        responder: {
            title: 'First Responder',
            description: null,
        },
        gmcompetitive: {
            title: 'GM Competitive Lease',
            description: null,
        },
        gmlease: {
            title: 'GM Lease Loyalty',
            description: null,
        },
        cadillaclease: {
            title: 'Cadillac Lease Loyalty',
            description: null,
        },
        gmloyalty: {
            title: 'Lease Loyalty',
            description: null,
        },
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

    getRoles(roles) {
        const arrayRoles = map(item => {
            let label = this.roleLabels[item.role];
            item.title = label.title;
            item.help = label.description;
            return item;
        }, Object.values(roles));
        return sortBy(prop('title'), arrayRoles);
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
        const roles = this.getRoles(quote.selections.conditionalRoles);
        return (
            <div>
                {this.isAnyRoleChecked() && (
                    <div class="eligibility">
                        Proof of eligibility required.
                    </div>
                )}
                <div>
                    {roles.map(role => (
                        <RebatesRole
                            key={role.id}
                            isRoleChecked={this.isRoleChecked(role)}
                            role={role}
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

export default connect(mapStateToProps)(Rebates);
