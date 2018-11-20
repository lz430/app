import React from 'react';
import PropTypes from 'prop-types';
import { dealType } from '../../../core/types';
import classNames from 'classnames';
import { contains, map, prop } from 'ramda';

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType,
        compareList: PropTypes.array,
        onToggleCompare: PropTypes.func.isRequired,
    };

    compareButtonClass() {
        const isActive = this.compareListContainsDeal();

        return classNames(
            'btn',
            { 'btn-outline-primary': isActive },
            { 'btn-primary': !isActive }
        );
    }

    compareListContainsDeal() {
        return contains(
            this.props.deal,
            map(prop('deal'), this.props.compareList)
        );
    }

    render() {
        return (
            <button
                className={this.compareButtonClass(this.props.deal)}
                onClick={() => this.props.onToggleCompare(this.props.deal)}
            >
                {this.compareListContainsDeal(this.props.deal)
                    ? 'Remove from compare'
                    : 'Add to compare'}
            </button>
        );
    }
}
