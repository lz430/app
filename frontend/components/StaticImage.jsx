import React from 'react';

import PropTypes from 'prop-types';
import Imgix from 'react-imgix';

import { buildStaticImageUrl } from '../util/util';

export default class StaticImage extends React.PureComponent {
    static propTypes = {
        path: PropTypes.string.isRequired,
    };

    render() {
        return (
            <Imgix
                src={buildStaticImageUrl(this.props.path)}
                imgixParams={{ auto: ['compress', 'format'] }}
                {...this.props}
            />
        );
    }
}
