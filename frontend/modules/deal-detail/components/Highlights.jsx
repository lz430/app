import React from 'react';
import { dealType } from '../../../core/types';
import DealColors from '../../../components/Deals/DealColors';
import StandardFeaturesModal from './StandardFeaturesModal';
import AdditionalFeaturesModal from './AdditionalFeaturesModal';
import { Row, Col } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCar } from '@fortawesome/free-solid-svg-icons';

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    state = {
        basicFeatures: [],
        fuelEconomy: {},
        upholsteryType: null,
        standardFeaturesModalOpen: false,
        additionalFeaturesModalOpen: false,
    };

    componentDidMount() {
        if (this.props.deal) {
            const {
                body_style,
                driven_wheels,
                fuel_econ_city,
                fuel_econ_hwy,
            } = this.props.deal.version;

            const { engine, transmission } = this.props.deal;

            const basicFeatures = [
                { name: 'Body', content: body_style },
                { name: 'Drive Train', content: driven_wheels },
                { name: 'Engine', content: engine },
                { name: 'Transmission', content: transmission },
            ];

            const fuelEconomy = {
                city: fuel_econ_city,
                highway: fuel_econ_hwy,
            };

            this.setState({ basicFeatures, fuelEconomy });

            // console.log(this.props.deal);
        }
    }

    toggleStandardFeaturesModal() {
        this.setState({
            standardFeaturesModalOpen: !this.state.standardFeaturesModalOpen,
        });
    }

    toggleAdditionalFeaturesModal() {
        this.setState({
            additionalFeaturesModalOpen: !this.state
                .additionalFeaturesModalOpen,
        });
    }

    render() {
        const { deal } = this.props;

        return (
            <div className="row border deal-details__container p-10">
                <Row
                    className="deal-details__top-highlights border-bottom"
                    id="overview"
                >
                    <Col>
                        <h3 className="text-center">350 hp</h3>
                        <h6 className="text-center">
                            {this.props.deal.engine}
                        </h6>
                    </Col>
                    <Col>
                        <h3 className="text-center">6-speed</h3>
                        <h6 className="text-center">
                            {this.props.deal.transmission} transmission
                        </h6>
                    </Col>
                    <Col>
                        <h3 className="text-center">
                            {this.props.deal.fuel_econ_city} |{' '}
                            {this.props.deal.fuel_econ_hwy}
                        </h3>
                        <h6 className="text-center">
                            city &nbsp; MPG &nbsp; hwy
                        </h6>
                    </Col>
                    <Col>
                        <h3 className="text-center">Up to 7</h3>
                        <h6 className="text-center">passengers</h6>
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
