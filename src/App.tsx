import React, { useState } from 'react';
import StateSearch from './components/StateSearch/StateSearch';
import StateMap from './components/StateMap/StateMap';
import './App.scss';
import Typography from './components/Typography/Typography';
import CountySearch from './components/CountySearch/CountySearch';

const YourMainComponent: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCounty, setSelectedCounty] = useState<string>('');

  const handleSelectState = (state: string) => {
    setSelectedState(state);
  };

  const handleSelectCounty = (county: string) => {
    setSelectedCounty(county);
  }

  return (
    <div className="main-container">
      <div className='title'>
        {selectedState && (
          <Typography variant="h1">Showing {selectedState} {`with ${selectedCounty} county`}</Typography>
        )}
      </div>
      <div className='search-boxes'>
        <StateSearch onSelectState={handleSelectState} />
        {selectedState !== '' && (
          <CountySearch selectedState={selectedState} onSelectCounty={handleSelectCounty} />
        )}
      </div>
      <StateMap selectedState={selectedState} selectedCounty={selectedCounty}/>
    </div>
  );
};

export default YourMainComponent;
