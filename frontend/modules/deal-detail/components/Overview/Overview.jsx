import React from 'react';
import { dealType } from '../../../../core/types';
import { Row, Col, Container } from 'reactstrap';

import HighlightItem from './HighlightItem';
import KeyFeatureItem from './KeyFeatureItem';

import { faCheck } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { filter, groupBy, prop } from 'ramda';

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    getHighlightItems() {
        const { deal } = this.props;
        // Probably a smarter way to do this.
        const overviewData = groupBy(prop('label'), deal.overview);

        let items = [];
        if (overviewData['Horse Power']) {
            items.push({
                primary: `${overviewData['Horse Power'][0]['value']} hp`,
                secondary: this.props.deal.engine,
            });
        }
        if (overviewData['Transmission Speed']) {
            items.push({
                primary: `${
                    overviewData['Transmission Speed'][0]['value']
                }-speed`,
                secondary: `${deal.transmission} transmission`,
            });
        }
        if (deal.fuel_econ_city && deal.fuel_econ_hwy) {
            items.push({
                primary: `${deal.fuel_econ_city} | ${deal.fuel_econ_hwy}`,
                secondary: 'city  MPG  hwy',
            });
        }
        if (deal.seating_capacity) {
            items.push({
                primary: `Up to ${deal.seating_capacity - 1}`,
                secondary: 'Passengers',
            });
        }

        return items;
    }

    getOverviewItems() {
        let items = [...this.props.deal.overview];

        if (this.props.deal.fuel_type && this.props.deal.fuel_type.length) {
            items.unshift({
                category: 'Misc',
                label: 'Fuel Type',
                value: this.props.deal.fuel_type[0],
            });
        }

        if (this.props.deal.drive_train && this.props.deal.drive_train.length) {
            items.unshift({
                category: 'Misc',
                label: 'Drive Train',
                value: this.props.deal.drive_train[0],
            });
        }

        items.unshift({
            category: 'Misc',
            label: 'Body Style',
            value: this.props.deal.style,
        });

        items.unshift({
            category: 'Misc',
            label: 'Seating Materials',
            value: this.props.deal.seat_materials,
        });

        if (this.props.deal.interior_color) {
            items.unshift({
                category: 'Colors',
                label: 'Interior Color',
                value: this.props.deal.interior_color,
            });
        }

        items.unshift({
            category: 'Colors',
            label: 'Exterior Color',
            value: this.props.deal.color,
            swatch: this.props.deal.exterior_color_swatch,
        });

        items = filter(item => {
            if (
                ['Fuel Economy', 'Transmission', 'Engine'].includes(
                    item.category
                )
            ) {
                return false;
            }

            return true;
        }, items);

        return items;
    }

    renderHighlight() {
        return (
            <Row
                className="deal__section-overview-highlights  rounded-top"
                id="overview"
                noGutters
            >
                {this.getHighlightItems().map((item, index) => {
                    return (
                        <HighlightItem
                            key={`highlight-${index}`}
                            primary={item.primary}
                            secondary={item.secondary}
                        />
                    );
                })}
            </Row>
        );
    }

    renderKeyFeatures() {
        const items = this.getOverviewItems();
        return (
            <Row
                className="deal__section-overview-features justify-content-between pt-2 pb-2"
                noGutters
            >
                {items.map((item, index) => {
                    return (
                        <KeyFeatureItem
                            key={`key-feature-${index}`}
                            item={item}
                            deal={this.props.deal}
                        />
                    );
                })}
            </Row>
        );
    }

    renderPackagesOrOptions(label, items) {
        return (
            <Col md={6}>
                <div className="deal__section-overview-options-group-header">
                    {label}
                </div>
                <div>
                    {items.map((item, index) => {
                        return (
                            <div
                                key={`${label}-${index}`}
                                className="deal__section-overview-options-item"
                            >
                                <FontAwesomeIcon icon={faCheck} />{' '}
                                {item.option_name}
                            </div>
                        );
                    })}
                </div>
            </Col>
        );
    }

    renderPackagesAndOptions() {
        const { deal } = this.props;
        const renderPackages = deal.packages && deal.packages.length;
        const renderOptions = deal.options && deal.options.length;

        if (!renderPackages && !renderOptions) {
            return false;
        }

        return (
            <Row className="deal__section-overview-options" noGutters>
                {!!renderPackages &&
                    this.renderPackagesOrOptions('Packages', deal.packages)}
                {!!renderOptions &&
                    this.renderPackagesOrOptions('Options', deal.options)}
            </Row>
        );
    }

    render() {
        return (
            <div className="deal__section-overview  pt-3 pb-3">
                <Container>
                    <Row className="deal__section-heading">
                        <Col>
                            <h3 className="text-center"> Overview </h3>
                        </Col>
                    </Row>

                    <div className="border rounded shadow-sm bg-white">
                        {this.renderHighlight()}
                        {this.renderKeyFeatures()}
                        {this.renderPackagesAndOptions()}
                    </div>
                </Container>
            </div>
        );
    }
}
