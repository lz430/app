import React from "react";
import R from "ramda";
import util from "src/util";
import rebates from "src/rebates";
import formulas from "src/formulas";
import { connect } from "react-redux";
import * as Actions from "actions/index";

class DealPrice extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      availableRebates: null,
      selectedRebates: []
    };
  }

  componentWillReceiveProps(props) {
    if (!props.dealRebates.hasOwnProperty(props.deal.id)) return;

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
      )
    });
  }

  renderCashPrice() {
    return (
      <div className="deal-price__price">
        <div className="deal-price__cash-label">Your cash price</div>
        <div className="deal-price__cash-price">
          {util.moneyFormat(this.props.deal.price)}
        </div>
        <div className="deal-price__hr" />
        <div className="deal-price__cash-msrp">
          {util.moneyFormat(this.props.deal.msrp)}{" "}
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
          {this.props.dealRebates.hasOwnProperty(this.props.deal.id)
            ? util.moneyFormat(
                Math.round(
                  formulas.calculateFinancedMonthlyPayments(
                    this.props.deal.price -
                      R.sum(
                        R.map(
                          R.prop("value"),
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
            : "Loading..."}
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
                this.props.deal.price -
                  R.sum(
                    R.map(
                      R.prop("value"),
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
                this.props.termDuration
              )
            )
          )}
        </div>
        <div className="deal-price__hr" />
      </div>
    );
  }

  renderSelectedTab() {
    switch (this.props.selectedTab) {
      case "cash":
        return this.renderCashPrice();
      case "finance":
        return this.renderFinancePrice();
      case "lease":
        return this.renderLeasePrice();
    }
  }

  renderAppliedRebatesLink() {
    if (!this.state.availableRebates) {
      return <div>Loading...</div>;
    }

    const selectedAmount = R.sum(
      R.map(R.prop("value"), this.state.selectedRebates)
    );
    const maxAmount = R.sum(
      R.map(R.prop("value"), this.state.availableRebates)
    );

    return (
      <div className="deal-price__rebates-applied">
        <a onClick={() => this.props.selectDeal(this.props.deal)} href="#">
          {util.moneyFormat(selectedAmount)} rebates applied of{" "}
          {util.moneyFormat(maxAmount)} available...
        </a>
      </div>
    );
  }

  render() {
    return (
      <div className="deal-price">
        <div className="tabs">
          <div
            onClick={this.props.selectTab.bind(null, "cash")}
            className={`tabs__tab ${this.props.selectedTab === "cash" ? "tabs__tab--selected" : ""}`}
          >
            Cash
          </div>
          <div
            onClick={this.props.selectTab.bind(null, "finance")}
            className={`tabs__tab ${this.props.selectedTab === "finance" ? "tabs__tab--selected" : ""}`}
          >
            Finance
          </div>
          <div
            onClick={this.props.selectTab.bind(null, "lease")}
            className={`tabs__tab ${this.props.selectedTab === "lease" ? "tabs__tab--selected" : ""}`}
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
    downPayment: state.downPayment,
    termDuration: state.termDuration,
    selectedTab: state.selectedTab,
    dealRebates: state.dealRebates,
    selectedRebates: state.selectedRebates
  };
};

export default connect(mapStateToProps, Actions)(DealPrice);
