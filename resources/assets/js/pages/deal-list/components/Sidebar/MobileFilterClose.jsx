import React from 'react';
import PropTypes from 'prop-types';

class MobileFilterClose extends React.PureComponent {
    static propTypes = {
        onToggleOpen: PropTypes.func.isRequired,
    };

    render() {
        return (
            <div className="filter-close">
                <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => this.props.onToggleOpen('filter')}
                >
                    Done
                </button>
            </div>
        );
    }
}

export default MobileFilterClose;
