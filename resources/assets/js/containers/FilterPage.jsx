import React from 'react';
import R from 'ramda';
import Modal from 'components/Modal';
import MakeSelector from 'components/MakeSelector';
import PropTypes from 'prop-types';
import Deals from 'components/Deals/Deals';
import Sortbar from 'components/Sortbar';
import Filterbar from 'components/Filterbar';
import CompareBar from 'components/CompareBar';
import FilterPanel from 'components/FilterPanel';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import util from 'src/util';
import CashFinanceLeaseCalculator from '../components/CashFinanceLeaseCalculator';
import AccuPricingModal from 'components/AccuPricingModal';

class FilterPage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            accuPricingModalIsOpen: false,
        };
    }

    renderMakeSelectionModal() {
        return (
            <Modal
                onClose={this.props.closeMakeSelectorModal}
                title="Select brand preference"
                subtitle="Select one or more brands to compare"
                closeText="Show available vehicles"
                buttonCloseDisabled={this.props.selectedMakes.length == 0}
            >
                <MakeSelector />
            </Modal>
        );
    }

    renderCalculatorModal() {
        return (
            <Modal
                onClose={this.props.clearSelectedDeal}
                closeText="Back to results"
            >
                <CashFinanceLeaseCalculator />
            </Modal>
        );
    }

    renderFilterPanel() {
        const className =
            'filter-page__filter-panel ' +
            (util.windowIsLargerThanSmall(this.props.window.width)
                ? ''
                : 'filter-page__filter-panel--small ' +
                  (this.props.smallFiltersShown
                      ? 'filter-page__filter-panel--small-filters-shown'
                      : 'filter-page__filter-panel--small-filters-hidden'));

        return (
            <div className={className}>
                <FilterPanel />
            </div>
        );
    }

    renderAccuPricingCta() {
        return (
            <div>
                <AccuPricingModal isOpen={this.state.accuPricingModalIsOpen} onClose={() => this.setState({accuPricingModalIsOpen: false})} />
                <div className="accupricing-cta accupricing-cta--horizontal">
                    <a onClick={() => this.setState({accuPricingModalIsOpen: true})}>
                        <img src="/images/accupricing-logo.png" className="accupricing-cta__logo" />
                    </a>
                    <p className="accupricing-cta__disclaimer">
                        * Includes taxes, dealer fees and rebates.
                    </p>
                </div>
            </div>
        );
    }

    renderSelectedTabButtons() {
        return (
            <div className="button-group">
                <div
                    onClick={() => {
                        this.handleTabChange('cash');
                    }}
                    className={`button-group__button ${
                        this.props.selectedTab === 'cash'
                            ? 'button-group__button--selected'
                            : ''
                        }`}
                >
                    Cash
                </div>
                <div
                    onClick={() => {
                        this.handleTabChange('finance');
                    }}
                    className={`button-group__button ${
                        this.props.selectedTab === 'finance'
                            ? 'button-group__button--selected'
                            : ''
                        }`}
                >
                    Finance
                </div>
                <div
                    onClick={() => {
                        this.handleTabChange('lease');
                    }}
                    className={`button-group__button ${
                        this.props.selectedTab === 'lease'
                            ? 'button-group__button--selected'
                            : ''
                        }`}
                >
                    Lease
                </div>
            </div>
        )
    }

    renderDeals() {
        const className =
            'filter-page__deals ' +
            (util.windowIsLargerThanSmall(this.props.window.width)
                ? ''
                : 'filter-page__deals--small ' +
                  (this.props.smallFiltersShown
                      ? 'filter-page__deals--small-filters-shown'
                      : 'filter-page__deals--small-filters-hidden'));

        return (
            <div className={className}>
                <div className="filter-page__top-row">
                    <div className="filter-page__top-row__section filter-page__top-row__section--accuPricing">
                        {this.renderAccuPricingCta()}
                    </div>
                    {(this.props.deals && this.props.deals.length > 0) &&
                        <div className="filter-page__top-row__section filter-page__top-row__section--tabButtons">
                            {this.renderSelectedTabButtons()}
                        </div>
                    }
                    <div className="filter-page__top-row__section filter-page__top-row__section--sortbar">
                        <Sortbar />
                    </div>
                </div>
                <Filterbar />
                <Deals />
                <CompareBar />
            </div>
        );
    }

    renderFilterPanelAndDeals() {
        return (
            <div className="filter-page">
                {this.renderFilterPanel()}
                {this.renderDeals()}
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.props.showMakeSelectorModal ? (
                    this.renderMakeSelectionModal()
                ) : (
                    ''
                )}

                {this.props.selectedDeal ? this.renderCalculatorModal() : ''}

                {this.renderFilterPanelAndDeals()}
            </div>
        );
    }

    handleTabChange(tabName) {
        this.props.selectTab(tabName);
        this.props.getBestOffersForLoadedDeals();
    }
}

FilterPage.propTypes = {
    selectedMakes: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = state => {
    return {
        selectedMakes: state.selectedMakes,
        window: state.window,
        closeMakeSelectorModal: state.closeMakeSelectorModal,
        clearSelectedDeal: state.clearSelectedDeal,
        smallFiltersShown: state.smallFiltersShown,
        showMakeSelectorModal: state.showMakeSelectorModal,
        selectedDeal: state.selectedDeal,
        selectedTab: state.selectedTab,
        deals: state.deals,
    };
};

export default connect(mapStateToProps, Actions)(FilterPage);
