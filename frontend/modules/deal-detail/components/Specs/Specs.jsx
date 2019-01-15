import React from 'react';
import { dealType } from '../../../../core/types';
import SpecsGroup from './SpecsGroup';
import SpecsTabButton from './SpecsTabButton';
import { Row, Col, Container } from 'reactstrap';
import { groupBy, filter, map, toPairs, pipe, prop, zipObj } from 'ramda';

const capabilitiesCategories = [
    'Engine',
    'Dimensions',
    'Hybrid & Electric',
    'Transmission',
    'Fuel Economy',
    'Suspension',
    'Warranty',
];

const featuresCategories = [
    'Comfort & Convenience',
    'Infotainment',
    'Interior',
    'Exterior',
    'Safety & Driver Assist',
];

export default class Specs extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    state = {
        activeTab: 'capabilities',
        activeCategory: null,
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

    toggleActiveTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
                activeCategory: null,
            });
        }
    }

    toggleActiveCategory(category) {
        if (this.state.activeCategory !== category) {
            this.setState({
                activeCategory: category,
            });
        } else {
            this.setState({
                activeCategory: null,
            });
        }
    }

    render() {
        if (
            !this.props.deal.equipment ||
            this.props.deal.equipment.length === 0
        ) {
            return false;
        }

        return (
            <div className="deal-details__container pt-4 pb-3">
                <Container>
                    <Row className="deal__section-heading" noGutters>
                        <Col>
                            <h3 className="text-center"> Specifications </h3>
                        </Col>
                    </Row>
                    <Row className="rounded bg-white shadow-sm" noGutters>
                        <Col>
                            <Row className="deal-details__specs-tabs" noGutters>
                                <SpecsTabButton
                                    isActive={
                                        this.state.activeTab === 'capabilities'
                                    }
                                    label="Capabilities"
                                    value="capabilities"
                                    handleOnClick={this.toggleActiveTab.bind(
                                        this
                                    )}
                                />
                                <SpecsTabButton
                                    isActive={
                                        this.state.activeTab === 'features'
                                    }
                                    label="Features"
                                    value="features"
                                    handleOnClick={this.toggleActiveTab.bind(
                                        this
                                    )}
                                />
                            </Row>
                            <SpecsGroup
                                deal={this.props.deal}
                                category={this.state.activeTab}
                                activeCategory={this.state.activeCategory}
                                specs={this.filterSpecs()}
                                toggleActiveCategory={this.toggleActiveCategory.bind(
                                    this
                                )}
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}
