const cartCountEl = document.querySelector(".cart-count");
const cartSidebar = document.getElementById("cartSidebar");
const overlay = document.getElementById("overlay");
const cartItemsList = document.getElementById("cartItems");
const buyNowBtn = document.getElementById("buyNowBtn");
const cartIcon = document.querySelector(".fa-shopping-bag");

const totalAmountEl = document.createElement("p");
const deliveryCostEl = document.createElement("p");
const finalAmountEl = document.createElement("p");

let cart = JSON.parse(localStorage.getItem("cart")) || {};
const baseDeliveryCost = 15;

cartIcon.addEventListener("click", () => {
    cartSidebar.classList.toggle("open");
    overlay.classList.toggle("active");
});

overlay.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
    overlay.classList.remove("active");
});

document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        const productCard = button.closest(".card");
        const productName = productCard.querySelector(".title").innerText;
        const priceText = productCard.querySelector(".amount").innerText;
        const price = parseFloat(priceText.replace("$", ""));

        if (cart[productName]) {
            cart[productName].quantity += 1;
        } else {
            cart[productName] = { price, quantity: 1 };
        }

        updateCart();
    });
});

function updateCart() {
    const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.innerText = totalItems;

    cartItemsList.innerHTML = "";

    let subtotal = 0;

    for (let item in cart) {
        const { price, quantity } = cart[item];
        subtotal += price * quantity;

        const li = document.createElement("li");
        li.innerHTML = `
            <strong>${item}</strong><br>
            $${price.toFixed(2)} × ${quantity} = $${(price * quantity).toFixed(2)}
            <br>
            <button class="decrease-btn" data-item="${item}">−</button>
            <button class="increase-btn" data-item="${item}">+</button>
            <button class="remove-btn" data-item="${item}">Remove</button>
        `;
        cartItemsList.appendChild(li);
    }

    const deliveryCost = subtotal >= 99 ? 0 : baseDeliveryCost;
    const total = subtotal + deliveryCost;

    totalAmountEl.textContent = `Subtotal: $${subtotal.toFixed(2)}`;
    deliveryCostEl.textContent = `Delivery: $${deliveryCost.toFixed(2)}`;
    finalAmountEl.textContent = `Total: $${total.toFixed(2)}`;

    cartItemsList.appendChild(totalAmountEl);
    cartItemsList.appendChild(deliveryCostEl);
    cartItemsList.appendChild(finalAmountEl);

    localStorage.setItem("cart", JSON.stringify(cart));
    setupCartButtons();
}

function setupCartButtons() {
    document.querySelectorAll(".increase-btn").forEach(button => {
        button.addEventListener("click", () => {
            const item = button.dataset.item;
            cart[item].quantity++;
            updateCart();
        });
    });

    document.querySelectorAll(".decrease-btn").forEach(button => {
        button.addEventListener("click", () => {
            const item = button.dataset.item;
            if (cart[item].quantity > 1) {
                cart[item].quantity--;
            } else {
                delete cart[item];
            }
            updateCart();
        });
    });

    document.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener("click", () => {
            const item = button.dataset.item;
            delete cart[item];
            updateCart();
        });
    });
}
buyNowBtn.addEventListener("click", () => {
    if (Object.keys(cart).length === 0) {
        alert("Your cart is empty.");
        return;
    }

    document.getElementById("paymentOptions").style.display = "block";
});

const confirmPaymentBtn = document.getElementById("confirmPayment");

confirmPaymentBtn.addEventListener("click", () => {
    const selected = document.querySelector('input[name="payment"]:checked');
    if (!selected) {
        alert("Please choose a payment method.");
        return;
    }

    const paymentMethod = selected.value;
    let extraInfo = "";

    if (paymentMethod === "netbanking") {
        const bank = document.getElementById("banks").value;
        if (!bank) {
            alert("Please select a bank.");
            return;
        }
        extraInfo = ` via ${bank}`;
    }

    alert(`Payment successful using ${paymentMethod.toUpperCase()}${extraInfo}. Thank you!`);

    cart = {};
    localStorage.removeItem("cart");
    updateCart();

    document.getElementById("paymentOptions").style.display = "none";
    cartSidebar.classList.remove("open");
    overlay.classList.remove("active");
});


updateCart();





document.querySelectorAll('input[name="payment"]').forEach(radio => {
    radio.addEventListener("change", () => {
        const bankDropdown = document.getElementById("bankDropdown");
        bankDropdown.style.display = radio.value === "netbanking" ? "block" : "none";
    });
});
