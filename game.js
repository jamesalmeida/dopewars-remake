// Game configuration
const locations = ['Bronx', 'Ghetto', 'Central Park', 'Manhattan', 'Coney Island', 'Brooklyn'];
const drugs = ['Cocaine', 'Heroin', 'Acid', 'Weed', 'Speed', 'Ludes'];
const maxDays = 30;

// Player state
let player = {
    cash: 2000,
    debt: 5500,
    day: 1,
    location: 'Bronx',
    inventory: {}
};

// Market prices (will fluctuate)
let market = {};

// UI state
let currentMode = 'normal'; // 'normal', 'buying', 'selling', 'paying'
let selectedDrug = null;
let selectedQuantity = 1;
let paymentAmount = 100; // Default debt payment amount

// Initialize game
function initGame() {
    drugs.forEach(drug => player.inventory[drug] = 0);
    generateMarket();
    updateDisplay();
}

// Generate market prices for the current location
function generateMarket() {
    market = {};
    drugs.forEach(drug => {
        // Random price between 100 and 2000, with occasional spikes or drops
        let basePrice = Math.floor(Math.random() * 1900) + 100;
        if (Math.random() < 0.1) basePrice *= 3; // 10% chance of a price spike
        if (Math.random() < 0.1) basePrice = Math.floor(basePrice / 3); // 10% chance of a drop
        market[drug] = basePrice;
    });
}

// Update the display
function updateDisplay() {
    document.getElementById('cash').textContent = player.cash;
    document.getElementById('debt').textContent = player.debt;
    document.getElementById('day').textContent = player.day;
    document.getElementById('max-days').textContent = maxDays;
    document.getElementById('location').textContent = player.location;

    const inventoryList = document.getElementById('inventory-list');
    inventoryList.innerHTML = '';
    for (const drug in player.inventory) {
        if (player.inventory[drug] > 0) {
            const li = document.createElement('li');
            li.textContent = `${drug}: ${player.inventory[drug]}`;
            inventoryList.appendChild(li);
        }
    }

    const marketList = document.getElementById('market-list');
    marketList.innerHTML = '';
    for (const drug in market) {
        const li = document.createElement('li');
        li.textContent = `${drug}: $${market[drug]}`;
        marketList.appendChild(li);
    }

    // Reset transaction panel
    const transactionPanel = document.getElementById('transaction-panel');
    if (transactionPanel) {
        transactionPanel.style.display = 'none';
    }

    // Show/hide action buttons based on mode
    const mainActions = document.getElementById('main-actions');
    const transactionActions = document.getElementById('transaction-actions');
    
    if (mainActions && transactionActions) {
        if (currentMode === 'normal') {
            mainActions.style.display = 'block';
            transactionActions.style.display = 'none';
        } else {
            mainActions.style.display = 'none';
            transactionActions.style.display = 'block';
        }
    }
}

// Add a message to the log
function addMessage(message) {
    const messages = document.getElementById('messages');
    const p = document.createElement('p');
    p.textContent = message;
    messages.appendChild(p);
    messages.scrollTop = messages.scrollHeight;
}

// Enter buying mode
function enterBuyMode() {
    currentMode = 'buying';
    selectedDrug = null;
    selectedQuantity = 1;
    
    showTransactionPanel('Buy Drugs', 'buy');
}

// Enter selling mode
function enterSellMode() {
    currentMode = 'selling';
    selectedDrug = null;
    selectedQuantity = 1;
    
    showTransactionPanel('Sell Drugs', 'sell');
}

// Enter debt payment mode
function enterPayDebtMode() {
    if (player.debt <= 0) {
        addMessage("You don't have any debt to pay off!");
        return;
    }
    
    if (player.cash <= 0) {
        addMessage("You don't have any cash to pay your debt!");
        return;
    }
    
    currentMode = 'paying';
    paymentAmount = Math.min(100, player.cash, player.debt); // Default to $100 or less if cash/debt is lower
    
    showTransactionPanel('Pay Debt', 'pay');
}

