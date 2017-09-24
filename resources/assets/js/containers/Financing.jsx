import React, { Component } from 'react';
import api from 'src/api';

class Financing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url: 'https://itl.routeone.net/XRD/turnKeyOcaStart.do?rteOneDmsId=F00DMR' +
                `&dealerId=${props.purchase.deal.dealer.route_one_id}` +
                `&buyOrLease=${props.purchase.type === 'finance' ? 1 : 2}` +
                `&email=${props.user.email}` +
                `&vehicleYear=${props.purchase.deal.year}` +
                `&vehicleMake=${props.purchase.deal.make}` +
                `&vehicleModel=${props.purchase.deal.model}` +
                `&contractTerms_vehiclestyle=${props.purchase.deal.body}` +
                `&vehicle_vin=${props.purchase.deal.vin}` +
                `&contractTerms_msrp=${props.purchase.deal.msrp}` +
                `&contractTerms_cash_down=${props.purchase.down_payment}` +
                `&contractTerms_financed_amount=${props.purchase.amount_financed}` +
                `&contractTerms_term=${props.purchase.term}` +
                `&vehicle_image_url=${props.featuredPhoto
                    ? props.featuredPhoto.url
                    : ''}` +
                `&dealership_name=${props.purchase.deal.dealer.name}`,
        };
    }

    componentDidMount() {
        document.getElementById('routeOne').XrdNavigationUtils = {
            beforeUnloadIsDisabled: true,
        };
        window.setInterval(() => {
            api.getApplicationStatus(this.props.purchase.id).then(response => {
                if (response.data) {
                    window.location = '/thank-you';
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

                        <form name="purchase" method="post" action="purchase">
                            <input
                                type="hidden"
                                name="_token"
                                value={window.Laravel.csrfToken}
                            />
                            <input
                                type="hidden"
                                name="purchase_id"
                                value={DeliverMyRide.purchase.id}
                            />
                            <input type="hidden" name="method" value="cash" />
                            <a
                                onClick={() => document.purchase.submit()}
                                className="financing__cash"
                            >
                                No thanks, I'll pay cash
                            </a>
                        </form>
                    </div>

                    <iframe
                        frameBorder="0"
                        height="1000"
                        id="routeOne"
                        src={this.state.url}
                        width="800"
                    />
                </div>
            </div>
        );
    }
}

export default Financing;
