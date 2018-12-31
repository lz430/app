import React from 'react';

import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import Link from 'next/link';

class AccountSummary extends React.Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
    };

    render() {
        return (
            <Row>
                <Col md={{ size: 6, offset: 3 }}>
                    <div className="bg-white border border-light shadow-sm rounded mb-3 ">
                        <h4 className="m-0 p-3">
                            {this.props.user.first_name}{' '}
                            {this.props.user.last_name}
                        </h4>
                        <div className="pl-3 pr-3 pb-3">
                            <div>{this.props.user.email}</div>
                            <div>{this.props.user.phone_number}</div>
                        </div>
                        <div className=" p-3 bg-light">
                            <Link
                                href="/auth/update-account"
                                as="/my-account/update"
                            >
                                <a className="btn btn-primary btn-sm">
                                    Update Account
                                </a>
                            </Link>
                        </div>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default AccountSummary;
