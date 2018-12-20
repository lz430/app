import React from 'react';
import { dealType } from '../../../core/types';
import DealColors from '../../../components/Deals/DealColors';
import StandardFeaturesModal from './StandardFeaturesModal';
import AdditionalFeaturesModal from './AdditionalFeaturesModal';
import { Row, Col } from 'reactstrap';
import { Sticky } from 'react-sticky';

import { MediumAndUp, SmallAndDown } from '../../../components/Responsive';

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
        // console.log(this.props);
        return (
            <div className="deal__highlights">
                <Sticky topOffset={607}>
                    {({ style, isSticky }) => (
                        <div
                            className="deal-highlights fixed"
                            style={{
                                ...style,
                                marginTop: isSticky ? '138px' : '0px',
                            }}
                        >
                            <Row>
                                <Col
                                    sm="3"
                                    className="highlights__make-model align-items-center"
                                >
                                    <h6>
                                        {this.props.deal.make}{' '}
                                        {this.props.deal.model}{' '}
                                    </h6>
                                </Col>
                                <Col sm="9" className="highlights__anchors">
                                    <ul className="d-flex align-items-center justify-content-between mb-0">
                                        <li className="list-inline-item">
                                            <a href="#overview">Overview</a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#highlights">Highlights</a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#gallery">Gallery</a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#specs">Specs</a>
                                        </li>
                                        <li className="list-inline-item">
                                            <a href="#trims">Trims</a>
                                        </li>
                                    </ul>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Sticky>
            </div>
        );
    }
}
