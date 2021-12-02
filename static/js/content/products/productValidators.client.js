function validateAllFilters() {
    const validators = [
        validateProductName,
        validateTechKeywords,
        validateCategories,
        validateBatteryCapacity,
    ];

    for (const validator of validators) {
        const { status, message } = validator();
        if (!status) {
            alert(message);
            return false;
        }
    }

    return true;
}

function validateProductName() {
    const pattern = new RegExp('^[a-zA-Z0-9\s]*$');
    const productNameFilter = document.getElementById('name-input');

    if (!pattern.test(productNameFilter.value))
        return {
            status: false,
            message: 'Product name can only contain letters, digits and spaces.'
        };

    return {
        status: true
    }
}

function validateCategories() {
    const categories = document.querySelectorAll('input[name="category-input"]');
    const isAtLeastOneChecked = Array
        .from(categories)
        .map(c => Number(c.checked))
        .reduce((x, y) => x + y);

    if (!isAtLeastOneChecked) {
        return {
            status: false,
            message: 'You have to select at least one category!',
        }
    }

    return {
        status: true
    }
}

function validateTechKeywords() {
    const technologiesFilter = document.getElementById('technologies-input');
    const s = '^([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*(,[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*)*)*$';
    const pattern = new RegExp(s);

    if (!pattern.test(technologiesFilter.value)) {
        return {
            status: false,
            message: 'Separate keywords by commas and words by dash. Only letters and digits are allowed in words.',
        };
    }

    return {
        status: true
    }
}

function validateBatteryCapacity() {
    const batteryInput = Array
        .from(document.querySelectorAll('#battery-input > option'))
        .filter(capacity => capacity.selected)
        .map(capacity => capacity.value);

    if (batteryInput.length > 1 && batteryInput.includes('default')) {
        return {
            status: false,
            message: 'Cannot select both all and specific battery capacities.',
        };
    }

    return {
        status: true
    }
}