import React, {useEffect, useState} from "react";
import './App.css';
import PokemonCard from "./components/PokemonCard";

function App() {
	const [allPokemon, setAllPokemon] = useState([]);
	const [loadMore, setLoadMore] = useState(
		"https://pokeapi.co/api/v2/pokemon?limit=5"
	);
	const [type, setType] = useState("all");

	const typeHandler = (e) => {
		setType(e.target.value)
		if (e.target.value === "all") {
			setLoadMore("https://pokeapi.co/api/v2/pokemon?offset=0&limit=5");
		} else {
			setLoadMore("https://pokeapi.co/api/v2/pokemon?offset=0&limit=100");
		}
		setAllPokemon([]);
	};
	
	const fetchPokemon = async () => {
		const res = await fetch(loadMore);
		const data = await res.json();
		setLoadMore(data.next);

		function createPokemonCard(result) {
			result.forEach(async (pokemon) => {
				const res = await fetch(
					`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
				);
				const data = await res.json();
				if(type !== "all" ){
					data.types.forEach(typ => {
						if(type === typ.type.name){
							setAllPokemon((currentPokemon) => [...currentPokemon, data]);
						}
					})
				} else {
					setAllPokemon((currentPokemon) => [...currentPokemon, data]);
				}
			});
		}
		createPokemonCard(data.results);
	};

	useEffect(() => {
		fetchPokemon();
	}, [type]);

	return (
		<div className="App">
			<header className="App-header">
				<h1>PokeTools</h1>
				<select onChange={typeHandler}>
					<option value="all">All</option>
					<option value="normal">Normal</option>
					<option value="fighting">Fighting</option>
					<option value="flying">Flying</option>
					<option value="poison">Poison</option>
					<option value="ground">Ground</option>
					<option value="rock">Rock</option>
					<option value="bug">Bug</option>
					<option value="ghost">Ghost</option>
					<option value="steel">Steel</option>
					<option value="fire">Fire</option>
					<option value="water">Water</option>
					<option value="grass">Grass</option>
					<option value="electric">Electric</option>
					<option value="psychic">Psychic</option>
					<option value="ice">Ice</option>
					<option value="dragon">Dragon</option>
					<option value="dark">Dark</option>
					<option value="fairy">Fairy</option>
				</select>
				<div className="pokemon-container">
					{allPokemon
						.sort((a, b) => (a.id > b.id ? 1 : -1))
						.map((pokemon) => (
							<PokemonCard
								id={pokemon.id}
								name={pokemon.name}
								image={`https://cdn.traction.one/pokedex/pokemon/${pokemon.id}.png`}
								types={pokemon.types}
								key={pokemon.id}
							/>
						))}
				</div>
				<button onClick={() => fetchPokemon()}>Load More</button>
			</header>
		</div>
	);
}

export default App;
