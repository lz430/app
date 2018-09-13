import React from 'react';
import { Card, CardBody } from 'reactstrap';
import Phone from 'icons/zondicons/Phone';

class CardCta extends React.PureComponent {
    render() {
        return (
            <Card className="inventory-summary cta-card">
                <CardBody>
                    <div className="cta-card__icon">
                        <Phone />
                    </div>
                    <div>
                        Can't find what you're looking for? Questions about
                        trade in?
                    </div>
                    <div className="mt-4">
                        Contact Us: <br />
                        <a href="tel:855-675-7301">(855) 675-7301</a>
                    </div>
                </CardBody>
            </Card>
        );
    }
}

export default CardCta;
