import '../../styles/app.scss';
import React, { Component } from 'react';
import PageHero from '../../components/brochure/PageHero';
import { Container } from 'reactstrap';
import Link from 'next/link';
import withTracker from '../../components/withTracker';
import { withRouter } from 'next/router';
import Head from 'next/head';
import { track } from '../../core/services';

class Page extends Component {
    componentDidMount() {
        track('page:brochure-works:view');
    }

    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | How It Works</title>
                </Head>
                <PageHero
                    backgroundImage="/static/brochure/About_Us.jpg"
                    title="How It Works"
                />
                <div className="step-one  text-center pb-4 pt-4">
                    <Container>
                        <h4 className="mb-4">
                            Select the style and brands to compare
                        </h4>
                    </Container>
                    <img
                        className="how-it img-fluid"
                        src="/static/brochure/works/Select-Style.gif"
                    />
                </div>
                <div className="step-one bg-light text-center pb-4 pt-4">
                    <Container>
                        <h4 className="mb-4">View and refine your results</h4>
                    </Container>
                    <img
                        className="how-it img-fluid"
                        src="/static/brochure/works/View-Refine.gif"
                    />
                </div>
                <div className="step-one  text-center pb-4 pt-4">
                    <Container>
                        <h4 className="mb-4">
                            Prefer to compare? Add multiple vehicles to a
                            compare garage to compare vehicles side by side,
                            allowing you to make the best choice in minutes
                            instead of hours
                        </h4>
                    </Container>
                    <img
                        className="how-it img-fluid"
                        src="/static/brochure/works/Compare.gif"
                    />
                </div>
                <div className="step-one bg-light  text-center pb-4 pt-4">
                    <Container>
                        <h4 className="mb-4">
                            See a car you like? Click &#34;View Details&#34;.
                            Here you can customize your rebates and payments,
                            review standard equipment and view options.
                        </h4>
                    </Container>
                    <img
                        className="how-it img-fluid"
                        src="/static/brochure/works/View-Details.gif"
                    />
                </div>
                <div className="step-one  text-center pb-4 pt-4">
                    <Container>
                        <h4 className="mb-4">
                            When you are ready to buy or lease, click &#34;Buy
                            Now&#34; to review and finalize.
                        </h4>
                    </Container>
                    <img
                        className="how-it img-fluid"
                        src="/static/brochure/works/Ready-To-Buy.gif"
                    />
                </div>
                <div className="step-one bg-light text-center pb-4 pt-4">
                    <Container>
                        <p>
                            We will contact you within an hour of receiving your
                            information to confirm, finalize details and
                            schedule delivery. Remember, you can cancel at
                            anytime before final paperwork is signed, even if
                            the car is in your driveway!
                        </p>
                        <h4 className="mb-4">Have more questions?</h4>

                        <p>
                            Visit our{' '}
                            <Link href="/brochure/faq" as="/brochure/faq">
                                <a>FAQ page</a>
                            </Link>{' '}
                            or{' '}
                            <Link
                                href="/brochure/contact"
                                as="/brochure/contact"
                            >
                                <a>contact us</a>
                            </Link>
                            .
                        </p>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouter(withTracker(Page));
