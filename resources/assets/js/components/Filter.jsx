import React from 'react';
import MakeSelector from './MakeSelector';
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
            .getDeals(this.state.selectedMakes, [this.state.selectedBodyStyle])
            .then(deals => {
                console.log(deals.data.data);
                // TODO: we should save the deals, and render them to the page
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
                />
            </div>
        );
    }

    render() {
        return this.state.makes && this.state.showModal
            ? this.renderModal()
            : <div>'Loading'</div>;
    }
}

export default Filter;
