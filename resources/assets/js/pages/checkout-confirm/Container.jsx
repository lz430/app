import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ReCaptcha, loadReCaptcha } from 'react-recaptcha-google';
import { Container, Row, Col } from 'reactstrap';

import config from 'config';
import strings from 'src/strings';
import DealImage from 'components/Deals/DealImage';
import { dealPricingFromCheckoutFactory } from 'src/DealPricing';
import {
    checkoutContact,
    clearCheckoutContactFormErrors,
} from 'apps/checkout/actions';
import mapAndBindActionCreators from 'util/mapAndBindActionCreators';
import Header from 'components/pricing/Header';
import Group from 'components/pricing/Group';
import { checkout } from 'apps/checkout/selectors';
import { init } from './actions';
import DealStockNumber from 'components/Deals/DealStockNumber';
import FinanceSummary from 'components/checkout/FinanceSummary';
import LeaseSummary from 'components/checkout/LeaseSummary';
import CashSummary from 'components/checkout/CashSummary';
import CashDetails from 'components/checkout/CashDetails';
import FinanceDetails from 'components/checkout/FinanceDetails';
import LeaseDetails from 'components/checkout/LeaseDetails';
import InvalidCheckoutPage from 'components/checkout/InvalidCheckoutPage';
import DealColors from '../../components/Deals/DealColors';

class CheckoutConfirmContainer extends React.PureComponent {
    static propTypes = {
        init: PropTypes.func.isRequired,
        checkout: PropTypes.object.isRequired,
    };

    state = {
        recaptchaToken: null,
        isPageValid: true,
    };

    recaptcha = null;

    componentDidMount() {
        this.props.init();
        loadReCaptcha();
        this.props.clearCheckoutContactFormErrors();
    }

    handleConfirmPurchase = e => {
        e.preventDefault();

        const elements = e.target.elements;

        const extractFieldValue = fieldName => {
            const field = elements.namedItem(fieldName);

            return field ? field.value : null;
        };

        const fields = {
            email: extractFieldValue('email'),
            drivers_license_state: extractFieldValue('drivers_license_state'),
            drivers_license_number: extractFieldValue('drivers_license_number'),
            first_name: extractFieldValue('first_name'),
            last_name: extractFieldValue('last_name'),
            phone_number: extractFieldValue('phone_number'),
            g_recaptcha_response: this.state.recaptchaToken,
        };

        this.recaptcha.reset();

        this.props.checkoutContact(fields);
    };

