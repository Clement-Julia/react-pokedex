import React, { useState, useEffect } from 'react';
import Card from '../layout/card';
import { useNavigate } from 'react-router-dom';
import { updatePokedex } from '../utils/pokedexUtils';

const Pokedex = () => {
    const [pokedex] = useState(JSON.parse(localStorage.getItem('pokedex')) || [])
    const [pokemonData, setPokemonData] = useState([])
    const [searchInput, setSearchInput] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate()


    const clearPokedex = () => {
        localStorage.clear()
        navigate('/')
    }

    const searchPokemonInput = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
            const data = await response.json();
            const allPokemons = data.results.map(pokemon => pokemon.name);
            const filteredPokemons = allPokemons.filter(pokemon => pokemon.toLowerCase().includes(searchInput.toLowerCase()));
            const pokemonDetails = await Promise.all(filteredPokemons.map(async (pokemonName) => {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                const data = await response.json();
                return {
                    id: data.id,
                    name: data.name,
                    type: data.types.map(typeObj => typeObj.type.name)
                };
            }));
            setPokemonData(pokemonDetails);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
        
    useEffect(() => {
        const searchPokedexPokemon = async () => {
            const data = pokedex.map(async (pokemonId) => {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
                const { id, name, types } = await response.json()
                const pokemonTypes = types.map(typeObj => typeObj.type.name)
                
                return { id, name, type: pokemonTypes }
            });
                       

            const pokedexPokemons = await Promise.all(data)
            setPokemonData(pokedexPokemons)
        }

        searchPokedexPokemon()
    }, [pokedex]);

    return (
        <div className='pokedex p-1 mt-5'>
            <h2 className='display-3 d-flex justify-content-center mb-4'>Pokédex</h2>

            <div className='d-flex flex-column align-items-center'>
                <div className='input-group w-50 mb-3'>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Rechercher un Pokémon...'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                         <button className='btn btn-outline-primary' type='button' onClick={searchPokemonInput} disabled={isLoading}>
                        {isLoading ? "Chargement..." : "Rechercher"}
                    </button>
                </div>
            </div>
            {pokemonData.length > 0 ? (
                <div className='d-flex flex-column align-items-center'>
                    <button className='btn btn-outline-danger' onClick={clearPokedex}>Vider le Pokédex</button>
                    <div className='d-flex flex-wrap justify-content-center'>
                        {pokemonData.map((pokemon) => (
                            <div key={pokemon.id} className={`${pokemonData.length === 1 ? 'col-12' : 'col-5'} my-3 mx-1`}>
                            <Card pokemon={pokemon} updateFav={updatePokedex} />
                        </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center fs-2 mt-5">Le Pokédex est vide.</p>
            )}
        </div>
    )
};

export default Pokedex;
