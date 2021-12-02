window.addEventListener('DOMContentLoaded', (event) => {
    addActiveFilters();
    addResetFilters();
    addTotalFilter();
    addSortFilter();
});

function addSortFilter() {
    const sortAscButton = document.getElementById('sort-asc-button');
    const sortDescButton = document.getElementById('sort-des-button');
    const products = Array.from(getProductElements());

    sortAscButton.addEventListener('click', () => {
        const isValid = validateAllFilters();

        if (!isValid) {
            return;
        }

        sortProductsByNameAndPrice(products, 1);
    });

    sortDescButton.addEventListener('click', () => {
        const isValid = validateAllFilters();

        if (!isValid) {
            return;
        }

        sortProductsByNameAndPrice(products, -1);
    });
}

function sortProductsByNameAndPrice(products, sign) {
    products
        .sort((x, y) => {
            const xName = x.getElementsByClassName('name-value')[0]
                .innerHTML.trim();
            const yName = y.getElementsByClassName('name-value')[0]
                .innerHTML.trim();

            if (xName !== yName) {
                return sign * xName.localeCompare(yName);
            }

            return sign * (getProductPrice(x) - getProductPrice(y));
        })
        .forEach(p => p.parentNode.appendChild(p));
}

function getProductPrice(product) {
    let trunc = product.getElementsByClassName('price-value-trunc')[0]
        .innerHTML.trim();
    let decim = product.getElementsByClassName('price-value-decim')[0]
        .innerHTML.trim();
    trunc = parseInt(trunc);
    decim = parseInt(decim);
    const price = trunc + decim / 100;
    return price;
}

function addTotalFilter() {
    const totalButton = document.getElementById('total-button');
    let currentTimeout = null;

    totalButton.addEventListener('click', function(event) {
        const isValid = validateAllFilters();

        if (!isValid) {
            return;
        }

        const visibleProducts = Array.from(getProductElements())
            .filter(p => p.style.display !== 'none');

        const total = visibleProducts
            .map(p => getProductPrice(p))
            .reduce((x, y) => x + y, 0);

        const actionElements = document.getElementsByClassName('product-actions')[0];
        let totalElement = document.getElementById('total-product-sum');

        if (!totalElement) {
            totalElement = document.createElement('div');
            actionElements.appendChild(totalElement);
            totalElement.id = 'total-product-sum';
        }

        totalElement.innerHTML = `Total Sum: $${total.toFixed(2)}`;

        if (currentTimeout) {
            clearTimeout(currentTimeout);
        }

        currentTimeout = setTimeout(() => {
            actionElements.removeChild(totalElement);
            currentTimeout = null;
        }, 2000);
    });
}

function addResetFilters() {
    const resetFiltersButton = document.getElementById('reset-filters-button');
    resetFiltersButton.addEventListener('click', () => applyResetFilters());
}

function applyResetFilters() {
    const isValid = validateAllFilters();

    if (!isValid) {
        return;
    }

    const resets = [
        resetProductName,
        resetHasAudioJack,
        resetPrice,
        resetOperatingSystem,
        resetCategories,
        resetTechnologies,
        resetReleaseYear,
        resetBatteryCapacity,
    ];

    for (const reset of resets) {
        reset();
    }

    applyActiveFilters();
}

function resetProductName() {
    const productNameInput = document.getElementById('name-input');
    productNameInput.value = '';
}

function resetHasAudioJack() {
    const hasAudioJackInput = document.getElementById('has-jack-input');
    hasAudioJackInput.checked = false;
}

function resetPrice() {
    const priceInput = document.getElementById('price-input');
    priceInput.value = priceInput.max;
    const currentPrice = document.getElementById('price-current');
    currentPrice?.remove();
}

function resetOperatingSystem() {
    const osInput = document.querySelectorAll('input[name="os-input"]');
    osInput.forEach(os => os.checked = false);
    const osInputDefault = document.getElementById('os-default-input');
    osInputDefault.checked = true;
}

function resetCategories() {
    const categoriesInput = document.querySelectorAll('input[name="category-input"]');
    categoriesInput.forEach(category => category.checked = true);
}

function resetTechnologies() {
    const technologiesInput = document.getElementById('technologies-input');
    technologiesInput.value = "";
}

function resetReleaseYear() {
    const yearsInput = Array
        .from(document.querySelectorAll('#release-year-input > option'));
    yearsInput.forEach(year => year.selected = false);
    yearsInput.filter(year => year.value === "default")
        .forEach(year => year.selected = true);
}

