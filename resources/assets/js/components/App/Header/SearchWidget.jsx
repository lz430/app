import React from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';

import { buildSearchQueryUrl } from 'pages/deal-list/helpers';
import StyleIcon from 'components/Deals/StyleIcon';

class SearchWidget extends React.PureComponent {
    static propTypes = {
        currentPageIsInCheckout: PropTypes.bool,
        onRequestSearch: PropTypes.func.isRequired,
        autocompleteResults: PropTypes.object,
        history: ReactRouterPropTypes.history.isRequired,
        searchQuery: PropTypes.object,
    };

    state = {
        query: '',
        selectedItem: null,
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClick, false);
    }

    handleClick = e => {
        if (this.node.contains(e.target)) {
            return;
        }

        this.setState({ query: '' });
    };

    onSelectItem(item) {
        let newSearchQuery = { ...this.props.searchQuery };
        if (item.query.entity) {
            newSearchQuery.entity = item.query.entity;
        }

        if (item.query.filters) {
            newSearchQuery.filters = item.query.filters;
        }
        const urlQuery = buildSearchQueryUrl(newSearchQuery);
        this.props.history.push('/filter?' + urlQuery);
        this.setState({ query: '' });
    }

    handleSearchRequest(query) {
        this.setState({ query: query });

        if (query) {
            this.props.onRequestSearch(query);
        }
    }

    renderResultItemIcon(category, item) {
        if (category === 'style') {
            return <StyleIcon style={item.icon} />;
        }

        return <img src={item.icon} />;
    }

    renderResultItem(category, item) {
        return (
            <li
                className="search__results__item"
                key={item.label}
                onClick={() => this.onSelectItem(item)}
            >
                <div className="search__results__item__icon">
                    {this.renderResultItemIcon(category, item)}
                </div>

                <div className="search__results__item__title">
                    <div className="search__results__item__title__label">
                        {item.label}
                    </div>
                    <div className="search__results__item__title__count">
                        ({item.count})
                    </div>
                </div>

                <div className="search__results__item__cta">
                    <span className="btn btn-sm btn-outline-primary">
                        Select
                    </span>
                </div>
            </li>
        );
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
            <div className="search__results__category" key={category}>
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
            <div className="search" ref={node => (this.node = node)}>
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
