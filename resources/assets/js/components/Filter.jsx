import React from 'react';
import MakeSelector from './MakeSelector';
import R from 'ramda';
import api from '../src/api';

class Filter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
        this.setState({
            showModal: false,
        })


    }

    renderModal() {
        return <div className="filter modal">
            <div className="modal__close" onClick={this.closeModal}>X</div>
            <MakeSelector
                makes={this.state.makes}
                onSelectMake={this.onSelectMake}
                selectedMakes={this.state.selectedMakes}
            />
        </div>;
    }

    render() {
        return this.state.makes && this.state.showModal
            ? this.renderModal()
            : <div>'Loading'</div>;
    }
}

export default Filter;
