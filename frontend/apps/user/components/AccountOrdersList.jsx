import React from 'react';

import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

import ApiClient from '../../../store/api';
import LoadingIcon from '../../../components/Loading';
import Link from 'next/link';
class AccountOrdersList extends React.Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
    };

    state = {
        orders: null,
    };

    componentDidMount() {
        ApiClient.checkout.orderList().then(response => {
            this.setState({ orders: response.data.data });
        });
    }

    renderLoading() {
        return <LoadingIcon size={2} />;
    }

    renderEmpty() {
        return <div>You have not created any purchases.</div>;
    }

    renderTable() {
        return (
            <table className="table rounded table-striped table-sm">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Deal</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.orders.map((order, index) => {
                        return (
                            <tr key={`order-${index}`}>
                                <td>{order.created_at}</td>
                                <td>{order.strategy}</td>
                                <td>{order.status}</td>
                                <td>
                                    <Link
                                        href={`/deal-detail?id=${
                                            order.deal_id
                                        }`}
                                        as={`/deals/${order.deal_id}`}
                                    >
                                        <a>{order['deal_title']}</a>
                                    </Link>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    }

    render() {
        let content;

        if (this.state.orders === null) {
            content = this.renderLoading();
        } else if (this.state.orders.length === 0) {
            content = this.renderEmpty();
        } else {
            content = this.renderTable();
        }

        return (
            <Row>
                <Col md={{ size: 6, offset: 3 }}>
                    <div className="bg-white border border-light shadow-sm rounded mb-3">
                        <h5 className="m-0 p-3">My Purchases</h5>
                        <div className="pl-3 pr-3 pb-3">{content}</div>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default AccountOrdersList;
