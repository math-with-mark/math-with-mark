import React from 'react';

import MathQuill, { addStyles as addMathQuillStyles } from 'react-mathquill';

addMathQuillStyles();

const Sandbox = () => <MathQuill latex="a^2+b^2=c^2" />;

export default Sandbox;
