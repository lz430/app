import React from 'react';
import Responsive from 'react-responsive';

export const ExtraLargeAndUp = props => (
    <Responsive {...props} minWidth={1200} />
);
export const LargeAndUp = props => <Responsive {...props} minWidth={992} />;
export const LargeAndDown = props => <Responsive {...props} maxWidth={993} />;
export const MediumAndUp = props => <Responsive {...props} minWidth={768} />;
export const MediumAndDown = props => <Responsive {...props} maxWidth={769} />;
export const SmallAndDown = props => <Responsive {...props} maxWidth={767} />;
export const SmallAndUp = props => <Responsive {...props} minWidth={576} />;
