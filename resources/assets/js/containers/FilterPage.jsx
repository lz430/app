import React from 'react';
import R from 'ramda';
import Modal from 'components/Modal';
import MakeSelector from 'components/MakeSelector';
import Deals from 'components/Deals';
import DealDetails from 'components/DealDetails';
import Sortbar from 'components/Sortbar';
import Filterbar from 'components/Filterbar';
import FilterPanel from 'components/FilterPanel';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';

class FilterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: true,
        };

        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        axios
            .get('http://ipinfo.io')
            .then(data => {
                this.props.setZipCode(data.data.postal);
            })
            .catch(error => {
                console.log('Error', error.message);
            });
    }

    closeModal() {
        if (this.props.selectedMakes.length > 0) {
            this.setState({ showModal: false }, () =>
                this.props.requestDeals()
            );
        }
    }

    renderMakeSelectionModal() {
        return (
            <Modal
                onClose={this.closeModal}
                title="Select brand preference"
                subtitle="Please select one or more brands that you are considering"
                closeText="Show available options"
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
                closeText="Back to results"
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
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.props.makes && this.state.showModal
                    ? this.renderMakeSelectionModal()
                    : ''}

                {this.props.deals ? this.renderDeals() : ''}

                {this.props.selectedDeal ? this.renderSelectedDealModal() : ''}
            </div>
        );

        // return <div>'Loading'</div>;
    }
}

export default connect(R.identity, Actions)(FilterPage);
