import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import zondicons from 'zondicons';

class FilterSegmentSelector extends React.PureComponent {
    render() {
        return (
            <div className="filter-selector">
                {this.props.segments.map((segment, index) => {
                    const className =
                        this.props.selectedSegment === segment
                            ? 'filter-selector__radio filter-selector__radio--selected'
                            : 'filter-selector__radio';

                    return (
                        <div
                            key={index}
                            className="filter-selector__selector"
                            onClick={this.props.onSelectSegment.bind(
                                null,
                                segment
                            )}
                        >
                            <div className={className} /> {segment}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default FilterSegmentSelector;
