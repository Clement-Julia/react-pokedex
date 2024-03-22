import React, { useState, useEffect } from 'react';
import Card from '../layout/card';
import { useNavigate } from 'react-router-dom';
import { updatePokedex } from '../utils/pokedexUtils';

const Pokedex = () => {
    const [pokedex, setPokedex] = useState(JSON.parse(localStorage.getItem('pokedex')) || [])
    const [pokemonData, setPokemonData] = useState([])
    const [searchInput, setSearchInput] = useState('');
    const navigate = useNavigate()


    const clearPokedex = () => {
        localStorage.clear()
        navigate('/')
    }

    const handleSearch = async () => {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=2000');
        const data = await response.json()
        const allPokemons = data.results.map(pokemon => pokemon.name)
        const filteredPokemons = allPokemons.filter(pokemon => pokemon.toLowerCase().includes(searchInput.toLowerCase()))
        const pokemonDetails = await Promise.all(filteredPokemons.map(async (pokemonName) => {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
            const data = await response.json()
            return {
                id: data.id,
                name: data.name,
                type: data.types.map(typeObj => typeObj.type.name)
            }
        }))
        setPokemonData(pokemonDetails);
    }
        
    useEffect(() => {
        const fetchData = async () => {
            const dataPromises = pokedex.map(async (pokemonId) => {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
                const { id, name, types } = await response.json()
                const pokemonTypes = types.map(typeObj => typeObj.type.name)
                
                return { id, name, type: pokemonTypes }
            });
                       

            const fetchedData = await Promise.all(dataPromises)
            setPokemonData(fetchedData)
        }

        fetchData()
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
                        <button className='btn btn-outline-primary' type='button' onClick={handleSearch}>Rechercher</button>
                </div>
            </div>
            {pokemonData.length > 0 ? (
                <div className='d-flex flex-column align-items-center'>
                    <button className='btn btn-outline-danger' onClick={clearPokedex}>Vider le Pokédex</button>
                    {pokemonData.map((pokemon) => (
                        <Card key={pokemon.id} pokemon={pokemon} updateFav={updatePokedex} />
                    ))}
                </div>
            ) : (
                <p className="text-center fs-2 mt-5">Le Pokédex est vide.</p>
            )}
        </div>
    )
};

export default Pokedex;
