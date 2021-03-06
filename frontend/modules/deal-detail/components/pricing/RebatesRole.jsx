import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import PropTypes from 'prop-types';
import Line from '../../../../apps/pricing/components/Line';
import Label from '../../../../apps/pricing/components/Label';

import { faInfoCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class RebatesRole extends React.Component {
    static propTypes = {
        isRoleChecked: PropTypes.bool.isRequired,
        role: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    state = {
        conditionalProgramsOpened: false,
    };

    toggleProgramDescriptionModal() {
        this.setState({
            conditionalProgramsOpened: !this.state.conditionalProgramsOpened,
        });
    }

    renderProgramExplanationModal() {
        if (!this.state.conditionalProgramsOpened) {
            return false;
        }

        return (
            <Modal
                className="rebate-description-modal"
                size="lg"
                isOpen={this.state.conditionalProgramsOpened || false}
                toggle={this.toggleProgramDescriptionModal.bind(this)}
            >
                <ModalHeader
                    toggle={this.toggleProgramDescriptionModal.bind(this)}
                >
                    Rebate Details
                </ModalHeader>
                <ModalBody>
                    <div>
                        <h4>{this.props.role.title}</h4>
                        <p style={{ color: 'red' }}>
                            Rebate Expires: {this.props.role.stopDate}
                        </p>
                        <p>Value: ${this.props.role.value}</p>
                        <div
                            className="text-sm"
                            dangerouslySetInnerHTML={{
                                __html: this.props.role.description,
                            }}
                        />
                    </div>
                </ModalBody>
            </Modal>
        );
    }

    render() {
        const { role } = this.props;
        let canUserHaveRebatePerAffinity;

        const wasRoleCancelled =
            role.isSelected === true && role.isApplied === false;

        if (wasRoleCancelled) {
            canUserHaveRebatePerAffinity = (
                <span style={{ textDecorationLine: 'line-through' }}>
                    {role.title}
                </span>
            );
        } else {
            canUserHaveRebatePerAffinity = role.title;
        }

        return (
            <div className="form-check">
                <Line>
                    <Label
                        className="form-check-label"
                        for={role['role']}
                        key={role['role']}
                        style={{ fontSize: '.9em' }}
                    >
                        <input
                            key={role['role']}
                            name="discountType"
                            value={role['role']}
                            type="checkbox"
                            className="form-check-input"
                            checked={this.props.isRoleChecked}
                            onChange={() => this.props.onChange(role)}
                            id={role['role']}
                        />
                        {canUserHaveRebatePerAffinity}
                    </Label>

                    <FontAwesomeIcon
                        icon={faInfoCircle}
                        onClick={() => this.toggleProgramDescriptionModal()}
                        className="link infomodal__button"
                        style={{
                            paddingLeft: '6px',
                            marginTop: '-10px',
                        }}
                    />
                    {this.renderProgramExplanationModal()}
                    {this.props.isRoleChecked &&
                        (canUserHaveRebatePerAffinity || role.help) && (
                            <div
                                style={{
                                    fontStyle: 'italic',
                                    fontSize: '.75em',
                                    marginLeft: '.25em',
                                }}
                            >
                                {!!role.help && role.help}{' '}
                                {!wasRoleCancelled && (
                                    <span>
                                        ($
                                        {role.value})
                                    </span>
                                )}
                            </div>
                        )}
                </Line>
            </div>
        );
    }
}

export default RebatesRole;
