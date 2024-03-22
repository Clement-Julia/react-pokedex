export const updatePokedex = (pokemonId) => {
    let pokedex = JSON.parse(localStorage.getItem('pokedex')) || [];
    const pokemonIndex = pokedex.indexOf(pokemonId);

    if (pokemonIndex === -1) {
        pokedex.push(pokemonId);
    } else {
        pokedex.splice(pokemonIndex, 1);
    }

    localStorage.setItem('pokedex', JSON.stringify(pokedex));
};
