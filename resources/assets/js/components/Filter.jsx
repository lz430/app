import React from 'react';
import MakeSelector from './MakeSelector';
import Deals from './Deals';
import R from 'ramda';
import api from '../src/api';
import qs from 'qs';

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBodyStyle: R.prop(
                'style',
                qs.parse(window.location.search.slice(1))
            ),
            selectedMakes: [],
            makes: null,
            showModal: true,
            deals: null,
        };
        this.onSelectMake = this.onSelectMake.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentDidMount() {
        api.getMakes().then(makes => {
            this.setState({
                makes: makes.data.data,
            });
        });
    }

    onSelectMake(id) {
        this.setState({
            selectedMakes: R.contains(id, this.state.selectedMakes)
                ? R.reject(R.equals(id), this.state.selectedMakes)
                : R.append(id, this.state.selectedMakes),
        });
    }

    closeModal() {
        this.setState(
            {
                showModal: false,
            },
            this.getDeals
        );
    }

    getDeals() {
        api
            .getDeals(this.state.selectedMakes, [this.state.selectedBodyStyle], 'photos')
            .then(deals => {
                this.setState({
                    deals: deals.data,
                });
            });
    }

    priceDesc(a, b) {
        return a.msrp > b.msrp;
    }

    renderModal() {
        return (
            <div className="filter modal">
                <div className="modal__close" onClick={this.closeModal}>X</div>
                <MakeSelector
                    makes={this.state.makes}
                    onSelectMake={this.onSelectMake}
                    selectedMakes={this.state.selectedMakes}
                />
            </div>
        );
    }

    renderDeals() {
        return (
            this.state.deals
                ? <div><Deals deals={this.state.deals}></Deals></div>
                : <div><p>No Results</p></div>
        );
    }

    render() {
        if(this.state.makes && this.state.showModal) {
            return this.renderModal();
        }

        if(this.state.deals.data.length > 0) {
            return this.renderDeals();
        }

        return <div>'Loading'</div>;
    }
}

export default Filter;
