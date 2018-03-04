import React from 'react';
import R from 'ramda';
import fuelapi from 'src/fuelapi';
import fuelcolor from 'src/fuel-color-map';

class ModelYearImage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            featuredImage: null,
            fallbackDealImage: '/images/dmr-logo.svg',
        };
    }

    componentDidMount() {
        this.requestFuelImages();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    featuredImageUrl() {
        return R.propOr(
            this.state.fallbackDealImage,
            'url',
            this.state.featuredImage
        )
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
        const vehicleId =
            (await fuelapi.getVehicleId(this.props.modelYear.year, this.props.modelYear.make, this.props.modelYear.model))
                .data[0].id || false;
        if (!vehicleId) return;

        try {
            const externalImages = this.extractFuelImages(
                await fuelapi.getExternalImages(
                    vehicleId,
                    fuelcolor.random()
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

export default ModelYearImage;
