window.addEventListener('DOMContentLoaded', (event) => {
    applyActiveFilters();
});

function applyActiveFilters() {
    const products = getProductElements();
    const applyFiltersButton = document.getElementById('apply-filters-button');

    applyFiltersButton.addEventListener('click', function(event) {
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
    });
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
    return processedValue.includes(nameInput.value)
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