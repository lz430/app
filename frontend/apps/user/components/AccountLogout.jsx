import React from 'react';

import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';

class AccountLogout extends React.Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        logoutUser: PropTypes.func.isRequired,
    };

    state = {
        loggingOut: false,
    };

    handleLogout() {
        this.setState({ loggingOut: true });
        this.props.logoutUser();
    }

    render() {
        return (
            <Row>
                <Col md={{ size: 6, offset: 3 }}>
                    <div className="mt-2 text-center">
                        {this.state.loggingOut && <span>Logging out...</span>}
                        {!this.state.loggingOut && (
                            <a
                                className="cursor-pointer"
                                onClick={() => this.handleLogout()}
                            >
                                Logout
                            </a>
                        )}
                    </div>
                </Col>
            </Row>
        );
    }
}

export default AccountLogout;
