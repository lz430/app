import React from 'react';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import PropTypes from 'prop-types';
import util from 'src/util';
import DealImage from 'components/Deals/DealImage';
import DealPrice from 'components/Deals/DealPrice';

class Deal extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            targetKey: null,
            bestOfferKey: null,
        };
    }

    componentWillMount() {
        this.setState({
            targetKey: util.getTargetKeyForDealAndZip(
                this.props.deal,
                this.props.zipcode
            ),
        });

        this.props.requestBestOffer(this.props.deal)
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const deal = this.props.deal;

        return (
            <div className="deal">
                {this.props.hideImageAndTitle ? (
                    ''
                ) : (
                    <div>
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
                            </div>
                        </div>

                        <DealImage
                            featureImageClass="deal__image"
                            deal={this.props.deal}
                        />
                    </div>
                )}

                <div className="tabs__title">
                    Select Your Payment &amp; Rebates
                </div>

                <div className="deal__price">
                    <DealPrice deal={deal} targetKey={this.state.targetKey} />
                </div>

                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        compareList: state.compareList,
        zipcode: state.zipcode,
    };
};

Deal.PropTypes = {
    deal: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, Actions)(Deal);
