import React from 'react';
import { Row, Col, Button } from 'reactstrap';
import { MediumAndUp, SmallAndDown } from '../../../components/Responsive';

export default class extends React.PureComponent {
    render() {
        return (
            <div className="deal__promise">
                <Col xs="12">
                    <h2 className="text-center"> We Promise </h2>
                </Col>
                <Row className="deal__promise__columns no-gutters">
                    <Col md="4">
                        <MediumAndUp>
                            <Row className="no-gutters">
                                <Col md="1" sm="1" xs="1">
                                    <img
                                        src="../../static/images/icons/promise-shield.png"
                                        alt="Our promise shield"
                                    />
                                </Col>
                                <Col md="10">
                                    <h5 className="text-uppercase">
                                        Not to sell you out{' '}
                                    </h5>
                                    <p>
                                        We are not a lead generating site for
                                        dealerships. If anyone asks for your
                                        contact information without promising
                                        that you won't be spammed – you'll be
                                        spammed. At Deliver My Ride you control
                                        the process of purchasing your new
                                        vehicle 100% online, and your
                                        information stays private, meaning no
                                        annoying sales calls – ever!
                                    </p>
                                </Col>
                            </Row>
                        </MediumAndUp>
                        <SmallAndDown>
                            <Row className="no-gutters">
                                <img
                                    src="../../static/images/icons/promise-shield.png"
                                    alt="Our promise shield"
                                />
                                <h5 className="text-uppercase">
                                    Not to sell you out{' '}
                                </h5>
                            </Row>
                            <Row>
                                <Col>
                                    <p>
                                        We are not a lead generating site for
                                        dealerships. If anyone asks for your
                                        contact information without promising
                                        that you won't be spammed – you'll be
                                        spammed. At Deliver My Ride you control
                                        the process of purchasing your new
                                        vehicle 100% online, and your
                                        information stays private, meaning no
                                        annoying sales calls – ever!
                                    </p>
                                </Col>
                            </Row>
                        </SmallAndDown>
                    </Col>

                    <Col md="4">
                        <MediumAndUp>
                            <Row className="no-gutters">
                                <Col md="1" sm="1" xs="1">
                                    <img
                                        src="../../static/images/icons/promise-mag.png"
                                        alt="Our promise mag"
                                    />
                                </Col>
                                <Col md="10">
                                    <h5 className="text-uppercase">
                                        Not to try to fool you{' '}
                                    </h5>
                                    <p>
                                        Are you a helicopter pilot, ski-patrol
                                        surgeon and recent college graduate that
                                        happens to be an astronaut? Yeah,
                                        neither are we. That's why you'll never
                                        see a full-sized luxury SUV for $79/mo
                                        on our site. Advertised prices are too
                                        good to be true – because they often
                                        are. Don't be fooled, at Deliver My Ride
                                        the price you see is the price you'll
                                        pay.
                                    </p>
                                </Col>
                            </Row>
                        </MediumAndUp>
                        <SmallAndDown>
                            <Row className="no-gutters">
                                <img
                                    src="../../static/images/icons/promise-mag.png"
                                    alt="Our promise mag"
                                />
                                <h5 className="text-uppercase">
                                    Not to try to fool you{' '}
                                </h5>
                            </Row>
                            <Row>
                                <Col>
                                    <p>
                                        Are you a helicopter pilot, ski-patrol
                                        surgeon and recent college graduate that
                                        happens to be an astronaut? Yeah,
                                        neither are we. That's why you'll never
                                        see a full-sized luxury SUV for $79/mo
                                        on our site. Advertised prices are too
                                        good to be true – because they often
                                        are. Don't be fooled, at Deliver My Ride
                                        the price you see is the price you'll
                                        pay.
                                    </p>
                                </Col>
                            </Row>
                        </SmallAndDown>
                    </Col>

                    <Col md="4">
                        <MediumAndUp>
                            <Row className="no-gutters">
                                <Col md="1" sm="1" xs="1">
                                    <img
                                        src="../../static/images/icons/promise-comp.png"
                                        alt="Our promise comp"
                                    />
                                </Col>
                                <Col md="10">
                                    <h5 className="text-uppercase">
                                        100% dealer inventory{' '}
                                    </h5>
                                    <p>
                                        Deliver My Ride is the modern way to buy
                                        or lease a new vehicle. We only show you
                                        real cars that are in local dealer
                                        inventory – right now. Our pricing,
                                        rebates and financing options, aren't
                                        estimates they are the real price you
                                        will pay all without having to leave
                                        your home. We even deliver (for free!)
                                        to your home or office.
                                    </p>
                                </Col>
                            </Row>
                        </MediumAndUp>
                        <SmallAndDown>
                            <Row className="no-gutters">
                                <img
                                    src="../../static/images/icons/promise-comp.png"
                                    alt="Our promise comp"
                                />
                                <h5 className="text-uppercase">
                                    100% dealer inventory{' '}
                                </h5>
                            </Row>
                            <Row>
                                <Col>
                                    <p>
                                        Deliver My Ride is the modern way to buy
                                        or lease a new vehicle. We only show you
                                        real cars that are in local dealer
                                        inventory – right now. Our pricing,
                                        rebates and financing options, aren't
                                        estimates they are the real price you
                                        will pay all without having to leave
                                        your home. We even deliver (for free!)
                                        to your home or office.
                                    </p>
                                </Col>
                            </Row>
                        </SmallAndDown>
                    </Col>

                    <Col className="d-flex justify-content-center">
                        <Button color="primary" size="lg">
                            {' '}
                            See what our customers are saying{' '}
                        </Button>
                    </Col>
                </Row>
            </div>
        );
    }
}
