import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import PropTypes from 'prop-types';
import { dealType } from '../../core/types';

import { track } from '../../core/services';

import { Alert, Container, Breadcrumb, BreadcrumbItem } from 'reactstrap';
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
import {
    initPage,
    receiveDeal,
    dealDetailRequestDealQuote,
    selectDmrDiscount,
    selectEmployeeDiscount,
    selectSupplierDiscount,
    selectConditionalRoles,
    updateDownPayment,
    updateTerm,
    updateLease,
    tradeSetValue,
    tradeSetOwed,
    tradeSetEstimate,
} from './actions';

import { getConditionalRoles, getDeal, getDiscountType } from './selectors';
import DealDetail from './components/DealDetail';
import { pricingFromStateFactory } from '../../pricing/pricing/factory';
import withTracker from '../../components/withTracker';
import { nextRouterType } from '../../core/types';
import { withRouter } from 'next/router';
import BackToSearchResultsLink from '../../apps/page/components/BackToSearchResultsLink';
import { getSearchQuery } from '../deal-list/selectors';

class DealDetailContainer extends React.PureComponent {
    static propTypes = {
        deal: dealType,
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
        setCheckoutData: PropTypes.func.isRequired,
        checkoutStart: PropTypes.func.isRequired,
        toggleCompare: PropTypes.func.isRequired,
        router: nextRouterType,
        searchQuery: PropTypes.object.isRequired,
        pricing: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        selectDmrDiscount: PropTypes.func.isRequired,
        selectEmployeeDiscount: PropTypes.func.isRequired,
        selectSupplierDiscount: PropTypes.func.isRequired,
        selectConditionalRoles: PropTypes.func.isRequired,
        updateDownPayment: PropTypes.func.isRequired,
        updateTerm: PropTypes.func.isRequired,
        updateLease: PropTypes.func.isRequired,
        tradeSetValue: PropTypes.func.isRequired,
        tradeSetOwed: PropTypes.func.isRequired,
        tradeSetEstimate: PropTypes.func.isRequired,
    };

    componentDidMount() {
        this.props.initPage(this.props.router.query.id);
    }

    handlePaymentTypeChange = strategy => {
        this.props.setPurchaseStrategy(strategy);
        this.props.dealDetailRequestDealQuote(
            this.props.deal,
            this.props.userLocation.zipcode,
            strategy,
            this.props.discountType
        );

        // This is here because purchase strategy is a global thing
        track('deal-detail:quote-form:changed', {
            'Form Property': 'Purchase Strategy',
            'Form Value': strategy,
        });
    };

    handleDiscountChange = (discountType, make) => {
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

        this.props.dealDetailRequestDealQuote(
            this.props.deal,
            this.props.userLocation.zipcode,
            this.props.purchaseStrategy,
            discountType
        );
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

        this.props.dealDetailRequestDealQuote(
            this.props.deal,
            this.props.userLocation.zipcode,
            this.props.purchaseStrategy,
            this.props.discountType,
            selectedRoles
        );
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

    onSelectDeal(pricing) {
        return this.props.checkoutStart(pricing, this.props.router);
    }

    renderPageLoadingIcon() {
        return (
            <React.Fragment>
                {this.renderBreadcrumb()}
                <Container className="pt-5 pb-5">
                    <Loading />
                </Container>
            </React.Fragment>
        );
    }

    renderDealLoadingError() {
        return (
            <React.Fragment>
                {this.renderBreadcrumb()}
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

    renderBreadcrumb() {
        return (
            <Container>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BackToSearchResultsLink
                            searchQuery={this.props.searchQuery}
                        />
                    </BreadcrumbItem>
                    <BreadcrumbItem active>View Deal</BreadcrumbItem>
                </Breadcrumb>
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
                {this.renderBreadcrumb()}

                {!this.props.deal['is_in_range'] && this.renderDealOutOfRange()}

                <DealDetail
                    deal={this.props.deal}
                    pricing={this.props.pricing}
                    purchaseStrategy={this.props.purchaseStrategy}
                    handlePaymentTypeChange={this.handlePaymentTypeChange.bind(
                        this
                    )}
                    handleDiscountChange={this.handleDiscountChange.bind(this)}
                    handleRebatesChange={this.handleRebatesChange.bind(this)}
                    handleFinanceDownPaymentChange={this.handleFinanceDownPaymentChange.bind(
                        this
                    )}
                    handleFinanceTermChange={this.handleFinanceTermChange.bind(
                        this
                    )}
                    handleLeaseChange={this.handleLeaseChange.bind(this)}
                    tradeSetValue={this.props.tradeSetValue}
                    tradeSetOwed={this.props.tradeSetValue}
                    tradeSetEstimate={this.props.tradeSetEstimate}
                    setCheckoutData={this.props.setCheckoutData}
                    checkoutStart={this.onSelectDeal.bind(this)}
                    onToggleCompare={this.props.toggleCompare}
                    compareList={this.props.compareList}
                    userLocation={this.props.userLocation}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, props) => {
    const deal = getDeal(state);

    return {
        deal,
        searchQuery: getSearchQuery(state),
        selectedConditionalRoles: getConditionalRoles(state),
        purchaseStrategy: getUserPurchaseStrategy(state),
        compareList: state.common.compareList,
        discountType: getDiscountType(state),
        userLocation: getUserLocation(state),
        isLoading: getIsPageLoading(state),
        pricing: pricingFromStateFactory(state, { ...props, deal }),
    };
};

const mapDispatchToProps = mapAndBindActionCreators({
    toggleCompare,
    initPage,
    setPurchaseStrategy,
    receiveDeal,
    dealDetailRequestDealQuote,
    setCheckoutData,
    checkoutStart,
    selectDmrDiscount,
    selectEmployeeDiscount,
    selectSupplierDiscount,
    selectConditionalRoles,
    updateDownPayment,
    updateTerm,
    updateLease,
    tradeSetValue,
    tradeSetOwed,
    tradeSetEstimate,
});

export default compose(
    withRouter,
    withTracker,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(DealDetailContainer);
