import React, { Component } from 'react';

const deal = DeliverMyRide.deal;

const url  = 'https://itl.routeone.net/XRD/turnKeyOcaStart.do?rteOneDmsId=F00PRZ&dealerId=AX0PG'
    + `&buyOrLease=1`
    + `&vehicleYear=${ deal.year }`
    + `&vehicleMake=${ deal.make }`
    + `&vehicleModel=${ deal.model }`
    + `&contractTerms_vehiclestyle=${ deal.body }`
    + `&vehicle_vin=${ deal.vin }`
    + `&contractTerms_msrp=${ deal.msrp }`
    + `&vehicle_image_url=${ deal.photos ? deal.photos[0].url : ''}`
    + `&dealership_name=${ deal.dealer_name }`;

class Financing extends Component {
    render() {
        return (
            <div className="financing">
                <div>
                    <button onClick={ () => { window.location = '/financing/thankyou' }}>Nevermind, I want to pay cash</button>

                    <br />

                    <iframe src={ url }
                            id="routeOne"
                            frameBorder="0"
                            width="800"
                            height="1000" />
                </div>
            </div>
        );
    }
}

export default Financing;
