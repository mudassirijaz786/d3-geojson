import React, { useState, useEffect, ChangeEvent } from 'react';
import './CountySearch.scss';
import counties from '../../data/counties.json';

interface CountySearchProps {
  selectedState: string;
  onSelectCounty: (selectedCounty: string) => void;
}

const CountySearch: React.FC<CountySearchProps> = ({ selectedState, onSelectCounty }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [countySuggestions, setCountySuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedCounty) {
      const citiesInSelectedState = (counties as Record<string, string[]>)[selectedState] || [];
      const filteredCities = citiesInSelectedState
        .filter((city: string) => city.toLowerCase().includes(searchTerm.toLowerCase()));

      // compare the filteredCities with 
      setCountySuggestions(filteredCities);
    }
  }, [searchTerm, selectedCounty, selectedState]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSelectedCounty(null);
  };

  const handleSelectCounty = (county: string) => {
    setSearchTerm(county);
    setSelectedCounty(county);
    onSelectCounty(county);
  };

  return (
    <div className="county-search">
      <input
        type="text"
        placeholder={`Search for counties in ${selectedState}...`}
        value={selectedCounty || searchTerm}
        onChange={handleInputChange}
      />
      {selectedCounty === null && searchTerm !== '' && (
        <ul>
          {countySuggestions.length > 0 ? (
            countySuggestions.map((county, index) => (
              <li key={index} onClick={() => handleSelectCounty(county)}>
                {county}
              </li>
            ))
          ) : (
            <li>No Results Found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CountySearch;
