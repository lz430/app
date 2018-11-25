import React from 'react';
import HomepageSearch from './HomepageSearch';
import PropTypes from 'prop-types';

export default class extends React.Component {
    static propTypes = {
        purchaseStrategy: PropTypes.string,
        autocompleteResults: PropTypes.object,
        onRequestSearch: PropTypes.func.isRequired,
        onClearSearchResults: PropTypes.func.isRequired,
        onSetSelectedMake: PropTypes.func.isRequired,
        push: PropTypes.func.isRequired,
    };

    render() {
        return (
            <div className="home__hero">
                <div className="home__hero__banner">
                    <HomepageSearch
                        purchaseStrategy={this.props.purchaseStrategy}
                        push={this.props.push}
                        onRequestSearch={this.props.onRequestSearch}
                        onClearSearchResults={this.props.onClearSearchResults}
                        onSetSelectedMake={this.props.onSetSelectedMake}
                        autocompleteResults={this.props.autocompleteResults}
                    />
                </div>
            </div>
        );
    }
}
