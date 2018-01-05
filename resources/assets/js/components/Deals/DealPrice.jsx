import React from 'react';
import R from 'ramda';
import util from 'src/util';
import rebates from 'src/rebates';
import formulas from 'src/formulas';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';
import InfoModal from 'components/InfoModal';

class DealPrice extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            availableTargets: null,
        };
    }

    componentDidMount() {
        if (
            !this.props.dealTargets.hasOwnProperty(this.props.deal.id) &&
            this.props.zipcode
        ) {
            this.requestTargets();
        } else {
            this.componentWillReceiveProps(this.props);
        }
    }

    requestTargets() {
        this.props.requestTargets(this.props.deal);
    }

    componentWillReceiveProps(props) {
        if (!props.dealTargets.hasOwnProperty(props.deal.id)) {
            return this.props.requestTargets(this.props.deal);
        }

        this.setState({
            availableTargets: rebates.getAvailableTargetsForDealAndType(
                props.dealTargets,
                props.selectedTab,
                props.deal
            )
        });
    }

    renderPriceExplanationModal() {
        return <InfoModal deal={this.props.deal}/>
    }

    renderCashPrice() {
        return (
            <div className="deal-price__price">
                <div className="deal-price__cash-label">Your cash price</div>
                <div className="deal-price__cash-price">
                    {util.moneyFormat(
                        util.getEmployeeOrSupplierPrice(
                            this.props.deal,
                            this.props.employeeBrand
                        )
                    )}
                    {this.renderPriceExplanationModal()}
                </div>
                <div className="deal-price__hr" />
                <div className="deal-price__cash-msrp">
                    {util.moneyFormat(this.props.deal.msrp)}{' '}
                    <span className="deal-price__cash-msrp-label">MSRP</span>
                </div>
            </div>
        );
    }

    renderFinancePrice() {
        return (
            <div className="deal-price__price">
                <div className="deal-price__finance-lease-label">
                    Estimated Monthly Finance Payment
                </div>
                <div className="deal-price__finance-lease-price">
                    {this.props.dealTargets.hasOwnProperty(
                        this.props.deal.id
                    ) ? (
                        util.moneyFormat(
                            Math.round(
                                formulas.calculateFinancedMonthlyPayments(
                                    util.getEmployeeOrSupplierPrice(
                                        this.props.deal,
                                        this.props.employeeBrand
                                    ) -
                                    /*
                                        R.sum(
                                            R.map(
                                                R.prop('value'),
                                                rebates.getSelectedTargetsForDeal(
                                                    this.props.dealTargets,
                                                    this.props.selectedTargets,
                                                    this.props.selectedTab,
                                                    this.props.deal
                                                )
                                            )
                                        ),*/
                                    0, // @todo this would be the sum of our rebating
                                    this.props.downPayment,
                                    this.props.termDuration
                                )
                            )
                        )
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                    {this.renderPriceExplanationModal()}
                </div>
                <div className="deal-price__hr" />
            </div>
        );
    }

    renderLeasePrice() {
        return (
            <div className="deal-price__price">
                <div className="deal-price__finance-lease-label">
                    Estimated Monthly Lease Payment
                </div>
                <div className="deal-price__finance-lease-price">
                    {util.moneyFormat(
                        Math.round(
                            formulas.calculateLeasedMonthlyPayments(
                                util.getEmployeeOrSupplierPrice(
                                    this.props.deal,
                                    this.props.employeeBrand
                                ) -
                                /*
                                    R.sum(
                                        R.map(
                                            R.prop('value'),
                                            rebates.getSelectedTargetsForDeal(
                                                this.props.dealTargets,
                                                this.props.selectedTargets,
                                                this.props.selectedTab,
                                                this.props.deal
                                            )
                                        )
                                    ),
                                    */
                                0, // @TODO this would be the sum of our rebate price
                                0,
                                0,
                                this.props.termDuration,
                                R.or(this.props.residualPercent, 31)
                            )
                        )
                    )}
                    {this.renderPriceExplanationModal()}
                </div>
                <div className="deal-price__hr" />
            </div>
        );
    }

    renderSelectedTab() {
        switch (this.props.selectedTab) {
            case 'cash':
                return this.renderCashPrice();
            case 'finance':
                return this.renderFinancePrice();
            case 'lease':
                return this.renderLeasePrice();
        }
    }

    renderAppliedTargetsLink() {
        if (!this.state.availableTargets) {
            return <SVGInline svg={miscicons['loading']} />;
        }
        return (
            <div className="deal-price__rebates-applied">
                <SVGInline
                    height="10px"
                    width="10px"
                    className="deal-price__tag-icon"
                    svg={miscicons['tag']}
                />
                <a
                    onClick={() => this.props.selectDeal(this.props.deal)}
                    href="#"
                >
                    See Available Targets or something
                </a>
            </div>
        );
    }

    render() {
        return (
            <div className="deal-price">
                <div className="tabs">
                    <div
                        onClick={this.props.selectTab.bind(null, 'cash')}
                        className={`tabs__tab ${this.props.selectedTab ===
                        'cash'
                            ? 'tabs__tab--selected'
                            : ''}`}
                    >
                        Cash
                    </div>
                    <div
                        onClick={this.props.selectTab.bind(null, 'finance')}
                        className={`tabs__tab ${this.props.selectedTab ===
                        'finance'
                            ? 'tabs__tab--selected'
                            : ''}`}
                    >
                        Finance
                    </div>
                    <div
                        onClick={this.props.selectTab.bind(null, 'lease')}
                        className={`tabs__tab ${this.props.selectedTab ===
                        'lease'
                            ? 'tabs__tab--selected'
                            : ''}`}
                    >
                        Lease
                    </div>
                </div>
                <div className="tabs__content">{this.renderSelectedTab()}</div>
                {this.renderAppliedTargetsLink()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        employeeBrand: state.employeeBrand,
        downPayment: state.downPayment,
        termDuration: state.termDuration,
        residualPercent: state.residualPercent,
        selectedTab: state.selectedTab,
        dealTargets: state.dealTargets,
    };
};

export default connect(mapStateToProps, Actions)(DealPrice);
