import React, { useState } from 'react';

function useField(type, def) {
  console.log(def);

  const [value, setValue] = useState(def);

  const onChange = (event) => {
    setValue(event.target.value);
  };

  return {
    type,
    value,
    onChange,
  };
}

export default useField;
