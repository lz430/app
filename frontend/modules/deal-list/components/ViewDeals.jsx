import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as R from 'ramda';

import { dealType } from '../../../core/types';
import Loading from '../../../icons/miscicons/Loading';

import Deal from '../../../components/Deals/Deal';

import { toggleCompare } from '../../../apps/common/actions';
import { requestMoreDeals } from '../actions';
import { getLoadingSearchResults } from '../selectors';
import Link from 'next/link';
import classNames from 'classnames';
import CardCta from './Cta/CardCta';

class ViewDeals extends React.PureComponent {
    static propTypes = {
        deals: PropTypes.arrayOf(dealType),
        compareList: PropTypes.array,
        meta: PropTypes.object.isRequired,
        shouldShowLoading: PropTypes.bool,
        onRequestMoreDeals: PropTypes.func.isRequired,
        onToggleCompare: PropTypes.func.isRequired,
    };

    compareListContainsDeal(deal) {
        return R.contains(deal, R.map(R.prop('deal'), this.props.compareList));
    }

    compareButtonClass() {
        return classNames('btn', 'btn-outline-primary', 'btn-sm');
    }

    renderShowMoreButton() {
        if (this.props.deals && this.props.shouldShowLoading) {
            // Deals are already loaded and we have already requested more deals
            return <Loading />;
        }

        if (
            this.props.deals &&
            this.props.meta &&
            this.props.meta.current_page !== this.props.meta.last_page
        ) {
            // Deals are already loaded, and there are more pages.
            return (
                <div className="deals__show-more">
                    <button
                        onClick={this.props.onRequestMoreDeals}
                        className="btn btn-primary"
                    >
                        Show More
                    </button>
                </div>
            );
        }
    }

    renderDeal(deal, index) {
        return (
            <Deal deal={deal} key={index}>
                <div className="deal__buttons">
                    <button
                        className={this.compareButtonClass()}
                        onClick={this.props.onToggleCompare.bind(null, deal)}
                    >
                        {this.compareListContainsDeal(deal)
                            ? 'Remove'
                            : 'Compare'}{' '}
                    </button>
                    <Link
                        href={`/deal-detail?id=${deal.id}`}
                        as={`/deals/${deal.id}`}
                    >
                        <a className="btn btn-outline-success btn-sm">View</a>
                    </Link>
                </div>
            </Deal>
        );
    }

    render() {
        if (!this.props.deals || !this.props.deals.length) {
            return <Loading />;
        }

        return (
            <div className="deals-wrapper">
                <div className="inventory-summary-deck card-deck  m-0">
                    {this.props.deals.map((deal, index) => {
                        const data = [deal];

                        if (index === 3) {
                            data.splice(0, 0, { cta: 'call' });
                        }
                        return data.map(item => {
                            if (item.cta) {
                                return <CardCta key={'cta-' + index} />;
                            } else {
                                return this.renderDeal(deal, index);
                            }
                        });
                    })}
                </div>
                {this.renderShowMoreButton()}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        compareList: state.common.compareList,
        meta: state.pages.dealList.meta,
        shouldShowLoading: getLoadingSearchResults(state),
        deals: state.pages.dealList.deals,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onRequestMoreDeals: () => {
            return dispatch(requestMoreDeals());
        },
        onToggleCompare: data => {
            return dispatch(toggleCompare(data));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewDeals);
