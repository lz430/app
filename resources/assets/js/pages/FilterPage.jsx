import React from 'react';
import MakeSelector from '../components/MakeSelector';
import Deals from '../components/Deals';
import Sortbar from '../components/Sortbar';
import FilterPanel from '../components/FilterPanel';
import R from 'ramda';
import api from '../src/api';
import qs from 'qs';

class FilterPage extends React.Component {
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
            sortColumn: 'price',
        };
        this.onSelectMake = this.onSelectMake.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.toggleSort = this.toggleSort.bind(this);
        this.sortParam = this.sortParam.bind(this);
        this.renderDeals = this.renderDeals.bind(this);
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
            .getDeals(
                this.state.selectedMakes,
                [this.state.selectedBodyStyle],
                ['photos'],
                sort
            )
            .then(deals => {
                this.setState({
                    deals: deals.data.data,
                });
            });
    }

    sortParam(column) {
        return this.state.sortStatus === 'desc' ? '-' + column : column;
    }

    toggleSort(column) {
        this.setState(
            {
                sortColumn: column,
                sortStatus: this.state.sortStatus === 'asc' ? 'desc' : 'asc',
            },
            () => {
                this.getDeals(this.sortParam(column));
            }
        );
    }

    renderModal() {
        return (
            <div className="modal">
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

    renderDeals() {
        return (
            <div className="filter-page">
                <div className="filter-page__filter-panel">
                    <FilterPanel />
                </div>
                <div className="filter-page__deals">
                    <Sortbar
                        results_count={this.state.deals.length}
                        onPriceClick={this.toggleSort.bind(this, 'price')}
                        onYearClick={this.toggleSort.bind(this, 'year')}
                        onAtoZClick={this.toggleSort.bind(this, 'make')}
                        sortColumn={this.state.sortColumn}
                        sortStatus={this.state.sortStatus}
                    />
                    {this.state.deals.length
                        ? <Deals
                              deals={this.state.deals}
                              fallbackDealImage={this.state.fallbackDealImage}
                          />
                        : <p>No Results</p>}
                </div>
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

export default FilterPage;
