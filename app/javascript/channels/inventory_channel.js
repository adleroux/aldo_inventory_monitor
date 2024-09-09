import consumer from "./consumer"

const inventoryChannel = consumer.subscriptions.create("InventoryChannel", {
  connected() {
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    const store = data.store;
    const model = data.model;
    const inventory = data.inventory;

    console.log("Received data:", data);

    // Display latest JSON data
    document.getElementById('latest-json').textContent = JSON.stringify(data, null, 2);

    const headerRow = document.getElementById('header-row');
    const inventoryBody = document.getElementById('inventory-body');

    // Check if the store header exists
    let storeHeader = document.getElementById(`header-${store}`);
    let storeColumnIndex;

    if (!storeHeader) {
      console.log(`Creating new header for store: ${store}`);
      // Create the store header if it doesn't exist
      const th = document.createElement('th');
      th.id = `header-${store}`;
      th.textContent = store;
      headerRow.appendChild(th);

      // Update column indices for existing rows
      const rows = inventoryBody.getElementsByTagName('tr');
      for (let i = 0; i < rows.length; i++) {
        const tr = rows[i];
        const td = document.createElement('td');
        td.id = `cell-${tr.id}-${headerRow.children.length - 1}`;
        tr.appendChild(td);
      }

      // New column index
      storeColumnIndex = headerRow.children.length - 1;
    } else {
      console.log(`Using existing header for store: ${store}`);
      storeColumnIndex = Array.from(headerRow.children).indexOf(storeHeader);
    }

    // Check if the row for this model exists
    let modelRow = document.getElementById(`row-${model}`);

    if (!modelRow) {
      console.log(`Creating new row for model: ${model}`);
      // Create a new row for the model if it doesn't exist
      const tr = document.createElement('tr');
      tr.id = `row-${model}`;

      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = model;
      tr.appendChild(th);

      // Create an empty cell for each store
      for (let i = 1; i < headerRow.children.length; i++) {
        const td = document.createElement('td');
        td.id = `cell-${model}-${i}`;
        tr.appendChild(td);
      }

      inventoryBody.appendChild(tr);
      modelRow = tr; // Update modelRow reference
    }

    // Add inventory data to the correct cell
    const cell = modelRow.children[storeColumnIndex];
    cell.textContent = inventory; // Only display the inventory number

    // Highlight the updated cell
    cell.classList.add('highlighted');

    // Remove the highlight after 5 seconds
    setTimeout(() => {
      cell.classList.remove('highlighted');
    }, 5000);

    // Check inventory levels and display alerts if necessary
    checkInventoryLevels(store, model, inventory);
  }
});

const activeAlerts = {}; // Object to store active alerts

function checkInventoryLevels(store, model, inventory) {
  const alertsDiv = document.getElementById('alerts');
  const alertKey = `${store}-${model}`; // Unique key for each store-model combination

  if (inventory < 6) {
    // Low stock alert
    if (!activeAlerts[alertKey]) {
      activeAlerts[alertKey] = `Low stock for Model ${model} at Store ${store} - Only ${inventory} left!`;
    }
  } else if (inventory >= 95) {
    // High stock alert
    if (!activeAlerts[alertKey]) {
      activeAlerts[alertKey] = `High stock for Model ${model} at Store ${store} - Inventory is at ${inventory}.`;
    }
  } else {
    // If inventory is within normal range, remove any existing alert for this store-model combination
    delete activeAlerts[alertKey];
  }

  // Update alerts display
  updateAlertsDisplay(alertsDiv);
}

function updateAlertsDisplay(alertsDiv) {
  alertsDiv.innerHTML = ''; // Clear current alerts

  // Add all active alerts to the alerts div
  Object.values(activeAlerts).forEach((alertMessage) => {
    const alertElement = document.createElement('div');
    alertElement.textContent = alertMessage;
    alertsDiv.appendChild(alertElement);
  });

  // Show or hide the alerts div based on whether there are active alerts
  alertsDiv.style.display = Object.keys(activeAlerts).length > 0 ? 'block' : 'none';
}

export default inventoryChannel;
