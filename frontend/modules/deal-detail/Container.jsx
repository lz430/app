import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dealType } from '../../core/types';

import { compose } from 'redux';
import Link from 'next/link';

import { track } from '../../core/services';

import { Alert, Container, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import mapAndBindActionCreators from '../../util/mapAndBindActionCreators';
import Loading from '../../icons/miscicons/Loading';
import { toggleCompare } from '../../apps/common/actions';
import { getIsPageLoading } from '../../apps/page/selectors';
import { setPurchaseStrategy } from '../../apps/user/actions';
import {
    getUserLocation,
    getUserPurchaseStrategy,
} from '../../apps/user/selectors';
import { setCheckoutData, checkoutStart } from '../../apps/checkout/actions';
import * as selectDiscountActions from './modules/selectDiscount';
import * as financeActions from './modules/finance';
import * as leaseActions from './modules/lease';
import { initPage, receiveDeal, dealDetailRequestDealQuote } from './actions';
import { getDeal, getLeaseAnnualMileage, getLeaseTerm } from './selectors';
import DealDetail from './components/DealDetail';
import { pricingFromStateFactory } from '../../pricing/pricing/factory';
import withTracker from '../../components/withTracker';
import { nextRouterType } from '../../core/types';
import { withRouter } from 'next/router';

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
        pricing: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        selectDiscountActions: PropTypes.shape({
            selectDmrDiscount: PropTypes.func.isRequired,
            selectEmployeeDiscount: PropTypes.func.isRequired,
            selectSupplierDiscount: PropTypes.func.isRequired,
            selectConditionalRoles: PropTypes.func.isRequired,
        }),
        financeActions: PropTypes.shape({
            updateDownPayment: PropTypes.func.isRequired,
            updateTerm: PropTypes.func.isRequired,
        }),
        leaseActions: PropTypes.shape({
            update: PropTypes.func.isRequired,
        }),
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
                this.props.selectDiscountActions.selectDmrDiscount();
                break;

            case 'employee':
                this.props.selectDiscountActions.selectEmployeeDiscount(make);
                break;

            case 'supplier':
                this.props.selectDiscountActions.selectSupplierDiscount(make);
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

        this.props.selectDiscountActions.selectConditionalRoles(selectedRoles);

        this.props.dealDetailRequestDealQuote(
            this.props.deal,
            this.props.userLocation.zipcode,
            this.props.purchaseStrategy,
            this.props.discountType,
            selectedRoles
        );
    };

    handleFinanceDownPaymentChange = downPayment => {
        this.props.financeActions.updateDownPayment(downPayment);
    };

    handleFinanceTermChange = term => {
        this.props.financeActions.updateTerm(term);
    };

    handleLeaseChange = (annualMileage, term, cashDue) => {
        this.props.leaseActions.update(annualMileage, term, cashDue);
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
                        <Link href="/deal-list" as="/filter">
                            <a>Search Results</a>
                        </Link>
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
                    purchaseStrategy={this.props.purchaseStrategy}
                    pricing={this.props.pricing}
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
        selectedConditionalRoles:
            state.pages.dealDetails.selectDiscount.conditionalRoles,
        purchaseStrategy: getUserPurchaseStrategy(state),
        compareList: state.common.compareList,
        financeDownPayment: state.pages.dealDetails.finance.downPayment,
        financeTerm: state.pages.dealDetails.finance.term,
        leaseAnnualMileage: getLeaseAnnualMileage(state),
        leaseTerm: getLeaseTerm(state),
        fallbackDealImage: state.common.fallbackDealImage,
        discountType: state.pages.dealDetails.selectDiscount.discountType,
        window: state.common.window,
        userLocation: getUserLocation(state),
        isLoading: getIsPageLoading(state),
        pricing: pricingFromStateFactory(state, { ...props, deal }),
    };
};

const mapDispatchToProps = mapAndBindActionCreators({
    financeActions,
    leaseActions,
    selectDiscountActions,
    toggleCompare,
    initPage,
    setPurchaseStrategy,
    receiveDeal,
    dealDetailRequestDealQuote,
    setCheckoutData,
    checkoutStart,
});

export default compose(
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withTracker
)(DealDetailContainer);
