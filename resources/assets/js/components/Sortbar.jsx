import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import { connect } from 'react-redux';
import * as Actions from 'actions';
import util from 'src/util';

class Sortbar extends React.PureComponent {
    constructor() {
        super();

        this.state = {
            dropdownShown: false,
        };
    }

    renderFilterToggle() {
        return util.windowIsLargerThanSmall(this.props.window.width) ? (
            ''
        ) : (
            <div
                onClick={this.props.toggleSmallFiltersShown}
                className="sortbar__filter-toggle"
            >
                <SVGInline
                    height="20px"
                    width="20px"
                    className="sortbar__filter-toggle-icon"
                    svg={zondicons['tuning']}
                />{' '}
                <span className="sortbar__filter-toggle-text">Filter</span>
            </div>
        );
    }

    toggleDropdownShown() {
        this.setState({
            dropdownShown: !this.state.dropdownShown,
        });
    }

    renderIcon(column) {
        const icon = this.props.sortAscending ? 'cheveron-up' : 'cheveron-down';

        return this.props.sortColumn === column ? (
            <SVGInline
                height="18px"
                width="18px"
                className="sortbar__sort-icon"
                svg={zondicons[icon]}
            />
        ) : (
            ''
        );
    }

    renderSortbarDropdown() {
        const icon = this.state.dropdownShown ? 'cheveron-down' : 'cheveron-up';

        return (
            <div className="sortbar__buttons">
                <button
                    className="sortbar__button sortbar__button"
                    onClick={() => this.toggleDropdownShown()}
                >
                    Sort results by...
                    <SVGInline
                        height="18px"
                        width="18px"
                        className="sortbar__sort-icon sortbar__sort-icon--right-side"
                        svg={zondicons[icon]}
                    />
                </button>
                {this.state.dropdownShown ? (
                    <div className="sortbar__dropdown">
                        <div onClick={() => this.props.sortDeals('price')}>
                            Price {this.renderIcon('price')}
                        </div>
                    </div>
                ) : (
                    ''
                )}
            </div>
        );
    }

    render() {
        return (
            <div className="sortbar">
                {this.renderFilterToggle()}
                {this.props.filterPage === 'deals' ? this.renderSortbarDropdown() : ''}
            </div>
        );
    }
}

Sortbar.propTypes = {
    deals: PropTypes.arrayOf(
        PropTypes.shape({
            year: PropTypes.string.isRequired,
            msrp: PropTypes.number.isRequired,
            employee_price: PropTypes.number.isRequired,
            supplier_price: PropTypes.number.isRequired,
            make: PropTypes.string.isRequired,
            model: PropTypes.string.isRequired,
            id: PropTypes.number.isRequired,
        })
    ),
    sortColumn: PropTypes.oneOf(['price', 'make', 'year']).isRequired,
    sortAscending: PropTypes.bool.isRequired,
    window: PropTypes.shape({
        width: PropTypes.number.isRequired,
    }).isRequired,
};

function mapStateToProps(state) {
    return {
        deals: state.deals,
        filterPage: state.filterPage,
        sortColumn: state.sortColumn,
        sortAscending: state.sortAscending,
        compareList: state.compareList,
        window: state.window,
    };
}

export default connect(mapStateToProps, Actions)(Sortbar);
