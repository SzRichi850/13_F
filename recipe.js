
import recipes from "./recipes.js"
console.log(recipes)
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const recipeId = getQueryParam('id');
if (!recipeId) {
    document.getElementById('recipe-detail-content').innerHTML = '<p class="error">Nincs recept kiválasztva.</p>';
} else {
        const recipe = recipes.find(r => r.id == recipeId);
            if (!recipe) {
                document.getElementById('recipe-detail-content').innerHTML = '<p class="error">A recept nem található.</p>';
            }

            const totalTime = recipe.prepTime + recipe.cookTime;
            const timeDisplay = totalTime > 0 ? `${totalTime} perc` : "Gyors";

            const related = recipes.filter(r => r.category === recipe.category && r.id != recipe.id).slice(0, 3);

            let relatedHtml = '';
            if (related.length > 0) {
                relatedHtml = `<section class="related-recipes">
                            <h3>Kapcsolódó receptek</h3>
                            <div class="related-grid">
                                ${related.map(r => `
                                    <div class="related-card" data-id="${r.id}">
                                        <img src="${r.imageUrl}" alt="${r.name}">
                                        <h4>${r.name}</h4>
                                    </div>
                                `).join('')}
                            </div>
                        </section>`;
            }

            const detailHtml = `
                        <div class="recipe-header-image">
                            <img src="${recipe.imageUrl}" alt="${recipe.name}">
                        </div>
                        <div class="recipe-detail-card">
                            <h1>${recipe.name}</h1>
                            <div class="info-bar">
                                <span>Előkészítés: ${recipe.prepTime} perc</span>
                                <span>Főzés: ${recipe.cookTime} perc</span>
                                <span>dag: ${recipe.servings} fő</span>
                                <span>${timeDisplay}</span>
                            </div>
                            <div class="two-columns">
                                <div class="ingredients">
                                    <h2>Hozzávalók</h2>
                                    <ul>
                                        ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="steps">
                                    <h2>Elkészítés</h2>
                                    <ol>
                                        ${recipe.steps.map(step => `<li>${step}</li>`).join('')}
                                    </ol>
                                </div>
                            </div>
                            <div class="tips-nutrition">
                                <div class="tips">
                                    <h3>Tippek és variációk</h3>
                                    <p>Használj friss fűszernövényeket az ízfokozásért. A recept könnyen variálható más fehérjeforrásokkal is.</p>
                                </div>
                                <div class="nutrition">
                                    <h3>Tápérték (adagonként)</h3>
                                    <p>Kalória: ~550 kcal | Fehérje: 28g | Szénhidrát: 45g | Zsír: 22g</p>
                                </div>
                                <div class="rating">
                                    <h3>Értékelés</h3>
                                    <p>★★★★☆ (4.5/5 – 132 vélemény alapján)</p>
                                </div>
                            </div>
                            ${relatedHtml}
                        </div>
                    `;

            document.getElementById('recipe-detail-content').innerHTML = detailHtml;

            // document.querySelectorAll('.related-card').forEach(card => {
            //     card.addEventListener('click', () => {
            //         const id = card.getAttribute('data-id');
            //         window.location.href = `recipe.html?id=${id}`;
            //     });
            // });
}