import React, { useState, useContext } from 'react';
import LangContext from '../../context/langContext';
const API_KEY = '5ab552ce53afe14f0a144870d38a89fb';

function Weather({ boxQuality, msg }) {

    const [weather, setWeather] = useState({});
    const [city, setCity] = useState('La Plata');
    const [spinner, setSpinner] = useState(false);

    const langCtx = useContext(LangContext);

    const getWeatherData = async () => {
        // const cityRefactor = city.replace(' ', '%20')
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        setWeather(data);
        setSpinner(false);
    }
    const getCelsiusFromKelvin = f => (f - 273).toFixed(1);

    const onSubmitHandler = e => {
        e.preventDefault();
        getWeatherData();
        setSpinner(true);
        setWeather({});
    }
    const renderWeather = () => {
        return (
            <div className="d-flex flex-column align-items-center mt-3">
                <h4>{`${weather.name}, ${weather.sys.country}`}</h4>
                <p>{langCtx === 'es' ? 'Temperatura' : 'Temperature'}: {getCelsiusFromKelvin(weather.main.temp)}°c</p>
                <p>{langCtx === 'es' ? 'Sensación Térmica' : 'Wind chill factor'}:  {getCelsiusFromKelvin(weather.main.feels_like)}°c</p>
                <p>{langCtx === 'es' ? 'Humedad' : 'Humidity'}: {weather.main.humidity}%</p>
                <p>{langCtx === 'es' ? 'Presión' : 'Pressure'}: {weather.main.pressure}hPa</p>
                <p>{langCtx === 'es' ? 'Descripción' : 'Description'}: {weather.weather[0].description}</p>
            </div>
        )
    }

    return (
        <div className={boxQuality}>
            {msg}
            <form
                className="d-flex flex-column align-items-center"
                onSubmit={onSubmitHandler}
            >
                <div className="d-flex">
                    <input
                        className="border border-secondary rounded p-2"
                        type="text "
                        value={city}
                        onChange={e => setCity(e.target.value)}
                    />
                    <input
                        className="ml-3 btn btn-primary"
                        type="submit"
                        value="Buscar"
                    />
                </div>
               
                    <div>{weather.weather ? renderWeather() : null}</div>
                
                {spinner ? <div className="spinner-grow mt-4 text-info"></div> : null}
            </form>
        </div>
    )
}


export default Weather;
