import React from 'react';
import { dealType } from '../../../core/types';

import { Row, Col, Button } from 'reactstrap';
import { faCalculator, faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Sticky } from 'react-sticky';

export default class Header extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    render() {
        return (
            <div>
                {/*<Row className="deal-details__new-header stationary">
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
                </Row>*/}

                <Sticky topOffset={-62}>
                    {({ style, isSticky }) => (
                        <div
                            className="deal-details__new-header fixed"
                            style={{
                                ...style,
                                marginTop: isSticky ? '64px' : '0px',
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
                                <Col lg="auto" className="payment">
                                    <p className="m-0">As low as</p>
                                    <span className="dmr-price border-right">
                                        <sub>$</sub>
                                        45,375
                                    </span>
                                </Col>
                                <Col
                                    lg="auto"
                                    sm="6"
                                    className="deal-details__new-header payment"
                                >
                                    <p className="m-0">Lease from</p>
                                    <p>
                                        <span className="payment__monthly">
                                            <sub>$</sub>
                                            637
                                            <sup>/mo</sup>
                                        </span>
                                    </p>
                                </Col>
                                <Col
                                    lg="auto"
                                    className="d-flex ml-auto align-items-center"
                                >
                                    <Button className="" color="primary">
                                        <b>Next: </b> Begin Purchase
                                    </Button>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Sticky>
            </div>
        );
    }
}
