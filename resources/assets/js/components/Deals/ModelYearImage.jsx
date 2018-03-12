import React from 'react';
import R from 'ramda';
import fuelapi from 'src/fuelapi';
import fuelcolor from 'src/fuel-color-map';

class ModelYearImage extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            fallbackDealImage: '/images/dmr-logo.svg',
            externalImages: null,
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.requestFuelImages();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    featuredImageUrl() {
        return this.state.externalImages ? (
            this.state.externalImages[2] ? this.state.externalImages[2].url : this.state.externalImages[0].url
        ) : this.state.fallbackDealImage;
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
        console.log('vehicle id ' + vehicleId);
        if (!vehicleId) return;


        try {
            if (!this._isMounted) return;
            console.log('trying first');

            this.setState({
                externalImages: this.extractFuelImages(
                    await fuelapi.getExternalImages(
                        vehicleId,
                        fuelcolor.random()
                    )
                )
            });
        } catch (e) {
            try {
                if (!this._isMounted) return;
                console.log('trying second');

                this.setState({
                    externalImages: this.extractFuelImages(
                        await fuelapi.getExternalImages(vehicleId, 'white')
                    )
                });
            } catch (e) {
                console.log('no images');
                // No Fuel Images Available.
            }
        }
    }

    render() {
        return (
            <img
                className='modelyear__image'
                src={this.featuredImageUrl()}
            />
        );
    }
}

export default ModelYearImage;
