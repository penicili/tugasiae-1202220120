import React, { useState, useEffect } from 'react';

const App = () => {
  const [pokemon, setPokemon] = useState(null);
  const [pokemonId, setPokemonId] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shiny, setShiny] = useState(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }
        
        const data = await response.json();
        setPokemon(data);
      } catch (err) {
        setError(`Error: ${err.message}`);
        setPokemon(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonId]);

  const handlePrevious = () => {
    setPokemonId(current => current > 1 ? current - 1 : 1);
  };

  const handleNext = () => {
    setPokemonId(current => current + 1);
  };

  const handleRandom = () => {
    const randomId = Math.floor(Math.random() * 898) + 1;
    setPokemonId(randomId);
  };

  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setPokemonId(value);
    }
  };

  const handleShiny = () => {
    setShiny(!shiny);
    console.log(shiny);
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-green-400 rounded-lg shadow-lg">
      {/* <h1 className="text-2xl font-bold text-center mb-6">Pokémon Viewer</h1> */}
      <img src="images.png" alt="pokemon logo" />
      
      <div className="mb-4 flex items-center justify-center space-x-2">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" 
          onClick={handlePrevious}
          disabled={loading || pokemonId <= 1}
        >
          Previous
        </button>
        
        <input
          type="number"
          value={pokemonId}
          onChange={handleInputChange}
          className="w-16 text-center border rounded py-2"
          min={0}
        />
        
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors" 
          onClick={handleNext}
          disabled={loading}
        >
          Next
        </button>
        
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          onClick={handleRandom}
          disabled={loading}
        >
          Random
        </button>
        <button className={`px-4 py-2 rounded  transition-colors ${shiny ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "bg-grey-500 hover:bg-grey-600 border border-black text-black"}`} onClick={handleShiny}>
          Shiny
        </button>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : pokemon ? (
          <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold capitalize mb-2">
              #{pokemon.id}: {pokemon.name}
            </h2>
            
              <img 
                src={shiny ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemonId}.png` :`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                alt={pokemon.name} 
                className="w-32 h-32 object-contain mb-4"
              />
            
            <div className="flex space-x-2 mb-4">
              {pokemon.types.map(typeInfo => (
                <span 
                  key={typeInfo.type.name}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm capitalize"
                >
                  {typeInfo.type.name}
                </span>
              ))}
            </div>
            
            <div className="w-full">
              <h3 className="font-medium mb-2">Base Stats:</h3>
              {pokemon.stats.map(stat => (
                <div key={stat.stat.name} className="mb-2">
                  <div className="flex justify-between text-sm capitalize mb-1">
                    <span>{stat.stat.name}</span>
                    <span>{stat.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${shiny ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">No Pokemon data available</div>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500">
        Data from <a href="https://pokeapi.co" className="text-blue-500 hover:underline">PokéAPI</a>
      </div>
    </div>
  );
};

export default App;