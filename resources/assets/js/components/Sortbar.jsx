import React from 'react';
import PropTypes from 'prop-types';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';
import { connect } from 'react-redux';
import * as Actions from 'actions';
import util from 'src/util';

class Sortbar extends React.Component {
    renderIcon(column) {
        const icon = this.props.sortAscending ? 'cheveron-up' : 'cheveron-down';

        return this.props.sortColumn === column
            ? <SVGInline
                  height="18px"
                  width="18px"
                  className="sortbar__sort-icon"
                  svg={zondicons[icon]}
              />
            : '';
    }

    renderFilterToggle() {
        return util.windowIsLargerThanSmall(this.props.window.width)
            ? ''
            : <div
                  onClick={this.props.toggleSmallFiltersShown}
                  className="sortbar__filter-toggle"
              >
                  <SVGInline
                      height="20px"
                      width="20px"
                      className="sortbar__filter-toggle-icon"
                      svg={zondicons['tuning']}
                  />
                  {' '}
                  <span className="sortbar__filter-toggle-text">Filter</span>
              </div>;
    }

    render() {
        return (
            <div className="sortbar">
                {this.renderFilterToggle()}
                <div className="sortbar__count">
                    <span className="sortbar__count-number">
                        {this.props.results_count}
                    </span>
                    {' '}
                    results
                </div>
                <div className="sortbar__buttons">
                    <button
                        className="sortbar__button sortbar__button"
                        onClick={() => {
                            this.props.sortDeals('price');
                            this.props.requestDeals();
                        }}
                    >
                        {this.renderIcon('price')} Price
                    </button>
                    <button
                        className="sortbar__button sortbar__button"
                        onClick={() => {
                            this.props.sortDeals('year');
                            this.props.requestDeals();
                        }}
                    >
                        {this.renderIcon('year')} Year
                    </button>
                    <button
                        className="sortbar__button sortbar__button"
                        onClick={() => {
                            this.props.sortDeals('make');
                            this.props.requestDeals();
                        }}
                    >
                        {this.renderIcon('make')} A-Z
                    </button>
                </div>
            </div>
        );
    }
}

Sortbar.propTypes = {
    results_count: PropTypes.number.isRequired,
    sortColumn: PropTypes.oneOf(['price', 'make', 'year']).isRequired,
    sortAscending: PropTypes.bool.isRequired,
    window: PropTypes.shape({
        width: PropTypes.number.isRequired,
    }).isRequired,
};

function mapStateToProps(state) {
    return {
        results_count: state.deals.length,
        sortColumn: state.sortColumn,
        sortAscending: state.sortAscending,
        compareList: state.compareList,
        window: state.window,
    };
}

export default connect(mapStateToProps, Actions)(Sortbar);
