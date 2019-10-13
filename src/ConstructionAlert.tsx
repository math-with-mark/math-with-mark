import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

const ConstructionAlert = (): JSX.Element => {
  const [show, setShow] = useState(true);

  return show ? (
    <Alert variant="primary" onClose={() => setShow(false)} dismissible>
      This site is under construction.
    </Alert>
  ) : (
    <></>
  );
};

export default ConstructionAlert;
