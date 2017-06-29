import React from 'react';
import R from 'ramda';
import util from 'src/util';
import fuelapi from 'src/fuelapi';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';

class Deal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            featuredImage: R.propOr(
                props.fallbackDealImage,
                'url',
                props.deal.photos.data[1]
                    ? props.deal.photos.data[0]
                    : { url: props.fallbackDealImage }
            ),
        };
    }
    componentDidMount() {
        if (this.props.deal.photos.data.length === 1) {
            fuelapi
                .getVehicleId(
                    this.props.deal.year,
                    this.props.deal.make,
                    this.props.deal.model
                )
                .then(data => {
                    fuelapi
                        .getExternalImages(
                            data.data[0].id,
                            this.props.deal.color
                        )
                        .then(data => {
                            const externalImages = data.data.products.map(
                                product =>
                                    product.productFormats.map(format => {
                                        return {
                                            id: `fuel_external_${format.id}`,
                                            url: format.assets[0].url,
                                        };
                                    })
                            )[0] || [];

                            this.setState({
                                featuredImage: R.propOr(
                                    this.props.fallbackDealImage,
                                    'url',
                                    externalImages[0]
                                ),
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            fuelapi
                                .getExternalImages(data.data[0].id, 'white')
                                .then(data => {
                                    const externalImages = data.data.products.map(
                                        product =>
                                            product.productFormats.map(
                                                format => {
                                                    return {
                                                        id: `fuel_external_${format.id}`,
                                                        url: format.assets[0]
                                                            .url,
                                                    };
                                                }
                                            )
                                    )[0] || [];

                                    this.setState({
                                        featuredImage: R.propOr(
                                            this.props.fallbackDealImage,
                                            'url',
                                            externalImages[0]
                                        ),
                                    });
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        });
                });
        }
    }
    render() {
        const deal = this.props.deal;
        return (
            <div className="deal">
                <img className="deal__image" src={this.state.featuredImage} />

                <div className="deal__basic-info">
                    <p>
                        <a
                            href={`apply-or-purchase?deal_id=${deal.id}`}
                        >{`${deal.year} ${deal.make} ${deal.model}`}</a>
                        <br />
                        <strong>{util.moneyFormat(deal.price)}</strong>
                    </p>
                </div>

                <div className="deal__buttons">
                    <button
                        onClick={this.props.selectDeal.bind(null, deal)}
                        className="deal__button deal__button--small deal__button--blue deal__button"
                    >
                        Details
                    </button>
                    <button
                        className={
                            'deal__button deal__button--small ' +
                                (R.contains(deal, this.props.compareList)
                                    ? 'deal__button--blue'
                                    : '')
                        }
                        onClick={this.props.toggleCompare.bind(null, deal)}
                    >
                        Compare
                    </button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedDeal: state.selectedDeal,
        compareList: state.compareList,
    };
};

export default connect(mapStateToProps, Actions)(Deal);
