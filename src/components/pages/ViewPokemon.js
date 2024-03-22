import React, { useState, useEffect } from "react"
import { Link, useParams, useSearchParams } from 'react-router-dom'
import axios from "axios"

const ViewPokemon = () => {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState({id: 0, name:"", type:[], stats:{pv:0, attaque:0, defense:0, att_spe:0, def_spe:0, speed:0}});
    const [loading, setLoading] = useState(true);

    // Recherche de l'objet de projet correspondant à l'ID
    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
                setPokemon({
                    id: response.data.id,
                    name: response.data.name.charAt(0).toUpperCase() + response.data.name.slice(1),
                    type: response.data.types.map(typeInfo => typeInfo.type.name),
                    stats: {
                        pv: response.data.stats.find(stat => stat.stat.name === 'hp').base_stat,
                        attaque: response.data.stats.find(stat => stat.stat.name === 'attack').base_stat,
                        defense: response.data.stats.find(stat => stat.stat.name === 'defense').base_stat,
                        att_spe: response.data.stats.find(stat => stat.stat.name === 'special-attack').base_stat,
                        def_spe: response.data.stats.find(stat => stat.stat.name === 'special-defense').base_stat,
                        speed: response.data.stats.find(stat => stat.stat.name === 'speed').base_stat
                    },
                });
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        })();
    }, []);

    if (pokemon.id == 0) {
        return <div className='text-center mt-5 titre'>Pokémon non trouvé</div>;
    }
    
    var idPokemon = id
    if (id > 10 & id < 100) {
        idPokemon = '0' + idPokemon
    }
    if (id < 10) {
        idPokemon = '00' + idPokemon
    }

    var lien = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/" + idPokemon + ".png";
    var backColor = "type-" + (pokemon.type ? pokemon.type[0].toLowerCase() : "normal")
    var cardClass = "card cardPokemon p-4 " + backColor

    return (
        <div className='container d-flex justify-content-center my-4'>
            {loading ? (
                <div className="d-flex justify-content-center">
                    <span className="loader"></span>
                </div>
            ) : pokemon ? (
                <div className={cardClass}>
                    <div className='cardHeader'>
                        <div className='nomPokemon me-5'>{pokemon.name}</div>
                        <div className='pv'><span className="petit me-2">PV</span>{pokemon.stats.pv}</div>
                    </div>
                    <div className='cardImg'>
                        <img className='imgPokemon' src={lien}></img>
                    </div>
                    <div className='hrPerso'></div>
                    <div className='cardFooter'>
                        <div className='typePokemon'>{pokemon.type.join(', ')}</div>
                        <div className="statsPokemon mt-3 mb-2">
                            <div>Attaque : {pokemon.stats.attaque}</div>
                            <div>Défense : {pokemon.stats.defense}</div>
                            <div>Att Spé : {pokemon.stats.att_spe}</div>
                            <div>Déf Spé : {pokemon.stats.def_spe}</div>
                        </div>
                        <div className='vitessePokemon'>Vitesse : {pokemon.stats.speed}</div>
                    </div>
                </div>
            ) : (
                <p>No pokemons found</p>
            )}
        </div>
    );
};

export default ViewPokemon;