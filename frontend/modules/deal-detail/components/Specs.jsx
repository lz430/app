import React from 'react';
import { dealType } from '../../../core/types';
import DealColors from '../../../components/Deals/DealColors';
import SpecsGroup from './SpecsGroup';
import { Row, Col, TabContent, TabPane } from 'reactstrap';

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
        activeTab: '1',
    };

    componentDidMount() {
        if (this.props.deal) {
        }
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
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
        console.log(this.state);

        return (
            <div className="row deal-details__container p-10">
                <Row className="deal-details__specs heading" id="specs">
                    <Col xs="12">
                        <h2 className="text-center"> Specifications </h2>
                    </Col>
                </Row>

                <Row className="border">
                    <Col>
                        <Row tabs className="deal-details__specs headings p-15">
                            <Col
                                sm="6"
                                className={
                                    'deal-details__specs headings__item d-flex justify-content-center border-bottom ' +
                                    (this.state.activeTab === '1')
                                }
                                onClick={() => {
                                    this.toggle('1');
                                }}
                            >
                                <h6 className="m-0">Capabilities</h6>
                            </Col>
                            <Col
                                sm="6"
                                className={
                                    'deal-details__specs headings__item d-flex justify-content-center border-bottom ' +
                                    (this.state.activeTab === '2')
                                }
                                onClick={() => {
                                    this.toggle('2');
                                }}
                            >
                                <h6 className="m-0">Features</h6>
                            </Col>
                        </Row>

                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="1">
                                <SpecsGroup
                                    key={this.props.deal.id}
                                    vehicle={this.props.deal}
                                />
                            </TabPane>
                            <TabPane tabId="2">
                                <h2>Features go here </h2>
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
            </div>
        );
    }
}
