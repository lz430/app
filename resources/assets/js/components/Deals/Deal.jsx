import React from 'react';
import DealPrice from 'components/Deals/DealPrice';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';
import DealImage from 'components/Deals/DealImage';

class Deal extends React.PureComponent {
    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidMount() {
        this._isMounted = true;
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
                                    (window.location = `/deals/${deal.id}`)}
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

                <div className="tabs__title">Select Your Payment &amp; Rebates</div>

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
