import React from 'react';
import R from 'ramda';
import fuelapi from 'src/fuelapi';
import fuelcolor from 'src/fuel-color-map';

class DealImage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            featuredImage: props.deal.photos[0],
            fallbackDealImage: '/images/dmr-placeholder.jpg',
        };
    }

    componentDidMount() {
        this._isMounted = true;

        if (this.props.deal.photos.length === 0) {
            this.requestFuelImages();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    featuredImageUrl() {
        return R.propOr(
            R.propOr(
                this.state.fallbackDealImage,
                'url',
                this.state.featuredImage
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

        try {
            const vehicleId =
                (await fuelapi.getVehicleId(deal.year, deal.make, deal.model))
                    .data[0].id || false;
            if (!vehicleId) return;
        } catch (e) {
            return; // No Fuel Vehicle ID Available.
        }

        try {
            const externalImages = this.extractFuelImages(
                await fuelapi.getExternalImages(
                    vehicleId,
                    fuelcolor.convert(deal.color)
                )
            );

            if (!this._isMounted) return;
            this.setState({ featuredImage: externalImages[0] });
        } catch (e) {
            try {
                const externalImages = this.extractFuelImages(
                    await fuelapi.getExternalImages(vehicleId, 'white')
                );

                if (!this._isMounted) return;
                this.setState({ featuredImage: externalImages[0] });
            } catch (e) {
                // No Fuel Images Available.
            }
        }
    }

    render() {
        return (
            <img
                className={this.props.featureImageClass}
                src={this.featuredImageUrl()}
            />
        );
    }
}

export default DealImage;