// Show transaction panel with drug options
function showTransactionPanel(title, mode) {
    const transactionPanel = document.getElementById('transaction-panel');
    transactionPanel.style.display = 'block';
    
    // Set panel title
    const panelTitle = document.getElementById('transaction-title');
    panelTitle.textContent = title;
    
    // Clear previous content
    const drugOptions = document.getElementById('drug-options');
    drugOptions.innerHTML = '';
    
    // Add drug buttons or debt payment controls
    if (mode === 'buy') {
        for (const drug in market) {
            const button = document.createElement('button');
            button.textContent = `${drug}: $${market[drug]}`;
            button.onclick = () => selectDrug(drug);
            drugOptions.appendChild(button);
        }
    } else if (mode === 'sell') {
        for (const drug in player.inventory) {
            if (player.inventory[drug] > 0) {
                const button = document.createElement('button');
                button.textContent = `${drug}: ${player.inventory[drug]} (Sell @ $${market[drug]})`;
                button.onclick = () => selectDrug(drug);
                drugOptions.appendChild(button);
            }
        }
        
        // If no drugs to sell
        if (drugOptions.children.length === 0) {
            const message = document.createElement('p');
            message.textContent = 'No drugs in inventory to sell!';
            drugOptions.appendChild(message);
        }
    } else if (mode === 'pay') {
        // Create debt payment controls
        const debtInfo = document.createElement('p');
        debtInfo.textContent = `Current Debt: $${player.debt} | Cash Available: $${player.cash}`;
        drugOptions.appendChild(debtInfo);
        
        const paymentControls = document.createElement('div');
        paymentControls.className = 'payment-controls';
        
        const paymentLabel = document.createElement('p');
        paymentLabel.textContent = 'Payment Amount: $';
        paymentControls.appendChild(paymentLabel);
        
        const paymentInput = document.createElement('input');
        paymentInput.type = 'number';
        paymentInput.id = 'payment-amount';
        paymentInput.value = paymentAmount;
        paymentInput.min = 1;
        paymentInput.max = Math.min(player.cash, player.debt);
        paymentInput.addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            if (value > 0 && value <= Math.min(player.cash, player.debt)) {
                paymentAmount = value;
            } else if (value > Math.min(player.cash, player.debt)) {
                paymentAmount = Math.min(player.cash, player.debt);
                paymentInput.value = paymentAmount;
            } else {
                paymentAmount = 1;
                paymentInput.value = 1;
            }
        });
        paymentControls.appendChild(paymentInput);
        
        const quickButtons = document.createElement('div');
        quickButtons.className = 'quick-payment-buttons';
        
        // Quick payment buttons
        const paymentOptions = [
            { label: '$100', value: 100 },
            { label: '$500', value: 500 },
            { label: '$1000', value: 1000 },
            { label: 'Half Debt', value: Math.floor(player.debt / 2) },
            { label: 'Max', value: Math.min(player.cash, player.debt) }
        ];
        
        paymentOptions.forEach(option => {
            if (option.value <= Math.min(player.cash, player.debt)) {
                const button = document.createElement('button');
                button.textContent = option.label;
                button.onclick = () => {
                    paymentAmount = option.value;
                    document.getElementById('payment-amount').value = paymentAmount;
                };
                quickButtons.appendChild(button);
            }
        });
        
        paymentControls.appendChild(quickButtons);
        drugOptions.appendChild(paymentControls);
    }
    
    // Update quantity controls
    updateQuantityControls();
    
    // Show transaction actions
    const mainActions = document.getElementById('main-actions');
    const transactionActions = document.getElementById('transaction-actions');
    mainActions.style.display = 'none';
    transactionActions.style.display = 'block';
}

