const STORAGE_KEY = "hisaab.v1";
const UPI_ID = "shop@upi";
const state = { customers: [], route: { view: "overview" }, search: "", lang: localStorage.getItem("hisaab.lang") || "en" };
const els = {};

function money(value) {
  return "Rs. " + Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
}

function dateText(value) {
  return new Date(value + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.customers)) state.customers = parsed.customers;
    }
  } catch (e) {
    console.error(e);
    showStorageAlert("Saved data could not be read. Import may be needed.");
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ customers: state.customers }));
    hideStorageAlert();
  } catch (e) {
    showStorageAlert("Could not save data. Storage may be full.");
  }
}

function showStorageAlert(text) {
  if (els.storageAlert) {
    els.storageAlert.textContent = text;
    els.storageAlert.hidden = false;
  }
}

function hideStorageAlert() {
  if (els.storageAlert) els.storageAlert.hidden = true;
}

function toast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => {
    els.toast.textContent = "";
    els.toast.classList.remove("show");
  }, 2600);
}

function initTheme() {
  const saved = localStorage.getItem("hisaab.theme") || "light";
  document.documentElement.dataset.theme = saved;
  updateThemeButton();
}

function toggleTheme() {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("hisaab.theme", next);
  updateThemeButton();
}

function updateThemeButton() {
  const dark = document.documentElement.dataset.theme === "dark";
  els.theme.innerHTML = dark ? '<svg><use href="#i-sun"/></svg>' : '<svg><use href="#i-moon"/></svg>';
  els.theme.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  els.theme.setAttribute("title", dark ? "Switch to light mode" : "Switch to dark mode");
}

function totals() {
  const totalDue = state.customers.reduce((sum, customer) => sum + customerBalance(customer), 0);
  const totalCredit = state.customers.reduce((sum, customer) => sum + customer.entries.reduce((a, e) => a + (e.type === "credit" ? e.amount : 0), 0), 0);
  const totalPayment = state.customers.reduce((sum, customer) => sum + customer.entries.reduce((a, e) => a + (e.type === "payment" ? e.amount : 0), 0), 0);
  return { totalDue, totalCredit, totalPayment };
}

function customerBalance(customer) {
  return customer.entries.reduce((sum, e) => sum + (e.type === "credit" ? e.amount : -e.amount), 0);
}

function openDialog(title, html) {
  els.dialogTitle.textContent = title;
  els.dialogBody.innerHTML = html;
  els.dialog.showModal();
}

function closeDialog() {
  els.dialog.close();
  els.dialogBody.innerHTML = "";
}

function render() {
  const view = state.route.view;
  updateNav();
  if (view === "customer") {
    const customer = state.customers.find(c => c.id === state.route.id);
    if (!customer) {
      state.route = { view: "overview" };
      render();
      return;
    }
    renderCustomer(customer);
  } else {
    renderOverview();
  }
}

function updateNav() {
  document.querySelectorAll(".nav-item").forEach(el => el.removeAttribute("aria-current"));
  const map = { overview: "nav-overview", customers: "nav-customers" };
  const active = state.route.view === "customer" ? "customers" : state.route.view;
  const nav = document.getElementById(map[active]);
  if (nav) nav.setAttribute("aria-current", "page");
  document.getElementById("location").textContent = state.route.view === "customer" ? "Customer" : (state.route.view === "customers" ? "Customers" : "Overview");
}

