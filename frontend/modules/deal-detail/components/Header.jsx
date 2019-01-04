import React from 'react';
import { dealType } from '../../../core/types';

import { Row, Col, /*Button, */ Container } from 'reactstrap';
//import classNames from 'classnames';
//import { Sticky } from 'react-sticky';

import DealStockNumber from '../../../components/Deals/DealStockNumber';
import strings from '../../../util/strings';

export default class Header extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    render() {
        return (
            <Container>
                <Row className="deal-details__header">
                    <Col sm="6">
                        <div className="deal-details__title-year-make">
                            {strings.dealYearMake(this.props.deal)}
                        </div>
                        <div className="deal-details__title-model-trim">
                            {strings.dealModelTrim(this.props.deal)}
                        </div>
                    </Col>
                    <Col sm="6" className="deal-details__stock-number">
                        <DealStockNumber deal={this.props.deal} />
                    </Col>
                </Row>
            </Container>
        );
    }

    /*
    render() {
        return (
            <Sticky topOffset={-62}>
                {({ style, isSticky }) => (
                    <div
                        className={classNames('deal-details__new-header', {
                            stickied: isSticky,
                        })}
                        style={{
                            ...style,
                            marginTop: isSticky ? '62px' : '0px',
                        }}
                    >
                        <Container>
                            <Row>
                                <Col sm="6">
                                    <div className="deal-details__new-header title-year-make">
                                        {this.props.deal.year}{' '}
                                        {this.props.deal.make}{' '}
                                        {this.props.deal.model}
                                    </div>
                                    <div className="deal-details__new-header title-model-trim">
                                        {this.props.deal.series}
                                    </div>
                                </Col>
                                <Col lg="auto" className="payment">
                                    <p className="m-0">As low as</p>
                                    <span className="dmr-price border-right">
                                        <sub>$</sub>
                                        45,375
                                    </span>
                                </Col>
                                <Col
                                    lg="auto"
                                    sm="6"
                                    className="deal-details__new-header payment"
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
                                    lg="auto"
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
    */
}
