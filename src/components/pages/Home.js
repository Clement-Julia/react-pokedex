import React, { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from 'react-router-dom'
import axios from "axios"

import chari from "../../assets/img/charizard.svg"
import pika from "../../assets/img/pika.svg"
import poke from "../../assets/img/pokeball.svg"
import Card from '../layout/card'
import '../../assets/style/card.css'
import { updatePokedex } from '../utils/pokedexUtils';

const Home = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [pokemons, setPokemons] = useState([]);
    const [originalPokemons, setOriginalPokemons] = useState([]);
    const [offset, setOffset] = useState(152);
    const [limit, setLimit] = useState(50);
    const [fetchStatus, setFecthStatus] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [loading, setLoading] = useState(true);
    let searchQuery = searchParams.get("query");
    
    
    useEffect(() => {
        axios
            .get('https://pokeapi.co/api/v2/pokemon', {
                params: {
                    offset: 0,
                    limit: searchQuery ? 1500 : 151
                }
            })
            .then((response) => {
                const promises = response.data.results.map(pokemon => {
                    return axios.get(pokemon.url)
                });
    
                Promise.all(promises).then(pokemonResponses => {
                    const pokemons = pokemonResponses.reduce((filteredPokemons, pokemonResponse) => {
                        if(!searchQuery || pokemonResponse.data.name.toLocaleLowerCase().includes(searchQuery)){
                            filteredPokemons.push({
                                id: pokemonResponse.data.id,
                                name: pokemonResponse.data.name.charAt(0).toUpperCase() + pokemonResponse.data.name.slice(1),
                                type: pokemonResponse.data.types.map(type => type.type.name)
                            })
                        }
                        return filteredPokemons;
                    }, []);

                    setPokemons(pokemons);
                    setOriginalPokemons(pokemons);
                    setLoading(false);
                });
            })
            .catch((error) => {
                console.error(error)
                setLoading(false)
            });
    }, []);

    useEffect(() => {
        const filteredPokemons = originalPokemons.filter(pokemon => pokemon.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()));
        setPokemons(filteredPokemons);
    }, [search, originalPokemons]);

    const fetchMorePokemons = () => {
        if (isFetching) return;
        setIsFetching(true);
        setFecthStatus(true);
        axios
        .get('https://pokeapi.co/api/v2/pokemon', {
            params: {
                offset: offset,
                limit: limit
            }
        })
        .then((response) => {
            const promises = response.data.results.map(pokemon => {
                return axios.get(pokemon.url)
            });

            Promise.all(promises).then(pokemonResponses => {
                const newPokemons = pokemonResponses.reduce((filteredPokemons, pokemonResponse) => {
                    if(!searchQuery || pokemonResponse.data.name.toLocaleLowerCase().includes(searchQuery)){
                        filteredPokemons.push({
                            id: pokemonResponse.data.id,
                            name: pokemonResponse.data.name.charAt(0).toUpperCase() + pokemonResponse.data.name.slice(1),
                            type: pokemonResponse.data.types.map(type => type.type.name)
                        });
                    }
                    return filteredPokemons
                }, []);

                setPokemons(prevPokemons => [...prevPokemons, ...newPokemons])
                setOffset(offset + 50)
                setIsFetching(false);
            });
        })
        .catch((error) => {
            console.error(error);
            setIsFetching(false);
        });
    }

    const fetchAllPokemons = async () => {
        if (isFetching) return;
        setIsFetching(true);
        setFecthStatus(true);
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
                    if(!searchQuery || pokemonResponse.data.name.toLocaleLowerCase().includes(searchQuery)){
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
                setIsFetching(false);
            });
        })
        .catch((error) => {
            console.error(error);
            setIsFetching(false);
        });
    }

    console.log(offset)
    console.log(limit)
    console.log(searchQuery)

    return (
        <div className='px-1 py-1 mt-5'>
            <h1 className='display-2 d-flex justify-content-center mb-4'>Liste des pokémons</h1>
            <div className='row w-100 ms-0'>
                <div className="d-flex justify-content-center">
                    <input className="form-control w-25" type="text" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} />
                </div>
                {loading ? (
                    <div className="d-flex justify-content-center">
                        <span className="loader"></span>
                    </div>
                ) : pokemons.length > 0 ? (
                    <>
                        {pokemons.map((pokemon) => {
                            return <div key={pokemon.id} className='col-3 my-3'><Card pokemon={pokemon} updateFav={updatePokedex} /></div>
                        })}
                        { (limit > 0) && !searchQuery ? (
                            <div className="d-flex justify-content-center my-2">
                                {fetchStatus ?
                                    <span className="loader"></span>
                                : 
                                <>
                                    <button className="btn-pika" onClick={fetchMorePokemons}>
                                        <img src={poke} alt="" className="pokeball" />
                                        <img src={pika} alt="" className="pika" />
                                        <span className="go">50 more!</span>
                                        <span className="pword">pika</span>
                                        <span className="pword2">pika</span>
                                    </button>
                                    <button className="btn-pika ms-2" onClick={fetchAllPokemons}>
                                        <img src={poke} alt="" className="pokeball" />
                                        <img src={chari} alt="" className="chari" />
                                        <span className="go All">All!</span>
                                        <span className="pword">draco</span>
                                        <span className="pword2">draco</span>
                                    </button>
                                </>
                                }
                            </div>
                        ) : null }
                    </>
                ) : (
                    <p>No pokemons found</p>
                )}
            </div>
        </div>
    )
}

export default Home
