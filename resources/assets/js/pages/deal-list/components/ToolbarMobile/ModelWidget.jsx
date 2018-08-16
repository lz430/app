import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class ModelWidget extends React.PureComponent {
    static propTypes = {
        selectedFiltersByCategory: PropTypes.object.isRequired,
        onClearModelYear: PropTypes.func.isRequired,
        setActiveTab: PropTypes.func.isRequired,
    };

    onChange() {
        this.props.onClearModelYear();
        this.props.setActiveTab(null);
    }

    render() {
        console.log(this.props.selectedFiltersByCategory);
        return (
            <div className="tray-widget">
                <div className="tray-widget-content">
                    <div className="bubble">
                        <strong>Make:</strong>{' '}
                        {this.props.selectedFiltersByCategory['make'][0]} <br />
                    </div>
                    <div className="bubble">
                        <strong>Model:</strong>{' '}
                        {this.props.selectedFiltersByCategory['model'][0]}{' '}
                        <br />
                    </div>
                </div>
                <div
                    onClick={() => this.onChange()}
                    className="tray-widget-action"
                >
                    &lt; Change
                </div>
            </div>
        );
    }
}

export default ModelWidget;
