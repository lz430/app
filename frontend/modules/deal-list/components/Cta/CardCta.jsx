import React from 'react';
import { Card, CardBody } from 'reactstrap';

import { faPhone } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CardCta extends React.PureComponent {
    render() {
        return (
            <Card className="inventory-summary cta-card">
                <CardBody>
                    <div className="cta-card__icon">
                        <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div>
                        Can&#39;t find what you&#39;re looking for? Questions
                        about trade in?
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
