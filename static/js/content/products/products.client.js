window.addEventListener('DOMContentLoaded', (event) => {
    // If the user select a product, highlight it
    // Otherwise un-highlight it
    highlightAddToCart();
});

function highlightAddToCart() {
    // Get selected product labels
    const addToCartElements = document.getElementsByClassName('select-cart');

    // Highlight selected elements
    for (const selectCartElement of addToCartElements) {
        // Get the checkbox
        const selectCheckbox = selectCartElement.getElementsByClassName(
            'select-cart-input'
        )[0];

        // Get the span
        const spanElem = selectCartElement.getElementsByTagName('span')[0];

        // Attach listener to checkbox click events
        selectCheckbox.addEventListener('change', function(event) {
            // Find the checkmark
            let check = spanElem.getElementsByClassName('product-selected');

            // Check if it is selected by the user
            if (this.checked) {
                spanElem.style.backgroundColor = 'var(--color-cart-add-checked)';
                spanElem.style.borderColor = 'var(--color-cart-add-checked)';
                spanElem.innerHTML = ' In Cart ';

                // Make sure there is only one checkmark
                if (check.length) {
                    return;
                }

                // Create the checkmark
                check = document.createElement('span');
                check.classList.add('product-selected');
                check.classList.add('fa-check');
                check.classList.add('fas');

                // Append it to its proper place
                spanElem.appendChild(check);
            } else {
                spanElem.style.backgroundColor = 'var(--color-cart-add-unchecked)';
                spanElem.style.borderColor = 'var(--color-cart-add-unchecked)';
                spanElem.innerHTML = 'Add to Cart';

                // Make sure there is a checkmark to be removed
                if (!check.length) {
                    return;
                }

                // Remove the checkmark
                spanElem.removeChild(check[0]);
            }
        });

        // Highlight the text
        spanElem.addEventListener('mouseenter', function(event) {
            const spanElem = this.parentNode.getElementsByTagName('span')[0];
            spanElem.style.backgroundColor = 'var(--color-cart-add-hover)';
            spanElem.style.borderColor = 'var(--color-cart-add-hover)';
        });

        // Un-Highlight the text
        spanElem.addEventListener('mouseleave', function(event) {
            if (selectCheckbox.checked) {
                spanElem.style.backgroundColor = 'var(--color-cart-add-checked)';
                spanElem.style.borderColor = 'var(--color-cart-add-checked)';
            } else {
                spanElem.style.backgroundColor = 'var(--color-cart-add-unchecked)';
                spanElem.style.borderColor = 'var(--color-cart-add-unchecked)';
            }
        });
    }
}