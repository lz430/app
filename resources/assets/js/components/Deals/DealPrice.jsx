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
            availableRebates: null,
            selectedRebates: [],
        };
    }

    componentDidMount() {
        if (
            !this.props.dealRebates.hasOwnProperty(this.props.deal.id) &&
            this.props.zipcode
        ) {
            this.requestRebates();
        } else {
            this.componentWillReceiveProps(this.props);
        }
    }

    requestRebates() {
        this.props.requestRebates(this.props.deal);
    }

    componentWillReceiveProps(props) {
        if (!props.dealRebates.hasOwnProperty(props.deal.id)) {
            return this.props.requestRebates(this.props.deal);
        }

        this.setState({
            availableRebates: rebates.getAvailableRebatesForDealAndType(
                props.dealRebates,
                props.selectedRebates,
                props.selectedTab,
                props.deal
            ),
            selectedRebates: rebates.getSelectedRebatesForDealAndType(
                props.dealRebates,
                props.selectedRebates,
                props.selectedTab,
                props.deal
            ),
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
                    {this.props.dealRebates.hasOwnProperty(
                        this.props.deal.id
                    ) ? (
                        util.moneyFormat(
                            Math.round(
                                formulas.calculateFinancedMonthlyPayments(
                                    util.getEmployeeOrSupplierPrice(
                                        this.props.deal,
                                        this.props.employeeBrand
                                    ) -
                                        R.sum(
                                            R.map(
                                                R.prop('value'),
                                                rebates.getSelectedRebatesForDealAndType(
                                                    this.props.dealRebates,
                                                    this.props.selectedRebates,
                                                    this.props.selectedTab,
                                                    this.props.deal
                                                )
                                            )
                                        ),
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
                                    R.sum(
                                        R.map(
                                            R.prop('value'),
                                            rebates.getSelectedRebatesForDealAndType(
                                                this.props.dealRebates,
                                                this.props.selectedRebates,
                                                this.props.selectedTab,
                                                this.props.deal
                                            )
                                        )
                                    ),
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

    renderAppliedRebatesLink() {
        if (!this.state.availableRebates) {
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
                    See Available Rebates
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
                {this.renderAppliedRebatesLink()}
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
        dealRebates: state.dealRebates,
        selectedRebates: state.selectedRebates,
    };
};

export default connect(mapStateToProps, Actions)(DealPrice);
