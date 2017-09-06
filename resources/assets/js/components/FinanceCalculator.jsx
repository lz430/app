import React from "react";
import util from "src/util";
import R from "ramda";
import Rebates from "components/Rebates";
import rebates from "src/rebates";
import formulas from "src/formulas";
import { connect } from "react-redux";
import * as Actions from "actions";

class FinanceCalculator extends React.PureComponent {
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
        Finance Price {util.moneyFormat(this.props.deal.price)}
        <hr />
        Available Rebates and Incentives on Finance
        <Rebates />
        <hr />
        Summary
        <div>
          <div>
            <span>MSRP</span>
            <span style={{ float: "right" }}>
              {util.moneyFormat(this.props.deal.msrp)}
            </span>
          </div>
          <div>
            <span>Your Price</span>
            <span style={{ float: "right" }}>
              {util.moneyFormat(this.props.deal.price)}
            </span>
          </div>
          <div>
            <span>Documentation Fee</span>
            <span style={{ float: "right" }}>$0</span>
          </div>
          <div>
            <span>Sales Tax</span>
            <span style={{ float: "right" }}>$0</span>
          </div>
          <div>
            <span>Your Rebates and Incentives</span>
            <span style={{ float: "right" }}>
              {this.props.availableRebates
                ? util.moneyFormat(
                    R.sum(R.map(R.prop("value"), this.props.selectedRebates))
                  )
                : "Loading..."}
            </span>
          </div>
          <div>
            <span>Total Cost of Vehicle</span>
            <span style={{ float: "right", color: "green" }}>
              {util.moneyFormat(
                this.props.deal.price -
                  R.sum(R.map(R.prop("value"), this.props.selectedRebates))
              )}
            </span>
          </div>
        </div>
        <hr />
        <div>
          Calculate Your Payment
          <div>
            <span>Amount Financed</span>
            <span style={{ float: "right" }}>
              {this.props.availableRebates
                ? this.props.deal.price -
                    this.props.downPayment -
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
                    )
                : "Loading..."}
            </span>
          </div>
          <div>
            <span>Down Payment (10%)</span>
            <span style={{ float: "right" }}>
              ${" "}
              <input
                type="number"
                min="0"
                name="down-payment"
                value={this.props.downPayment}
                onChange={e => this.updateDownPayment(e)}
              />
            </span>
          </div>
          <div>
            <span>Term Duration</span>
            <span style={{ float: "right" }}>
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
          <span>Annual Percentage Rate</span>
          <span style={{ float: "right" }}>4%</span>
        </div>
        <div>
          <span>Your Monthly Finance Payment</span>
          <span style={{ float: "right" }}>
            {this.props.availableRebates
              ? util.moneyFormat(
                  Math.round(
                    formulas.calculateFinancedMonthlyPayments(
                      this.props.deal.price -
                        R.sum(
                          R.map(R.prop("value"), this.props.selectedRebates)
                        ),
                      this.props.downPayment,
                      this.props.termDuration
                    )
                  )
                )
              : "Loading..."}
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
    )
  };
}

export default connect(mapStateToProps, Actions)(FinanceCalculator);
