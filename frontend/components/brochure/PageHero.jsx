import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

export default class PageHero extends React.PureComponent {
    static propTypes = {
        title: PropTypes.string.isRequired,
        backgroundImage: PropTypes.string,
        subtitle: PropTypes.string,
        button: PropTypes.string,
        cta: PropTypes.shape({
            label: PropTypes.string.isRequired,
            href: PropTypes.string.isRequired,
            as: PropTypes.string.isRequired,
        }),
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

                {this.props.cta && (
                    <Link
                        as={this.props.cta.as}
                        href={this.props.cta.href}
                        passHref
                    >
                        <a className="btn btn-primary">
                            {this.props.cta.label}
                        </a>
                    </Link>
                )}
            </div>
        );
    }
}
