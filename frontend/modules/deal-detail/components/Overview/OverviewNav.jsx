import React from 'react';
import { dealType } from '../../../../core/types';
import { Row, Col, Container } from 'reactstrap';
import classNames from 'classnames';
import { Sticky } from 'react-sticky';
import { configureAnchors } from 'react-scrollable-anchor';

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    state = {
        activeSection: 'Overview',
    };

    componentDidMount() {
        // window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        // window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        let sections = document.querySelectorAll('.deal-details__container'),
            totalScroll = document.body.getBoundingClientRect().top,
            nav = document.querySelectorAll('.overview-nav'),
            navHeight = nav[0].clientHeight;

        window.addEventListener('scroll', () => {
            sections.forEach(section => {
                let topOffset = section.getBoundingClientRect().top; //How far from the top are we
                let top = topOffset - navHeight, //How far from the top minus the height of the nav
                    bottom = top + section.clientHeight; //Find where the bottom of the current section is

                if (totalScroll >= top && totalScroll <= bottom) {
                    // console.log("Truth");
                    this.setState({ activeSection: true });
                } else {
                    // console.log("False");
                    this.setState({ activeSection: false });
                }
                // console.log(section);

                // console.log("TotalScroll: " + totalScroll);
                // console.log("Top: " + top);
                // console.log("Bottom: " + bottom);
            });
        });
        // console.log(totalScroll);
    };

    handleClick = e => {
        this.setState({
            activeSection: name,
        });

        configureAnchors({ offset: -110, scrollDuration: 800 });
    };

    render() {
        return (
            <div className="p-0">
                <Sticky topOffset={585}>
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
                                                    'overview'
                                                        ? 'active'
                                                        : ''
                                                }
                                                onClick={e =>
                                                    this.handleClick(e)
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
                                                onClick={e =>
                                                    this.handleClick(e)
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
                                                onClick={e =>
                                                    this.handleClick(e)
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
                                                onClick={e =>
                                                    this.handleClick(e)
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
                                                onClick={e =>
                                                    this.handleClick(e)
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
