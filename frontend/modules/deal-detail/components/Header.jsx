import React from 'react';
import { dealType } from '../../../core/types';

import { Row, Col, Button, Container } from 'reactstrap';
import classNames from 'classnames';
import { Sticky } from 'react-sticky';

export default class Header extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    // Sticky header
    render() {
        return (
            <Sticky topOffset={10}>
                {({ style, isSticky }) => (
                    <div
                        className={classNames('deal-details__new-header', {
                            stickied: isSticky,
                        })}
                        style={{
                            ...style,
                            marginTop: isSticky ? '0' : '0',
                        }}
                    >
                        <Container>
                            <Row>
                                <Col md="6">
                                    <div className="deal-details__new-header title-year-make">
                                        {this.props.deal.year}{' '}
                                        {this.props.deal.make}{' '}
                                        {this.props.deal.model}
                                    </div>
                                    <div className="deal-details__new-header title-model-trim">
                                        {this.props.deal.series}
                                    </div>
                                </Col>
                                <Col
                                    md="auto"
                                    sm="6"
                                    xs="6"
                                    className="payment"
                                >
                                    <p className="m-0">As low as</p>
                                    <span className="dmr-price border-right">
                                        <sub>$</sub>
                                        45,375
                                    </span>
                                </Col>
                                <Col
                                    md="auto"
                                    sm="6"
                                    xs="6"
                                    className="deal-details__new-header payment align-self-sm-end"
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
                                    md="auto"
                                    className="d-flex ml-auto align-items-center"
                                >
                                    <Button className="" color="primary">
                                        <b>Next: </b> Begin Purchase
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                )}
            </Sticky>
        );
    }
}
