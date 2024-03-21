import React, { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from 'react-router-dom'
import axios from "axios"

import Card from '../layout/card'
import '../../assets/style/card.css'

const Home = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [pokemons, setPokemons] = useState([]);
    const [offset, setOffset] = useState(152);
    const [limit, setLimit] = useState(50);
    let test = searchParams.get("query");
    
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get('https://pokeapi.co/api/v2/pokemon', {
                params: {
                    offset: 0,
                    limit: test ? 1500 : 151
                }
            })
            .then((response) => {
                const promises = response.data.results.map(pokemon => {
                    return axios.get(pokemon.url);
                });
    
                Promise.all(promises).then(pokemonResponses => {
                    const pokemons = pokemonResponses.reduce((filteredPokemons, pokemonResponse) => {
                        if(!test || pokemonResponse.data.name.toLocaleLowerCase().includes(test)){
                            filteredPokemons.push({
                                id: pokemonResponse.data.id,
                                name: pokemonResponse.data.name.charAt(0).toUpperCase() + pokemonResponse.data.name.slice(1),
                                type: pokemonResponse.data.types.map(type => type.type.name)
                            });
                        }
                        return filteredPokemons;
                    }, []);

                    setPokemons(pokemons);
                    setLoading(false);
                });
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    const fetchMorePokemons = () => {
        axios
        .get('https://pokeapi.co/api/v2/pokemon', {
            params: {
                offset: offset,
                limit: limit
            }
        })
        .then((response) => {
            const promises = response.data.results.map(pokemon => {
                return axios.get(pokemon.url);
            });

            Promise.all(promises).then(pokemonResponses => {
                const newPokemons = pokemonResponses.reduce((filteredPokemons, pokemonResponse) => {
                    if(!test || pokemonResponse.data.name.toLocaleLowerCase().includes(test)){
                        filteredPokemons.push({
                            id: pokemonResponse.data.id,
                            name: pokemonResponse.data.name.charAt(0).toUpperCase() + pokemonResponse.data.name.slice(1),
                            type: pokemonResponse.data.types.map(type => type.type.name)
                        });
                    }
                    return filteredPokemons;
                }, []);

                setPokemons(prevPokemons => [...prevPokemons, ...newPokemons]);
                setOffset(offset + 50);
            });
        })
        .catch((error) => {
            console.error(error);
        });
    }

    const fetchAllPokemons = async () => {
        axios
        .get('https://pokeapi.co/api/v2/pokemon', {
            params: {
                offset: offset,
                limit: 1510
            }
        })
        .then((response) => {
            const promises = response.data.results.map(pokemon => {
                return axios.get(pokemon.url);
            });

            Promise.all(promises).then(pokemonResponses => {
                const newPokemons = pokemonResponses.reduce((filteredPokemons, pokemonResponse) => {
                    if(!test || pokemonResponse.data.name.toLocaleLowerCase().includes(test)){
                        filteredPokemons.push({
                            id: pokemonResponse.data.id,
                            name: pokemonResponse.data.name.charAt(0).toUpperCase() + pokemonResponse.data.name.slice(1),
                            type: pokemonResponse.data.types.map(type => type.type.name)
                        });
                    }
                    return filteredPokemons;
                }, []);

                setPokemons(prevPokemons => [...prevPokemons, ...newPokemons]);
                setLimit(0);
            });
        })
        .catch((error) => {
            console.error(error);
        });
    }

    return (
        <div className='px-1 py-1 mt-3'>
            <h1 className='title d-flex justify-content-center mb-4'>Liste des pokémons</h1>
            <div className='row w-100'>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <span className="loader"></span>
                    </div>
                ) : pokemons.length > 0 ? (
                    <>
                        {pokemons.map((pokemon) => {
                            return <Card key={pokemon.id} pokemon={pokemon}></Card>
                        })}
                        { (limit > 0) && !test ? (
                            <div className="d-flex justify-content-center my-2">
                                <button className="btn btn-primary me-2" onClick={fetchMorePokemons}>Show 50</button>
                                <button className="btn btn-primary" onClick={fetchAllPokemons}>Show all</button>
                            </div>
                        ) : null
                    }
                    </>
                ) : (
                    <p>No pokemons found</p>
                )}
            </div>
        </div>
    )
}

export default Home
