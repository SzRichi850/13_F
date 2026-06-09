const container = document.getElementById('recipe-container');
const searchInput = document.getElementById('search-input');

fetch('recipes.json')
    .then(response => response.json())
    .then(data => {
        const recipesList = data.recipes || data;
        
        // Kedvencek beolvasása LocalStorage-ból (ha még nincs, üres tömb)
        let favorites = JSON.parse(localStorage.getItem('kedvencek')) || [];

        recipesList.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            card.addEventListener('click', () => {
                window.location.href = `recipe.html?id=${recipe.id}`;
            });

            const totalTime = recipe.prepTime + recipe.cookTime;
            const timeDisplay = totalTime > 0 ? `${totalTime} perc` : "Gyors";
            
            // Időtartam mentése az elem attribútumába a későbbi rendezéshez
            card.dataset.time = totalTime;

            // Ellenőrizzük, hogy a recept már el van-e mentve kedvencnek
            const isFavorite = favorites.includes(recipe.id);

            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${recipe.imageUrl || 'https://via.placeholder.com/500x300'}" alt="${recipe.name}">
                    <span class="category">${recipe.category}</span>
                    <button class="fav-btn ${isFavorite ? 'active' : ''}" data-id="${recipe.id}">
                        <svg viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
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

            // Kedvenc gomb működtetése
            const favBtn = card.querySelector('.fav-btn');
            favBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Megakadályozza, hogy a kártya kattintás (navigáció) lefusson
                
                // Aktuális állapot újraolvasása
                favorites = JSON.parse(localStorage.getItem('kedvencek')) || [];
                const recipeId = recipe.id;

                if (favorites.includes(recipeId)) {
                    // Ha már benne van, kitereljük belőle (unfavorite)
                    favorites = favorites.filter(id => id !== recipeId);
                    favBtn.classList.remove('active');
                } else {
                    // Ha nincs benne, hozzáadjuk (favorite)
                    favorites.push(recipeId);
                    favBtn.classList.add('active');
                }

                // Mentés vissza a LocalStorage-ba
                localStorage.setItem('kedvencek', JSON.stringify(favorites));
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
            });
        });
        
        // Kezdő darabszám kiíratása
        if(typeof filterCards === 'function') filterCards();
    })
    .catch(error => console.error('Hiba:', error));

    function filterCards() {
        const val = document.getElementById('Select').value;
        const cards = document.querySelectorAll('.recipe-card');
        let visible = 0;
        cards.forEach(card => {
            const kategoria = card.querySelector('.category').textContent;
            const show = val === 'all' || kategoria === val;
            card.style.display = show ? '' : 'none';
            if (show) visible++;
        });
        document.getElementById('countBadge').textContent = visible + ' recept';
    }

// Rendezés funkció (leggyorsabb előre)
function sortCards() {
    const sortBy = document.getElementById('SortSelect').value;
    if (sortBy === 'time') {
        const cards = Array.from(document.querySelectorAll('.recipe-card'));
        
        // Növekvő sorrendbe rendezés az elmentett időtartam alapján
        cards.sort((a, b) => Number(a.dataset.time) - Number(b.dataset.time));
        
        // Elemek újbóli elhelyezése a rendezett sorrendben
        cards.forEach(card => container.appendChild(card));
    }
function filterCards() {
    const val = document.getElementById('Select').value;
    const cards = document.querySelectorAll('.recipe-card');
    let visible = 0;
    cards.forEach(card => {
        const kategoria = card.querySelector('.category').textContent;
        const show = val === 'all' || kategoria === val;
        card.style.display = show ? 'flex' : 'none'; // 'flex'-re javítva az elcsúszás ellen
        if (show) visible++;
    });
    const badge = document.getElementById('countBadge');
    if(badge) badge.textContent = visible + ' recept';
}