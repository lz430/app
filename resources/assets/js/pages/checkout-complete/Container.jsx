import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';

import strings from 'src/strings';
import DealImage from 'components/Deals/DealImage';
import { dealPricingFromCheckoutFactory } from 'src/DealPricing';
import mapAndBindActionCreators from 'util/mapAndBindActionCreators';
import Header from 'components/pricing/Header';
import Group from 'components/pricing/Group';
import { checkout } from 'apps/checkout/selectors';
import { init } from './actions';
import DealStockNumber from 'components/Deals/DealStockNumber';
import FinanceSummary from 'components/checkout/FinanceSummary';
import LeaseSummary from 'components/checkout/LeaseSummary';
import CashSummary from 'components/checkout/CashSummary';
import FinanceDetails from 'components/checkout/FinanceDetails';
import LeaseDetails from 'components/checkout/LeaseDetails';
import CashDetails from 'components/checkout/CashDetails';
import InvalidCheckoutPage from 'components/checkout/InvalidCheckoutPage';
import DealColors from 'components/Deals/DealColors';
import { MediumAndUp, SmallAndDown } from 'components/Responsive';
class CheckoutCompleteContainer extends React.PureComponent {
    static propTypes = {
        init: PropTypes.func.isRequired,
        checkout: PropTypes.object.isRequired,
    };

    componentDidMount() {
        this.props.init();
    }

    render() {
        if (!this.props.checkout.deal.id) {
            return <InvalidCheckoutPage />;
        }

        const { dealPricing } = this.props;
        const deal = dealPricing.deal();

        return (
            <Container className="checkout-confirm">
                <Row className="checkout-confirm__header">
                    <Col>
                        <h1>Congratulations on your new car!</h1>
                    </Col>
                </Row>

                <Row>
                    <Col xs="12" md="4" className="image">
                        <SmallAndDown>
                            <DealImage deal={deal} link={false} size="full" />
                        </SmallAndDown>
                        <MediumAndUp>
                            <DealImage deal={deal} link={false} />
                        </MediumAndUp>
                    </Col>
                    <Col md="4" className="title">
                        <Group>
                            <div className="year-and-make">
                                {strings.dealYearMake(deal)}
                            </div>
                            <div className="model-and-trim">
                                {strings.dealModelTrim(deal)}
                            </div>
                            <div className="colors">
                                <DealColors deal={deal} />
                            </div>
                            <div className="stock-number">
                                <DealStockNumber deal={deal} />
                            </div>
                        </Group>
                    </Col>
                    <Col md="4" className="summary">
                        {dealPricing.isCash() && (
                            <CashSummary dealPricing={dealPricing} />
                        )}
                        {dealPricing.isFinance() && (
                            <FinanceSummary dealPricing={dealPricing} />
                        )}
                        {dealPricing.isLease() && (
                            <LeaseSummary dealPricing={dealPricing} />
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col className="details">
                        {dealPricing.isCash() && (
                            <CashDetails dealPricing={dealPricing} />
                        )}
                        {dealPricing.isFinance() && (
                            <FinanceDetails dealPricing={dealPricing} />
                        )}
                        {dealPricing.isLease() && (
                            <LeaseDetails dealPricing={dealPricing} />
                        )}
                    </Col>
                    <Col className="confirm">
                        <Group>
                            <Header style={{ fontSize: '1.5em' }}>
                                What's next?
                            </Header>
                            <p>
                                A Deliver My Ride affiliate dealer
                                representative will contact you shortly to
                                schedule your delivery. If past regular hours of
                                operation, you can expect a call early the next
                                business day.
                            </p>

                            <Header>
                                To finalize your purchase, you'll need:
                            </Header>
                            <ul>
                                <li>Drivers License</li>
                                <li>Certificate of Insurance</li>
                                <li>
                                    Certified Check in the amount listed above
                                </li>
                                <li>Registration</li>
                                <li>
                                    Proof of eligibility for any rebates you
                                    selected
                                </li>
                            </ul>
                        </Group>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <div style={{ margin: '1em 0' }}>
                            * This is not a binding contract. Delivering dealer
                            will verify vehicle availability, pricing details
                            and incentive eligibility. Rates are subject to
                            credit approval.
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        dealPricing: dealPricingFromCheckoutFactory(state, props),
        checkout: checkout(state, props),
    };
};

const mapDispatchToProps = mapAndBindActionCreators({
    init,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutCompleteContainer);
