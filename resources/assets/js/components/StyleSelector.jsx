import React from 'react';
import PropTypes from 'prop-types';
import R from 'ramda';
import SVGInline from "react-svg-inline"
import icons from '../../../../public/icons';

class StyleSelector extends React.Component {
    constructor() {
        super();

        this.renderStyle = this.renderStyle.bind(this);
    }

    renderStyle(style) {
        let selected = R.contains(style.style, this.props.selectedStyles);
        let className = `style-selector__style ${selected ? 'style-selector__style--selected' : ''}`;

        return (
            <div
                className={className}
                onClick={this.props.onSelectStyle.bind(null, style.style)}
                key={style.style}
            >
                {icons[style.icon] ? <SVGInline svg={ icons[style.icon] } /> : ''}

                <div className="style-selector__name">{style.style}</div>
            </div>
        );
    }

    render() {
        return (
            <div className="style-selector">
                <div className="style-selector__title">Select Style</div>

                <div className="style-selector__styles">
                    {this.props.styles.map(this.renderStyle)}
                </div>
            </div>
        );
    }
}

StyleSelector.propTypes = {
    styles: PropTypes.arrayOf(
        PropTypes.shape({
            style: PropTypes.string,
            icon: PropTypes.string,
        })
    ).isRequired,
    selectedStyles: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSelectStyle: PropTypes.func.isRequired,
};

export default StyleSelector;
