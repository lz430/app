import React from 'react';
import R from 'ramda';
import Modal from 'components/Modal';
import MakeSelector from 'components/MakeSelector';
import Deals from 'components/Deals';
import DealDetails from 'components/DealDetails';
import Sortbar from 'components/Sortbar';
import Filterbar from 'components/Filterbar';
import Comparebar from 'components/Comparebar'
import FilterPanel from 'components/FilterPanel';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';

class FilterPage extends React.Component {
    renderMakeSelectionModal() {
        return (
            <Modal
                onClose={this.props.closeMakeSelectorModal}
                title="Select brand preference"
                subtitle="Please select one or more brands that you are considering"
                closeText="Show available vehicles"
            >
                {() => <MakeSelector />}
            </Modal>
        );
    }

    renderSelectedDealModal() {
        return (
            <Modal
                onClose={this.props.clearSelectedDeal}
                title={this.props.selectedDeal.model}
                subtitle={
                    this.props.selectedDeal.year +
                        ' ' +
                        this.props.selectedDeal.make
                }
            >
                {() => <DealDetails />}
            </Modal>
        );
    }

    renderDeals() {
        return (
            <div className="filter-page">
                <div className="filter-page__filter-panel">
                    <FilterPanel />
                </div>
                <div className="filter-page__deals">
                    <Sortbar />
                    <Filterbar />
                    {this.props.deals.length ? <Deals /> : <p>No Results</p>}
                    {this.props.compareList.length ? <Comparebar /> : ''}
                </div>

            </div>
        );
    }

    render() {
        return (
            <div>
                {this.props.showMakeSelectorModal
                    ? this.renderMakeSelectionModal()
                    : ''}

                {this.props.deals ? this.renderDeals() : ''}

                {this.props.selectedDeal ? this.renderSelectedDealModal() : ''}
            </div>
        );
    }
}

export default connect(R.identity, Actions)(FilterPage);
