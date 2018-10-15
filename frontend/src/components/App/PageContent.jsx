import React from 'react';
import PropTypes from 'prop-types';

import Footer from './Footer';
import { LargeAndUp } from '../Responsive';

export default class PageContent extends React.PureComponent {
    static propTypes = {
        children: PropTypes.node.isRequired,
        desktopOnlyFooter: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        desktopOnlyFooter: false,
    };

    renderFooter() {
        if (this.props.desktopOnlyFooter) {
            return (
                <LargeAndUp>
                    <Footer />
                </LargeAndUp>
            );
        }

        return <Footer />;
    }

    render() {
        return (
            <div className="app-content-wrapper">
                <div className="app-content">{this.props.children}</div>
                {this.renderFooter()}
            </div>
        );
    }
}
