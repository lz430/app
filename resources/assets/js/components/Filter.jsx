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
            fallbackLogoImage: '/images/dmr-logo.svg',
            fallbackDealImage: '/images/dmr-logo.svg',
            sortStatus: 'asc',
            sorted: 'price'
        };
        this.onSelectMake = this.onSelectMake.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
        this.sortParam = this.sortParam.bind(this);
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

    getDeals(sort = 'price') {
        api
            .getDeals(this.state.selectedMakes, [this.state.selectedBodyStyle], ['photos'], sort)
            .then(deals => {
                this.setState({
                    deals: deals.data.data,
                });
            });
    }

    sortParam(column) {
        return this.state.sortStatus === 'desc' ? "-" + column : column;
    }

    toggleSort(column) {
        this.setState({
            sorted: column,
            sortStatus: this.state.sortStatus === 'asc' ? 'desc' : 'asc'
        }, () => {
            this.getDeals(this.sortParam(column))
        });
    }

    renderModal() {
        return (
            <div className="filter modal">
                <div className="modal__close" onClick={this.closeModal}>X</div>
                <MakeSelector
                    makes={this.state.makes}
                    onSelectMake={this.onSelectMake}
                    selectedMakes={this.state.selectedMakes}
                    fallbackLogoImage={this.state.fallbackLogoImage}
                />
            </div>
        );
    }

    renderSortIcon(column) {
        return this.state.sorted === column
            ? <img className="button__icon" src={this.state.sortStatus === 'desc'
                ? "/images/zondicons/cheveron-up.svg"
                : "/images/zondicons/cheveron-down.svg"} />
            : '';
    }

    renderDeals() {
        return (
            <div className="filter">
                <div className="filter__options">
                    <button className="button" onClick={this.toggleSort.bind(this, 'price')}>{this.renderSortIcon('price')}Price</button>
                    <button className="button" onClick={this.toggleSort.bind(this, 'year')}>{this.renderSortIcon('year')}Year</button>
                    <button className="button" onClick={this.toggleSort.bind(this, 'make')}>{this.renderSortIcon('make')}A-Z</button>

                </div>
                {this.state.deals.length
                ? <Deals
                        deals={this.state.deals}
                        fallbackDealImage={this.state.fallbackDealImage}
                  />
                : <p>No Results</p>}

            </div>
        );
    }

    render() {
        if (this.state.makes && this.state.showModal) {
            return this.renderModal();
        }

        if (this.state.deals) {
            return this.renderDeals();
        }

        return <div>'Loading'</div>;
    }
}

export default Filter;