function renderOverview() {
  const t = totals();
  const filtered = state.customers.filter(c => c.name.toLowerCase().includes(state.search.toLowerCase()) || c.phone.includes(state.search));
  els.view.innerHTML = `
    <section class="page-head">
      <div>
        <p class="eyebrow">Dashboard</p>
        <h1>Today's ledger, in one place.</h1>
        <p class="intro">Track credit, payments, balances and reminders for every customer.</p>
      </div>
      <button class="button primary" type="button" data-action="add-customer"><svg><use href="#i-plus"/></svg>Add customer</button>
      <button class="button secondary" type="button" data-action="export-csv"><svg><use href="#i-import"/></svg>Export CSV</button>
    </section>
    <section class="summary">
      <article class="hero">
        <p class="hero-label"><span class="hero-icon"><svg><use href="#i-wallet"/></svg></span> Total outstanding</p>
        <span class="amount">${money(t.totalDue)}</span>
        <p>Across ${state.customers.length} customer${state.customers.length === 1 ? "" : "s"}</p>
        <svg class="hero-art"><use href="#i-book"/></svg>
      </article>
      <div class="metrics">
        <article class="metric"><span class="metric-icon"><svg><use href="#i-up"/></svg></span><div><p>Credit given</p><span class="amount">${money(t.totalCredit)}</span></div></article>
        <article class="metric"><span class="metric-icon"><svg><use href="#i-down"/></svg></span><div><p>Payments received</p><span class="amount">${money(t.totalPayment)}</span></div></article>
        <article class="metric"><span class="metric-icon warm"><svg><use href="#i-people"/></svg></span><div><p>Customers</p><span class="amount">${state.customers.length}</span></div></article>
      </div>
    </section>
    <section class="panel" id="overdue">
      <div class="panel-head"><div><h2>Overdue customers</h2><p>Sorted by days since last payment.</p></div></div>
      ${overdueRows()}
    </section>
    <section class="panel" id="customers">
      <div class="panel-head">
        <div><h2>Customers</h2><p>Tap a customer to open the ledger.</p></div>
        <label class="search" aria-label="Search customers"><svg><use href="#i-search"/></svg><input id="search" value="${escapeAttr(state.search)}" placeholder="Search by name or phone"></label>
      </div>
      ${filtered.length ? `
        <div class="list-head"><span>Name</span><span class="phone-head">Phone</span><span>Balance</span><span></span></div>
        ${filtered.map(customerRow).join("")}
      ` : emptyState()}
    </section>
  `;
  bindOverviewEvents();
}

