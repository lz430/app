import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'next/router';

import { Container, Row, Col } from 'reactstrap';

import strings from '../../util/strings';
import DealImage from '../../components/Deals/DealImage';
import { pricingFromCheckoutFactory } from '../../apps/checkout/selectors';
import { checkoutContact } from '../../apps/checkout/actions';
import mapAndBindActionCreators from '../../util/mapAndBindActionCreators';
import { checkout } from '../../apps/checkout/selectors';
import { init } from './actions';
import DealStockNumber from '../../components/Deals/DealStockNumber';
import FinanceSummary from '../../apps/checkout/components/FinanceSummary';
import LeaseSummary from '../../apps/checkout/components/LeaseSummary';
import CashSummary from '../../apps/checkout/components/CashSummary';
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
                <Container className="pt-4 pb-4">
                    <Row>
                        <Col>
                            <h2 className="mb-4">
                                Get Started: Tell us a little about yourself
                            </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="bg-white border border-medium">
                                <ContactForm
                                    checkout={this.props.checkout}
                                    onCheckoutContact={this.onSubmit.bind(this)}
                                />
                            </div>
                        </Col>
                        <Col>
                            <div className="d-flex bg-white p-4 border border-medium mb-4">
                                <div className="image">
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
                                </div>
                                <div className="title pl-4 w-100">
                                    <div className="year-and-make font-weight-bold">
                                        {strings.dealYearMake(deal)}
                                    </div>
                                    <div className="model-and-trim mb-2 font-weight-bold">
                                        {strings.dealModelTrim(deal)}
                                    </div>
                                    <div className="colors">
                                        <DealColors deal={deal} />
                                    </div>
                                    <div className="stock-number">
                                        <DealStockNumber deal={deal} />
                                    </div>
                                </div>
                            </div>
                            <div className="summary bg-white pl-4 pr-4 pb-4 pt-2 border border-medium mb-4">
                                {pricing.isCash() && (
                                    <CashSummary pricing={pricing} />
                                )}
                                {pricing.isFinance() && (
                                    <FinanceSummary pricing={pricing} />
                                )}
                                {pricing.isLease() && (
                                    <LeaseSummary pricing={pricing} />
                                )}
                            </div>
                            <div className="bg-white p-4 border border-danger text-sm">
                                This is not a binding contract. Delivering
                                dealer will verify vehicle availability, pricing
                                details and incentive eligibility. <br />
                                <br />
                                Monthly payment amount applies to qualified
                                credit or lease applicants having a minimum
                                credit score of 740. Your monthly payment is
                                established based on a full review of your
                                credit application and credit report.
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
});

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withTracker
)(CheckoutConfirmContainer);
