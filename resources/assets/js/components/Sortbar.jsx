import React from 'react';
import PropTypes from 'prop-types';

const renderSortIcon = (sortStatus, sortColumn, column) => {
    return sortColumn === column
        ? <img
              className="sortbar__icon"
              src={
                  sortStatus === 'desc'
                      ? '/images/zondicons/cheveron-down.svg'
                      : '/images/zondicons/cheveron-up.svg'
              }
          />
        : '';
};

const Sortbar = ({
    results_count,
    onPriceClick,
    onYearClick,
    onAtoZClick,
    sortStatus,
    sortColumn,
}) => {
    const renderIcon = renderSortIcon.bind(undefined, sortStatus, sortColumn);

    return (
        <div className="sortbar">
            <div className="results">
                {results_count} Results sorted by
            </div>
            <div className="sortbar__buttons">
                <button className="sortbar__button" onClick={onPriceClick}>
                    {renderIcon('price')}
                    Price
                </button>
                <button className="sortbar__button" onClick={onYearClick}>
                    {renderIcon('year')}
                    Year
                </button>
                <button className="sortbar__button" onClick={onAtoZClick}>
                    {renderIcon('make')}
                    A-Z
                </button>
            </div>
        </div>
    );
};

Sortbar.propTypes = {
    results_count: PropTypes.number.isRequired,
    onPriceClick: PropTypes.func.isRequired,
    onAtoZClick: PropTypes.func.isRequired,
    onYearClick: PropTypes.func.isRequired,
    sortColumn: PropTypes.oneOf(['price', 'make', 'year']).isRequired,
    sortStatus: PropTypes.oneOf(['asc', 'desc']).isRequired,
};

export default Sortbar;
