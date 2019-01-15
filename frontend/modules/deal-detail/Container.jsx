import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import PropTypes from 'prop-types';
import { dealType } from '../../core/types';

import { track } from '../../core/services';

import { Alert, Container, Row, Col } from 'reactstrap';

import mapAndBindActionCreators from '../../util/mapAndBindActionCreators';
import Loading from '../../components/Loading';
import { toggleCompare } from '../../apps/common/actions';
import { getIsPageLoading } from '../../apps/page/selectors';
import { setPurchaseStrategy } from '../../apps/user/actions';
import {
    getUserLocation,
    getUserPurchaseStrategy,
} from '../../apps/user/selectors';
import { setCheckoutData, checkoutStart } from '../../apps/checkout/actions';
import { equals } from 'ramda';
import {
    initPage,
    receiveDeal,
    dealDetailRequestDealQuote,
    dealDetailRefreshDealQuote,
    dealDetailResetDealQuote,
    setDmrDiscount,
    setEmployeeDiscount,
    setSupplierDiscount,
    selectConditionalRoles,
    updateFinanceDownPayment,
    updateFinanceTerm,
    updateLease,
    tradeSet,
} from './actions';

import {
    dealPricingDataForDetail,
    getConditionalRoles,
    getDeal,
    getDealDetailQuote,
    getDiscountType,
    getIsDealQuoteRefreshing,
    getTradeIn,
    getUrlQuery,
    pricingFromDealDetail,
} from './selectors';

import Breadcrumb from './components/Breadcrumb';
import withTracker from '../../components/withTracker';
import { nextRouterType } from '../../core/types';
import { withRouter } from 'next/router';
import { getSearchQuery } from '../deal-list/selectors';
import { StickyContainer } from 'react-sticky';
import Header from './components/Header';
import Media from './components/Media';
import AddToCart from './components/AddToCart';
import Faq from './components/faq';
import ContactForm from './components/ContactForm';
import OurPromise from '../../components/General/Promise';
//import NavHighlights from './components/NavHighlights';
import Overview from './components/Overview/Overview';
import Specs from './components/Specs/Specs';
import AdditionalInformation from './components/MiscFeatures';

