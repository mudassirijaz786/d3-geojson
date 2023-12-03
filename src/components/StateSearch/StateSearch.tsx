import React, { useState, useEffect, ChangeEvent } from 'react';
import us from '../../data/us.json';
import './StateSearch.scss';

interface StateSearchProps {
  onSelectState: (selectedState: string) => void;
}

const StateSearch: React.FC<StateSearchProps> = ({ onSelectState }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedState) {
      const filteredStates = us.objects.states.geometries
        .map((geometry: any) => geometry.properties.name)
        .filter((state: string) => state.toLowerCase().includes(searchTerm.toLowerCase()));

      setSuggestions(filteredStates);
    }
  }, [searchTerm, selectedState]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSelectedState(null);
  };

  const handleSelectState = (state: string) => {
    setSearchTerm(state);
    setSelectedState(state);
    onSelectState(state);
  };

  return (
    <div className="state-search">
      <input
        type="text"
        placeholder="Search for a state..."
        value={selectedState || searchTerm}
        onChange={handleInputChange}
      />
      {selectedState === null && searchTerm !== '' && (
        <ul>
          {suggestions.length > 0 ? (
            suggestions.map((state, index) => (
              <li key={index} onClick={() => handleSelectState(state)}>
                {state}
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

export default StateSearch;