function escapeAttr(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function customerRow(customer) {
  const balance = customerBalance(customer);
  const initials = customer.name.trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  return `
    <article class="customer-row" data-customer="${customer.id}">
      <div class="customer-name"><span class="avatar">${initials}</span>${escapeHtml(customer.name)}</div>
      <span class="phone">${escapeHtml(customer.phone)}</span>
      <span class="customer-balance ${balance > 0 ? "due" : "paid"}">${money(balance)}</span>
      <button class="icon-button" type="button" data-action="whatsapp" data-customer="${customer.id}" aria-label="WhatsApp reminder"><svg><use href="#i-chat"/></svg></button>
    </article>
  `;
}

function emptyState() {
  return `
    <div class="empty">
      <svg class="empty-art"><use href="#i-people"/></svg>
      <h3>No customers yet</h3>
      <p>Add your first customer to start recording credit and payments.</p>
      <button class="button primary" type="button" data-action="add-customer"><svg><use href="#i-plus"/></svg>Add customer</button>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function overdueRows() {
  const overdue = state.customers
    .map(c => {
      const payments = c.entries.filter(e => e.type === "payment");
      const lastPayment = payments.length ? payments.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b).date : null;
      const days = lastPayment ? Math.floor((Date.now() - new Date(lastPayment + "T00:00:00")) / 86400000) : (c.entries.length ? 999 : 0);
      return { c, balance: customerBalance(c), days, lastPayment };
    })
    .filter(x => x.balance > 0)
    .sort((a, b) => b.days - a.days);
  if (!overdue.length) return `<div class="empty"><h3>No overdue customers</h3></div>`;
  return overdue.map(x => `<div class="customer-row" data-customer="${x.c.id}" style="cursor:pointer;"><div class="customer-name">${escapeHtml(x.c.name)}</div><span class="phone">${x.lastPayment ? "Last paid " + dateText(x.lastPayment) : "No payments"}</span><span class="customer-balance due">${money(x.balance)} (${x.days}d)</span><span></span></div>`).join("");
}

function bindOverviewEvents() {
  document.getElementById("search")?.addEventListener("input", e => {
    state.search = e.target.value;
    renderOverview();
  });
  els.view.querySelectorAll("[data-action='export-csv']").forEach(btn => btn.addEventListener("click", exportCSV));
  els.view.querySelectorAll("#overdue .customer-row").forEach(row => row.addEventListener("click", () => {
    state.route = { view: "customer", id: row.dataset.customer };
    render();
  }));
  els.view.querySelectorAll("[data-action='whatsapp']").forEach(btn => btn.addEventListener("click", e => {
    e.stopPropagation();
    sendReminder(btn.dataset.customer);
  }));
  els.view.querySelectorAll(".customer-row").forEach(row => row.addEventListener("click", e => {
    if (e.target.closest("button")) return;
    state.route = { view: "customer", id: row.dataset.customer };
    render();
  }));
}

function openAddCustomer() {
  openDialog("Add customer", `
    <form class="form" id="customer-form">
      <label>Name <input name="name" required maxlength="60" placeholder="Customer name"></label>
      <label>Phone number <input name="phone" required inputmode="numeric" pattern="[0-9]{10}" maxlength="10" placeholder="10-digit mobile number"></label>
      <p class="hint">Indian mobile numbers must be 10 digits.</p>
      <div id="customer-error" class="form-error" role="alert"></div>
      <div class="form-actions"><button class="button secondary" type="button" data-action="close">Cancel</button><button class="button primary" type="submit">Save customer</button></div>
    </form>
  `);
  document.getElementById("customer-form").addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    if (!/^[0-9]{10}$/.test(phone)) {
      document.getElementById("customer-error").textContent = "Phone number must be exactly 10 digits.";
      return;
    }
    if (state.customers.some(c => c.phone === phone)) {
      document.getElementById("customer-error").textContent = "A customer with this phone already exists.";
      return;
    }
    state.customers.unshift({ id: uid(), name, phone, entries: [] });
    save();
    closeDialog();
    toast("Customer added");
    render();
  });
}

function renderCustomer(customer) {
  const balance = customerBalance(customer);
  const sorted = [...customer.entries].sort((a, b) => new Date(b.date) - new Date(a.date) || b.id.localeCompare(a.id));
  els.view.innerHTML = `
    <a href="#customers" class="back" data-action="back"><svg><use href="#i-back"/></svg>Back to customers</a>
    <section class="page-head">
      <div>
        <p class="eyebrow">Customer ledger</p>
        <h1>${escapeHtml(customer.name)}</h1>
        <p class="intro">${escapeHtml(customer.phone)} · Balance ${money(balance)}</p>
      </div>
      <div class="detail-actions">
        <button class="button primary" type="button" data-action="credit"><svg><use href="#i-up"/></svg>Credit</button>
        <button class="button secondary" type="button" data-action="payment"><svg><use href="#i-down"/></svg>Payment</button>
        <button class="button reminder" type="button" data-action="whatsapp" data-customer="${customer.id}"><svg><use href="#i-chat"/></svg>Reminder</button>
        <button class="button secondary" type="button" data-action="delete-customer" data-customer="${customer.id}"><svg><use href="#i-close"/></svg>Delete</button>
      </div>
    </section>
    <section class="panel">
      <div class="panel-head"><div><h2>Transactions</h2><p>Newest first.</p></div></div>
      ${sorted.length ? sorted.map(e => entryRow(customer, e)).join("") : `
        <div class="empty"><svg class="empty-art"><use href="#i-wallet"/></svg><h3>No transactions yet</h3><p>Add credit or payment to begin.</p></div>
      `}
    </section>
  `;
  els.view.querySelector("[data-action='back']")?.addEventListener("click", e => {
    e.preventDefault();
    state.route = { view: "overview" };
    render();
  });
  els.view.querySelector("[data-action='credit']")?.addEventListener("click", () => openEntry(customer, "credit"));
  els.view.querySelector("[data-action='payment']")?.addEventListener("click", () => openEntry(customer, "payment"));
  els.view.querySelector("[data-action='whatsapp']")?.addEventListener("click", () => sendReminder(customer.id));
  els.view.querySelector("[data-action='delete-customer']")?.addEventListener("click", () => deleteCustomer(customer.id));
  els.view.querySelectorAll("[data-action='view-image']").forEach(btn => btn.addEventListener("click", () => openImage(btn.dataset.src)));
  els.view.querySelectorAll("[data-action='edit-entry']").forEach(btn => btn.addEventListener("click", () => {
    const customer = state.customers.find(c => c.id === btn.dataset.customer);
    const entry = customer?.entries.find(e => e.id === btn.dataset.entry);
    if (customer && entry) openEditEntry(customer, entry);
  }));
  els.view.querySelectorAll("[data-action='delete-entry']").forEach(btn => btn.addEventListener("click", () => {
    const customer = state.customers.find(c => c.id === btn.dataset.customer);
    if (!customer) return;
    if (!window.confirm("Delete this transaction?")) return;
    customer.entries = customer.entries.filter(e => e.id !== btn.dataset.entry);
    save();
    render();
  }));
}

function entryRow(customer, entry) {
  const isCredit = entry.type === "credit";
  return `
    <article class="entry">
      <span class="entry-icon ${isCredit ? "credit" : ""}"><svg><use href="${isCredit ? "#i-up" : "#i-down"}"/></svg></span>
      <div>
        <strong>${isCredit ? "Credit" : "Payment"}</strong>
        <p>${escapeHtml(entry.note || "No note")}</p>
        ${entry.image ? `<button class="attachment" type="button" data-action="view-image" data-src="${entry.image}"><img src="${entry.image}" alt="Payment screenshot"><span>View screenshot</span></button>` : ""}
        <div style="margin-top:6px;display:flex;gap:6px;">
          <button class="button secondary" style="min-height:30px;padding:4px 8px;font-size:.75rem;" type="button" data-action="edit-entry" data-customer="${customer.id}" data-entry="${entry.id}">Edit</button>
          <button class="button secondary" style="min-height:30px;padding:4px 8px;font-size:.75rem;" type="button" data-action="delete-entry" data-customer="${customer.id}" data-entry="${entry.id}">Delete</button>
        </div>
      </div>
      <div class="entry-value">
        <span class="amount ${isCredit ? "due" : "paid"}">${isCredit ? "+" : "-"} ${money(entry.amount)}</span>
        <time datetime="${entry.date}">${dateText(entry.date)}</time>
      </div>
    </article>
  `;
}

function openEntry(customer, type) {
  const title = type === "credit" ? "Add credit" : "Add payment";
  openDialog(title, `
    <form class="form" id="entry-form">
      <div class="fields">
        <label>Amount (Rs.) <input name="amount" type="number" min="0.01" step="0.01" required placeholder="0"></label>
        <label>Date <input name="date" type="date" required value="${new Date().toISOString().slice(0, 10)}"></label>
      </div>
      <label>Note <input name="note" maxlength="120" placeholder="What was sold / paid"></label>
      ${type === "payment" ? `<label>Screenshot (optional) <input name="image" id="entry-image" type="file" accept="image/*"></label><div id="ocr-status" class="hint"></div>` : ""}
      <div id="entry-error" class="form-error" role="alert"></div>
      <div class="form-actions"><button class="button secondary" type="button" data-action="close">Cancel</button><button class="button primary" type="submit">Save entry</button></div>
    </form>
  `);
  const imgInput = document.getElementById("entry-image");
  if (imgInput) {
    imgInput.addEventListener("change", async () => {
      const file = imgInput.files && imgInput.files[0];
      if (!file) return;
      const status = document.getElementById("ocr-status");
      status.textContent = "Reading amount from screenshot...";
      try {
        const { amounts } = await detectAmount(file);
        if (!amounts.length) {
          status.textContent = "Couldn't read the amount. Please enter it manually.";
          return;
        }
        const amountInput = document.querySelector('#entry-form input[name="amount"]');
        if (amounts.length === 1) {
          amountInput.value = amounts[0];
          status.textContent = `Detected amount: ${amounts[0]}. You can edit it.`;
        } else {
          status.innerHTML = "Multiple amounts detected: " + amounts.map(a => `<button type="button" class="button secondary" style="min-height:28px;padding:2px 8px;font-size:.75rem;" data-ocr="${a}">${a}</button>`).join(" ") + " — click to use.";
          status.querySelectorAll("[data-ocr]").forEach(b => b.addEventListener("click", () => { amountInput.value = b.dataset.ocr; }));
        }
      } catch (e) {
        document.getElementById("ocr-status").textContent = "Couldn't read the amount. Please enter it manually.";
      }
    });
  }
  document.getElementById("entry-form").addEventListener("submit", async e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const amount = Number(data.get("amount"));
    const date = String(data.get("date") || "");
    const note = String(data.get("note") || "").trim();
    if (!amount || amount <= 0) {
      document.getElementById("entry-error").textContent = "Enter a valid amount.";
      return;
    }
    if (!date) {
      document.getElementById("entry-error").textContent = "Choose a date.";
      return;
    }
    let image = "";
    const file = data.get("image");
    if (file && file.size) {
      try {
        image = await readFileAsDataUrl(file);
      } catch (err) {
        document.getElementById("entry-error").textContent = "Could not read screenshot.";
        return;
      }
    }
    customer.entries.unshift({ id: uid(), type, amount, date, note, image });
    save();
    closeDialog();
    toast(type === "credit" ? "Credit added" : "Payment added");
    render();
  });
}

function openEditEntry(customer, entry) {
  openDialog("Edit entry", `
    <form class="form" id="edit-form">
      <div class="fields">
        <label>Amount (Rs.) <input name="amount" type="number" min="0.01" step="0.01" required value="${entry.amount}"></label>
        <label>Date <input name="date" type="date" required value="${entry.date}"></label>
      </div>
      <label>Note <input name="note" maxlength="120" value="${escapeAttr(entry.note)}"></label>
      <div id="edit-error" class="form-error" role="alert"></div>
      <div class="form-actions"><button class="button secondary" type="button" data-action="close">Cancel</button><button class="button primary" type="submit">Save</button></div>
    </form>
  `);
  document.getElementById("edit-form").addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const amount = Number(data.get("amount"));
    const date = String(data.get("date") || "");
    const note = String(data.get("note") || "").trim();
    if (!amount || amount <= 0) { document.getElementById("edit-error").textContent = "Enter a valid amount."; return; }
    if (!date) { document.getElementById("edit-error").textContent = "Choose a date."; return; }
    entry.amount = amount;
    entry.date = date;
    entry.note = note;
    save();
    closeDialog();
    toast("Entry updated");
    render();
  });
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function openImage(src) {
  openDialog("Payment screenshot", `<img class="full-image" src="${src}" alt="Payment screenshot">`);
}

function sendReminder(customerId) {
  const customer = state.customers.find(c => c.id === customerId);
  if (!customer) return;
  const balance = customerBalance(customer);
  if (balance <= 0) {
    toast("No outstanding balance");
    return;
  }
  const message = `Namaste ${customer.name}, your outstanding balance at our shop is Rs. ${balance.toLocaleString("en-IN")}. Pay via UPI: upi://pay?pa=${UPI_ID}&pn=Shop&am=${balance}&cu=INR. Thank you.`;
  const url = `https://wa.me/91${customer.phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function deleteCustomer(customerId) {
  const customer = state.customers.find(c => c.id === customerId);
  if (!customer) return;
  const ok = window.confirm(`Delete ${customer.name} and all their transactions? This cannot be undone.`);
  if (!ok) return;
  state.customers = state.customers.filter(c => c.id !== customerId);
  save();
  state.route = { view: "overview" };
  toast("Customer deleted");
  render();
}

function addImportedEntry(customer, entry) {
  const normalized = normalizeEntry(entry);
  if (!normalized) return;
  const signature = `${normalized.type}|${normalized.amount}|${normalized.date}|${normalized.note}`;
  const exists = customer.entries.some(e => `${e.type}|${e.amount}|${e.date}|${e.note}` === signature);
  if (exists) return;
  customer.entries.unshift(normalized);
}

function openImport() {
  openDialog("Import JSON", `
    <form class="form" id="import-form">
      <label>JSON data <textarea name="json" placeholder='{"customers":[...]}' required></textarea></label>
      <details><summary>Expected format</summary><pre>{
  "customers": [
    { "name": "Ravi", "phone": "9876543210", "entries": [
      { "type": "credit", "amount": 500, "date": "2026-01-10", "note": "Rice and dal" },
      { "type": "payment", "amount": 200, "date": "2026-01-12", "note": "Paid cash" }
    ]}
  ]
}</pre></details>
      <div id="import-error" class="form-error" role="alert"></div>
      <div class="form-actions"><button class="button secondary" type="button" data-action="close">Cancel</button><button class="button primary" type="submit">Import</button></div>
    </form>
  `);
  document.getElementById("import-form").addEventListener("submit", e => {
    e.preventDefault();
    const raw = new FormData(e.target).get("json");
    try {
      const parsed = JSON.parse(String(raw));
      const incomingCustomers = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.customers) ? parsed.customers : []);
      const topLevelEntries = Array.isArray(parsed?.entries) ? parsed.entries : [];
      if (!Array.isArray(incomingCustomers)) throw new Error("Missing customers array");
      let count = 0;
      const existingPhones = new Set(state.customers.map(c => c.phone));
      incomingCustomers.forEach(item => {
        if (!item || !item.name || !/^[0-9]{10}$/.test(String(item.phone || ""))) return;
        const phone = String(item.phone);
        if (!existingPhones.has(phone)) {
          state.customers.unshift({ id: item.id || uid(), name: String(item.name).trim(), phone, entries: [] });
          existingPhones.add(phone);
        }
        const customer = state.customers.find(c => c.phone === phone);
        const nestedEntries = Array.isArray(item.entries) ? item.entries : [];
        nestedEntries.forEach(e => addImportedEntry(customer, e));
        count++;
      });
      topLevelEntries.forEach(e => {
        if (!e || !/^[0-9]{10}$/.test(String(e.phone || ""))) return;
        const customer = state.customers.find(c => c.phone === String(e.phone));
        if (!customer) return;
        addImportedEntry(customer, e);
      });
      save();
      closeDialog();
      toast(`Imported ${count} customer${count === 1 ? "" : "s"}`);
      render();
    } catch (err) {
      document.getElementById("import-error").textContent = "Invalid JSON. Check the format and try again.";
    }
  });
}

function exportCSV() {
  const rows = [["Customer", "Phone", "Type", "Amount", "Date", "Note", "Balance"]];
  state.customers.forEach(c => {
    const bal = customerBalance(c);
    if (!c.entries.length) rows.push([c.name, c.phone, "", "", "", "", bal]);
    c.entries.forEach(e => rows.push([c.name, c.phone, e.type, e.amount, e.date, e.note, bal]));
  });
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hisaab-export.csv";
  a.click();
  URL.revokeObjectURL(url);
  toast("CSV exported");
}

function normalizeEntry(entry) {
  if (!entry || (entry.type !== "credit" && entry.type !== "payment")) return null;
  const amount = Number(entry.amount);
  if (!amount || amount <= 0) return null;
  return {
    id: entry.id || uid(),
    type: entry.type,
    amount,
    date: entry.date || new Date().toISOString().slice(0, 10),
    note: String(entry.note || "").trim(),
    image: typeof entry.image === "string" ? entry.image : ""
  };
}

function toggleLang() {
  state.lang = state.lang === "hi" ? "en" : "hi";
  localStorage.setItem("hisaab.lang", state.lang);
  updateLangButton();
  render();
}
function updateLangButton() {
  if (els.lang) els.lang.textContent = state.lang === "hi" ? "HI" : "EN";
}
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

function parseAmounts(text) {
  const matches = [];
  const regex = /(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)/gi;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const num = Number(m[1].replace(/,/g, ""));
    if (!isNaN(num) && num > 0) matches.push(num);
  }
  return [...new Set(matches)];
}

async function detectAmount(file) {
  if (!window.Tesseract) {
    await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js");
  }
  const result = await window.Tesseract.recognize(file, "eng");
  const text = result?.data?.text || "";
  return { text, amounts: parseAmounts(text) };
}

function handleRoute() {
  const hash = location.hash.replace(/^#/, "");
  if (hash === "customers") state.route = { view: "customers" };
  else if (hash.startsWith("customer/")) state.route = { view: "customer", id: hash.slice(9) };
  else state.route = { view: "overview" };
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  els.view = document.getElementById("view");
  els.dialog = document.getElementById("dialog");
  els.dialogTitle = document.getElementById("dialog-title");
  els.dialogBody = document.getElementById("dialog-body");
  els.toast = document.getElementById("toast");
  els.lang = document.getElementById("lang");
  els.theme = document.getElementById("theme");
  initTheme();
  load();
  els.theme.addEventListener("click", toggleTheme);
  els.lang.addEventListener("click", toggleLang);
  updateLangButton();
  els.dialog.addEventListener("click", e => { if (e.target === els.dialog) closeDialog(); });
  document.addEventListener("click", e => {
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (action === "close") closeDialog();
    if (action === "import") openImport();
  });
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
});
