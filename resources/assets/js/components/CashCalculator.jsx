import React from 'react';
import R from 'ramda';
import Targets from 'components/Targets';
import CustomerTypeSelect from 'components/CustomerTypeSelect';
import { connect } from 'react-redux';
import * as Actions from 'apps/common/actions';
import SVGInline from 'react-svg-inline';
import miscicons from 'miscicons';

class CashCalculator extends React.PureComponent {
    componentWillMount() {
        this.props.requestTargets(this.props.dealPricing.deal());
        this.props.requestBestOffer(this.props.dealPricing.deal());
    }

    handleTargetsChange() {
        this.props.requestBestOffer(this.props.dealPricing.deal());
    }

    showWhenPricingIsLoaded(fn) {
        return this.props.dealPricing.isPricingLoading() ? (
            <SVGInline svg={miscicons['loading']} />
        ) : (
            fn()
        );
    }

    render() {
        return (
            <div className="cash-finance-lease-calculator__calculator-content">
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <CustomerTypeSelect
                            {...R.pick(
                                ['deal', 'employeeBrand', 'setEmployeeBrand'],
                                this.props
                            )}
                        />
                    </div>
                    <div>Your Price {this.props.dealPricing.yourPrice()}*</div>
                </div>
                <hr />
                <Targets
                    deal={this.props.dealPricing.deal()}
                    targetsChanged={() => this.handleTargetsChange()}
                />
                {/* <hr />*/}
                <h4>Summary</h4>
                <div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            MSRP
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {this.props.dealPricing.msrp()}
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Selling Price
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {this.props.dealPricing.sellingPrice()}
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Rebates Applied
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {this.props.dealPricing.bestOfferIsLoading() ? (
                                <SVGInline svg={miscicons['loading']} />
                            ) : (
                                this.props.dealPricing.bestOffer()
                            )}
                        </span>
                    </div>
                    <div>
                        <span className="cash-finance-lease-calculator__left-item">
                            Your Price
                        </span>
                        <span className="cash-finance-lease-calculator__right-item">
                            {this.props.dealPricing.bestOfferIsLoading() ? (
                                <SVGInline svg={miscicons['loading']} />
                            ) : (
                                this.props.dealPricing.yourPrice()
                            )}*
                        </span>
                    </div>
                </div>
                <div className="accupricing-cta">
                    <a onClick={this.props.showAccuPricingModal}>
                        <img
                            src="/images/accupricing-logo.png"
                            className="accupricing-cta__logo"
                        />
                    </a>
                    <p className="accupricing-cta__disclaimer">
                        * Includes taxes, dealer fees and rebates.
                    </p>
                </div>
            </div>
        );
    }
}

const makeMapStateToProps = () => {
    const mapStateToProps = (state, props) => {
        return {
            deal: props.dealPricing.deal(),
            employeeBrand: props.dealPricing.employeeBrand(),
        };
    };
    return mapStateToProps;
};

export default connect(
    makeMapStateToProps,
    Actions
)(CashCalculator);
