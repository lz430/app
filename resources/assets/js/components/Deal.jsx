import React from 'react';
import R from 'ramda';
import util from 'src/util';
import fuelapi from 'src/fuelapi';
import DealPrice from 'components/DealPrice';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';

class Deal extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            fallbackDealImage: '/images/dmr-logo.svg',
            fuelFeaturedImage: null,
        };
    }

    componentDidMount() {
        if (this.props.deal.photos.length === 0) {
            this.requestFuelImages();
        }
    }

    featuredImageUrl() {
        return R.propOr(
            R.propOr(
                this.state.fallbackDealImage,
                'url',
                this.state.fuelFeaturedImage
            ),
            'url',
            this.props.deal.photos[0]
        );
    }

    extractFuelImages(data) {
        return (
            data.data.products.map(product =>
                product.productFormats.map(format => {
                    return {
                        id: `fuel_external_${format.id}`,
                        url: format.assets[0].url,
                    };
                })
            )[0] || []
        );
    }

    async requestFuelImages() {
        const deal = this.props.deal;

        const vehicleId =
            (await fuelapi.getVehicleId(deal.year, deal.make, deal.model))
                .data[0].id || false;
        if (!vehicleId) return;

        try {
            const externalImages = this.extractFuelImages(
                await fuelapi.getExternalImages(
                    vehicleId,
                    fuelcolor.convert(deal.color)
                )
            );

            this.setState({ fuelFeaturedImage: externalImages[0] });
        } catch (e) {
            try {
                const externalImages = this.extractFuelImages(
                    await fuelapi.getExternalImages(vehicleId, 'white')
                );

                this.setState({ fuelFeaturedImage: externalImages[0] });
            } catch (e) {
                // No Fuel Images Available.
            }
        }
    }
    render() {
        const deal = this.props.deal;
        const featuredImageUrl = this.featuredImageUrl();
        const featureImageClass =
            featuredImageUrl !== this.state.fallbackDealImage
                ? 'deal__image'
                : 'deal__image deal__image--fallback';

        return (
            <div className="deal">
                {this.props.hideImageAndTitle ? (
                    ''
                ) : (
                    <div>
                        <div className="deal__basic-info">
                            <div
                                onClick={() =>
                                    (window.location = `/deals/${deal.id}`)}
                                className="deal__basic-info-year-and-model"
                            >
                                {`${deal.year} ${deal.make} ${deal.model} ${deal.series}`}
                            </div>
                            <div className="deal__basic-info-msrp">
                                {util.moneyFormat(deal.msrp)} MSRP
                            </div>
                        </div>

                        <img
                            className={featureImageClass}
                            src={featuredImageUrl}
                        />
                    </div>
                )}

                <div className="deal__price">
                    <DealPrice deal={deal} />
                </div>

                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        compareList: state.compareList,
    };
};

export default connect(mapStateToProps, Actions)(Deal);
