import React from 'react';
import { dealType } from '../../../core/types';
import DealColors from '../../../components/Deals/DealColors';
import SpecsGroup from './SpecsGroup';
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
        category: 'Engine',
        activeSpec: false,
    };

    componentDidMount() {
        if (this.props.deal) {
        }
    }

    toggleSpecAccordion(faqKey) {
        // If the user clicks on the open faq, close all faqss
        if (faqKey === this.state.activeSpec) {
            this.setState({
                activeSpec: false,
            });
        } else {
            this.setState({
                activeSpec: faqKey,
            });
        }
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
                        <SpecsGroup
                            key={this.props.deal.id}
                            vehicle={this.props.deal}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}
