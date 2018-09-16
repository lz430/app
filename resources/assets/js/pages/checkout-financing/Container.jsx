import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Container, Row, Col } from 'reactstrap';

import api from 'src/api';

import { init } from './actions';
import getFinancing from './selectors';

import mapAndBindActionCreators from 'util/mapAndBindActionCreators';
import { checkout } from 'apps/checkout/selectors';
import InvalidCheckoutPage from 'components/checkout/InvalidCheckoutPage';
import PageContent from '../../components/App/PageContent';
import { getIsPageLoading } from '../../apps/page/selectors';
import Loading from '../../icons/miscicons/Loading';
import RouteOneIframe from './components/RouteOneIframe';

class CheckoutFinancingContainer extends Component {
    static propTypes = {
        init: PropTypes.func.isRequired,
        checkout: PropTypes.object.isRequired,
        financing: PropTypes.object.isRequired,
        isLoading: PropTypes.bool,
    };

    state = {
        method: 'cash',
    };

    componentDidMount() {
        this.props.init();
        /*
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
                */
    }

    renderRouteOneIFrame() {
        if (!this.props.financing.url) {
            return false;
        }

        return (
            <div className="embed-responsive embed-responsive-financing">
                <RouteOneIframe url={this.props.financing.url} />
            </div>
        );
    }

    renderPageLoadingIcon() {
        return <Loading />;
    }

    render() {
        if (!this.props.checkout.deal.id || !this.props.checkout.purchase.id) {
            return <InvalidCheckoutPage />;
        }

        if (this.props.isLoading) {
            return this.renderPageLoadingIcon();
        }

        const { purchase } = this.props.checkout;

        return (
            <PageContent>
                <Container className="checkout-financing mb-4">
                    <Row className="checkout-financing__header mt-4">
                        <Col>
                            <h1>Financing</h1>
                        </Col>
                        <Col className="d-flex justify-content-end align-content-end align-items-center">
                            <form
                                name="purchase"
                                method="post"
                                action="/purchase"
                            >
                                <input
                                    type="hidden"
                                    name="_token"
                                    value={window.Laravel.csrfToken}
                                />
                                <input
                                    type="hidden"
                                    name="purchase_id"
                                    value={purchase.id}
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
                    {this.renderRouteOneIFrame()}
                </Container>
            </PageContent>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        checkout: checkout(state, props),
        isLoading: getIsPageLoading(state),
        financing: getFinancing(state),
    };
};

const mapDispatchToProps = mapAndBindActionCreators({
    init,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutFinancingContainer);
