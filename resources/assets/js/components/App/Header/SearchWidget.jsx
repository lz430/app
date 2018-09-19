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

    render() {
        if (this.props.currentPageIsInCheckout) {
            return false;
        }

        return (
            <div>
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
        );
    }
}

export default SearchWidget;
