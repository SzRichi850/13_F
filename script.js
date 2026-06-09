const container = document.getElementById('recipe-container');

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

            card.innerHTML = `
                <div class="card-image-container">
                    <img src="${recipe.imageUrl || 'https://via.placeholder.com/500x300'}" alt="${recipe.name}">
                    <span class="category">${recipe.category}</span>
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3>${recipe.name}</h3>
                        <span class="time">${timeDisplay}</span>
                    </div>
                    <p class="description">${recipe.description}</p>
                    <button class="view-btn">Recept megtekintése</button>
                </div>
            `;

            container.appendChild(card);
        });
    })
    .catch(error => console.error('Hiba:', error));