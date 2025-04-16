document.addEventListener('DOMContentLoaded', () => {
    // Cart Elements
    const cartCountElement = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const openCartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.getElementById('modal-close-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceElement = document.getElementById('cart-total-price');
    const emptyCartMessage = document.createElement('p'); // Create empty message element once
    emptyCartMessage.classList.add('empty-cart-message');
    emptyCartMessage.textContent = 'Your cart is currently empty.';


    // Product Elements
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    // Cart State (Front-end only)
    let cartItems = []; // Array to hold {id, name, price, imgSrc} objects

    // --- Functions ---

    const openCartModal = () => {
        renderCartItems();
        cartModal.classList.add('show');
        document.body.classList.add('modal-open');
    };

    const closeCartModal = () => {
        cartModal.classList.remove('show');
        document.body.classList.remove('modal-open');
    };

    const updateCartCount = () => {
        const totalItems = cartItems.length;
        cartCountElement.textContent = totalItems;
        cartCountElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 150);
    };

    const updateCartTotal = () => {
        const total = cartItems.reduce((sum, item) => sum + item.price, 0);
        cartTotalPriceElement.textContent = total.toFixed(2);
    };

    // Function to render items in the cart modal (MODIFIED)
    const renderCartItems = () => {
        cartItemsContainer.innerHTML = ''; // Clear previous items

        if (cartItems.length === 0) {
            cartItemsContainer.appendChild(emptyCartMessage); // Add the pre-made empty message
        } else {
            const list = document.createElement('ul');
            list.style.listStyle = 'none';
            list.style.padding = '0';

            cartItems.forEach((item, index) => { // Get index here
                const listItem = document.createElement('li');
                listItem.classList.add('cart-item');
                // Add data-index attribute to list item or directly to button later
                listItem.innerHTML = `
                    <img src="${item.imgSrc}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-price">$ ${item.price.toFixed(2)}</span>
                    </div>
                    <button class="cart-item-remove-btn" data-index="${index}" aria-label="Remove ${item.name}">X</button>
                `; // Added remove button with data-index

                list.appendChild(listItem);

                // Find the remove button JUST added and attach listener
                const removeBtn = listItem.querySelector('.cart-item-remove-btn');
                removeBtn.addEventListener('click', handleRemoveFromCart);

            });
            cartItemsContainer.appendChild(list);
        }
        updateCartTotal(); // Update total price
    };

     // NEW: Function to handle removing an item from the cart
    const handleRemoveFromCart = (event) => {
        const button = event.target;
        const indexToRemove = parseInt(button.dataset.index, 10); // Get index from data attribute

        // Validate index (optional but good practice)
        if (indexToRemove >= 0 && indexToRemove < cartItems.length) {
            cartItems.splice(indexToRemove, 1); // Remove 1 item at the specified index

            // Update the UI
            renderCartItems(); // Re-render the cart list
            updateCartCount(); // Update the header count
        } else {
            console.error("Invalid index for item removal:", indexToRemove);
        }
    };


    const handleAddToCart = (event) => {
        const button = event.target;
        const productCard = button.closest('.product-card');

        const product = {
            id: productCard.dataset.id,
            name: productCard.dataset.name,
            price: parseFloat(productCard.dataset.price),
            imgSrc: productCard.dataset.img
        };

        cartItems.push(product);
        updateCartCount();

        button.textContent = 'Added!';
        button.disabled = true;
        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.disabled = false;
        }, 1500);
    };

    // --- Event Listeners ---

    addToCartButtons.forEach(button => {
        button.addEventListener('click', handleAddToCart);
    });

    openCartBtn.addEventListener('click', openCartModal);
     openCartBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            openCartModal();
        }
    });

    closeCartBtn.addEventListener('click', closeCartModal);
    modalOverlay.addEventListener('click', closeCartModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartModal.classList.contains('show')) {
            closeCartModal();
        }
    });

    // --- Initial Setup ---
    updateCartCount();
    // renderCartItems(); // No need to render initially, done when modal opens

});