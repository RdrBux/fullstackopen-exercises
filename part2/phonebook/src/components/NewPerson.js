import React from 'react';

const NewPerson = ({
  name,
  changeName,
  number,
  changeNumber,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input type="text" value={name} onChange={changeName} />
      </div>
      <div>
        number: <input type="text" value={number} onChange={changeNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default NewPerson;
