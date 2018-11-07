import React from 'react';
import HomepageSearch from './HomepageSearch';
import PropTypes from 'prop-types';
import { nextRouterType } from '../../../core/types';

export default class extends React.Component {
    static propTypes = {
        autocompleteResults: PropTypes.object,
        onRequestSearch: PropTypes.func.isRequired,
        onClearSearchResults: PropTypes.func.isRequired,
        onSetSelectedMake: PropTypes.func.isRequired,
        router: nextRouterType,
    };

    render() {
        return (
            <div className="home__hero">
                <div className="home__hero__banner">
                    <HomepageSearch
                        onRequestSearch={this.props.onRequestSearch}
                        onClearSearchResults={this.props.onClearSearchResults}
                        onSetSelectedMake={this.props.onSetSelectedMake}
                        autocompleteResults={this.props.autocompleteResults}
                        router={this.props.router}
                    />
                </div>
                <div className="home__hero__message text-center p-2 text-white" />
            </div>
        );
    }
}
