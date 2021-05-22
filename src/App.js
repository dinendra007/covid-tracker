import React,{useEffect, useState} from 'react';
import {MenuItem, FormControl, Select,Card,CardContent} from '@material-ui/core';
import './App.css';
import Infobox from './Infobox';
import Table from './Table';
import {sortData} from './util';
import LineGraph from './LineGraph';
import numeral from "numeral";

// import "leaflet/dist/leaflet.css";

function App() {

  const[countries,setCountries]=useState([]);
  const[country,setCountry]=useState("worldwide");
  const[countryInfo,setCountryInfo]=useState([]);
  const[tableData,setTableData]=useState([]);


  useEffect(()=>{
    fetch("https://api.caw.sh/v3/covid-19/all")
    .then(response=>response.json())
    .then(data=>{
      setCountryInfo(data);
    })
  },[]);

  useEffect(()=>{
    const getCountriesData= async ()=>{
      await fetch("https://corona.lmao.ninja/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries=data.map((country)=>({
          name:country.country,
          value:country.countryInfo.iso2,
        }));
        const sortedData=sortData(data);
        setTableData(sortedData);
        setCountries(countries);
      });
    };
    getCountriesData();
  },[]);

  const onCountryChange= async(event)=>{
    const countryCode=event.target.value;
    setCountry(countryCode);
    const url = countryCode==="worldwide"?"https://api.caw.sh/v3/covid-19/all"
    : `https://api.caw.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response=>response.json())
    .then((data)=>{
      setCountry(countryCode);
      setCountryInfo(data);

    })
  }

  return (
    <div className="app">
      <div className="app__left">
            <div className="app__header">
            <h1>Covid-19 Tracker</h1>
            <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country)=>(
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
              </Select>
            </FormControl>
            </div>
            <div className="app__stats">
              <Infobox title="Covid-19 Cases"  cases={countryInfo.todayCases} total={countryInfo.cases}/>
              <Infobox title="Covid-19 Recoveries" cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
              <Infobox title="Covid-19 Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
            </div>
            <h1>Worldwide New Cases</h1>
          <LineGraph/>
          <h3>Developed for Espherus Technologies by dinendra007</h3>
      </div>
      
      
      
      <Card className="app__right">
        <CardContent>
          <h1>Live Cases By Country</h1>
          <Table countries={tableData}/>
          
        </CardContent>
      </Card>
     
    </div>
  );
}

export default App;