    render() {
        if (!this.props.checkout.deal.id) {
            return <InvalidCheckoutPage />;
        }

        const { dealPricing } = this.props;
        const deal = dealPricing.deal();
        const errors = this.props.checkout.contactFormErrors || {};

        return (
            <Container className="checkout-confirm">
                <Row className="checkout-confirm__header">
                    <Col>
                        <h1>Say hello to your new car!</h1>
                    </Col>
                </Row>
                <Row>
                    <Col className="image">
                        <DealImage deal={deal} link={false} />
                    </Col>
                    <Col className="title">
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
                    <Col className="summary">
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
                                Confirm your purchase
                            </Header>

                            <form
                                className="request-email__form"
                                method="POST"
                                action="/receive-email"
                                onSubmit={this.handleConfirmPurchase}
                            >
                                <div className="request-email__group">
                                    <label
                                        htmlFor="email"
                                        className="request-email__label"
                                    >
                                        Email
                                    </label>

                                    <div className="request-email__input-and-error">
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="Enter Your Email"
                                            className="request-email__input"
                                            name="email"
                                            autoComplete="email"
                                            required
                                            autoFocus
                                        />

                                        {errors.email && (
                                            <span className="request-email__error">
                                                <strong>
                                                    {errors.email[0]}
                                                </strong>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="request-email__group">
                                    <label
                                        htmlFor="first_name"
                                        className="request-email__label"
                                    >
                                        First Name
                                    </label>

                                    <div className="request-email__input-and-error">
                                        <input
                                            id="first_name"
                                            type="text"
                                            className="request-email__input"
                                            placeholder="Enter Your First Name"
                                            name="first_name"
                                            autoComplete="given-name"
                                            required
                                        />

                                        {errors.first_name && (
                                            <span className="request-email__error">
                                                <strong>
                                                    {errors.first_name[0]}
                                                </strong>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="request-email__group">
                                    <label
                                        htmlFor="last_name"
                                        className="request-email__label"
                                    >
                                        Last Name
                                    </label>

                                    <div className="request-email__input-and-error">
                                        <input
                                            id="last_name"
                                            type="text"
                                            className="request-email__input"
                                            name="last_name"
                                            placeholder="Enter Your Last Name"
                                            autoComplete="family-name"
                                            required
                                        />

                                        {errors.last_name && (
                                            <span className="request-email__error">
                                                <strong>
                                                    {errors.last_name[0]}
                                                </strong>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="request-email__group">
                                    <label
                                        htmlFor="phone_number"
                                        className="request-email__label"
                                    >
                                        Phone Number
                                    </label>

                                    <div className="request-email__input-and-error">
                                        <input
                                            id="phone_number"
                                            type="tel"
                                            className="request-email__input"
                                            name="phone_number"
                                            placeholder="Enter Your Phone Number"
                                            autoComplete="tel-national"
                                            required
                                        />

                                        {errors.phone_number && (
                                            <span className="request-email__error">
                                                <strong>
                                                    {errors.phone_number[0]}
                                                </strong>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="request-dl__group">
                                    <div className="request-dl__labels">
                                        <label
                                            htmlFor="drivers_license"
                                            type="text"
                                            className="request-dl__number-label"
                                        >
                                            Driver's License Number
                                        </label>
                                        <label
                                            htmlFor="drivers_license_state"
                                            className="request-dl__state-label"
                                        >
                                            State
                                        </label>
                                    </div>

                                    <div className="request-dl__inline-input-and-error">
                                        <input
                                            id="drivers_license"
                                            className="request-dl__number"
                                            name="drivers_license_number"
                                            placeholder="Enter Driver's License Number"
                                            required
                                        />

                                        <select
                                            className="request-dl__state"
                                            id="drivers_license_state"
                                            name="drivers_license_state"
                                        >
                                            <option value="AL">AL</option>
                                            <option value="AK">AK</option>
                                            <option value="AS">AS</option>
                                            <option value="AZ">AZ</option>
                                            <option value="AR">AR</option>
                                            <option value="CA">CA</option>
                                            <option value="CO">CO</option>
                                            <option value="CT">CT</option>
                                            <option value="DE">DE</option>
                                            <option value="DC">DC</option>
                                            <option value="FM">FM</option>
                                            <option value="FL">FL</option>
                                            <option value="GA">GA</option>
                                            <option value="GU">GU</option>
                                            <option value="HI">HI</option>
                                            <option value="ID">ID</option>
                                            <option value="IL">IL</option>
                                            <option value="IN">IN</option>
                                            <option value="IA">IA</option>
                                            <option value="KS">KS</option>
                                            <option value="KY">KY</option>
                                            <option value="LA">LA</option>
                                            <option value="ME">ME</option>
                                            <option value="MH">MH</option>
                                            <option value="MD">MD</option>
                                            <option value="MA">MA</option>
                                            <option value="MI">MI</option>
                                            <option value="MN">MN</option>
                                            <option value="MS">MS</option>
                                            <option value="MO">MO</option>
                                            <option value="MT">MT</option>
                                            <option value="NE">NE</option>
                                            <option value="NV">NV</option>
                                            <option value="NH">NH</option>
                                            <option value="NJ">NJ</option>
                                            <option value="NM">NM</option>
                                            <option value="NY">NY</option>
                                            <option value="NC">NC</option>
                                            <option value="ND">ND</option>
                                            <option value="MP">MP</option>
                                            <option value="OH">OH</option>
                                            <option value="OK">OK</option>
                                            <option value="OR">OR</option>
                                            <option value="PW">PW</option>
                                            <option value="PA">PA</option>
                                            <option value="PR">PR</option>
                                            <option value="RI">RI</option>
                                            <option value="SC">SC</option>
                                            <option value="SD">SD</option>
                                            <option value="TN">TN</option>
                                            <option value="TX">TX</option>
                                            <option value="UT">UT</option>
                                            <option value="VT">VT</option>
                                            <option value="VI">VI</option>
                                            <option value="VA">VA</option>
                                            <option value="WA">WA</option>
                                            <option value="WV">WV</option>
                                            <option value="WI">WI</option>
                                            <option value="WY">WY</option>
                                        </select>

                                        {errors.drivers_license_number && (
                                            <span className="request-email__error">
                                                <strong>
                                                    {
                                                        errors
                                                            .drivers_license_number[0]
                                                    }
                                                </strong>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="request-email__captcha">
                                    <ReCaptcha
                                        ref={el => {
                                            this.recaptcha = el;
                                        }}
                                        size="normal"
                                        data-theme="dark"
                                        render="explicit"
                                        sitekey={config.RECAPTCHA_PUBLIC_KEY}
                                        onloadCallback={
                                            this.handleResetRecaptchaToken
                                        }
                                        verifyCallback={
                                            this.handleVerifyRecaptchaToken
                                        }
                                    />

                                    {errors['g-recaptcha-response'] && (
                                        <span className="request-email__error">
                                            <strong>
                                                {
                                                    errors[
                                                        'g-recaptcha-response'
                                                    ][0]
                                                }
                                            </strong>
                                        </span>
                                    )}
                                </div>

                                <div className="request-email__buttons">
                                    <button className="request-email__button request-email__button--purple request-email__button--small">
                                        Confirm and Submit
                                    </button>
                                </div>
                            </form>
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

    handleResetRecaptchaToken = () => {
        this.setState({ recaptchaToken: null });
    };

    handleVerifyRecaptchaToken = recaptchaToken => {
        this.setState({ recaptchaToken });
    };
}

const mapStateToProps = (state, props) => {
    return {
        dealPricing: dealPricingFromCheckoutFactory(state, props),
        checkout: checkout(state, props),
    };
};

const mapDispatchToProps = mapAndBindActionCreators({
    checkoutContact,
    init,
    clearCheckoutContactFormErrors,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutConfirmContainer);
