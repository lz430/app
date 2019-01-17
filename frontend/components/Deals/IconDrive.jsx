import React from 'react';
import PropTypes from 'prop-types';
import FourByFourIcon from '../../static/icons/equipment/4wd-icn.svg';
import FrontWheelIcon from '../../static/icons/equipment/fwd-icn.svg';
import RearWheelIcon from '../../static/icons/equipment/rwd-icn.svg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/pro-light-svg-icons';

class IconDrive extends React.PureComponent {
    static propTypes = {
        drive: PropTypes.string.isRequired,
    };

    render() {
        const { drive } = this.props;
        switch (drive) {
            case 'Four Wheel Drive (4x4)':
            case '4WD':
                return <FourByFourIcon className="svg-inline--fa fa-w-16" />;

            case 'All Wheel Drive (AWD)':
            case 'AWD':
                return <FourByFourIcon className="svg-inline--fa fa-w-16" />;

            case 'Front Wheel Drive (FWD)':
            case 'FWD':
                return <FrontWheelIcon className="svg-inline--fa fa-w-16" />;

            case 'Rear Wheel Drive (RWD)':
            case 'RWD':
                return <RearWheelIcon className="svg-inline--fa fa-w-16" />;
        }

        return <FontAwesomeIcon icon={faCheck} />;
    }
}

export default IconDrive;
