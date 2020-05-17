import './App.css';
import React, { Component } from 'react';
import { weatherStackApiAccessKey } from './constants'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputCountry: '',
      countrySelected: null,
      countryResponse: [],
      capitalWeather: null
    }
  }

  //API call on enter country button
  handleSubmit = e => {
    e.preventDefault()

    fetch(`https://restcountries.eu/rest/v2/name/${this.state.inputCountry}`).then(res => res.json()).then(res => {
      this.setState({ countryResponse: res })
    })
  }

  //select country from the listed countries
  selectCountry = index => {
    this.setState({
      countrySelected: this.state.countryResponse[index]
    })
  }

  //get weather for the capital
  getCapitalWeather = () => {
    fetch(`http://api.weatherstack.com/current?access_key=${weatherStackApiAccessKey}&query=${this.state.countrySelected.capital}`)
      .then(res => res.json())
      .then(res => {
        this.setState({ capitalWeather: res.current })
      })
  }

  render() {
    return (
      <div className="App" >
        {this.state.countrySelected ?
          <div className="country-info">
            <img className="flag" src={this.state.countrySelected.flag} alt="flag" />
            <div>Country: {this.state.countrySelected.name}</div>
            <div>Population: {this.state.countrySelected.population}</div>
            <div>Lat & Long: {`${this.state.countrySelected.latlng[0]}, ${this.state.countrySelected.latlng[1]}`}</div>
            {this.state.capitalWeather === null ?
              <button className="clickable get-capital" onClick={() => this.getCapitalWeather()}>Capital Weather</button>
              :
              //weather information of the capital 
              <div className="weather-section">
                <b>CAPITAL WEATHER</b>
                <div>Temperature: {this.state.capitalWeather.temperature}</div>
                {this.state.capitalWeather.weather_icons.map((icon, index) => {
                  return <img className="weather-icon" src={icon} key={index} alt="weather" />
                })}
                <div>Wind Speed: {this.state.capitalWeather.wind_speed}</div>
                <div>Precipitation: {this.state.capitalWeather.precip}</div>
              </div>
            }
          </div>
          :
          //initial form to enter the country
          <form className="form">
            <input
              placeholder="Enter country"
              onChange={(e) => this.setState({ inputCountry: e.target.value })}
              className={`${this.state.countryResponse.length > 0 ? 'align-center' : ''}`} />

            {this.state.countryResponse.length > 0 && <div className="country-list-container">
              {this.state.countryResponse.map((country, index) => {
                return <div onClick={() => this.selectCountry(index)} className="clickable country-list" key={index}>{country.name}</div>
              })}
            </div>}
            {!this.state.countryResponse.length > 0 && <button className="clickable" onClick={e => this.handleSubmit(e)} disabled={this.state.inputCountry === '' ? true : false} type="submit">Submit</button>}
          </form>
        }
      </div>
    );
  }
}

export default App;