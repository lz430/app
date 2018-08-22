import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dealType } from 'types';
import { track } from 'services';

import { Alert, Container, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import mapAndBindActionCreators from 'util/mapAndBindActionCreators';
import Loading from 'icons/miscicons/Loading';
import { toggleCompare } from 'apps/common/actions';
import { getIsPageLoading } from 'apps/page/selectors';
import { setPurchaseStrategy } from 'apps/user/actions';
import { getUserLocation, getUserPurchaseStrategy } from 'apps/user/selectors';
import { setCheckoutData, checkoutStart } from 'apps/checkout/actions';
import * as selectDiscountActions from './modules/selectDiscount';
import * as financeActions from './modules/finance';
import * as leaseActions from './modules/lease';
import { initPage, receiveDeal, dealDetailRequestDealQuote } from './actions';
import { getDeal, getLeaseAnnualMileage, getLeaseTerm } from './selectors';
import DealDetail from './components/DealDetail';
import { pricingFromStateFactory } from '../../src/pricing/factory';

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
    };

    componentDidMount() {
        this.props.initPage();
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

    renderPageLoadingIcon() {
        return <Loading />;
    }

    render() {
        if (this.props.isLoading) {
            return this.renderPageLoadingIcon();
        }

        if (!this.props.deal) {
            return (
                <Container>
                    <Alert color="danger">Unable to load deal.</Alert>
                </Container>
            );
        }

        return (
            <div>
                <Container>
                    <Breadcrumb>
                        <BreadcrumbItem>
                            <a href="/filter">Search Results</a>
                        </BreadcrumbItem>
                        <BreadcrumbItem active>View Deal</BreadcrumbItem>
                    </Breadcrumb>
                </Container>
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
                    checkoutStart={this.props.checkoutStart}
                    onToggleCompare={this.props.toggleCompare}
                    compareList={this.props.compareList}
                />
            </div>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DealDetailContainer);
