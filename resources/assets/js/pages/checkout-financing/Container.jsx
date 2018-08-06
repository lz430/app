import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Container, Row, Col } from 'reactstrap';

import api from 'src/api';

import { init } from './actions';
import mapAndBindActionCreators from 'util/mapAndBindActionCreators';
import { checkout } from 'apps/checkout/selectors';
import InvalidCheckoutPage from 'components/checkout/InvalidCheckoutPage';

class CheckoutFinancingContainer extends Component {
    static propTypes = {
        init: PropTypes.func.isRequired,
        checkout: PropTypes.object.isRequired,
        featuredPhoto: PropTypes.object.isRequired,
        purchase: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,

        url: PropTypes.string.isRequired,
    };

    state = {
        method: 'cash',
    };

    componentDidMount() {
        this.props.init();

        document.getElementById('routeOne').XrdNavigationUtils = {
            beforeUnloadIsDisabled: true,
        };

        window.setInterval(() => {
            api.getApplicationStatus(this.props.purchase.id).then(response => {
                if (response.data) {
                    this.setState({
                        method: 'finance',
                    });

                    document.purchase.submit();
                }
            });
        }, 2000);
    }

    render() {
        if (!this.props.checkout.deal.id) {
            return <InvalidCheckoutPage />;
        }

        return (
            <Container className="checkout-financing mb-4">
                <Row className="checkout-financing__header mt-4">
                    <Col>
                        <h1>Financing</h1>
                    </Col>
                    <Col className="d-flex justify-content-end align-content-end align-items-center">
                        <form name="purchase" method="post" action="/purchase">
                            <input
                                type="hidden"
                                name="_token"
                                value={window.Laravel.csrfToken}
                            />
                            <input
                                type="hidden"
                                name="purchase_id"
                                value={this.props.purchase.id}
                            />
                            <input
                                type="hidden"
                                name="method"
                                value={this.state.method}
                            />
                            <button
                                onClick={() => document.purchase.submit()}
                                className="btn btn-success"
                            >
                                No thanks, I'll get my own financing.
                            </button>
                        </form>
                    </Col>
                </Row>
                <div className="embed-responsive embed-responsive-4by3">
                    <iframe
                        frameBorder="0"
                        className="embed-responsive-item"
                        id="routeOne"
                        src={this.props.url}
                    />
                </div>
            </Container>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        checkout: checkout(state, props),
    };
};

const mapDispatchToProps = mapAndBindActionCreators({
    init,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutFinancingContainer);
