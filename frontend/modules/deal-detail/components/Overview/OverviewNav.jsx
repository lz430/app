import React from 'react';
import { dealType } from '../../../../core/types';
import { Row, Col, Container } from 'reactstrap';
import classNames from 'classnames';
import { Sticky } from 'react-sticky';

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    state = {
        activeSection: 'Overview',
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    // window.addEventListener('scroll', event => {
    //     let fromTop = window.scrollY;

    //     mainNavLinks.forEach(link => {
    //         let section = document.querySelector(link.hash);
    //         let rect = section.getBoundingClientRect();

    //         if (
    //           rect.top <= fromTop &&
    //           rect.top + section.offsetHeight > fromTop
    //         ) {
    //              this.setState({ activeSection: true });
    //         } else {
    //              this.setState({ activeSection: false });
    //         }
    //         // console.log(this.state.activeSection);
    //     });
    // });

    // Todo: Put IDs on each section...then do the math on those particular sections vs. the top nav.
    handleScroll = () => {
        let sections = document.querySelectorAll('.deal-details__container'),
            nav = document.querySelectorAll('.overview-nav'),
            navHeight = nav[0].clientHeight;

        window.addEventListener('scroll', () => {
            let theTop = this.scrollTop;

            sections.forEach(section => {
                let topOffset = section.getBoundingClientRect().top;
                let top = topOffset - navHeight,
                    bottom = top + section.outerHeight;

                if (theTop >= top && theTop <= bottom) {
                    this.setState({ activeSection: true });
                } else {
                    this.setState({ activeSection: false });
                }
            });
            console.log(this);
        });
    };

    render() {
        return (
            <div className="p-0">
                <Sticky topOffset={520}>
                    {({ style, isSticky }) => (
                        <div
                            className={classNames('deal__section-overview', {
                                stickied: isSticky,
                            })}
                            style={{
                                ...style,
                                marginTop: isSticky ? '81px' : '0',
                            }}
                        >
                            <Container>
                                <Row className="deal__section-heading overview-nav">
                                    <Col>
                                        <h6 className="section-header-overview text-center mb-0">
                                            <a
                                                href="#overview"
                                                className={
                                                    this.state.activeSection ===
                                                    true
                                                        ? 'active'
                                                        : ''
                                                }
                                            >
                                                Overview
                                            </a>
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6 className="section-header-overview text-center mb-0">
                                            <a
                                                href="#specs"
                                                className={
                                                    this.state.activeSection ===
                                                    true
                                                        ? 'active'
                                                        : ''
                                                }
                                            >
                                                {' '}
                                                Specs{' '}
                                            </a>
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6 className="section-header-overview text-center mb-0">
                                            <a
                                                href="#additional-information"
                                                className={
                                                    this.state.activeSection ===
                                                    true
                                                        ? 'active'
                                                        : ''
                                                }
                                            >
                                                Additional Information
                                            </a>
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6 className="section-header-overview text-center mb-0">
                                            <a
                                                href="#our-promise"
                                                className={
                                                    this.state.activeSection ===
                                                    true
                                                        ? 'active'
                                                        : ''
                                                }
                                            >
                                                Our Promise
                                            </a>
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6 className="section-header-overview text-center mb-0 border-0">
                                            <a
                                                href="#faqs"
                                                className={
                                                    this.state.activeSection ===
                                                    true
                                                        ? 'active'
                                                        : ''
                                                }
                                            >
                                                FAQs
                                            </a>
                                        </h6>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    )}
                </Sticky>
            </div>
        );
    }
}
