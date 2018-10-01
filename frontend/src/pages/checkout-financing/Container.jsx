import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { Container, Row, Col } from 'reactstrap'

import { init } from './actions'
import getFinancing from './selectors'

import mapAndBindActionCreators from 'util/mapAndBindActionCreators'
import { checkout } from 'apps/checkout/selectors'
import { checkoutFinancingComplete } from 'apps/checkout/actions'
import InvalidCheckoutPage from 'components/checkout/InvalidCheckoutPage'
import PageContent from 'components/App/PageContent'
import { getIsPageLoading } from 'apps/page/selectors'
import Loading from 'icons/miscicons/Loading'
import RouteOneIframe from './components/RouteOneIframe'
import CompleteFinancingForm from './components/CompleteFinancingForm'
import { compose } from 'redux'
import withTracker from '../../components/withTracker'

class CheckoutFinancingContainer extends Component {
    static propTypes = {
        init: PropTypes.func.isRequired,
        checkout: PropTypes.object.isRequired,
        financing: PropTypes.object.isRequired,
        isLoading: PropTypes.bool,
        checkoutFinancingComplete: PropTypes.func.isRequired,
    }

    state = {
        method: 'cash',
    }

    componentDidMount() {
        this.props.init()
    }

    renderRouteOneIFrame() {
        if (!this.props.financing.url) {
            return false
        }

        return (
            <div className="embed-responsive embed-responsive-financing">
                <RouteOneIframe url={this.props.financing.url} />
            </div>
        )
    }

    renderPageLoadingIcon() {
        return <Loading />
    }

    render() {
        if (!this.props.checkout.deal.id || !this.props.checkout.purchase.id) {
            return <InvalidCheckoutPage />
        }

        if (this.props.isLoading) {
            return this.renderPageLoadingIcon()
        }

        return (
            <PageContent>
                <Container className="checkout-financing mb-4">
                    <Row className="checkout-financing__header mt-4">
                        <Col>
                            <h1>Financing</h1>
                        </Col>
                        <Col className="d-flex justify-content-end align-content-end align-items-center">
                            <CompleteFinancingForm
                                checkout={this.props.checkout}
                                onFinancingComplete={
                                    this.props.checkoutFinancingComplete
                                }
                            />
                        </Col>
                    </Row>
                    {this.renderRouteOneIFrame()}
                </Container>
            </PageContent>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        checkout: checkout(state, props),
        isLoading: getIsPageLoading(state),
        financing: getFinancing(state),
    }
}

const mapDispatchToProps = mapAndBindActionCreators({
    init,
    checkoutFinancingComplete,
})

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withTracker
)(CheckoutFinancingContainer)
