const Weather = ({location, weather}) => {
    // Early return if no data
    if (!location || Object.keys(location).length === 0 || !weather) {
        return null;
    }

    const style = {
        height: 80,
        width: 80
    }
    
    return (
        <div>
            <h1>Weather in {location.capital}</h1><br/>
            <p>Temperature: {weather.temp} Celcius</p>
            <img style={style} src={`https://openweathermap.org/img/wn/${weather.weatherIcon}.png`} alt="Weather Icon"/>
            <p>Wind: {weather.wind} m/s</p>
        </div>
    )
}

export default Weather