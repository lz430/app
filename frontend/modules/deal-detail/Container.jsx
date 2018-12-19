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
    selectDmrDiscount,
    selectEmployeeDiscount,
    selectSupplierDiscount,
    selectConditionalRoles,
    updateDownPayment,
    updateTerm,
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
    pricingFromDealDetail,
} from './selectors';

import Breadcrumb from './components/Breadcrumb';
import withTracker from '../../components/withTracker';
import { nextRouterType } from '../../core/types';
import { withRouter } from 'next/router';
import { getSearchQuery } from '../deal-list/selectors';
import Header from './components/Header';
import Media from './components/Media';
import DealFeatures from './components/DealFeatures';
//import CompareButton from './components/CompareButton';
import AddToCart from './components/AddToCart';
import Faq from './components/faq';
import ContactForm from './components/ContactForm';
import OurPromise from './components/Promise';

class DealDetailContainer extends React.PureComponent {
    static propTypes = {
        deal: dealType,
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
        selectDmrDiscount: PropTypes.func.isRequired,
        selectEmployeeDiscount: PropTypes.func.isRequired,
        selectSupplierDiscount: PropTypes.func.isRequired,
        selectConditionalRoles: PropTypes.func.isRequired,
        updateDownPayment: PropTypes.func.isRequired,
        updateTerm: PropTypes.func.isRequired,
        updateLease: PropTypes.func.isRequired,
        tradeSet: PropTypes.func.isRequired,
        dealDetailRefreshDealQuote: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.initPage(this.props.router.query.id);
    }

    componentDidUpdate(prevProps) {
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
    };

    handleDiscountChange = (discountType, make) => {
        this.props.dealDetailResetDealQuote();
        switch (discountType) {
            case 'dmr':
                this.props.selectDmrDiscount();
                break;

            case 'employee':
                this.props.selectEmployeeDiscount(make);
                break;

            case 'supplier':
                this.props.selectSupplierDiscount(make);
                break;
            default:
                break;
        }
        this.props.dealDetailRefreshDealQuote();
    };

    handleRebatesChange = role => {
        let selectedRoles = this.props.selectedConditionalRoles;
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
        this.props.updateDownPayment(downPayment);
    };

    handleFinanceTermChange = term => {
        this.props.updateTerm(term);
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
            checkoutData.tradeIn
        );
        this.props.checkoutStart(pricing);
    }

    onSelectDeal(pricing) {
        return this.props.checkoutStart(pricing, this.props.router);
    }

    renderPageLoadingIcon() {
        return (
            <React.Fragment>
                <Breadcrumb searchQuery={this.props.searchQuery} />
                <Container className="pt-5 pb-5">
                    <Loading />
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

                <Container className="mb-5 deal-details">
                    <Header deal={this.props.deal} />
                    <Row>
                        <Col md="6" lg="7" xl="8">
                            <Media deal={this.props.deal} />
                            <DealFeatures deal={this.props.deal} />
                            {/*
                            <CompareButton
                                deal={this.props.deal}
                                compareList={this.props.compareList}
                                onToggleCompare={this.props.toggleCompare}
                            />
                             */}
                        </Col>
                        <Col md="6" lg="5" xl="4">
                            <AddToCart
                                deal={this.props.deal}
                                purchaseStrategy={this.props.purchaseStrategy}
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
                    <Row className="deal__row">
                        <OurPromise />
                    </Row>
                </Container>
                <div className="bg-white pb-5 pt-5">
                    <Container>
                        <Row>
                            <Col md="6">
                                <Faq />
                            </Col>
                            <Col md="6">
                                <ContactForm deal={this.props.deal} />
                            </Col>
                        </Row>
                    </Container>
                </div>
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
    selectDmrDiscount,
    selectEmployeeDiscount,
    selectSupplierDiscount,
    selectConditionalRoles,
    updateDownPayment,
    updateTerm,
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
