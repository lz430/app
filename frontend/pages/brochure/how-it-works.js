import '../../styles/app.scss';
import React from 'react';
import PageHero from '../../components/brochure/PageHero';
import { Container } from 'reactstrap';
import Link from 'next/link';

export default class extends React.Component {
    render() {
        return (
            <div>
                <PageHero
                    backgroundImage="/static/brochure/About_Us.jpg"
                    title="How It Works"
                />
                <div className="step-one  text-center pb-4 pt-4">
                    <Container>
                        <h3>Select the style and brands to compare</h3>
                    </Container>
                    <img
                        className="how-it"
                        src="/static/brochure/works/Select-Style.gif"
                    />
                </div>
                <div className="step-one bg-light text-center pb-4 pt-4">
                    <Container>
                        <h3>View and refine your results</h3>
                    </Container>
                    <img
                        className="how-it"
                        src="/static/brochure/works/View-Refine.gif"
                    />
                </div>
                <div className="step-one  text-center pb-4 pt-4">
                    <Container>
                        <h3>
                            Prefer to compare? Add multiple vehicles to a
                            compare garage to compare vehicles side by side,
                            allowing you to make the best choice in minutes
                            instead of hours
                        </h3>
                    </Container>
                    <img
                        className="how-it"
                        src="/static/brochure/works/Compare.gif"
                    />
                </div>
                <div className="step-one bg-light  text-center pb-4 pt-4">
                    <Container>
                        <h3>
                            See a car you like? Click &#34;View Details&#34;.
                            Here you can customize your rebates and payments,
                            review standard equipment and view options.
                        </h3>
                    </Container>
                    <img
                        className="how-it"
                        src="/static/brochure/works/View-Details.gif"
                    />
                </div>
                <div className="step-one  text-center pb-4 pt-4">
                    <Container>
                        <h3>
                            When you are ready to buy or lease, click &#34;Buy
                            Now&#34; to review and finalize.
                        </h3>
                    </Container>
                    <img
                        className="how-it"
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
                        <h3>Have more questions?</h3>

                        <p>
                            Visit our{' '}
                            <Link href="/brochure/faq" as="/brochure/faq">
                                FAQ page
                            </Link>{' '}
                            or{' '}
                            <Link
                                href="/brochure/contact"
                                as="/brochure/contact"
                            >
                                contact us
                            </Link>
                            .
                        </p>
                    </Container>
                </div>
            </div>
        );
    }
}
