import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import CheveronUp from '../../../../icons/zondicons/cheveron-up.svg';
import CheveronDown from '../../../../icons/zondicons/cheveron-down.svg';

class SidebarFilter extends React.PureComponent {
    static propTypes = {
        open: PropTypes.bool.isRequired,
        toggle: PropTypes.func.isRequired,
        title: PropTypes.string.isRequired,
        children: PropTypes.object.isRequired,
        selectedItems: PropTypes.array,
        canToggle: PropTypes.bool,
    };

    static defaultProps = {
        canToggle: true,
    };

    renderIcon() {
        if (this.props.open) {
            return <CheveronUp className="icon" />;
        }

        return <CheveronDown className="icon" />;
    }

    render() {
        return (
            <div
                className={classNames(
                    'filter',
                    { open: this.props.open },
                    { toggleable: this.props.canToggle }
                )}
            >
                <div
                    className="filter__title"
                    onClick={
                        this.props.canToggle ? this.props.toggle : () => {}
                    }
                >
                    {this.props.canToggle && this.renderIcon()}
                    {this.props.title}
                    <span className="count">
                        {this.props.selectedItems
                            ? this.props.selectedItems.length
                            : 0}
                    </span>
                </div>

                {this.props.open ? (
                    <div className="filter__content">{this.props.children}</div>
                ) : (
                    ''
                )}
            </div>
        );
    }
}

export default SidebarFilter;
