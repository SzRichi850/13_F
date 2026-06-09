const container = document.getElementById('recipe-container');
const searchInput = document.getElementById('search-input');
import recipesList from "./recipes.js";

function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
}

function toggleFavorite(id) {
    let favs = getFavorites();
    const strId = String(id);
    if (favs.includes(strId)) {
        favs = favs.filter(f => f !== strId);
    } else {
        favs.push(strId);
    }
    localStorage.setItem('favorites', JSON.stringify(favs));
    return favs.includes(strId);
}


        recipesList.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            card.addEventListener('click', () => {
                window.location.href = `recipe.html?id=${recipe.id}`;
            });

            const totalTime = recipe.prepTime + recipe.cookTime;
            const timeDisplay = totalTime > 0 ? `${totalTime} perc` : "Gyors";
            const isFav = getFavorites().includes(String(recipe.id));

            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${recipe.imageUrl || 'https://via.placeholder.com/500x300'}" alt="${recipe.name}">
                    <span class="category">${recipe.category}</span>
                    <button class="fav-btn ${isFav ? 'fav-active' : ''}" title="Kedvencekhez adás" data-id="${recipe.id}">★</button>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="recipe-title">${recipe.name}</h3>
                        <span class="time">${timeDisplay}</span>
                    </div>
                    <p class="description">${recipe.description}</p>
                    <button class="view-btn">Recept megtekintése</button>
                </div>
            `;

            card.querySelector('.view-btn').addEventListener('click', () => {
                window.location.href = `recipe.html?id=${recipe.id}`;
            });

            card.querySelector('.card-image-container img').addEventListener('click', () => {
                window.location.href = `recipe.html?id=${recipe.id}`;
            });

            const favBtn = card.querySelector('.fav-btn');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const nowFav = toggleFavorite(recipe.id);
                favBtn.classList.toggle('fav-active', nowFav);
            });

            container.appendChild(card);
        });

        // Keresés
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.recipe-card');
            cards.forEach(card => {
                const title = card.querySelector('.recipe-title').textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
                card.style.display = title.includes(searchTerm) ? 'flex' : 'none';
            });
        });