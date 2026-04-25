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
  const [currentPage, setCurrentPage] = useState(1);
  const pokemonsPerPage = 29;
  const [darkMode, setDarkMode] = useState(false);
  const [activeRegion, setActiveRegion] = useState('all');


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

  useEffect(() => {
    if (darkMode) {
     document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const [search, setSearch] = useState("");

const getRegion = (id) => {
  if (id <= 151) return 'kanto';
  if (id <= 251) return 'johto';
  if (id <= 386) return 'hoenn';
  if (id <= 493) return 'sinnoh';
  if (id <= 649) return 'unova';
  if (id <= 721) return 'kalos';
  return 'all';
};

const regionFiltered = activeRegion === 'all' 
  ? pokemons 
  : pokemons.filter(p => {
      const id = p.url.split("/")[6];
      return getRegion(id) === activeRegion;
    });

const filteredPokemons = regionFiltered.filter(pokemon =>
  pokemon.name.toLowerCase().includes(search.toLowerCase())
);

const indexOfLastPokemon = currentPage * pokemonsPerPage;
const currentPokemons = filteredPokemons.slice(0, indexOfLastPokemon);

if(loading) return <div className="Loading">Carregando os Pokemon...</div>
if(error) return <div className="error">X{error}</div>

  return (
  <div className="App">
    <h1>Pokedex</h1>

    <div className="regions">
  <button 
    className={activeRegion === 'all' ? 'active' : ''} 
    onClick={() => setActiveRegion('all')}
  >
    All ({pokemons.length})
  </button>
  <button 
    className={activeRegion === 'kanto' ? 'active' : ''} 
    onClick={() => setActiveRegion('kanto')}
  >
    Kanto (1-151)
  </button>
  <button 
    className={activeRegion === 'johto' ? 'active' : ''} 
    onClick={() => setActiveRegion('johto')}
  >
    Johto (152-251)
  </button>
  <button 
    className={activeRegion === 'hoenn' ? 'active' : ''} 
    onClick={() => setActiveRegion('hoenn')}
  >
    Hoenn (252-386)
  </button>
  <button 
    className={activeRegion === 'sinnoh' ? 'active' : ''} 
    onClick={() => setActiveRegion('sinnoh')}
  >
    Sinnoh (387-493)
  </button>
  <button 
    className={activeRegion === 'unova' ? 'active' : ''} 
    onClick={() => setActiveRegion('unova')}
  >
    Unova (494-649)
  </button>
  <button 
    className={activeRegion === 'kalos' ? 'active' : ''} 
    onClick={() => setActiveRegion('kalos')}
  >
    Kalos (650-721)
  </button>
</div>

    <div className="theme-toggle">
  <button onClick={() => setDarkMode(!darkMode)}>
    {darkMode ? 'Light' : 'Dark'}
  </button>
</div>

    
    <div className="pokemon-container">
      <input
  type="text"
  placeholder="Buscar pokemon..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>

      {currentPokemons.map((pokemon) => {
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
        <p><strong>Attack:</strong> {selectedPokemon.stats[1].base_stat}</p>
        <p><strong>Defense:</strong> {selectedPokemon.stats[2].base_stat}</p>
        <p><strong>Speed:</strong> {selectedPokemon.stats[5].base_stat}</p>
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

 <div className="pagination">
    <button
      onClick={() => setCurrentPage(currentPage - 1)}
      disabled={currentPage === 1}>
        Anterior
    </button>
    <span>Página {currentPage} | {Math.ceil(filteredPokemons.length / pokemonsPerPage)}</span>
    <button
       onClick={() => setCurrentPage(currentPage + 1)}
       disabled={currentPokemons.length < pokemonsPerPage}
    >
        Próxima
    </button>
  </div>

</div>
);
}


export default App;
