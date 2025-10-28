// Meal Planner App (Optimized)
class MealPlanner {
    constructor() {
        this.meals = [];
        this.editingId = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMeals();
    }

    setupEventListeners() {
        // Add meal buttons
        document.getElementById('addMealBtn').addEventListener('click', () => this.openModal());
        document.getElementById('addMealBtnEmpty').addEventListener('click', () => this.openModal());

        // Modal controls
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('cancelBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('modalOverlay').addEventListener('click', () => this.closeModal());

        // Form submission
        document.getElementById('mealForm').addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Live search
        document.getElementById('searchInput').addEventListener('input', async (e) => {
            await this.loadMeals(e.target.value);
        });
        
        document.getElementById('mealsGrid').addEventListener('click', (e) => {
            const button = e.target.closest('button.meal-btn');
            if (!button) return;

            const mealId = parseInt(button.dataset.id);
            const action = button.dataset.action;

            if (action === 'edit') {
                this.openModal(mealId);
            } else if (action === 'delete') {
                this.deleteMeal(mealId);
            }
        });
    }

    async loadMeals(searchTerm = '') {
        try {
            const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
            const res = await fetch(`/api/products${query}`);
            if (!res.ok) throw new Error('Failed to fetch meals');
            this.meals = await res.json();
            this.render();
        } catch (err) {
            console.error(err);
            alert('Error loading meals');
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const formData = {
            name: document.getElementById('mealName').value.trim(),
            description: document.getElementById('mealDescription').value.trim(),
            category: document.getElementById('mealCategory').value,
            calories: parseInt(document.getElementById('mealCalories').value),
            image: document.getElementById('mealImage').value.trim() || this.getDefaultImage(document.getElementById('mealCategory').value)
        };

        if (!formData.name || !formData.description || !formData.category || isNaN(formData.calories)) {
            alert('Please fill in all required fields correctly.');
            return;
        }

        try {
            let res;
            if (this.editingId) {
                res = await fetch(`/api/products/${this.editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            } else {
                res = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
            }

            if (!res.ok) throw new Error('Failed to save meal');
            await this.loadMeals(); // reload list from server
            this.closeModal();
        } catch (err) {
            console.error(err);
            alert('Error saving meal');
        }
    }

    async deleteMeal(id) {
        if (!confirm('Are you sure you want to delete this meal?')) return;
        try {
            const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete meal');
            await this.loadMeals();
        } catch (err) {
            console.error(err);
            alert('Error deleting meal');
        }
    }

    openModal(mealId = null) {
        const modal = document.getElementById('mealModal');
        const overlay = document.getElementById('modalOverlay');
        const form = document.getElementById('mealForm');
        const title = document.getElementById('modalTitle');

        form.reset();
        this.editingId = null;

        if (mealId) {
            const meal = this.meals.find(m => m.id === mealId);
            if (meal) {
                title.textContent = 'Edit Meal';
                document.getElementById('mealName').value = meal.name;
                document.getElementById('mealDescription').value = meal.description;
                document.getElementById('mealCategory').value = meal.category;
                document.getElementById('mealCalories').value = meal.calories;
                document.getElementById('mealImage').value = meal.image || '';
                this.editingId = mealId;
            }
        } else {
            title.textContent = 'Add New Meal';
        }

        modal.classList.add('active');
        overlay.classList.add('active');
    }

    closeModal() {
        document.getElementById('mealModal').classList.remove('active');
        document.getElementById('modalOverlay').classList.remove('active');
        this.editingId = null;
    }

    getDefaultImage(category) {
        const images = {
            breakfast: '🥞',
            lunch: '🥗',
            dinner: '🍝',
            snack: '🍎',
            dessert: '🍰',
        };
        return images[category] || '🍽️';
    }

    render() {
        const mealsGrid = document.getElementById('mealsGrid');
        const emptyState = document.getElementById('emptyState');
        mealsGrid.innerHTML = '';

        if (!this.meals || this.meals.length === 0) {
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');

        this.meals.forEach(meal => {
            const card = document.createElement('div');
            card.className = 'meal-card';
            card.innerHTML = `
                <div class="meal-image">
                    ${meal.image && meal.image.startsWith('http') ?
                    `<img src="${meal.image}" alt="${meal.name}" style="width:100%; height:100%; object-fit:cover;">` :
                    `<span class="image-icon">${meal.image}</span>`
                }
                </div>
                <div class="meal-content">
                    <span class="meal-category">${meal.category}</span>
                    <h3 class="meal-name">${meal.name}</h3>
                    <p class="meal-description">${meal.description}</p>
                    <div class="meal-footer">
                        <span class="meal-calories">${meal.calories} cal</span>
                        <div class="meal-actions">
                            <button class="meal-btn" data-id="${meal.id}" data-action="edit" title="Edit">✏️</button>
                            <button class="meal-btn" data-id="${meal.id}" data-action="delete" title="Delete">🗑️</button>
                        </div>
                    </div>
                </div>
            `;
            mealsGrid.appendChild(card);
        });
    }
}

// Initialize the app
const app = new MealPlanner();
