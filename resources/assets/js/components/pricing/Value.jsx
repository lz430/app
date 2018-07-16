import React from 'react';
import miscicons from 'miscicons';
import SVGInline from 'react-svg-inline';

export default class Value extends React.PureComponent {
    static defaultProps = {
        showIf: true,
        isNegative: false,
        isLoading: false,
    };

    render() {
        if (!this.props.showIf) {
            return <div />;
        }

        const style = { float: 'right' };

        if (this.props.isNegative) {
            style.color = '#41b1ac';
        }

        return (
            <div style={style}>
                {this.props.isLoading && (
                    <div data-loading-size="regular">
                        <SVGInline
                            style={{ height: '.5em' }}
                            svg={miscicons['loading']}
                        />
                    </div>
                )}
                {this.props.isLoading || (
                    <div>
                        {this.props.isNegative ? '-' : ''}
                        {this.props.children}
                    </div>
                )}
            </div>
        );
    }
}
