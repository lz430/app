import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import strings from '../../src/strings';
import DealImage from '../../components/Deals/DealImage';
import { pricingFromCheckoutFactory } from '../../src/pricing/factory';
import mapAndBindActionCreators from 'util/mapAndBindActionCreators';
import Header from '../../components/pricing/Header';
import Group from '../../components/pricing/Group';
import { checkout } from '../../apps/checkout/selectors';
import { init } from './actions';
import DealStockNumber from '../../components/Deals/DealStockNumber';
import FinanceSummary from '../../components/checkout/FinanceSummary';
import LeaseSummary from '../../components/checkout/LeaseSummary';
import CashSummary from '../../components/checkout/CashSummary';
import FinanceDetails from '../../components/checkout/FinanceDetails';
import LeaseDetails from '../../components/checkout/LeaseDetails';
import CashDetails from '../../components/checkout/CashDetails';
import InvalidCheckoutPage from '../../components/checkout/InvalidCheckoutPage';
import DealColors from '../../components/Deals/DealColors';
import { MediumAndUp, SmallAndDown } from '../../components/Responsive';
import withTracker from '../../components/withTracker';
import HeaderToolbar from '../../components/App/Header/HeaderToolbar';
import { withRouter } from 'next/router';

class CheckoutCompleteContainer extends React.PureComponent {
    static propTypes = {
        init: PropTypes.func.isRequired,
        checkout: PropTypes.object.isRequired,
        pricing: PropTypes.object,
    };

    componentDidMount() {
        this.props.init();
    }

    render() {
        if (!this.props.checkout.deal.id) {
            return <InvalidCheckoutPage />;
        }

        const { pricing } = this.props;
        const deal = pricing.deal();

        return (
            <React.Fragment>
                <HeaderToolbar />
                <Container className="checkout-confirm">
                    <Row className="checkout-confirm__header">
                        <Col>
                            <h1>Congratulations on your new car!</h1>
                        </Col>
                    </Row>

                    <Row>
                        <Col xs="12" md="4" className="image">
                            <SmallAndDown>
                                <DealImage
                                    deal={deal}
                                    link={false}
                                    size="full"
                                />
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
                            {pricing.isCash() && (
                                <CashSummary pricing={pricing} />
                            )}
                            {pricing.isFinance() && (
                                <FinanceSummary pricing={pricing} />
                            )}
                            {pricing.isLease() && (
                                <LeaseSummary pricing={pricing} />
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col className="details">
                            {pricing.isCash() && (
                                <CashDetails pricing={pricing} />
                            )}
                            {pricing.isFinance() && (
                                <FinanceDetails pricing={pricing} />
                            )}
                            {pricing.isLease() && (
                                <LeaseDetails pricing={pricing} />
                            )}
                        </Col>
                        <Col className="confirm">
                            <Group>
                                <Header style={{ fontSize: '1.5em' }}>
                                    What&apos;s next?
                                </Header>
                                <p>
                                    A Deliver My Ride affiliate dealer
                                    representative will contact you shortly to
                                    schedule your delivery. If past regular
                                    hours of operation, you can expect a call
                                    early the next business day.
                                </p>

                                <Header>
                                    To finalize your purchase, you&apos;ll need:
                                </Header>
                                <ul>
                                    <li>Drivers License</li>
                                    <li>Certificate of Insurance</li>
                                    <li>
                                        Certified Check in the amount listed
                                        above
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
                                * This is not a binding contract. Delivering
                                dealer will verify vehicle availability, pricing
                                details and incentive eligibility. Rates are
                                subject to credit approval.
                            </div>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        pricing: pricingFromCheckoutFactory(state, props),
        checkout: checkout(state, props),
    };
};

const mapDispatchToProps = mapAndBindActionCreators({
    init,
});

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withTracker
)(CheckoutCompleteContainer);
