import React from 'react';

const RouteOne = () => {
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

    return (
        <div>
            <button onClick={ () => { window.location = '/financing/thankyou' }}>Nevermind, I want to pay cash</button>
            
            <br />

            <iframe src={ url }
                    id="routeOne"
                    frameBorder="0"
                    width="800"
                    height="1000" />
        </div>
    );
};

export default RouteOne;
