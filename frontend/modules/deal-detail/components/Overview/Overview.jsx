import React from 'react';
import { dealType } from '../../../../core/types';
import { Row, Col, Container } from 'reactstrap';
import classNames from 'classnames';
import { Sticky } from 'react-sticky';

import HighlightItem from './HighlightItem';
import KeyFeatureItem from './KeyFeatureItem';

import { faCheck } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    renderHighlight() {
        if (
            !this.props.deal.highlights ||
            this.props.deal.highlights.length === 0
        ) {
            return false;
        }

        return (
            <Row
                className="deal__section-overview-highlights  rounded-top"
                id="overview"
            >
                {this.props.deal.highlights.map((item, index) => {
                    return (
                        <HighlightItem
                            key={`highlight-${index}`}
                            primary={item.value}
                            secondary={item.label}
                        />
                    );
                })}
            </Row>
        );
    }

    renderKeyFeatures() {
        if (
            !this.props.deal.overview ||
            this.props.deal.overview.length === 0
        ) {
            return false;
        }

        return (
            <Row
                className="deal__section-overview-features justify-content-between pt-2 pb-2"
                noGutters
            >
                {this.props.deal.overview.map((item, index) => {
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
            <Container>
                <Sticky topOffset={585}>
                    {({ style, isSticky }) => (
                        <div
                            className={classNames('deal__section-overview', {
                                stickied: isSticky,
                            })}
                            style={{
                                ...style,
                                marginTop: isSticky ? '83px' : '0',
                            }}
                        >
                            <Container>
                                <Row className="deal__section-heading pt-3 pb-3">
                                    <Col>
                                        <h6 className="text-center">
                                            {' '}
                                            Overview{' '}
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6 className="text-center"> Specs </h6>
                                    </Col>
                                    <Col>
                                        <h6 className="text-center">
                                            {' '}
                                            Additional Information{' '}
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6 className="text-center">
                                            {' '}
                                            Our Promise
                                        </h6>
                                    </Col>
                                    <Col>
                                        <h6 className="text-center border-0">
                                            {' '}
                                            FAQs
                                        </h6>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    )}
                </Sticky>

                <Container>
                    <Row className="flex-column">
                        <div className="border rounded shadow-sm bg-white">
                            {this.renderHighlight()}
                            {this.renderKeyFeatures()}
                            {this.renderPackagesAndOptions()}
                        </div>
                    </Row>
                </Container>
            </Container>
        );
    }
}
