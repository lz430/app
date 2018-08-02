import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import api from 'src/api';

import { init } from './actions';
import mapAndBindActionCreators from 'util/mapAndBindActionCreators';
import { checkout } from 'apps/checkout/selectors';

class Container extends Component {
    static propTypes = {
        featuredPhoto: PropTypes.object.isRequired,
        purchase: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        init: PropTypes.func.isRequired,
    };

    state = {
        method: 'cash',
    };

    componentWillMount() {
        this.setState({
            url:
                `https://www.routeone.net/XRD/turnKeyOcaStart.do?rteOneDmsId=F00DMR` +
                `&dealerId=${this.props.purchase.deal.dealer.route_one_id}` +
                `&buyOrLease=${
                    this.props.purchase.type === 'finance' ? 1 : 2
                }` +
                `&email=${this.props.user.email}` +
                `&vehicleYear=${this.props.purchase.deal.year}` +
                `&vehicleMake=${this.props.purchase.deal.make}` +
                `&vehicleModel=${this.props.purchase.deal.model}` +
                `&contractTerms_vehiclestyle=${this.props.purchase.deal.body}` +
                `&vehicle_vin=${this.props.purchase.deal.vin}` +
                `&contractTerms_msrp=${this.props.purchase.deal.msrp}` +
                `&contractTerms_cash_down=${this.props.purchase.down_payment}` +
                `&contractTerms_financed_amount=${
                    this.props.purchase.amount_financed
                }` +
                `&contractTerms_term=${this.props.purchase.term}` +
                `&vehicle_image_url=${
                    this.props.featuredPhoto ? this.props.featuredPhoto.url : ''
                }` +
                `&dealership_name=${this.props.purchase.deal.dealer.name}`,
        });
    }

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
        return (
            <div className="financing">
                <div className="financing__constrained">
                    <div className="financing__header">
                        <div className="financing__title">Financing</div>
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
                                className="financing__button financing__button--blue"
                            >
                                No thanks, I'll get my own financing.
                            </button>
                        </form>
                    </div>
                    <div className="embed-responsive embed-responsive-4by3">
                        <iframe
                            frameBorder="0"
                            className="embed-responsive-item"
                            id="routeOne"
                            src={this.state.url}
                        />
                    </div>
                </div>
            </div>
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
)(Container);
