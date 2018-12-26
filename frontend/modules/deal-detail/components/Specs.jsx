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

            console.log(this.props.deal);
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
            <div className="row deal-details__container p-10">
                <Row className="deal-details__specs heading" id="specs">
                    <Col xs="12">
                        <h2 className="text-center"> Specifications </h2>
                    </Col>
                </Row>

                <Row className="border">
                    <Col>
                        <Row className="deal-details__specs headings p-15">
                            <Col
                                sm="6"
                                className="deal-details__specs headings__item d-flex justify-content-center border-bottom active"
                            >
                                <h6 className="m-0">Capabilities</h6>
                            </Col>
                            <Col
                                sm="6"
                                className="deal-details__specs headings__item d-flex justify-content-center border-bottom"
                            >
                                <h6 className="m-0">Features</h6>
                            </Col>
                        </Row>

                        <Row
                            className="deal-details__specs accoridon-heading"
                            id="specs"
                        >
                            <Col xs="12">
                                <h6 className=""> Powertrain </h6>
                            </Col>
                        </Row>

                        <Row className="deal-details__specs row">
                            <Col
                                sm="6"
                                className="deal-details__specs capabilities text-left"
                            >
                                <span>Fuel Type</span>
                            </Col>
                            <Col
                                sm="6"
                                className="deal-details__specs features text-center"
                            >
                                <span>Gas v8</span>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}
