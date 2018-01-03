import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import SVGInline from 'react-svg-inline';
import bodyStyleIcons from 'body-styles';
import miscicons from 'miscicons';

class FilterStyleSelector extends React.PureComponent {
    constructor() {
        super();

        this.renderStyle = this.renderStyle.bind(this);
    }

    renderStyle(style) {
        let selected = R.contains(style.style, this.props.selectedStyles);
        let className = `filter-style-selector__style ${selected
            ? 'filter-style-selector__style--selected'
            : ''}`;

        return (
            <div
                className={className}
                onClick={this.props.onSelectStyle.bind(null, style.style)}
                key={style.style}
            >
                {bodyStyleIcons[style.icon] ? (
                    <SVGInline
                        width="70px"
                        className="filter-style-selector__icon"
                        svg={bodyStyleIcons[style.icon]}
                    />
                ) : (
                    ''
                )}

                <div className="filter-style-selector__name">{style.label}</div>
            </div>
        );
    }

    render() {
        return (
            <div className="filter-style-selector">
                <div className="filter-style-selector__styles">
                    {this.props.styles ? (
                        this.props.styles.map(this.renderStyle)
                    ) : (
                        <SVGInline svg={miscicons['loading']} />
                    )}
                </div>
            </div>
        );
    }
}

FilterStyleSelector.propTypes = {
    styles: PropTypes.arrayOf(
        PropTypes.shape({
            style: PropTypes.string,
            icon: PropTypes.string,
        })
    ),
    selectedStyles: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectStyle: PropTypes.func.isRequired,
};

export default FilterStyleSelector;
