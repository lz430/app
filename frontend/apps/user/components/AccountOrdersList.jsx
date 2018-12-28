import React from 'react';

import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

class AccountOrdersList extends React.Component {
    static propTypes = {
        user: PropTypes.func.isRequired,
    };

    render() {
        return (
            <Row>
                <Col md={{ size: 6, offset: 3 }}>
                    <div className="bg-white border border-light shadow-sm rounded mb-3">
                        <h5 className="m-0 p-3">My Purchases</h5>
                        <div className="pl-3 pr-3 pb-3">
                            <div>{this.props.user.email}</div>
                        </div>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default AccountOrdersList;
