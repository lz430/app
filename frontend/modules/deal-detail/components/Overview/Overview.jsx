import React from 'react';
import { dealType } from '../../../../core/types';
import { Row, Col, Container } from 'reactstrap';

import HighlightItem from './HighlightItem';
import KeyFeatureItem from './KeyFeatureItem';

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    getOverviewItems() {
        let items = this.props.deal.overview;

        items.unshift({
            category: 'Colors',
            label: 'Interior Color',
            value: this.props.deal.interior_color,
        });

        items.unshift({
            category: 'Colors',
            label: 'Exterior Color',
            value: this.props.deal.color,
            swatch: this.props.deal.exterior_color_swatch,
        });

        return items;
    }

    renderHighlight() {
        const { deal } = this.props;

        return (
            <Row
                className="deal__section-overview-highlights  rounded-top"
                id="overview"
                noGutters
            >
                <HighlightItem primary={'350 hp'} secondary={deal.engine} />
                <HighlightItem
                    primary={'6-speed'}
                    secondary={`${deal.transmission} transmission`}
                />
                <HighlightItem
                    primary={`${deal.fuel_econ_city} | ${deal.fuel_econ_hwy}`}
                    secondary={'city  MPG  hwy'}
                />
                <HighlightItem
                    primary={`Up to ${deal.seating_capacity - 1}`}
                    secondary={'Passengers'}
                />
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
                {renderPackages &&
                    this.renderPackagesOrOptions('Packages', deal.packages)}
                {renderOptions &&
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
