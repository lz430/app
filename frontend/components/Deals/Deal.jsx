import React from 'react';
import PropTypes from 'prop-types';

import DealImage from './DealImage';
import DealPrice from './DealPrice';
import { dealType } from '../../core/types';

import { Card, CardBody, CardHeader, CardFooter } from 'reactstrap';
import Link from 'next/link';

class Deal extends React.Component {
    static propTypes = {
        deal: dealType.isRequired,
        children: PropTypes.node,
    };

    /**
     * Remove once everything supports react router.
     */
    renderHeaderContent() {
        const deal = this.props.deal;

        return (
            <Link
                href={`/deal-detail?id=${this.props.deal.id}`}
                as={`/deals/${this.props.deal.id}`}
            >
                <div className="deal__basic-info-year-and-model">
                    <div className="deal__basic-info-year-and-make">
                        {`${deal.year} ${deal.make}`}
                    </div>

                    <div className="deal__basic-info-model-and-series">
                        {`${deal.model} ${deal.series}`}
                    </div>
                    {deal.color &&
                        deal.interior_color && (
                            <div className="deal__basic-info-color">
                                {deal.color}, {deal.interior_color}
                            </div>
                        )}
                </div>
            </Link>
        );
    }

    render() {
        return (
            <Card className="inventory-summary deal-summary">
                <CardHeader className="deal__basic-info">
                    {this.renderHeaderContent()}
                </CardHeader>
                <CardBody className="deal__content">
                    <DealImage
                        featureImageClass="deal__image"
                        deal={this.props.deal}
                        key={'img' + this.props.deal.id}
                    />

                    <DealPrice
                        deal={this.props.deal}
                        key={'price' + this.props.deal.id}
                    />
                </CardBody>
                <CardFooter>{this.props.children}</CardFooter>
            </Card>
        );
    }
}

export default Deal;
