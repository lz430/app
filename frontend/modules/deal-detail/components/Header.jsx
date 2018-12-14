import React from 'react';
import { dealType } from '../../../core/types';

import { Row, Col, Button } from 'reactstrap';
import { faCalculator, faInfoCircle } from '@fortawesome/pro-light-svg-icons';
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
                    <Col sm="8">
                        <div className="deal-details__new-header title-year-make">
                            {this.props.deal.year} {this.props.deal.make}{' '}
                            {this.props.deal.model}
                        </div>
                        <div className="deal-details__new-header title-model-trim">
                            {this.props.deal.series}
                        </div>
                    </Col>
                    <Col
                        sm="4"
                        className="deal-details__new-header payment d-flex"
                    >
                        <div className="d-inline-block monthly">
                            <sup>$</sup>
                            <b>637</b>
                            <sub>/mo</sub>
                        </div>
                        <div className="configure d-inline-block">
                            <FontAwesomeIcon icon={faCalculator} />
                            Configure Payment
                        </div>
                    </Col>
                </Row>

                <Row className="deal-details__new-header new-header fixed hidden">
                    <Col sm="6">
                        <div className="deal-details__new-header title-year-make">
                            {strings.dealYearMake(this.props.deal)}
                        </div>
                        <div className="deal-details__new-header title-model-trim">
                            {strings.dealModelTrim(this.props.deal)}
                        </div>
                    </Col>
                    <Row>
                        <Col lg="auto" className="border-right">
                            <span className="dollar-sign">$</span>
                            <span className="payment">45,375</span>
                            <br />
                            <span className="tooltip">
                                <FontAwesomeIcon icon={faInfoCircle} />
                                DMR Price
                            </span>
                        </Col>
                        <Col
                            lg="auto"
                            sm="6"
                            className="deal-details__new-header payment"
                        >
                            <p>
                                <span className="monthly">
                                    $637
                                    <sup>/mo</sup>
                                </span>
                                <br />
                                <FontAwesomeIcon icon={faCalculator} />
                                Configure
                                <Button className="" color="primary">
                                    <b>Next: </b> Begin Purchase
                                </Button>
                            </p>
                        </Col>
                    </Row>
                </Row>
            </div>
        );
    }
}
