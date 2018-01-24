import React from 'react';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import PropTypes from 'prop-types';
import R from 'ramda';
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
        // const targetKey = util.getTargetKeyForDealAndZip(
        //     this.props.deal,
        //     this.props.zipcode
        // );
        // let selectedTargetIds = this.props.targets[targetKey]
        //     ? R.map(R.prop('targetId'), this.props.targets[targetKey].selected)
        //     : [];
        // selectedTargetIds = selectedTargetIds.concat(this.props.targetDefaults);
        // this.setState({
        //     targetKey: targetKey,
        //     bestOfferKey: util.getBestOfferKeyForDeal(
        //         this.props.deal,
        //         this.props.zipcode,
        //         this.props.selectedTab,
        //         selectedTargetIds
        //     ),
        // });
    }

    componentDidMount() {
        this._isMounted = true;

        //if no best offer is available, call for it
        if (!R.prop(this.state.bestOfferKey, this.props.bestOffers)) {
            this.props.requestBestOffer(this.props.deal);
        }

        const targetKey = util.getTargetKeyForDealAndZip(this.props.deal, this.props.zipcode);
        let selectedTargetIds = this.props.targets[targetKey] ? R.map(R.prop('targetId'), this.props.targets[targetKey].selected) : [];
        selectedTargetIds = R.uniq(selectedTargetIds.concat(this.props.targetDefaults));
        this.setState({
            targetKey: targetKey,
            bestOfferKey: util.getBestOfferKeyForDeal(
                this.props.deal,
                this.props.zipcode,
                this.props.selectedTab,
                selectedTargetIds
            ),
        });
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
                    <DealPrice deal={deal} targetKey={this.state.targetKey} bestOfferKey={this.state.bestOfferKey}/>
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
        bestOffers: state.bestOffers,
        selectedTab: state.selectedTab,
        targets: state.targets,
        targetDefaults: state.targetDefaults,
    };
};

Deal.PropTypes = {
    deal: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, Actions)(Deal);
