import React from 'react';
import R from 'ramda';
import api from 'src/api';
import qs from 'qs';
import MakeSelector from 'components/MakeSelector';
import Deals from 'components/Deals';
import Sortbar from 'components/Sortbar';
import FilterPanel from 'components/FilterPanel';

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
            dealPage: 0,
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
        this.loadMoreDeals = this.loadMoreDeals.bind(this);
    }

    componentDidMount() {
        api.getMakes().then(makes => {
            this.setState({
                makes: makes.data.data,
            });
        });
    }

    loadMoreDeals() {
        this.setState({
            dealPage: this.state.dealPage + 1,
        }, () => {
            this.getDeals(this.sortParam(this.state.sortColumn)).then(deals => {
                this.setState({
                    deals: R.concat(this.state.deals, deals.data.data),
                });
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
            () => {
                this.getDeals().then(deals => {
                    this.setState({
                        deals: deals.data.data,
                    });
                });
            }
        );
    }

    getDeals(sort = 'price', page = this.state.dealPage) {
        return api
            .getDeals(
                this.state.selectedMakes,
                [this.state.selectedBodyStyle],
                ['photos'],
                sort,
                page
            );
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
                this.getDeals(this.sortParam(column)).then(deals => {
                    this.setState({
                        deals: deals.data.data,
                        dealPage: 0,
                    });
                });
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
                              loadMoreDeals={this.loadMoreDeals}
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
