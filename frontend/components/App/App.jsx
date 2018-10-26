import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';

import { LargeAndUp } from '../Responsive';

import Header from './Header/Header';
import Footer from './Footer';

import BrochureHeader from '../brochure/brochure-header.jsx';
import BrochureFooter from '../brochure/brochure-footer.jsx';

class App extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        desktopOnlyFooter: PropTypes.bool.isRequired,
        isBrochureSite: PropTypes.bool.isRequired,
    };

    static defaultProps = {
        desktopOnlyFooter: false,
        isBrochureSite: false,
    };

    /**
     * @returns {*}
     */
    renderHeader() {
        if (this.props.isBrochureSite) {
            return <BrochureHeader />;
        }

        return <Header />;
    }

    /**
     * @returns {*}
     */
    renderFooter() {
        if (this.props.isBrochureSite) {
            return <BrochureFooter />;
        }
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
            <div className="app">
                {this.renderHeader()}
                <div
                    className="app-content-wrapper"
                    style={{
                        marginTop: this.props.isBrochureSite ? '86px' : '67px',
                    }}
                >
                    <div className="app-content">{this.props.children}</div>
                    {this.renderFooter()}
                </div>
            </div>
        );
    }
}

export default withRouter(App);
