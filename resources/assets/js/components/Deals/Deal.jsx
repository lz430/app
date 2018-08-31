import React from 'react';
import PropTypes from 'prop-types';

import DealImage from 'components/Deals/DealImage';
import DealPrice from 'components/Deals/DealPrice';
import { dealType } from 'types';

import { Card, CardBody, CardHeader, CardFooter } from 'reactstrap';
import { Link } from 'react-router-dom';

/**
 * legacyMode = if we are supporting react router or not.
 */
class Deal extends React.Component {
    static propTypes = {
        deal: dealType.isRequired,
        children: PropTypes.node,
        legacyMode: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        legacyMode: false,
    };

    /**
     * Remove once everything supports react router.
     */
    renderHeaderContent() {
        const deal = this.props.deal;

        if (this.props.legacyMode) {
            return (
                <a
                    href={`/deals/${deal.id}`}
                    className="deal__basic-info-year-and-model"
                >
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
                </a>
            );
        }

        return (
            <Link
                to={`/deals/${deal.id}`}
                className="deal__basic-info-year-and-model"
            >
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
                        legacyMode={this.props.legacyMode}
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
