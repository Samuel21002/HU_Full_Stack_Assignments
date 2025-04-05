const Form = ({ 
    newName, 
    newPhoneNr, 
    onNameChange, 
    onPhoneChange, 
    onSubmit, 
    phoneRegex 
  }) => {
    return (
      <form onSubmit={onSubmit}>
        <div>
          name: <input value={newName} onChange={onNameChange} />
        </div>
        <div>
          number: <input 
            type="tel" 
            value={newPhoneNr} 
            onChange={onPhoneChange} 
            pattern={phoneRegex} 
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    );
  };
  
  export default Form;