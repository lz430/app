import React from 'react';
import { dealType } from '../../../core/types';

import { Row, Col } from 'reactstrap';
import { faCalculator } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import strings from '../../../util/strings';
import DealStockNumber from '../../../components/Deals/DealStockNumber';

export default class Header extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    render() {
        console.log(this.props.deal);
        return (
            <div>
                <Row className="deal-details__new-header stationary">
                    <Col sm="6">
                        <div className="deal-details__title-year-make">
                            {strings.dealYearMake(this.props.deal)}
                        </div>
                        <div className="deal-details__title-model-trim">
                            {strings.dealModelTrim(this.props.deal)}
                        </div>
                    </Col>
                    <Col sm="6" className="deal-details__payment">
                        <p>
                            <span className="monthly">$637/mo</span>
                            <FontAwesomeIcon icon={faCalculator} />
                            Configure Payment
                        </p>
                    </Col>
                </Row>

                <Row className="deal-details__new-header fixed">
                    <Col sm="6">
                        <div className="deal-details__title-year-make">
                            {strings.dealYearMake(this.props.deal)}
                        </div>
                        <div className="deal-details__title-model-trim">
                            {strings.dealModelTrim(this.props.deal)}
                        </div>
                    </Col>
                    <Row>
                        <Col lg="4" className="border-right">
                            <span className="dollar-sign">$</span>
                            <span className="payment">45,375</span>
                        </Col>
                        <Col lg="auto" sm="6" className="deal-details__payment">
                            <p>
                                <span className="monthly">$637/mo</span>
                                <FontAwesomeIcon icon={faCalculator} />
                                Configure Payment
                            </p>
                        </Col>
                    </Row>
                </Row>
            </div>
        );
    }
}
