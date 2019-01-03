import React from 'react';
import { dealType } from '../../../../core/types';
import { Row, Col } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    render() {
        const { deal } = this.props;

        return (
            <div className="row border deal-details__container p-10">
                <Row
                    className="deal-details__top-highlights border-bottom"
                    id="overview"
                >
                    <Col className="text-center">
                        <h3>350 hp</h3>
                        <h6>{deal.engine}</h6>
                    </Col>
                    <Col className="text-center">
                        <h3>6-speed</h3>
                        <h6>{deal.transmission} transmission</h6>
                    </Col>
                    <Col className="text-center">
                        <h3>
                            {deal.fuel_econ_city} | {deal.fuel_econ_hwy}
                        </h3>
                        <h6>city &nbsp; MPG &nbsp; hwy</h6>
                    </Col>
                    <Col className="text-center">
                        <h3>Up to {deal.seating_capacity - 1}</h3>
                        <h6>passengers</h6>
                    </Col>
                </Row>

                <Row className="deal-details__top-features justify-content-between">
                    <Col md="6" className="d-flex align-items-center">
                        <div className="deal-details__top-features-icon d-flex justify-content-center">
                            <span
                                className="color__swatch-color d-inline-block"
                                style={{
                                    backgroundColor: deal.exterior_color_swatch,
                                }}
                            />
                        </div>

                        <div className="deal-details__deal-content-color d-flex exterior border-bottom">
                            <span className="d-inline-block">
                                Exterior Color: &nbsp;{' '}
                            </span>
                            <span className="color__swatch-name d-inline-block">
                                {this.props.deal.color}
                            </span>
                        </div>
                    </Col>
                    <Col md="6" className="d-flex align-items-center">
                        <div className="deal-details__top-features-icon d-flex justify-content-center">
                            <span
                                className="color__swatch-color d-inline-block"
                                style={{
                                    backgroundColor: deal.exterior_color_swatch,
                                }}
                            />
                        </div>

                        <div className="deal-details__deal-content-color d-flex exterior border-bottom">
                            <span className="d-inline-block">
                                Exterior Color: &nbsp;{' '}
                            </span>
                            <span className="color__swatch-name d-inline-block">
                                {this.props.deal.color}
                            </span>
                        </div>
                    </Col>
                </Row>

                <Row className="deal-details__top-features justify-content-between">
                    <Col md="6" className="d-flex align-items-center">
                        <div className="deal-details__top-features-icon d-flex justify-content-center">
                            <FontAwesomeIcon icon={faCar} />
                        </div>

                        <div className="deal-details__deal-content-color d-flex exterior border-bottom">
                            <span className="d-inline-block">
                                Exterior Color: &nbsp;{' '}
                            </span>
                            <span className="color__swatch-name d-inline-block">
                                {this.props.deal.color}
                            </span>
                        </div>
                    </Col>
                    <Col md="6" className="d-flex align-items-center">
                        <div className="deal-details__top-features-icon d-flex justify-content-center">
                            <FontAwesomeIcon icon={faCar} />
                        </div>

                        <div className="deal-details__deal-content-color d-flex exterior border-bottom">
                            <span className="d-inline-block">
                                Exterior Color: &nbsp;{' '}
                            </span>
                            <span className="color__swatch-name d-inline-block">
                                {this.props.deal.color}
                            </span>
                        </div>
                    </Col>
                </Row>

                <Row className="deal-details__top-features justify-content-between" />
            </div>
        );
    }
}
