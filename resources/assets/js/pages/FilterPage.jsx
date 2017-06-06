import React from 'react';
import R from 'ramda';
import api from 'src/api';
import qs from 'qs';
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
            <div className="modal">
                <div className="modal__close" onClick={this.closeModal}>X</div>
                <MakeSelector />
            </div>
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