// Select a drug for transaction
function selectDrug(drug) {
    selectedDrug = drug;
    selectedQuantity = 1;
    
    // Highlight selected drug button
    const drugButtons = document.querySelectorAll('#drug-options button');
    drugButtons.forEach(button => {
        if (button.textContent.startsWith(drug)) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
    
    updateQuantityControls();
}

// Update quantity controls based on selected drug
function updateQuantityControls() {
    const quantityControls = document.getElementById('quantity-controls');
    const confirmButton = document.getElementById('confirm-transaction');
    
    if (currentMode === 'paying') {
        quantityControls.style.display = 'none';
        confirmButton.style.display = 'block';
        return;
    }
    
    if (!selectedDrug) {
        quantityControls.style.display = 'none';
        confirmButton.style.display = 'none';
        return;
    }
    
    quantityControls.style.display = 'block';
    confirmButton.style.display = 'block';
    
    const quantityDisplay = document.getElementById('quantity-value');
    quantityDisplay.textContent = selectedQuantity;
    
    // Update max quantity based on mode
    if (currentMode === 'buying') {
        const maxAfford = Math.floor(player.cash / market[selectedDrug]);
        document.getElementById('max-quantity').textContent = maxAfford;
    } else if (currentMode === 'selling') {
        document.getElementById('max-quantity').textContent = player.inventory[selectedDrug];
    }
}

// Increase quantity
function increaseQuantity() {
    if (!selectedDrug) return;
    
    const maxQty = currentMode === 'buying' 
        ? Math.floor(player.cash / market[selectedDrug])
        : player.inventory[selectedDrug];
        
    if (selectedQuantity < maxQty) {
        selectedQuantity++;
        updateQuantityControls();
    }
}

// Decrease quantity
function decreaseQuantity() {
    if (!selectedDrug) return;
    
    if (selectedQuantity > 1) {
        selectedQuantity--;
        updateQuantityControls();
    }
}

// Set to max quantity
function setMaxQuantity() {
    if (!selectedDrug) return;
    
    if (currentMode === 'buying') {
        selectedQuantity = Math.floor(player.cash / market[selectedDrug]);
    } else if (currentMode === 'selling') {
        selectedQuantity = player.inventory[selectedDrug];
    }
    
    updateQuantityControls();
}

// Confirm transaction
function confirmTransaction() {
    if (currentMode === 'paying') {
        payDebt(paymentAmount);
        return;
    }
    
    if (!selectedDrug || selectedQuantity <= 0) return;
    
    if (currentMode === 'buying') {
        buyDrug(selectedDrug, selectedQuantity);
    } else if (currentMode === 'selling') {
        sellDrug(selectedDrug, selectedQuantity);
    }
    
    // Return to normal mode
    cancelTransaction();
}

// Cancel transaction
function cancelTransaction() {
    currentMode = 'normal';
    selectedDrug = null;
    selectedQuantity = 1;
    updateDisplay();
}

// Buy a drug
function buyDrug(drug, quantity) {
    if (!drug || !market[drug]) return addMessage('Invalid drug name.');
    if (quantity <= 0) return addMessage('Invalid quantity.');
    
    const cost = market[drug] * quantity;
    if (player.cash < cost) return addMessage('Not enough cash.');
    
    player.cash -= cost;
    player.inventory[drug] = (player.inventory[drug] || 0) + quantity;
    addMessage(`Bought ${quantity} ${drug} for $${cost}`);
    nextTurn();
}

// Sell a drug
function sellDrug(drug, quantity) {
    if (!drug || !player.inventory[drug]) return addMessage('Invalid drug name or none in inventory.');
    if (quantity <= 0 || quantity > player.inventory[drug]) return addMessage('Invalid quantity.');
    
    const revenue = market[drug] * quantity;
    player.cash += revenue;
    player.inventory[drug] -= quantity;
    addMessage(`Sold ${quantity} ${drug} for $${revenue}`);
    nextTurn();
}

// Pay debt
function payDebt(amount) {
    if (amount <= 0 || amount > player.cash || amount > player.debt) {
        addMessage('Invalid payment amount.');
        return;
    }
    
    player.cash -= amount;
    player.debt -= amount;
    addMessage(`Paid $${amount} toward your debt. Remaining debt: $${player.debt}`);
    
    // Return to normal mode
    cancelTransaction();
    
    // Advance turn
    nextTurn();
}

// Move to a new location
function moveLocation() {
    const newLocation = locations[Math.floor(Math.random() * locations.length)];
    player.location = newLocation;
    addMessage(`Moved to ${newLocation}`);
    nextTurn();
}

// Handle turn progression and random events
function nextTurn() {
    player.day++;
    player.debt = Math.floor(player.debt * 1.05); // 5% daily interest
    generateMarket();
    updateDisplay();

    // Random event (20% chance)
    if (Math.random() < 0.2) {
        const event = Math.random();
        if (event < 0.5) {
            // Police encounter
            addMessage('The cops are onto you! Lose some cash or drugs.');
            if (player.cash > 500) {
                player.cash -= 500;
                addMessage('Paid a $500 bribe to escape.');
            } else {
                for (const drug in player.inventory) {
                    if (player.inventory[drug] > 0) {
                        player.inventory[drug] = Math.floor(player.inventory[drug] / 2);
                        addMessage(`Lost half your ${drug} stash to the cops.`);
                        break;
                    }
                }
            }
        } else {
            // Found drugs
            const drug = drugs[Math.floor(Math.random() * drugs.length)];
            const qty = Math.floor(Math.random() * 5) + 1;
            player.inventory[drug] += qty;
            addMessage(`Found ${qty} ${drug} on the street!`);
        }
    }

    if (player.day > maxDays) {
        endGame();
    }
    updateDisplay();
}

// End the game
function endGame() {
    const netWorth = player.cash - player.debt;
    addMessage(`Game Over! Final net worth: $${netWorth}`);
    document.getElementById('actions').innerHTML = '<p>Game Over</p>';
}

// Start the game
initGame();