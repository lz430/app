import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as R from 'ramda';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import Loading from '../../../icons/miscicons/Loading';

import { filterItemType } from '../../../core/types';

class ModalMakeSelector extends React.PureComponent {
    static propTypes = {
        toggle: PropTypes.func.isRequired,
        isOpen: PropTypes.bool,
        makes: PropTypes.arrayOf(filterItemType),
        selectedFiltersByCategory: PropTypes.object.isRequired,
        fallbackLogoImage: PropTypes.string.isRequired,
        onToggleSearchFilter: PropTypes.func.isRequired,
    };

    static defaultProps = {
        isOpen: false,
    };

    logoMissing() {
        return R.has('icon') && R.propEq('icon', '');
    }

    getLogoFor(make) {
        return R.ifElse(
            this.logoMissing(make),
            () => this.props.fallbackLogoImage,
            R.prop('icon')
        ).bind(this)(make);
    }

    renderMake(make) {
        const selected =
            this.props.selectedFiltersByCategory &&
            this.props.selectedFiltersByCategory.make &&
            R.contains(make.value, this.props.selectedFiltersByCategory.make);

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