function resetBatteryCapacity() {
    const batteryInput = Array
        .from(document.querySelectorAll('#battery-input > option'));
    batteryInput.forEach(battery => battery.selected = false);
    batteryInput.filter(battery => battery.value === "default")
        .forEach(battery => battery.selected = true);
}

function addActiveFilters() {
    const applyFiltersButton = document.getElementById('apply-filters-button');
    applyFiltersButton.addEventListener('click', () => applyActiveFilters());
}

function applyActiveFilters() {
    const products = getProductElements();
    const isValid = validateAllFilters();

    if (!isValid) {
        return;
    }

    for (const product of products) {
        if (isProductIncluded(product)) {
            product.style.display = 'flex';
        } else {
            product.style.display = 'none';
        }
    }
}

function isProductIncluded(product) {
    const filters = [
        isProductNameIncluded,
        isAudioJackIncluded,
        isPriceIncluded,
        isOperatingSystemIncluded,
        isCategoryIncluded,
        isTechIncluded,
        isReleaseYearIncluded,
        isBatteryCapacityIncluded,
    ];

    for (const filter of filters) {
        if (!filter(product)) {
            return false;
        }
    }

    return true;
}

function isProductNameIncluded(product) {
    const nameInput = document.getElementById('name-input');

    if (!nameInput.value.length) {
        return true;
    }

    const nameValue = product.getElementsByClassName('name-value')[0];
    const processedValue = nameValue.innerHTML.trim().toLowerCase();
    return processedValue.includes(nameInput.value.toLowerCase())
}

function isAudioJackIncluded(product) {
    const hasJackInput = document.getElementById('has-jack-input');

    if (!hasJackInput.checked) {
        return true;
    }

    const hasJackValue = product.getElementsByClassName('has-jack-value')[0];
    return hasJackValue.innerHTML.trim() === 'Yes';
}

function isPriceIncluded(product) {
    const priceInput = document.getElementById('price-input').value;
    const priceValue = product.getElementsByClassName('price-value-trunc')[0]
        .innerHTML.trim();

    if (parseInt(priceValue) > parseInt(priceInput)) {
        return false;
    }

    return true;
}

function isOperatingSystemIncluded(product) {
    const defaultOsInput = document.getElementById("os-default-input");

    if (defaultOsInput.checked) {
        return true;
    }

    const osValue = product.getElementsByClassName('os-value')[0].innerHTML.trim();
    let osInput = document.querySelectorAll('input[name="os-input"]');
    osInput = Array.from(osInput)
        .filter(os => os.checked)
        .map(os => os.value);

    return osInput.includes(osValue);
}

function isCategoryIncluded(product) {
    const categoriesInput = Array.from(document.querySelectorAll('input[name="category-input"]'))
        .filter(category => category.checked)
        .map(category => category.value);

    const categoryValue = product.getElementsByClassName('category-value')[0]
        .innerHTML.trim();

    return categoriesInput.includes(categoryValue);
}

function isTechIncluded(product) {
    let techInput = document.getElementById('technologies-input')
        .value
        .toLowerCase();

    if (!techInput.length) {
        return true;
    }

    const techValue = Array.from(product.getElementsByClassName('spec-value'))
        .map(tech => tech.innerHTML.trim().toLowerCase());

    techInput = new Set(techInput.split(','));

    for (const tech of techValue) {
        if (techInput.has(tech)) {
            return true;
        }
    }

    return false;
}

function isReleaseYearIncluded(product) {
    const yearInput = Array.from(document.querySelectorAll('#release-year-input > option'))
        .filter(year => year.selected)
        .map(year => year.value)[0];

    if (yearInput === 'default') {
        return true;
    }

    const yearValue = product.getElementsByClassName('release-year-value')[0]
        .innerHTML.trim();

    if (yearInput !== yearValue) {
        return false;
    }

    return true;
}

function isBatteryCapacityIncluded(product) {
    const batteryInput = Array
        .from(document.querySelectorAll('#battery-input > option'))
        .filter(capacity => capacity.selected)
        .map(capacity => capacity.value);

    if (batteryInput.includes('default')) {
        return true;
    }

    const batteryValue = product.getElementsByClassName('battery-value')[0]
        .innerHTML.trim();

    return batteryInput.includes(batteryValue);
}

function getProductElements() {
    return document.getElementsByClassName('product-item');
}