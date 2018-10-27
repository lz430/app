import '../../styles/app.scss';
import React from 'react';
import PageHero from '../../components/brochure/PageHero';
import Link from 'next/link';
import { Container, Row, Col } from 'reactstrap';

export default class extends React.Component {
    render() {
        return (
            <div>
                <PageHero
                    backgroundImage="/static/brochure/About_Us.jpg"
                    title="About Us"
                />

                <div className="cost bg-white pt-4 pb-4">
                    <Container>
                        <h2 className="line">
                            &#34;There must be a better way!&#34;
                        </h2>
                        <p>
                            <img
                                className="underline"
                                src="/static/brochure/line.png"
                            />
                            <br />
                            That&#39;s what we said! And so have millions of
                            other Americans who are looking for a modern car
                            buying experience. Deliver My Ride creates a
                            convenient, unbiased, and pressure-free way to buy
                            or lease a new car online. We offer visibility into
                            local dealer inventory, pricing, manufacturer
                            rebates and multiple financing options, all without
                            having to leave your home. We even deliver (for
                            free!) to your home or office.
                        </p>
                    </Container>
                </div>

                <div className="story pt-4 pb-4">
                    <Container>
                        <h3 className="cap">Our Story</h3>
                        <p>
                            After a 30 year career in and around the car
                            business, Deliver My Ride’s founder Mike McInerney
                            found himself on the consumer’s side of the deal. “I
                            wanted to buy a car for my daughter a couple years
                            after leaving the retail car business and
                            experienced first hand how difficult the car buying
                            process could be as a consumer. I searched the web
                            looking for a fast, easy and transparent way to
                            compare different vehicle brands, prices and
                            incentives. Every site either directed me to a
                            dealership or sold my information, which led to
                            weeks of unwanted calls and emails…it was
                            frustrating. So I set out to fix the problem through
                            my knowledge of the car business and utilizing
                            modern technology.”
                        </p>
                        <p>
                            Determined to change the way we buy cars, he huddled
                            with bright technology minds, such as Compuware
                            Founder Peter Karmanos, developed a network of
                            innovative, like-minded dealerships, and created
                            Deliver My Ride as an alternative to the traditional
                            car buying process.
                        </p>
                    </Container>
                </div>

                <div className="values bg-white pt-4 pb-4">
                    <Container>
                        <h3 className="text-center pt-4 pb-4">Our Values</h3>
                        <Row className="text-center">
                            <Col>
                                <div className="mb-4">
                                    <img src="/static/brochure/Convenience.png" />
                                </div>
                                <h4>Convenience</h4>
                                <p className="text-sm">
                                    Buy your new car on your time and your
                                    terms. No more taking time off work. No more
                                    hustling the kids in and out of the
                                    dealership. No more wasting your weekends.
                                    With Deliver My Ride, you can shop, compare,
                                    calculate and purchase your new car 100%
                                    online and 100% convenient.
                                </p>
                            </Col>

                            <Col>
                                <div className="mb-4">
                                    <img src="/static/brochure/FreedomOfChoice.png" />
                                </div>
                                <h4>Choice</h4>
                                <p className="text-sm">
                                    We are partnered with hundreds of local
                                    dealers and aggregate their inventory into
                                    one location. Now, customers can view and
                                    search vehicle details of every brand to
                                    find the car that’s right for them.
                                </p>
                            </Col>

                            <Col>
                                <div className="mb-4">
                                    <img src="/static/brochure/PrivateData.png" />
                                </div>
                                <h4>Privacy</h4>
                                <p className="text-sm">
                                    We are not a lead provider so we never sell
                                    your information, meaning you will never get
                                    calls from <u>anyone</u> trying to sell you
                                    a car. You control the process and remain
                                    anonymous until it’s time to take delivery.
                                </p>
                            </Col>

                            <Col>
                                <div className="mb-4">
                                    <img src="/static/brochure/TransPricing.png" />
                                </div>
                                <h4>Transparency</h4>
                                <p className="text-sm">
                                    We utilize the most accurate pricing,
                                    incentives and interest rates so you can see
                                    and compare actual pricing among several
                                    dealers and determine which rebates you
                                    qualify for. No more unrealistic advertised
                                    prices just to get you in the door. We give
                                    you the tools to make an educated decision.
                                </p>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <div className="cost bg-white pt-4 pb-4">
                    <Container>
                        <p>
                            <strong>What does Deliver My Ride Cost Me?</strong>{' '}
                            Nothing. Zip. Zilch. Zero. In fact, we save you
                            money. As an alternate sales channel, we replace the
                            salesperson and reduce the cost to the dealer,
                            passing the savings to you. Since we don’t work for
                            any one dealer and aren’t working on a commission
                            percentage, we stay unbiased throughout the entire
                            buying process. With Deliver My Ride, nobody sells
                            you a car, you buy the car that’s right for you.
                        </p>
                        <div className="text-center">
                            <Link
                                href="/brochure/faq"
                                as="/brochure/faq"
                                passHref
                            >
                                <a className="btn btn-primary">See more FAQs</a>
                            </Link>
                        </div>
                    </Container>
                </div>

                <div className="about-office pt-4 pb-4">
                    <Container>
                        <Row>
                            <Col>
                                <h3>Who&#39;s behind Deliver My Ride?</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="6">
                                <div>
                                    <img
                                        className="img-fluid"
                                        src="/static/brochure/DMR-Office.jpg"
                                    />
                                </div>
                            </Col>
                            <Col md="6">
                                How does today&#39;s consumer really want to buy
                                a new vehicle? That&#39;s the question we
                                focused on while developing Deliver My Ride. We
                                are influencers, data experts and automotive
                                insiders who teamed up to create a world-class
                                site with you, the actual customer, in mind. The
                                men and women involved in this process each
                                shared unique car buying experiences, good and
                                bad. The team spent many hours researching and
                                testing to bring together the best sources of
                                data to give our customers the most complete set
                                of results related to their individual vehicle
                                buying needs. All of these factors were combined
                                to help us craft a great
                                website-DeliverMyRide.com. A site that we
                                consider an ideal vehicle buying experience. A
                                site that we would want to use for ourselves. We
                                sincerely hope you feel the same.
                            </Col>
                        </Row>
                    </Container>
                </div>

                <div className="about-team text-center bg-white pt-4 pb-4">
                    <Container>
                        <Row>
                            <Col>
                                <img src="/static/brochure/team/MichaelMcInerney.png" />
                                <h5>Michael McInerney</h5>
                                <span>Founder</span>
                            </Col>
                            <Col>
                                <img src="/static/brochure/team/MaryVellucci.png" />
                                <h5>Mary Velucci</h5>
                                <span>Administration</span>
                            </Col>
                            <Col>
                                <img src="/static/brochure/team/MarkHillman.png" />
                                <h5>Mark Hillman</h5>
                                <span>Business Strategy</span>
                            </Col>
                            <Col>
                                <img src="/static/brochure/team/LauraFournier.png" />
                                <h5>Laura Fournier</h5>
                                <p>Finance</p>
                            </Col>
                            <Col>
                                <img src="/static/brochure/team/PeterKarmanos.png" />
                                <h5>Peter Karmanos</h5>
                                <span>Chairman</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <img src="/static/brochure/team/RickGutierrez.png" />
                                <h5>Rick Gutierrez</h5>
                                <span>UX &amp; Design</span>
                            </Col>
                            <Col>
                                <img src="/static/brochure/team/GinaMarrow.png" />
                                <h5>Gina Morrow</h5>
                                <span>Customer Success</span>
                            </Col>
                            <Col>
                                <img src="/static/brochure/team/GrahamSutcliffe.png" />
                                <h5>Graham Sutcliffe</h5>
                                <span>Technology</span>
                            </Col>
                            <Col>
                                <img src="/static/brochure/team/SaraWright.png" />
                                <h5>Sara Wright</h5>
                                <span>Engagement</span>
                            </Col>
                            <Col>
                                <img src="/static/brochure/team/PeterSchmitt.png" />
                                <h5>Peter Schmitt</h5>
                                <span>Digital Strategy</span>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        );
    }
}
