const Persons = ({contact, deleteButton}) => {
    return(
      <>
      <li>{contact.name} {contact.number}</li><button data-id={contact.id} onClick={deleteButton}>Remove</button>
      </>
    )
}

export default Persons