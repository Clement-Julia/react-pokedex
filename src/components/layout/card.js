import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Card = ({ pokemon, updateFav }) => {
	const [isHovered, setIsHovered] = useState(false)
	const [isFavorite, setIsFavorite] = useState(false)

	const mouseEnter = () => {
		setIsHovered(true)
	}
	const mouseLeave = () => {
		setIsHovered(false)
	}
	const handleUpdateFavorite = (event) => {
		event.preventDefault();
		setIsFavorite(!isFavorite)
		updateFav(pokemon.id)
		if (window.location.pathname !== "/") {
			window.location.reload();
		}
	}

	// Gère l'affichage de l'étoile selon présence dans le pokédex
	useEffect(() => {
		const pokedex = JSON.parse(localStorage.getItem('pokedex')) || []
		setIsFavorite(pokedex.includes(pokemon.id))
	}, [pokemon.id])

	let id = pokemon.id
	let typeClass = ''

	if ((id >= 10) & (id < 100)) {
		id = '0' + id
	}
	if (id < 10) {
		id = '00' + id
	}
	
	pokemon.type.map((type, i) => {
		typeClass += ` type-${type.toLowerCase()}`
	})

	return (
		<Link className='text-decoration-none' key={pokemon.id} to={{ pathname: `/pokemon/${pokemon.id}` }}>
			<div className={`card m-1 row flex-row ${typeClass}`}>
				<div className='bg-pokeball'></div>
				<span className='pokemon-id'>{`#${id}`}</span>
				<div className='d-flex justify-content-between align-items-center'>
					<h2>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h2>
					<div onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>
						{isFavorite || isHovered ? (
							<i className="fa-solid fa-star fav" onClick={handleUpdateFavorite}></i>
						) : (
							<i className="fa-regular fa-star fav" onClick={handleUpdateFavorite}></i>
						)}
					</div>
				</div>
				<div className='card-title col-6'>
					<div className='pokemon-types mt-1'>
						{pokemon.type.map((type, i) => {
							return (
								<span key={i} className='type'>
									{type.charAt(0).toUpperCase() + type.slice(1)}
								</span>
							)
						})}
					</div>
				</div>
				<div className='pokemon-image col-6'>
					{/* <img alt="bulbasaur" src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`}/> */}
					<img alt='bulbasaur' src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`} />
					{/* <img alt="bulbasaur" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/25.svg"/> */}
				</div>
			</div>
		</Link>
	)
}

export default Card