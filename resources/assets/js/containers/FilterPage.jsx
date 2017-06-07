import React from 'react';
import R from 'ramda';
import Modal from 'components/Modal';
import MakeSelector from 'components/MakeSelector';
import Deals from 'components/Deals';
import Sortbar from 'components/Sortbar';
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

    closeModal() {
        if (this.props.selectedMakes.length > 0) {
            this.setState({ showModal: false }, () =>
                this.props.requestDeals()
            );
        }
    }

    renderModal() {
        return (
            <Modal
                onClose={this.closeModal}
                title='Select brand preference'
                subtitle='Please select one or more brands that you are considering'
                closeText='Show available options'
            >
                {() => <MakeSelector/>}
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
                    {this.props.deals.length ? <Deals /> : <p>No Results</p>}
                </div>
            </div>
        );
    }

    render() {
        if (this.props.makes && this.state.showModal) {
            return this.renderModal();
        }

        if (this.props.deals) {
            return this.renderDeals();
        }

        return <div>'Loading'</div>;
    }
}

export default connect(R.identity, Actions)(FilterPage);
