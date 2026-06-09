const container = document.getElementById('recipe-container');
const searchInput = document.getElementById('search-input');

fetch('recipes.json')
    .then(response => response.json())
    .then(data => {
        const recipesList = data.recipes || data;
        
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

            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${recipe.imageUrl || 'https://via.placeholder.com/500x300'}" alt="${recipe.name}">
                    <span class="category">${recipe.category}</span>
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
}