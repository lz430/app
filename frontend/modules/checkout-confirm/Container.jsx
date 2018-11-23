import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'next/router';

import { Container, Row, Col } from 'reactstrap';

import strings from '../../util/strings';
import DealImage from '../../components/Deals/DealImage';
import { pricingFromCheckoutFactory } from '../../apps/checkout/selectors';
import {
    checkoutContact,
    clearCheckoutContactFormErrors,
} from '../../apps/checkout/actions';
import mapAndBindActionCreators from '../../util/mapAndBindActionCreators';
import Header from '../../apps/pricing/components/Header';
import Group from '../../apps/pricing/components/Group';
import { checkout } from '../../apps/checkout/selectors';
import { init } from './actions';
import DealStockNumber from '../../components/Deals/DealStockNumber';
import FinanceSummary from '../../apps/checkout/components/FinanceSummary';
import LeaseSummary from '../../apps/checkout/components/LeaseSummary';
import CashSummary from '../../apps/checkout/components/CashSummary';
import CashDetails from '../../apps/checkout/components/CashDetails';
import FinanceDetails from '../../apps/checkout/components/FinanceDetails';
import LeaseDetails from '../../apps/checkout/components/LeaseDetails';
import InvalidCheckoutPage from '../../apps/checkout/components/InvalidCheckoutPage';
import DealColors from '../../components/Deals/DealColors';
import { MediumAndUp, SmallAndDown } from '../../components/Responsive';
import ContactForm from './components/ContactForm';

import withTracker from '../../components/withTracker';
import CheckoutSteps from '../../apps/checkout/components/CheckoutSteps';
import { nextRouterType } from '../../core/types';
import CheckoutPageLoading from '../../apps/checkout/components/CheckoutPageLoading';
import { getCurrentPage } from '../../apps/page/selectors';

class CheckoutConfirmContainer extends React.PureComponent {
    static propTypes = {
        checkout: PropTypes.object.isRequired,
        currentPage: PropTypes.string,
        init: PropTypes.func.isRequired,
        clearCheckoutContactFormErrors: PropTypes.func.isRequired,
        checkoutContact: PropTypes.func.isRequired,
        pricing: PropTypes.object,
        router: nextRouterType,
    };

    state = {
        renderPage: false,
        isPageValid: true,
    };

    componentDidMount() {
        this.setState({ renderPage: true });
        this.props.init();
    }

    onSubmit(fields, actions) {
        return this.props.checkoutContact(fields, actions);
    }

    render() {
        if (!this.state.renderPage) {
            return <CheckoutPageLoading />;
        }

        if (!this.props.checkout.deal.id) {
            return <InvalidCheckoutPage />;
        }

        const { pricing } = this.props;
        const deal = pricing.deal();
        return (
            <React.Fragment>
                <CheckoutSteps
                    currentPage={this.props.currentPage}
                    checkout={this.props.checkout}
                    router={this.props.router}
                />
                <Container className="checkout-confirm">
                    <Row>
                        <Col>
                            <h1>Say hello to your new car!</h1>
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
                                    Confirm your purchase
                                </Header>
                                <ContactForm
                                    checkout={this.props.checkout}
                                    clearCheckoutContactFormErrors={
                                        this.props
                                            .clearCheckoutContactFormErrors
                                    }
                                    checkoutContact={this.onSubmit.bind(this)}
                                />
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
        currentPage: getCurrentPage(state),
        checkout: checkout(state),
    };
};

const mapDispatchToProps = mapAndBindActionCreators({
    checkoutContact,
    init,
    clearCheckoutContactFormErrors,
});

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withTracker
)(CheckoutConfirmContainer);
