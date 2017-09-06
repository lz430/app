import React from "react";
import PropTypes from "prop-types";
import util from "src/util";
import R from "ramda";

class Lease extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      shortestTermLength: null,
      longestTermLength: null,
      termLengths: null
    };

    this.updateLeaseTerm = this.updateLeaseTerm.bind(this);
    this.updateLeaseAnnualMileage = this.updateLeaseAnnualMileage.bind(this);
    this.updateLeaseDownPayment = this.updateLeaseDownPayment.bind(this);
    this.renderLeaseTermsSlider = this.renderLeaseTermsSlider.bind(this);
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  componentWillReceiveProps(props) {
    switch (String(props.leaseTerms)) {
      case "null":
        return this.setState({
          shortestTermLength: null,
          longestTermLength: null,
          termLengths: null
        });
      case "":
        return this.setState({
          shortestTermLength: null,
          longestTermLength: null,
          termLengths: []
        });
      default:
        const termLengths = R.map(R.prop("term"), props.leaseTerms);

        this.setState({
          shortestTermLength: Math.min(termLengths),
          longestTermLength: Math.max(termLengths),
          termLengths: termLengths
        });
    }
  }

  updateLeaseTerm(e) {
    this.props.updateLeaseTerm(
      util.getClosestNumberInRange(
        parseInt(e.target.value),
        this.state.termLengths
      )
    );
  }

  updateLeaseAnnualMileage(e) {
    this.props.updateLeaseAnnualMileage(parseInt(e.target.value));
  }

  updateLeaseDownPayment(e) {
    const number = parseFloat(e.target.value);

    if (!isNaN(number)) {
      this.props.updateLeaseDownPayment(number);
    } else {
      this.props.updateLeaseDownPayment(0);
    }
  }

  renderLeaseTermsSlider() {
    switch (String(this.state.termLengths)) {
      case "null":
        return "loading";
      case "":
        return "no terms available";
      default:
        return (
          <div>
            <label htmlFor="lease-term">Lease Term (Months)</label>
            <div className="range-slider">
              <input
                className="range-slider__slider"
                name="lease-term"
                type="range"
                min={this.state.shortestTermLength}
                max={this.state.longestTermLength}
                defaultValue={this.props.leaseTerm}
                onChange={this.updateLeaseTerm}
              />
              <div className="range-slider__badge">
                {this.props.leaseTerm}
              </div>
            </div>
          </div>
        );
    }
  }

  render() {
    return (
      <div className="tabs__content lease">
        <div className="tabs__content-item">
          <label htmlFor="down-payment">Down Payment</label>
          <input
            className="lease__down-payment"
            type="number"
            min="0"
            name="down-payment"
            value={this.props.leaseDownPayment}
            onChange={this.updateLeaseDownPayment}
          />
        </div>
        <div className="tabs__content-item">
          <label className="lease__label" htmlFor="miles-year">
            Miles Per Year
          </label>
          <div className="range-slider">
            <input
              className="range-slider__slider"
              name="miles-year"
              type="range"
              min="5000"
              max="80000"
              step="5000"
              defaultValue={this.props.leaseAnnualMileage}
              onChange={this.updateLeaseAnnualMileage}
            />
            <div className="range-slider__badge">
              {util.numbersWithCommas(this.props.leaseAnnualMileage)}
            </div>
          </div>
        </div>
        <div className="tabs__content-item">
          {this.renderLeaseTermsSlider()}
        </div>
      </div>
    );
  }
}

export default Lease;
