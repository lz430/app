import React from 'react';
import PropTypes from 'prop-types';
import ApiClient from '../../../store/api';
import Loading from '../../../components/Loading';

export default class Header extends React.PureComponent {
    static propTypes = {
        id: PropTypes.number.isRequired,
    };

    state = {
        data: [],
    };

    componentDidMount() {
        ApiClient.deal.dealGetDimensions(this.props.id).then(response => {
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
