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
        };
        this.onSelectMake = this.onSelectMake.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.sortAsc = this.sortAsc.bind(this);
        this.sortDesc = this.sortDesc.bind(this);
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
            .getDeals(this.state.selectedMakes, [this.state.selectedBodyStyle], ['photos'])
            .then(deals => {
                this.setState({
                    deals: deals.data.data,
                });
            });
    }

    sortAsc() {
        this.setState({
            deals: R.sortWith([R.ascend(R.prop('msrp'))])(this.state.deals)
        });
    }

    sortDesc() {
        this.setState({
            deals: R.sortWith([R.descend(R.prop('msrp'))])(this.state.deals)
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

    renderDeals() {
        return (
            <div className="filter">
                <div className="filter__options">
                    <button onClick={this.sortAsc}>MSRP low to high</button>
                    <button onClick={this.sortDesc}>MSRP high to low</button>
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
