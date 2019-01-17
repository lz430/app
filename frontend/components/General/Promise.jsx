import React from 'react';
import { Row, Col, Container } from 'reactstrap';
import { MediumAndUp, SmallAndDown } from '../Responsive';

export default class extends React.PureComponent {
    render() {
        return (
            <div className="pb-3 pt-3">
                <Container>
                    <Row className="deal__section-heading">
                        <Col>
                            <h3 className="text-center"> We Promise </h3>
                        </Col>
                    </Row>
                    <Row className="deal__promise__columns no-gutters bg-white shadow-sm rounded">
                        <Col md="4">
                            <MediumAndUp>
                                <Row className="no-gutters">
                                    <Col md="1" sm="1" xs="1">
                                        <img
                                            src="/static/images/icons/promise-shield.png"
                                            alt="Our promise shield"
                                        />
                                    </Col>
                                    <Col md="10">
                                        <h5 className="text-uppercase">
                                            We Won’t Sell You Out{' '}
                                        </h5>
                                        <p className="text-sm">
                                            We are not a lead generation site
                                            for dealerships like most other
                                            sites. If a web site asks for your
                                            contact information, promising that
                                            you won’t be spammed – you will be
                                            spammed. At Deliver My Ride, you
                                            shop privately and control the
                                            purchase process 100% online. That
                                            means no annoying texts, emails, or
                                            phone calls – ever.
                                        </p>
                                    </Col>
                                </Row>
                            </MediumAndUp>
                            <SmallAndDown>
                                <Row className="no-gutters">
                                    <img
                                        src="/static/images/icons/promise-shield.png"
                                        alt="Our promise shield"
                                    />
                                    <h5 className="text-uppercase">
                                        We Won’t Sell You Out{' '}
                                    </h5>
                                </Row>
                                <Row>
                                    <Col>
                                        <p className="text-sm">
                                            We are not a lead generation site
                                            for dealerships like most other
                                            sites. If a web site asks for your
                                            contact information, promising that
                                            you won’t be spammed – you will be
                                            spammed. At Deliver My Ride, you
                                            shop privately and control the
                                            purchase process 100% online. That
                                            means no annoying texts, emails, or
                                            phone calls – ever.
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
                                            src="/static/images/icons/promise-mag.png"
                                            alt="Our promise mag"
                                        />
                                    </Col>
                                    <Col md="10">
                                        <h5 className="text-uppercase">
                                            No Fooling Around{' '}
                                        </h5>
                                        <p className="text-sm">
                                            Are you a helicopter pilot,
                                            ski-patrol surgeon, and a recent
                                            college grad who just happens to be
                                            an astronaut? Probably not. That’s
                                            why full transparency matters when
                                            car shopping. Advertised prices look
                                            too good to be true -because they
                                            always are. At Deliver My Ride, you
                                            won’t see a full-sized luxury SUV
                                            for $79/month because we won’t fool
                                            you. Instead, the price you see is
                                            the price you’ll pay.
                                        </p>
                                    </Col>
                                </Row>
                            </MediumAndUp>
                            <SmallAndDown>
                                <Row className="no-gutters">
                                    <img
                                        src="/static/images/icons/promise-mag.png"
                                        alt="Our promise mag"
                                    />
                                    <h5 className="text-uppercase">
                                        No Fooling Around{' '}
                                    </h5>
                                </Row>
                                <Row>
                                    <Col>
                                        <p className="text-sm">
                                            Are you a helicopter pilot,
                                            ski-patrol surgeon, and a recent
                                            college grad who just happens to be
                                            an astronaut? Probably not. That’s
                                            why full transparency matters when
                                            car shopping. Advertised prices look
                                            too good to be true -because they
                                            always are. At Deliver My Ride, you
                                            won’t see a full-sized luxury SUV
                                            for $79/month because we won’t fool
                                            you. Instead, the price you see is
                                            the price you’ll pay.
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
                                            src="/static/images/icons/promise-comp.png"
                                            alt="Our promise comp"
                                        />
                                    </Col>
                                    <Col md="10">
                                        <h5 className="text-uppercase">
                                            100% dealer inventory{' '}
                                        </h5>
                                        <p className="text-sm">
                                            Deliver My Ride is not a dealership,
                                            but we display thousands of cars
                                            from dealership inventory that you
                                            can buy right now. Not only can you
                                            review current inventory, but also
                                            discounted pricing, rebates,
                                            finance/lease options, and all taxes
                                            and fees. We will only provide real
                                            prices, not estimates, so you can
                                            have confidence in your purchase
                                            choice. And every vehicle is fully
                                            protected by the manufacturer’s
                                            warranty. We even deliver (for free)
                                            to your home or office.
                                        </p>
                                    </Col>
                                </Row>
                            </MediumAndUp>
                            <SmallAndDown>
                                <Row className="no-gutters">
                                    <img
                                        src="/static/images/icons/promise-comp.png"
                                        alt="Our promise comp"
                                    />
                                    <h5 className="text-uppercase">
                                        100% dealer inventory{' '}
                                    </h5>
                                </Row>
                                <Row>
                                    <Col>
                                        <p className="text-sm">
                                            Deliver My Ride is not a dealership,
                                            but we display thousands of cars
                                            from dealership inventory that you
                                            can buy right now. Not only can you
                                            review current inventory, but also
                                            discounted pricing, rebates,
                                            finance/lease options, and all taxes
                                            and fees. We will only provide real
                                            prices, not estimates, so you can
                                            have confidence in your purchase
                                            choice. And every vehicle is fully
                                            protected by the manufacturer’s
                                            warranty. We even deliver (for free)
                                            to your home or office.
                                        </p>
                                    </Col>
                                </Row>
                            </SmallAndDown>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
