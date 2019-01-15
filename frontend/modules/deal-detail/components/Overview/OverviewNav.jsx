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

    handleScroll() {}

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
                                        <h6 className="section-header text-center mb-0">
                                            {' '}
                                            Overview{' '}
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6 className="section-header text-center mb-0">
                                            {' '}
                                            Specs{' '}
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6 className="section-header text-center mb-0">
                                            {' '}
                                            Additional Information{' '}
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6 className="section-header text-center mb-0">
                                            {' '}
                                            Our Promise
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6 className="section-header text-center mb-0 border-0">
                                            {' '}
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
