import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { ifElse, prop, has, contains, propEq } from 'ramda';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Loading from '../../../components/Loading';

import { filterItemType } from '../../../core/types';

class ModalMakeSelector extends React.PureComponent {
    static propTypes = {
        toggle: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
        makes: PropTypes.arrayOf(filterItemType),
        selectedFiltersByCategory: PropTypes.object.isRequired,
        onToggleSearchFilter: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isOpen: false,
    };

    logoMissing() {
        return has('icon') && propEq('icon', '');
    }

    getLogoFor(make) {
        return ifElse(
            this.logoMissing(make),
            () => '/static/images/dmr-logo-small.svg',
            prop('icon')
        ).bind(this)(make);
    }

    renderMake(make) {
        const selected =
            this.props.selectedFiltersByCategory &&
            this.props.selectedFiltersByCategory.make &&
            contains(make.value, this.props.selectedFiltersByCategory.make);

        return (
            <div
                className={classNames('make-selector__make', {
                    'make-selector__make--selected': selected,
                })}
                onClick={() => this.props.onToggleSearchFilter(make)}
                key={make.value}
            >
                <img alt={make.value} src={this.getLogoFor(make)} />
                <div className="make-selector__make-name">{make.label}</div>
            </div>
        );
    }

    render() {
        return (
            <Modal
                size="full"
                isOpen={this.props.isOpen || false}
                toggle={this.props.toggle}
            >
                <ModalHeader toggle={this.props.toggle}>
                    SELECT ONE OR MORE BRANDS TO COMPARE
                </ModalHeader>
                <ModalBody>
                    <div className="make-selector">
                        <div className="make-selector__makes">
                            {this.props.makes ? (
                                this.props.makes.map(make =>
                                    this.renderMake(make)
                                )
                            ) : (
                                <Loading />
                            )}
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.props.toggle}>
                        Show available vehicles
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalMakeSelector;
