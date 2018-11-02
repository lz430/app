import React from 'react';
import PropTypes from 'prop-types';

export default class PageHero extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        backgroundImage: PropTypes.string,
        subtitle: PropTypes.string,
        button: PropTypes.string,
    };

    render() {
        let style = {};
        if (this.props.backgroundImage) {
            style.backgroundImage = 'url(' + this.props.backgroundImage + ')';
        }
        return (
            <div className="page-hero" style={style}>
                <h1>{this.props.title}</h1>
                <h4>{this.props.subtitle}</h4>
                <button className="btn btn-primary">{this.props.button}</button>
            </div>
        );
    }
}
