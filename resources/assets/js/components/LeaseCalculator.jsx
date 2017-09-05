import React from 'react';
import util from 'src/util';
import R from 'ramda';
import Rebates from 'components/Rebates';
import rebates from 'src/rebates';
import formulas from 'src/formulas';
import { connect } from 'react-redux';
import * as Actions from 'actions';

class LeaseCalculator extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    updateDownPayment(e) {
        this.props.updateDownPayment(Math.max(e.target.value, 0));
    }

    updateTermDuration(e) {
        this.props.updateTermDuration(Number(e.target.value));
    }

    render() {
        return (
            <div>
                Lease Price {util.moneyFormat(this.props.deal.price)}
                <hr />
                Available Rebates and Incentives on Lease
                <Rebates />
                <hr />
                Summary
                <div>
                    <div>
                        <span>MSRP</span>
                        <span style={{ float: 'right' }}>
                            {util.moneyFormat(this.props.deal.msrp)}
                        </span>
                    </div>
                    <div>
                        <span>Your Price</span>
                        <span style={{ float: 'right' }}>
                            {util.moneyFormat(this.props.deal.price)}
                        </span>
                    </div>
                    <div>
                        <span>Your Rebates and Incentives</span>
                        <span style={{ float: 'right' }}>
                            {this.props.availableRebates ? (
                                util.moneyFormat(
                                    R.sum(
                                        R.map(
                                            R.prop('value'),
                                            this.props.selectedRebates
                                        )
                                    )
                                )
                            ) : (
                                'Loading...'
                            )}
                        </span>
                    </div>
                </div>
                <hr />
                <div>
                    Lease Summary
                    <div>
                        <span>Term Duration</span>
                        <span style={{ float: 'right' }}>
                            <select
                                value={this.props.termDuration}
                                onChange={e => this.updateTermDuration(e)}
                            >
                                <option value="60">60</option>
                                <option value="48">48</option>
                                <option value="36">36</option>
                                <option value="24">24</option>
                            </select>
                        </span>
                    </div>
                </div>
                <div>
                    <span>Your Monthly Lease Payment</span>
                    <span style={{ float: 'right' }}>
                        {this.props.availableRebates ? (
                            util.moneyFormat(
                                Math.round(
                                    formulas.calculateLeasedMonthlyPayments(
                                        this.props.deal.price -
                                            R.sum(
                                                R.map(
                                                    R.prop('value'),
                                                    this.props.selectedRebates
                                                )
                                            ),
                                        0,
                                        0,
                                        this.props.termDuration
                                    )
                                )
                            )
                        ) : (
                            'Loading...'
                        )}
                    </span>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        zipcode: state.zipcode,
        downPayment: state.downPayment,
        deal: state.selectedDeal,
        termDuration: state.termDuration,
        availableRebates: rebates.getAvailableRebatesForDealAndType(
            state.dealRebates,
            state.selectedRebates,
            state.selectedTab,
            state.selectedDeal
        ),
        selectedRebates: rebates.getSelectedRebatesForDealAndType(
            state.dealRebates,
            state.selectedRebates,
            state.selectedTab,
            state.selectedDeal
        ),
    };
}

export default connect(mapStateToProps, Actions)(LeaseCalculator);
