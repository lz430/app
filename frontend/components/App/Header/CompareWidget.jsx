import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import DealImage from '../../Deals/DealImage';
import CloseSolid from '../../../icons/zondicons/close-solid.svg';
import Link from 'next/link';

class CompareWidget extends React.PureComponent {
    static propTypes = {
        currentPageIsInCheckout: PropTypes.bool,
        compareList: PropTypes.array,
        onToggleCompare: PropTypes.func.isRequired,
    };

    state = {
        compareDropdown: false,
    };

    toggleCompareDropdown() {
        this.setState({
            compareDropdown: !this.state.compareDropdown,
        });
    }

    dealIds() {
        let ids = [];
        this.props.compareList.map(dealAndSelectedFilters => {
            ids.push(dealAndSelectedFilters.deal.id);
        });
        return ids;
    }

    compareReady() {
        return this.props.compareList.length >= 2;
    }

    renderCompareDeal(data, index) {
        const deal = data.deal;

        return (
            <div className="compare-deal-summary" key={index}>
                <DealImage deal={deal} lazy={false} link={false} />
                <div className="deal-title">
                    <div className="deal__basic-info-year-and-make">
                        {`${deal.year} ${deal.make}`}
                    </div>
                    <div className="deal__basic-info-model-and-series">
                        {`${deal.model} ${deal.series}`}
                    </div>
                </div>
                <CloseSolid
                    className="compare-deal-remove"
                    onClick={() => this.props.onToggleCompare(deal)}
                />
            </div>
        );
    }

    render() {
        if (!this.props.compareList.length) {
            return false;
        }

        if (this.props.currentPageIsInCheckout) {
            return false;
        }

        return (
            <Dropdown
                className={classNames(
                    'dropdown',
                    'header-widget',
                    'compare-widget',
                    {
                        disabled: !this.compareReady(),
                    }
                )}
                isOpen={this.state.compareDropdown}
                toggle={this.toggleCompareDropdown.bind(this)}
            >
                <DropdownToggle tag="a">
                    <div className="header-widget-content hidden d-sm-block">
                        <div className="label">Compare</div>
                        <div className="value">Deals</div>
                    </div>
                    <div className="icon">
                        <span className="compare-count">
                            {this.props.compareList.length}
                        </span>
                    </div>
                </DropdownToggle>
                <DropdownMenu>
                    {this.props.compareList.map((deal, index) => {
                        return this.renderCompareDeal(deal, index);
                    })}
                    {this.compareReady() && (
                        <DropdownItem className="dropdown-footer-cta">
                            <Link
                                href={{
                                    pathname: '/compare',
                                    query: { deals: this.dealIds() },
                                }}
                            >
                                <a>Compare Deals</a>
                            </Link>
                        </DropdownItem>
                    )}
                </DropdownMenu>
            </Dropdown>
        );
    }
}

export default CompareWidget;
