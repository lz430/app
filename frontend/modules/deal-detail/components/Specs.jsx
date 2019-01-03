import React from 'react';
import { dealType } from '../../../core/types';
import SpecsGroup from './SpecsGroup';
import { Row, Col, TabContent, TabPane } from 'reactstrap';
import { groupBy, filter, map, toPairs, pipe, prop, zipObj } from 'ramda';

const capabilitiesCategories = [
    'Engine',
    'Dimensions',
    'Hybrid & Electric',
    'Transmission',
    'Fuel Economy',
    'Suspension',
];

const featuresCategories = [
    'Comfort & Convenience',
    'Infotainment',
    'Exterior',
    'Safety & Driver Assist',
];

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    state = {
        category: 'Engine',
        activeSpec: false,
        activeTab: 'capabilities',
    };

    filterSpecs() {
        const groupByCategories = pipe(
            filter(item => {
                if (
                    this.state.activeTab === 'capabilities' &&
                    capabilitiesCategories.includes(item.category)
                ) {
                    return true;
                }

                if (
                    this.state.activeTab === 'features' &&
                    featuresCategories.includes(item.category)
                ) {
                    return true;
                }

                return false;
            }),
            groupBy(prop('category')),
            toPairs,
            map(zipObj(['category', 'values']))
        );

        return groupByCategories(this.props.deal.equipment);
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        // console.log(this.state.activeTab);

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
                                    (this.state.activeTab === 'capabilities')
                                }
                                onClick={() => {
                                    this.toggle('capabilities');
                                }}
                            >
                                <h6 className="m-0">Capabilities</h6>
                            </Col>
                            <Col
                                sm="6"
                                className={
                                    'deal-details__specs headings__item d-flex justify-content-center border-bottom ' +
                                    (this.state.activeTab === 'features')
                                }
                                onClick={() => {
                                    this.toggle('features');
                                }}
                            >
                                <h6 className="m-0">Features</h6>
                            </Col>
                        </Row>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="capabilities">
                                <SpecsGroup
                                    vehicle={this.props.deal}
                                    category={this.state.activeTab}
                                    specs={this.filterSpecs()}
                                />
                            </TabPane>
                            <TabPane tabId="features">
                                <SpecsGroup
                                    vehicle={this.props.deal}
                                    category={this.state.activeTab}
                                    specs={this.filterSpecs()}
                                />
                            </TabPane>
                        </TabContent>
                    </Col>
                </Row>
            </div>
        );
    }
}
