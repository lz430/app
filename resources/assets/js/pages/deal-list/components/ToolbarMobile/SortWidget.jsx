import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class SortWidget extends React.PureComponent {
    static propTypes = {
        onToggleSearchSort: PropTypes.func.isRequired,
        searchQuery: PropTypes.object.isRequired,
    };

    sorts = [
        {
            key: 'title',
            label: 'Name: A > Z',
        },
        {
            key: '-title',
            label: 'Name: Z > A',
        },
        {
            key: 'price',
            label: 'MSRP: Low > High',
        },
        {
            key: '-price',
            label: 'MSRP: High > Low',
        },
        {
            key: 'payment',
            label: 'Payment: Low > High',
        },
        {
            key: '-payment',
            label: 'Payment: High > Low',
        },
    ];

    change(sort) {
        this.props.onToggleSearchSort(sort);
    }

    renderSortButton(item) {
        return (
            <div
                onClick={() => this.props.onToggleSearchSort(item.key)}
                className={classNames('tray-select-button', {
                    active: this.props.searchQuery.sort === item.key,
                })}
            >
                {item.label}
            </div>
        );
    }

    render() {
        return (
            <div className="tray-select">
                {this.sorts.map(item => {
                    return this.renderSortButton(item);
                })}
            </div>
        );
    }
}

export default SortWidget;
