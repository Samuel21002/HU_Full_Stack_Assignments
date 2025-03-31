const Country = ({country, showDetails}) => {

    return (
        <div>
            {country}  <button data-country={country} onClick={showDetails}>Show</button>
        </div>
    )
}

export default Country