import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

function ConstructionAlert() {
  const [show, setShow] = useState(true);

  if (show) {
    return (
      <Alert variant="primary" onClose={() => setShow(false)} dismissible>
        This site is under construction.
      </Alert>
    );
  }
  return '';
}

export default ConstructionAlert;
