import React from 'react';
import { dealType } from '../../../core/types';

import { Row, Col, Button } from 'reactstrap';
import { faCalculator, faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { StickyContainer, Sticky } from 'react-sticky';

import strings from '../../../util/strings';
import DealStockNumber from '../../../components/Deals/DealStockNumber';

export default class Header extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    render() {
        console.log(this.props);
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

                <StickyContainer className="deal-details__new-header fixed">
                    <Sticky topOffset={-62}>
                        {({
                            style,
                            isSticky,
                            wasSticky,
                            distanceFromTop,
                            distanceFromBottom,
                            calculatedHeight,
                        }) => (
                            <div
                                style={{
                                    ...style,
                                    marginTop: isSticky ? '62px' : '0px',
                                }}
                            >
                                <Row>
                                    <Col sm="6">
                                        <div className="deal-details__new-header title-year-make">
                                            {this.props.deal.year}{' '}
                                            {this.props.deal.make}{' '}
                                            {this.props.deal.model}
                                        </div>
                                        <div className="deal-details__new-header title-model-trim">
                                            {this.props.deal.series}
                                        </div>
                                    </Col>
                                    <Col lg="auto" className="border-right">
                                        <span className="dollar-sign">$</span>
                                        <span className="payment">45,375</span>
                                        <br />
                                        <span className="tooltip">
                                            <FontAwesomeIcon
                                                icon={faInfoCircle}
                                            />
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
                                            <FontAwesomeIcon
                                                icon={faCalculator}
                                            />
                                            Configure
                                            <Button
                                                className=""
                                                color="primary"
                                            >
                                                <b>Next: </b> Begin Purchase
                                            </Button>
                                        </p>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Sticky>
                </StickyContainer>
            </div>
        );
    }
}
