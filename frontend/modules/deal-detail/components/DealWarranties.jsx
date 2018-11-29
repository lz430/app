import React from 'react';

import Loading from '../../../components/Loading';
import ApiClient from '../../../store/api';
import PropTypes from 'prop-types';

export default class DealWarranties extends React.PureComponent {
    static propTypes = {
        id: PropTypes.number.isRequired,
    };

    state = {
        data: false,
    };

    componentDidMount() {
        ApiClient.deal.dealGetWarranties(this.props.id).then(response => {
            this.setState({
                data: response.data,
            });
        });
    }

    render() {
        return (
            <ul className="text-sm">
                {this.state.data ? (
                    this.state.data.map((dimension, index) => {
                        return (
                            <li key={index}>
                                {dimension.feature}: {dimension.content}
                            </li>
                        );
                    })
                ) : (
                    <Loading />
                )}
            </ul>
        );
    }
}