import React from 'react';
import PropTypes from 'prop-types';

class SearchWidget extends React.PureComponent {
    static propTypes = {
        currentPageIsInCheckout: PropTypes.bool,
        onRequestSearch: PropTypes.func.isRequired,
        autocompleteResults: PropTypes.object,
    };

    state = {
        query: '',
    };

    handleSearchRequest(query) {
        this.setState({ query: query });

        if (query) {
            this.props.onRequestSearch(query);
        }
    }
    renderResultItem(category, item) {
        return <li key={item.label}>{item.label}</li>;
    }
    renderSearchResultCategory(category, items) {
        if (!items.length) {
            return false;
        }
        const headers = {
            model: 'Model',
            make: 'Brand',
            style: 'Style',
        };

        return (
            <div className="search__results__category">
                <div className="search__results__category__header">
                    {headers[category]}
                </div>
                <ul className="search__results__category__list">
                    {items.map(item => this.renderResultItem(category, item))}
                </ul>
            </div>
        );
    }

    renderSearchResults() {
        const results = this.props.autocompleteResults;
        if (results && !Object.keys(results).length) {
            return false;
        }
        if (
            results &&
            (results.model.length ||
                results.make.length ||
                results.style.length)
        ) {
            return (
                <div className="search__results">
                    {Object.keys(results).map(key =>
                        this.renderSearchResultCategory(key, results[key])
                    )}
                </div>
            );
        }
        return false;
    }

    render() {
        if (this.props.currentPageIsInCheckout) {
            return false;
        }

        return (
            <div className="search">
                <div className="search__input">
                    <input
                        type="text"
                        onChange={e => {
                            this.handleSearchRequest(e.target.value);
                        }}
                        value={this.state.query}
                        placeholder="Search..."
                        required
                    />
                </div>
                {this.state.query && this.renderSearchResults()}
            </div>
        );
    }
}

export default SearchWidget;
