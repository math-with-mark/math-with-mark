import React from 'react';
import ReactDOM from 'react-dom';
import Latex from './Latex';

it('should render without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <>
      <Latex inline content="a^ + b^2 = c^2" />
      <Latex content="a^2 + b^2 = c^2" />
    </>,
    div,
  );
});
