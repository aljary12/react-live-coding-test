import "./App.css";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import Modal from "react-modal";

function PokeDex() {
	const [pagination, setPagination] = useState('')
  const [filter, setFilter] = useState('');
  const [pokemons, setPokemons] = useState([]);
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
	const [sortAscending, setSortAscending] = useState(true)

	const sort = () => {
		const newPokemons = [...pokemons]
		if (sortAscending) {
			newPokemons.sort((a, b) => a.name > b.name ? 1 : -1)
		} else {
			newPokemons.sort((a, b) => a.name > b.name ? -1 : 1)
		}
		setPokemons(newPokemons);
		setSortAscending(!sortAscending)
	} 

	useEffect(() => {
		axios.get('https://pokeapi.co/api/v2/pokemon').then((req) => {
			setPokemons(req.data.results)
			setPagination(req.data.next)
		})
	}, [])

	const getDetails = (url) => {
		axios.get(url).then((req) => {
			setPokemonDetail(req.data)
		})
	}

	const getMorePokemon = () => {
		axios.get(pagination).then((req) => {
			setPokemons(pokemons => [...pokemons, ...req.data.results])
			setPagination(req.data.next)
		})
	}

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      background: "black",
      color: "white",
    },
    overlay: { backgroundColor: "grey" },
  };

  if (!isLoading && pokemons.length === 0) {
    return (
      <div>
        <header className="App-header">
          <h1>Welcome to pokedex !</h1>
          <h2>Requirement:</h2>
          <ul>
            <li>
              Call this api:https://pokeapi.co/api/v2/pokemon to get pokedex, and show a list of pokemon name.
            </li>
            <li>Implement React Loading and show it during API call</li>
            <li>when hover on the list item , change the item color to yellow.</li>
            <li>when clicked the list item, show the modal below</li>
            <li>
              Add a search bar on top of the bar for searching, search will run
              on keyup event
            </li>
            <li>Implement sorting and pagingation</li>
            <li>Commit your codes after done</li>
          </ul>
        </header>
      </div>
    );
  }

  return (
    <div>
      <header className="App-header">
        {isLoading ? (
          <>
            <div className="App">
              <header className="App-header">
                {/* <b>Implement loader here</b> */}
								<ReactLoading type='spin' color='red'/>
              </header>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome to pokedex !</h1>
            {/* <b>Implement Pokedex list here</b> */}
						<div className='pokemon-search'>
							<div className='pokemon-search-detail'>Search</div>
							<input type="text" name="name" onChange={e => setFilter(e.target.value.toLowerCase())} />
						</div>
						<button onClick={sort}>Sort</button>
						{pokemons.filter(p => p.name.includes(filter)).map((p) => (
							<div key={p.name}>
								<div onClick={() => getDetails(p.url)} className='pokemon-name'>{p.name}</div>
							</div>)
						)}
						<div onClick={() => getMorePokemon()} className='pokemon-more'>More...</div>
          </>
        )}
      </header>
      {pokemonDetail && (
        <Modal
          isOpen={pokemonDetail}
          contentLabel={pokemonDetail?.name || ""}
          onRequestClose={() => {
            setPokemonDetail(null);
          }}
          style={customStyles}
        >
          {/* <div>
            Requirement:
            <ul>
              <li>show the sprites front_default as the pokemon image</li>
              <li>
                Show the stats details - only stat.name and base_stat is
                required
              </li>
            </ul>
          </div> */}
					<div>
						<img className='pokemon-detail-img-center' src={pokemonDetail.sprites.front_default}/>
						{pokemonDetail.stats.map(stats => (<div className='pokemon-detail-list'>
							<div>{stats.stat.name}</div>
							<div>{stats.base_stat}</div>
						</div>))}
					</div>
        </Modal>
      )}
    </div>
  );
}

export default PokeDex;
