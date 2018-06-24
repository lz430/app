import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DealImage from 'components/Deals/DealImage';
import DealPrice from 'components/Deals/DealPrice';

class Deal extends React.Component {
    static propTypes = {
        deal: PropTypes.object.isRequired,
    };

    render() {
        const deal = this.props.deal;
        return (
            <div className="deal">
                <div className="deal__content">
                    <div className="deal__basic-info">
                        <div
                            onClick={() =>
                                (window.location = `/deals/${deal.id}`)
                            }
                            className="deal__basic-info-year-and-model"
                        >
                            <div className="deal__basic-info-year-and-make">
                                {`${deal.year} ${deal.make}`}
                            </div>

                            <div className="deal__basic-info-model-and-series">
                                {`${deal.model} ${deal.series}`}
                            </div>
                            <div className="deal__basic-info-color">
                                {deal.color}, {deal.interior_color}
                            </div>
                        </div>
                    </div>

                    <DealImage
                        featureImageClass="deal__image"
                        deal={this.props.deal}
                        key={this.props.deal.id}
                    />
                </div>
                <div className="deal__price">
                    <DealPrice
                        deal={this.props.deal}
                        key={this.props.deal.id}
                    />
                </div>

                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

export default connect(mapStateToProps)(Deal);
