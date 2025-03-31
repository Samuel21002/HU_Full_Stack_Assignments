const CountryDetails = ({info}) => {

    const style = {
        flag: {
            border:'1px solid black',
            maxWidth: 300,
            maxHeight: 200
        }
    }

    if (info.name) {
    return(
        <div>
            <h1>{info.name}</h1>
            <p>Capital: {info.capital}</p>
            <p>Area: {info.area}</p><br/>
            <h2>Languages</h2>
            <ul>
                {Object.entries(info.languages).map(([key, value]) => (
                    <li key={key}>{key}: {JSON.stringify(value)}</li>
                ))}
            </ul>
            <img style={style.flag} src={info.flag}/>
        </div>
    )
    } else {
        return null
    }
}

export default CountryDetails