import React from 'react';
import { dealType } from '../../../../core/types';
import { Row, Col, Container } from 'reactstrap';
import classNames from 'classnames';
import { Sticky } from 'react-sticky';

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        let mainNavLinks = document.querySelectorAll(
            '.section-header-overview'
        );
        let mainSections = document.querySelectorAll('.deal__section-heading');

        // let  div = document.getElementById("overview");
        // let  rect = div.getBoundingClientRect();
        // let y = rect.top;

        // console.log(y);

        window.addEventListener('scroll', event => {
            let fromTop = window.scrollY;

            mainNavLinks.forEach(link => {
                let section = document.querySelector(link.id);
                let sectionFromTop = section.getBoundingClientRect();
                let y = rect.top;

                console.log(y);

                if (
                    section.offsetTop <= fromTop &&
                    section.offsetTop + section.offsetHeight > fromTop
                ) {
                    link.classList.add('current');
                    // console.log("Did we do it");
                } else {
                    link.classList.remove('current');
                    // console.log("Or didn't we");
                }
            });
        });

        /*window.addEventListener("scroll", event => {
            let overviewNav = document.getElementsByClassName("section-header-overview");
            let fromTop = window.scrollY;

            overviewNav.forEach(link => {
                let section = document.querySelector(this.link.id);
                if(section){
                    console.log(section);
                }else{
                    console.log("No section!");
                }
                // if ( section.scrollTop <= fromTop && section.scrollTop + section.offsetHeight > fromTop) {
                //     link.classList.add("current");
                // } else {
                //     link.classList.remove("current");
                // }
            });
        });
*/
    }

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
                                <Row className="deal__section-heading">
                                    <Col>
                                        <h6
                                            id="overview"
                                            className="section-header-overview text-center mb-0"
                                        >
                                            Overview
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6
                                            id="specs"
                                            className="section-header-overview text-center mb-0"
                                        >
                                            {' '}
                                            Specs{' '}
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6
                                            id="additional-information"
                                            className="section-header-overview text-center mb-0"
                                        >
                                            Additional Information
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6
                                            id="our-promise"
                                            className="section-header-overview text-center mb-0"
                                        >
                                            Our Promise
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6
                                            id="faqs"
                                            className="section-header-overview text-center mb-0 border-0"
                                        >
                                            FAQs
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
