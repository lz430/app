import React from 'react';
import { dealType } from '../../../core/types';
import DealColors from '../../../components/Deals/DealColors';
import SpecsGroup from './SpecsGroup';
import { Row, Col, TabContent, TabPane } from 'reactstrap';
import { groupBy, map, toPairs, pipe, prop, dissoc, zipObj } from 'ramda';

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
        activeTab: 'capabilities',
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

    filterSpecs(activeTab) {
        const groupByCategories = pipe(
            groupBy(prop('category')),
            map(map(dissoc('category'))), // optional - if you want to remove the category from the values
            toPairs,
            map(zipObj(['category', 'values']))
        );
        const specList = groupByCategories(this.props.deal.equipment);

        return specList;
    }

    render() {
        const { deal } = this.props;
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
                                    key={this.props.deal.id}
                                    vehicle={this.props.deal}
                                    category={this.state.activeTab}
                                    specs={this.filterSpecs()}
                                />
                            </TabPane>
                            <TabPane tabId="features">
                                <h3>Features go here </h3>
                                <SpecsGroup
                                    key={this.props.deal.id}
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
