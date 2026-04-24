import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemons, setPokemons] = useState ([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const showPokemonDetails = async (pokemon) => {
    console.log('Clicou em:', pokemon.name);
    try {
      const response = await fetch(pokemon.url);
      const details = await response.json();
      setSelectedPokemon(details);
    } catch (error) {
      console.error('Erro', error);
    }
  };


  useEffect (() => {
     fetch("https://pokeapi.co/api/v2/pokemon?limit=721")
      .then(res => {
        if (!res.ok) throw new Error('Erro na API');
        return res.json();
      })
      .then(data => {
        setPokemons(data.results);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const [search, setSearch] = useState("");
  const filteredPokemons = pokemons.filter((pokemon) =>
  pokemon.name.toLowerCase().includes(search.toLowerCase())
);

if(loading) return <div className="Loading">Carregando os Pokemon...</div>
if(error) return <div className="error">❌{error}</div>

  return (
  <div className="App">
    <h1>Pokedex</h1>

    <div className="pokemon-container">
      <input
  type="text"
  placeholder="Buscar pokemon..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

      {filteredPokemons.map((pokemon) => {
        const id = pokemon.url.split("/")[6];

        return (
          <div 
  className="card" key={pokemon.name}
  onClick={() => showPokemonDetails(pokemon)}
>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
              alt={pokemon.name}
            />
            <p>{pokemon.name}</p>
          </div>
        );
      })}

    {selectedPokemon && (
  <div className='modal-overlay' onClick={() => setSelectedPokemon(null)}>
    <div className='modal-content' onClick={(e) => e.stopPropagation()}>
      <h2>{selectedPokemon.name}</h2>
      
      <img 
        src={selectedPokemon.sprites.front_default}
        alt={selectedPokemon.name}
        style={{width: '150px', height: '150px'}}
      />
      
      <div className="stats">
        <p><strong>HP:</strong> {selectedPokemon.stats[0].base_stat}</p>
        <p><strong>Ataque:</strong> {selectedPokemon.stats[1].base_stat}</p>
        <p><strong>Defesa:</strong> {selectedPokemon.stats[2].base_stat}</p>
        <p><strong>Velocidade:</strong> {selectedPokemon.stats[5].base_stat}</p>
      </div>
      
      <div className="types">
        {selectedPokemon.types.map((type, index) => (
          <span key={index} className={`type ${type.type.name}`}>
            {type.type.name}
          </span>
        ))}
      </div>
      
      <button onClick={() => setSelectedPokemon(null)}>Fechar</button>
    </div>
  </div>
)}
</div>

</div>
);
}


export default App;
