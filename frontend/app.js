const API_BASE_URL = "http://127.0.0.1:3002/api";

const categorySelect = document.getElementById("categorySelect");
const statusContainer = document.getElementById("statusContainer");
const productsGrid = document.getElementById("productsGrid");

function showStatus(message, type = "info") {
  statusContainer.textContent = message;
  statusContainer.className = `status ${type}`;
}

function hideStatus() {
  statusContainer.textContent = "";
  statusContainer.className = "status hidden";
}

function formatPrice(price) {
  return `${Number(price).toFixed(2)} RON`;
}

function renderProducts(products) {
  productsGrid.innerHTML = "";

  if (!products.length) {
    showStatus("No products found for the selected category.", "info");
    return;
  }

  hideStatus();

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const isOutOfStock = Number(product.stock) === 0;
    if (isOutOfStock) {
      card.classList.add("out-of-stock");
    }

    const badgeClass = isOutOfStock ? "out-of-stock" : "in-stock";
    const badgeText = isOutOfStock ? "Out of stock" : `In stock: ${product.stock}`;

    card.innerHTML = `
      <h2>${product.name}</h2>
      <div class="product-meta">
        <p><span>Category:</span> ${product.category_name}</p>
        <p><span>Price:</span> ${formatPrice(product.price)}</p>
        <p><span>Stock:</span> ${product.stock}</p>
      </div>
      <div class="stock-badge ${badgeClass}">
        ${badgeText}
      </div>
    `;

    productsGrid.appendChild(card);
  });
}

async function loadCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to load categories.");
  }

  const categories = await response.json();

  categorySelect.innerHTML = `
    <option value="">All categories</option>
  `;

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}

async function loadProducts(categoryId = "") {
  showStatus("Loading products...", "info");
  productsGrid.innerHTML = "";

  let url = `${API_BASE_URL}/products`;

  if (categoryId) {
    url += `?category_id=${encodeURIComponent(categoryId)}`;
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load products.");
  }

  const products = await response.json();
  renderProducts(products);
}

async function initializePage() {
  try {
    showStatus("Loading categories...", "info");
    await loadCategories();
    await loadProducts();
  } catch (error) {
    console.error(error);
    showStatus("Something went wrong while loading data.", "error");
  }
}

categorySelect.addEventListener("change", async (event) => {
  try {
    await loadProducts(event.target.value);
  } catch (error) {
    console.error(error);
    showStatus("Something went wrong while filtering products.", "error");
  }
});

initializePage();