class DealDetailContainer extends React.PureComponent {
    static propTypes = {
        deal: dealType,
        initialQuoteParams: PropTypes.object,
        quote: PropTypes.object,
        purchaseStrategy: PropTypes.string.isRequired,
        userLocation: PropTypes.object.isRequired,
        isLoading: PropTypes.bool,
        discountType: PropTypes.string.isRequired,
        selectedConditionalRoles: PropTypes.array,
        compareList: PropTypes.array,
        initPage: PropTypes.func.isRequired,
        receiveDeal: PropTypes.func.isRequired,
        setPurchaseStrategy: PropTypes.func.isRequired,
        dealDetailRequestDealQuote: PropTypes.func.isRequired,
        dealDetailResetDealQuote: PropTypes.func.isRequired,
        setCheckoutData: PropTypes.func.isRequired,
        checkoutStart: PropTypes.func.isRequired,
        toggleCompare: PropTypes.func.isRequired,
        router: nextRouterType,
        searchQuery: PropTypes.object.isRequired,
        isDealQuoteRefreshing: PropTypes.bool.isRequired,
        pricing: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        dealPricingData: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.bool,
        ]),
        setDmrDiscount: PropTypes.func.isRequired,
        setEmployeeDiscount: PropTypes.func.isRequired,
        setSupplierDiscount: PropTypes.func.isRequired,
        selectConditionalRoles: PropTypes.func.isRequired,
        updateFinanceDownPayment: PropTypes.func.isRequired,
        updateFinanceTerm: PropTypes.func.isRequired,
        updateLease: PropTypes.func.isRequired,
        tradeSet: PropTypes.func.isRequired,
        dealDetailRefreshDealQuote: PropTypes.func.isRequired,
        urlQuery: PropTypes.object.isRequired,
    };

    state = {
        dealQuoteStep: 0, // price || payment || detail
        submitted: false,
    };

    componentDidMount() {
        if (this.props.initialQuoteParams.step) {
            this.setState({
                dealQuoteStep: parseInt(this.props.initialQuoteParams.step),
            });
        }

        this.props.initPage(
            this.props.router.query.id,
            this.props.initialQuoteParams
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.dealPricingData.tradeIn &&
            !equals(
                prevProps.dealPricingData.tradeIn,
                this.props.dealPricingData.tradeIn
            )
        ) {
            this.props.dealDetailRefreshDealQuote();
        }

        if (
            prevProps.dealPricingData.leaseCashDue !==
            this.props.dealPricingData.leaseCashDue
        ) {
            this.props.dealDetailRefreshDealQuote();
        }

        if (
            !equals(prevProps.urlQuery, this.props.urlQuery) ||
            prevState.dealQuoteStep !== this.state.dealQuoteStep
        ) {
            this.updateUrl();
        }
    }

    handlePaymentTypeChange = strategy => {
        this.props.dealDetailResetDealQuote();
        this.props.setPurchaseStrategy(strategy);
        this.props.dealDetailRefreshDealQuote();

        // This is here because purchase strategy is a global thing
        track('deal-detail:quote-form:changed', {
            'Form Property': 'Purchase Strategy',
            'Form Value': strategy,
        });
        //this.updateUrl();
    };

    handleDiscountChange = (discountType, make) => {
        this.props.dealDetailResetDealQuote();
        switch (discountType) {
            case 'dmr':
                this.props.setDmrDiscount();
                break;

            case 'employee':
                this.props.setEmployeeDiscount(make);
                break;

            case 'supplier':
                this.props.setSupplierDiscount(make);
                break;
            default:
                break;
        }
        this.props.dealDetailRefreshDealQuote();
    };

    onUpdateQuoteStep(step) {
        this.setState({ dealQuoteStep: step });
    }

    handleRebatesChange = role => {
        let selectedRoles = [...this.props.selectedConditionalRoles];
        let index = selectedRoles.indexOf(role);
        if (index !== -1) {
            selectedRoles.splice(index, 1);
        } else {
            selectedRoles.push(role);
        }

        this.props.selectConditionalRoles(selectedRoles);
        this.props.dealDetailRefreshDealQuote();
    };

    handleFinanceDownPaymentChange = downPayment => {
        this.props.updateFinanceDownPayment(downPayment);
    };

    handleFinanceTermChange = term => {
        this.props.updateFinanceTerm(term);
    };

    handleLeaseChange = (annualMileage, term, cashDue) => {
        this.props.updateLease(annualMileage, term, cashDue);
    };

    handleBuyNow() {
        const { pricing } = this.props;
        const checkoutData = pricing.toCheckoutData();
        this.props.setCheckoutData(
            checkoutData.deal,
            checkoutData.quote,
            checkoutData.paymentStrategy,
            checkoutData.discountType,
            checkoutData.effectiveTerm,
            checkoutData.financeDownPayment,
            checkoutData.leaseAnnualMileage,
            checkoutData.employeeBrand,
            checkoutData.supplierBrand,
            checkoutData.tradeIn,
            this.props.urlQuery
        );
        this.props.checkoutStart(pricing);
    }

    renderPageLoadingIcon() {
        return (
            <React.Fragment>
                <Breadcrumb searchQuery={this.props.searchQuery} />
                <Container className="pt-5 pb-5">
                    <Loading size={4} />
                </Container>
            </React.Fragment>
        );
    }

    renderDealLoadingError() {
        return (
            <React.Fragment>
                <Breadcrumb searchQuery={this.props.searchQuery} />
                <Container>
                    <Alert className="mb-5 mt-5" color="danger">
                        Unable to load deal.
                    </Alert>
                </Container>
            </React.Fragment>
        );
    }

    renderDealOutOfRange() {
        return (
            <Container className="mt-2">
                <Alert className="mb-0 text-sm p-2">
                    This deal is outside of your delivery range, additional fees
                    may apply.
                </Alert>
            </Container>
        );
    }

    updateUrl() {
        if (!this.props.deal) {
            return;
        }

        let query = {
            ...this.props.router.query,
            ...this.props.urlQuery,
            step: this.state.dealQuoteStep,
        };

        let prettyQuery = {
            ...query,
        };
        delete prettyQuery.csrfToken;
        delete prettyQuery.id;
        delete prettyQuery.quoteSettings;

        this.props.router.replace(
            {
                pathname: '/deal-detail',
                query: query,
            },
            {
                pathname: '/deals/' + this.props.deal.id,
                query: prettyQuery,
            },
            { shallow: true }
        );
    }

    render() {
        if (this.props.isLoading || this.props.deal === null) {
            return this.renderPageLoadingIcon();
        }

        if (this.props.deal === false) {
            return this.renderDealLoadingError();
        }

        return (
            <React.Fragment>
                <Breadcrumb searchQuery={this.props.searchQuery} />

                {!this.props.deal['is_in_range'] && this.renderDealOutOfRange()}

                <StickyContainer>
                    <Header deal={this.props.deal} />
                    <Container className="mb-5 deal-details">
                        <Row>
                            <Col md="6" lg="7" xl="8">
                                <Media deal={this.props.deal} />
                            </Col>
                            <Col md="6" lg="5" xl="4">
                                <AddToCart
                                    deal={this.props.deal}
                                    dealQuoteStep={this.state.dealQuoteStep}
                                    onUpdateQuoteStep={this.onUpdateQuoteStep.bind(
                                        this
                                    )}
                                    initialQuoteParams={
                                        this.props.initialQuoteParams
                                    }
                                    replace={this.props.router.replace}
                                    updateUrl={this.updateUrl.bind(this)}
                                    purchaseStrategy={
                                        this.props.purchaseStrategy
                                    }
                                    isDealQuoteRefreshing={
                                        this.props.isDealQuoteRefreshing
                                    }
                                    handlePaymentTypeChange={this.handlePaymentTypeChange.bind(
                                        this
                                    )}
                                    pricing={this.props.pricing}
                                    handleDiscountChange={this.handleDiscountChange.bind(
                                        this
                                    )}
                                    handleRebatesChange={this.handleRebatesChange.bind(
                                        this
                                    )}
                                    handleFinanceDownPaymentChange={this.handleFinanceDownPaymentChange.bind(
                                        this
                                    )}
                                    handleFinanceTermChange={this.handleFinanceTermChange.bind(
                                        this
                                    )}
                                    handleLeaseChange={this.handleLeaseChange.bind(
                                        this
                                    )}
                                    handleBuyNow={this.handleBuyNow.bind(this)}
                                    userLocation={this.props.userLocation}
                                    tradeSet={this.props.tradeSet}
                                />
                            </Col>
                        </Row>
                        {/* <div className="deal__row">
                            <NavHighlights deal={this.props.deal} />
                        </div> */}
                    </Container>
                    <Overview deal={this.props.deal} />
                    <Specs deal={this.props.deal} />
                    <AdditionalInformation deal={this.props.deal} />
                    <OurPromise />
                    <div className="pb-5">
                        <Container className="deal__container-faq-contact">
                            <Row className="shadow-sm">
                                <Col
                                    md="6"
                                    sm="12"
                                    className="bg-white shadow-sm rounded no-gutters container-faq"
                                >
                                    <Faq />
                                </Col>
                                <Col
                                    md="6"
                                    sm="12"
                                    className="bg-white shadow-sm rounded no-gutters container-contact"
                                >
                                    <ContactForm deal={this.props.deal} />
                                </Col>
                            </Row>
                        </Container>
                    </div>
                </StickyContainer>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        deal: getDeal(state),
        quote: getDealDetailQuote(state),
        searchQuery: getSearchQuery(state),
        selectedConditionalRoles: getConditionalRoles(state),
        purchaseStrategy: getUserPurchaseStrategy(state),
        compareList: state.common.compareList,
        discountType: getDiscountType(state),
        userLocation: getUserLocation(state),
        isLoading: getIsPageLoading(state),
        trade: getTradeIn(state),
        pricing: pricingFromDealDetail(state),
        isDealQuoteRefreshing: getIsDealQuoteRefreshing(state),
        dealPricingData: dealPricingDataForDetail(state, props),
        urlQuery: getUrlQuery(state),
    };
};

const mapDispatchToProps = mapAndBindActionCreators({
    toggleCompare,
    initPage,
    setPurchaseStrategy,
    receiveDeal,
    dealDetailRequestDealQuote,
    dealDetailResetDealQuote,
    setCheckoutData,
    checkoutStart,
    setDmrDiscount,
    setEmployeeDiscount,
    setSupplierDiscount,
    selectConditionalRoles,
    updateFinanceDownPayment,
    updateFinanceTerm,
    updateLease,
    tradeSet,
    dealDetailRefreshDealQuote,
});

export default compose(
    withRouter,
    withTracker,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(DealDetailContainer);
