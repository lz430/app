import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DealImage from 'components/Deals/DealImage';
import DealPrice from 'components/Deals/DealPrice';
import { dealType } from 'types';

import { Card, CardBody, CardHeader, CardFooter } from 'reactstrap';

class Deal extends React.Component {
    static propTypes = {
        deal: dealType.isRequired,
        children: PropTypes.node,
    };

    render() {
        const deal = this.props.deal;
        return (
            <Card className="inventory-summary">
                <CardHeader className="deal__basic-info">
                    <div
                        onClick={() => (window.location = `/deals/${deal.id}`)}
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
                    </div>
                </CardHeader>
                <CardBody className="deal__content">
                    <DealImage
                        featureImageClass="deal__image"
                        deal={this.props.deal}
                        key={this.props.deal.id}
                    />
                    <div className="deal__price">
                        <DealPrice
                            deal={this.props.deal}
                            key={this.props.deal.id}
                        />
                    </div>
                </CardBody>
                <CardFooter>{this.props.children}</CardFooter>
            </Card>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps)(Deal);
