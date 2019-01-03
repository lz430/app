import React from 'react';
import { dealType } from '../../../core/types';
import SpecsGroup from './SpecsGroup';
import { Row, Col, Container } from 'reactstrap';
import { groupBy, map, toPairs, pipe, prop, zipObj, filter } from 'ramda';

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

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

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

    render() {
        const { deal } = this.props;

        return (
            <div className="deal-details__container pt-3 pb-3">
                <Container>
                    <Row className="deal__section-heading">
                        <Col>
                            <h3 className="text-center"> Specifications </h3>
                        </Col>
                    </Row>
                    <Row className="border">
                        <Col>
                            <Row
                                tabs
                                className="deal-details__specs headings p-15"
                            >
                                <Col
                                    sm="6"
                                    className={
                                        'deal-details__specs headings__item d-flex justify-content-center border-bottom  cursor-pointer ' +
                                        (this.state.activeTab ===
                                            'capabilities')
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
                                        'deal-details__specs headings__item d-flex justify-content-center border-bottom cursor-pointer  ' +
                                        (this.state.activeTab === 'features')
                                    }
                                    onClick={() => {
                                        this.toggle('features');
                                    }}
                                >
                                    <h6 className="m-0">Features</h6>
                                </Col>
                            </Row>
                            <SpecsGroup
                                vehicle={this.props.deal}
                                category={this.state.activeTab}
                                specs={this.filterSpecs()}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
