import React from 'react';

const SignUpButton = ({ onClick }) => {
  return (
    <button className="btn-box" type="button" onClick={onClick}>
      <div className="btn-standard large">Create account</div>
    </button>
  );
};

export default SignUpButton;
