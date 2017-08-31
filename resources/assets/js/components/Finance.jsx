import React from 'react';
import PropTypes from 'prop-types';
import util from 'src/util';
import R from 'ramda';

class Finance extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            shortestTermLength: null,
            longestTermLength: null,
            termLengths: null,
        };

        this.updateFinanceTerm = this.updateFinanceTerm.bind(this);
        this.updateFinanceDownPayment = this.updateFinanceDownPayment.bind(
            this
        );
        this.renderFinanceTermsSlider = this.renderFinanceTermsSlider.bind(
            this
        );
    }

    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(props) {
        switch (String(props.financeTerms)) {
            case 'null':
                return this.setState({
                    shortestTermLength: null,
                    longestTermLength: null,
                    termLengths: null,
                });
            case '':
                return this.setState({
                    shortestTermLength: null,
                    longestTermLength: null,
                    termLengths: [],
                });
            default:
                const termLengths = R.map(R.prop('term'), props.financeTerms);

                this.setState({
                    shortestTermLength: Math.min(termLengths),
                    longestTermLength: Math.max(termLengths),
                    termLengths: termLengths,
                });
        }
    }

    updateFinanceTerm(e) {
        this.props.updateFinanceTerm(
            util.getClosestNumberInRange(
                parseInt(e.target.value),
                this.state.termLengths
            )
        );
    }

    updateFinanceDownPayment(e) {
        const number = parseFloat(e.target.value);

        if (!isNaN(number)) {
            this.props.updateFinanceDownPayment(number);
        } else {
            this.props.updateFinanceDownPayment(0);
        }
    }

    renderFinanceTermsSlider() {
        switch (String(this.state.termLengths)) {
            case 'null':
                return 'loading';
            case '':
                return 'no terms available';
            default:
                return (
                    <div>
                        <label htmlFor="finance-term">
                            Finance Term (Months)
                        </label>
                        <div className="range-slider">
                            <input
                                className="range-slider__slider"
                                name="finance-term"
                                type="range"
                                min={this.state.shortestTermLength}
                                max={this.state.longestTermLength}
                                defaultValue={this.props.financeTerm}
                                onChange={this.updateFinanceTerm}
                            />
                            <div className="range-slider__badge">
                                {this.props.financeTerm}
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
                        className="finance__down-payment"
                        type="number"
                        min="0"
                        name="down-payment"
                        value={this.props.financeDownPayment}
                        onChange={this.updateFinanceDownPayment}
                    />
                </div>
                <div className="tabs__content-item">
                    {this.renderFinanceTermsSlider()}
                </div>
            </div>
        );
    }
}

export default Finance;
