import React, { Component } from 'react';
import api from 'src/api';

class Financing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            url:
                'https://itl.routeone.net/XRD/turnKeyOcaStart.do?rteOneDmsId=F00DMR' +
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
                `&contractTerms_financed_amount=${
                    props.purchase.amount_financed
                }` +
                `&contractTerms_term=${props.purchase.term}` +
                `&vehicle_image_url=${
                    props.featuredPhoto ? props.featuredPhoto.url : ''
                }` +
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
                    window.location = '/thank-you?method=financing';
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
                        <button
                            onClick={() =>
                                (window.location = '/thank-you?method=cash')
                            }
                            className="financing__button financing__button--blue"
                        >
                            No thanks, I'll get my own financing.
                        </button>
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
