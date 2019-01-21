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
        console.log(this.props.deal);
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
                            minHeight: isSticky ? '100px' : 'none',
                        }}
                    >
                        <Container>
                            <Row>
                                <Col
                                    className={
                                        !isSticky
                                            ? 'col-md-6 col-lg-7 col-xl-8'
                                            : 'col-md-6'
                                    }
                                >
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
                                    sm="3"
                                    xs="3"
                                    className="payment"
                                    style={{
                                        marginRight: isSticky ? '' : 'auto',
                                    }}
                                >
                                    <p className="m-0">As low as</p>
                                    <span className="dmr-price border-right">
                                        <sub>$</sub>
                                        45,375
                                    </span>
                                </Col>
                                <Col
                                    md="auto"
                                    sm="3"
                                    xs="3"
                                    className="payment align-self-sm-end"
                                    style={{
                                        marginRight: isSticky ? '' : 'auto',
                                    }}
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
                                    className={
                                        !isSticky
                                            ? 'col-md-auto ml-auto align-items-center'
                                            : 'align-items-sm-center sticky container-button'
                                    }
                                    style={{
                                        display: isSticky ? 'flex' : 'none',
                                        marginRight: isSticky ? 'auto' : '',
                                    }}
                                >
                                    <Button className="" color="primary">
                                        <b>Get Started: </b> Configure Price
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
