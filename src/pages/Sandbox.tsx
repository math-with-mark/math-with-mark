import React from 'react';

import { addStyles, EditableMathField } from 'react-mathquill';

addStyles();

const Sandbox = () => <EditableMathField latex="a^2+b^2=c^2" />;

export default Sandbox;
