const STORAGE_KEY = "hisaab.v1";
const UPI_ID = "shop@upi";
const state = { customers: [], route: { view: "overview" }, search: "", lang: localStorage.getItem("hisaab.lang") || "en" };
const els = {};

const I18N = {
  en: {
    brandTag: "SHOP LEDGER",
    navWorkspace: "WORKSPACE",
    navOverview: "Overview",
    navCustomers: "Customers",
    navTools: "TOOLS",
    importJson: "Import JSON",
    storedLocal: "Stored on this device",
    noAccount: "No account needed",
    workspace: "Workspace",
    footerNote: "Your ledger is private and saved in this browser.",
    toggleHindi: "Toggle Hindi labels",
    switchDark: "Switch to dark mode",
    switchLight: "Switch to light mode",
    closeDialog: "Close dialog",
    searchCustomers: "Search customers",
    sidebarLabel: "Sidebar",
    mainNavLabel: "Main navigation",
    title: "Hisaab | Shop Ledger",
    renderErrorTitle: "Something went wrong displaying this page",
    renderErrorBody: "Your saved data may be damaged. You can reset it and re-import from a backup.",
    resetData: "Reset saved data",
    exportCsv: "Export CSV",
    confirmReset: "Delete all saved customers and transactions on this device? This cannot be undone.",
    dataReset: "Saved data reset",
    locOverview: "Overview",
    locCustomers: "Customers",
    locCustomer: "Customer",
    eyebrowDashboard: "Dashboard",
    overviewTitle: "Today's ledger, in one place.",
    overviewIntro: "Track credit, payments, balances and reminders for every customer.",
    addCustomer: "Add customer",
    totalOutstanding: "Total outstanding",
    acrossOne: "Across 1 customer",
    acrossMany: "Across {count} customers",
    creditGiven: "Credit given",
    paymentsReceived: "Payments received",
    customersMetric: "Customers",
    overdueTitle: "Overdue customers",
    overdueSub: "Sorted by days since last payment.",
    customersTitle: "Customers",
    customersSub: "Tap a customer to open the ledger.",
    searchPlaceholder: "Search by name or phone",
    colName: "Name",
    colPhone: "Phone",
    colBalance: "Balance",
    whatsappReminder: "WhatsApp reminder",
    noCustomersTitle: "No customers yet",
    noCustomersBody: "Add your first customer to start recording credit and payments.",
    noOverdue: "No overdue customers",
    lastPaid: "Last paid {date}",
    noPayments: "No payments",
    addCustomerTitle: "Add customer",
    fieldName: "Name",
    namePlaceholder: "Customer name",
    fieldPhone: "Phone number",
    phonePlaceholder: "10-digit mobile number",
    phoneHint: "Indian mobile numbers must be 10 digits.",
    cancel: "Cancel",
    saveCustomer: "Save customer",
    errPhone10: "Phone number must be exactly 10 digits.",
    errPhoneExists: "A customer with this phone already exists.",
    toastCustomerAdded: "Customer added",
    backToCustomers: "Back to customers",
    customerLedger: "Customer ledger",
    balanceLabel: "Balance {amount}",
    credit: "Credit",
    payment: "Payment",
    reminder: "Reminder",
    delete: "Delete",
    transactions: "Transactions",
    newestFirst: "Newest first.",
    noTransactionsTitle: "No transactions yet",
    noTransactionsBody: "Add credit or payment to begin.",
    noNote: "No note",
    viewScreenshot: "View screenshot",
    edit: "Edit",
    addCreditTitle: "Add credit",
    addPaymentTitle: "Add payment",
    fieldAmount: "Amount (Rs.)",
    fieldDate: "Date",
    fieldNote: "Note",
    notePlaceholder: "What was sold / paid",
    fieldScreenshot: "Screenshot (optional)",
    saveEntry: "Save entry",
    ocrReading: "Reading amount from screenshot...",
    ocrFail: "Couldn't read the amount. Please enter it manually.",
    ocrDetectedOne: "Detected amount: {amount}. You can edit it.",
    ocrMultiple: "Multiple amounts detected: ",
    ocrClickUse: "— click to use.",
    errAmount: "Enter a valid amount.",
    errDate: "Choose a date.",
    errScreenshot: "Could not read screenshot.",
    toastCreditAdded: "Credit added",
    toastPaymentAdded: "Payment added",
    editEntryTitle: "Edit entry",
    save: "Save",
    toastEntryUpdated: "Entry updated",
    paymentScreenshot: "Payment screenshot",
    toastNoBalance: "No outstanding balance",
    confirmDeleteTransaction: "Delete this transaction?",
    reminderMessage: "Namaste {name}, your outstanding balance at our shop is Rs. {balance}. Pay via UPI: upi://pay?pa={upi}&pn=Shop&am={amount}&cu=INR. Thank you.",
    confirmDeleteCustomer: "Delete {name} and all their transactions? This cannot be undone.",
    toastCustomerDeleted: "Customer deleted",
    importTitle: "Import JSON",
    jsonData: "JSON data",
    expectedFormat: "Expected format",
    importBtn: "Import",
    importToastOne: "Imported 1 customer",
    importToastMany: "Imported {count} customers",
    errJson: "Invalid JSON. Check the format and try again.",
    csvCustomer: "Customer",
    csvPhone: "Phone",
    csvType: "Type",
    csvAmount: "Amount",
    csvDate: "Date",
    csvNote: "Note",
    csvBalance: "Balance",
    toastCsvExported: "CSV exported",
    storageReadError: "Saved data could not be read. Import may be needed.",
    storageSaveError: "Could not save data. Storage may be full."
  },
  hi: {
    brandTag: "दुकान बही",
    navWorkspace: "कार्यक्षेत्र",
    navOverview: "अवलोकन",
    navCustomers: "ग्राहक",
    navTools: "औज़ार",
    importJson: "JSON आयात करें",
    storedLocal: "इस डिवाइस पर संग्रहीत",
    noAccount: "खाते की ज़रूरत नहीं",
    workspace: "कार्यक्षेत्र",
    footerNote: "आपकी बही निजी है और इसी ब्राउज़र में सुरक्षित रहती है।",
    toggleHindi: "हिंदी लेबल टॉगल करें",
    switchDark: "डार्क मोड पर जाएँ",
    switchLight: "लाइट मोड पर जाएँ",
    closeDialog: "डायलॉग बंद करें",
    searchCustomers: "ग्राहक खोजें",
    sidebarLabel: "साइडबार",
    mainNavLabel: "मुख्य नेविगेशन",
    title: "हिसाब | दुकान बही",
    renderErrorTitle: "यह पेज दिखाते समय कुछ गड़बड़ हुई",
    renderErrorBody: "आपका सहेजा डेटा खराब हो सकता है। आप इसे रीसेट करके बैकअप से फिर आयात कर सकते हैं।",
    resetData: "सहेजा डेटा रीसेट करें",
    exportCsv: "CSV निर्यात करें",
    confirmReset: "इस डिवाइस के सभी सहेजे ग्राहक और लेन-देन हटाएँ? इसे वापस नहीं लाया जा सकता।",
    dataReset: "सहेजा डेटा रीसेट हो गया",
    locOverview: "अवलोकन",
    locCustomers: "ग्राहक",
    locCustomer: "ग्राहक",
    eyebrowDashboard: "डैशबोर्ड",
    overviewTitle: "आज की बही, एक ही जगह।",
    overviewIntro: "हर ग्राहक का उधार, भुगतान, बैलेंस और रिमाइंडर ट्रैक करें।",
    addCustomer: "ग्राहक जोड़ें",
    totalOutstanding: "कुल बकाया",
    acrossOne: "1 ग्राहक में",
    acrossMany: "{count} ग्राहकों में",
    creditGiven: "दिया गया उधार",
    paymentsReceived: "प्राप्त भुगतान",
    customersMetric: "ग्राहक",
    overdueTitle: "बकाया ग्राहक",
    overdueSub: "आखिरी भुगतान के बाद के दिनों के अनुसार।",
    customersTitle: "ग्राहक",
    customersSub: "बही खोलने के लिए ग्राहक पर टैप करें।",
    searchPlaceholder: "नाम या फ़ोन से खोजें",
    colName: "नाम",
    colPhone: "फ़ोन",
    colBalance: "बैलेंस",
    whatsappReminder: "WhatsApp रिमाइंडर",
    noCustomersTitle: "अभी कोई ग्राहक नहीं",
    noCustomersBody: "उधार और भुगतान दर्ज करने के लिए अपना पहला ग्राहक जोड़ें।",
    noOverdue: "कोई बकाया ग्राहक नहीं",
    lastPaid: "आखिरी भुगतान {date}",
    noPayments: "कोई भुगतान नहीं",
    addCustomerTitle: "ग्राहक जोड़ें",
    fieldName: "नाम",
    namePlaceholder: "ग्राहक का नाम",
    fieldPhone: "फ़ोन नंबर",
    phonePlaceholder: "10 अंकों का मोबाइल नंबर",
    phoneHint: "भारतीय मोबाइल नंबर 10 अंकों के होने चाहिए।",
    cancel: "रद्द करें",
    saveCustomer: "ग्राहक सहेजें",
    errPhone10: "फ़ोन नंबर ठीक 10 अंकों का होना चाहिए।",
    errPhoneExists: "इस फ़ोन नंबर का ग्राहक पहले से मौजूद है।",
    toastCustomerAdded: "ग्राहक जोड़ा गया",
    backToCustomers: "ग्राहकों पर वापस जाएँ",
    customerLedger: "ग्राहक बही",
    balanceLabel: "बैलेंस {amount}",
    credit: "उधार",
    payment: "भुगतान",
    reminder: "रिमाइंडर",
    delete: "हटाएँ",
    transactions: "लेन-देन",
    newestFirst: "नए पहले।",
    noTransactionsTitle: "अभी कोई लेन-देन नहीं",
    noTransactionsBody: "शुरू करने के लिए उधार या भुगतान जोड़ें।",
    noNote: "कोई नोट नहीं",
    viewScreenshot: "स्क्रीनशॉट देखें",
    edit: "संपादित करें",
    addCreditTitle: "उधार जोड़ें",
    addPaymentTitle: "भुगतान जोड़ें",
    fieldAmount: "राशि (रुपये)",
    fieldDate: "तारीख़",
    fieldNote: "नोट",
    notePlaceholder: "क्या बेचा / दिया गया",
    fieldScreenshot: "स्क्रीनशॉट (वैकल्पिक)",
    saveEntry: "एंट्री सहेजें",
    ocrReading: "स्क्रीनशॉट से राशि पढ़ी जा रही है...",
    ocrFail: "राशि नहीं पढ़ी जा सकी। कृपया मैन्युअल रूप से दर्ज करें।",
    ocrDetectedOne: "पहचानी गई राशि: {amount}। आप इसे बदल सकते हैं।",
    ocrMultiple: "कई राशियाँ मिलीं: ",
    ocrClickUse: "— उपयोग करने के लिए क्लिक करें।",
    errAmount: "सही राशि दर्ज करें।",
    errDate: "तारीख़ चुनें।",
    errScreenshot: "स्क्रीनशॉट पढ़ा नहीं जा सका।",
    toastCreditAdded: "उधार जोड़ा गया",
    toastPaymentAdded: "भुगतान जोड़ा गया",
    editEntryTitle: "एंट्री संपादित करें",
    save: "सहेजें",
    toastEntryUpdated: "एंट्री अपडेट हुई",
    paymentScreenshot: "भुगतान स्क्रीनशॉट",
    toastNoBalance: "कोई बकाया नहीं",
    confirmDeleteTransaction: "यह लेन-देन हटाएँ?",
    reminderMessage: "नमस्ते {name}, हमारी दुकान पर आपका बकाया राशि {balance} रुपये है। UPI से भुगतान करें: upi://pay?pa={upi}&pn=Shop&am={amount}&cu=INR। धन्यवाद।",
    confirmDeleteCustomer: "{name} और उनके सभी लेन-देन हटाएँ? इसे वापस नहीं लाया जा सकता।",
    toastCustomerDeleted: "ग्राहक हटाया गया",
    importTitle: "JSON आयात करें",
    jsonData: "JSON डेटा",
    expectedFormat: "अपेक्षित प्रारूप",
    importBtn: "आयात करें",
    importToastOne: "1 ग्राहक आयात किया",
    importToastMany: "{count} ग्राहक आयात किए",
    errJson: "अमान्य JSON। प्रारूप जाँचें और फिर कोशिश करें।",
    csvCustomer: "ग्राहक",
    csvPhone: "फ़ोन",
    csvType: "प्रकार",
    csvAmount: "राशि",
    csvDate: "तारीख़",
    csvNote: "नोट",
    csvBalance: "बैलेंस",
    toastCsvExported: "CSV निर्यात किया गया",
    storageReadError: "सहेजा डेटा पढ़ा नहीं जा सका। आयात की ज़रूरत हो सकती है।",
    storageSaveError: "डेटा सहेजा नहीं जा सका। स्टोरेज भर सकता है।"
  }
};

function t(key, vars) {
  const dict = I18N[state.lang] || I18N.en;
  let s = dict[key] != null ? dict[key] : (I18N.en[key] != null ? I18N.en[key] : key);
  if (vars) {
    Object.keys(vars).forEach(k => { s = s.split("{" + k + "}").join(String(vars[k])); });
  }
  return s;
}

function money(value) {
  return "Rs. " + Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 0 });
}

function dateText(value) {
  return new Date(value + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function normalizeEntry(entry) {
  if (!entry || typeof entry !== "object") return null;
  if (entry.type !== "credit" && entry.type !== "payment") return null;
  const amount = Number(entry.amount);
  if (!amount || amount <= 0 || !isFinite(amount)) return null;
  return {
    id: entry.id ? String(entry.id) : uid(),
    type: entry.type,
    amount,
    date: /^\d{4}-\d{2}-\d{2}$/.test(String(entry.date || "")) ? entry.date : new Date().toISOString().slice(0, 10),
    note: String(entry.note || "").trim(),
    image: typeof entry.image === "string" ? entry.image : ""
  };
}

function normalizeCustomer(customer) {
  if (!customer || typeof customer !== "object") return null;
  const name = String(customer.name || "").trim();
  const phone = String(customer.phone || "").trim();
  if (!name || !/^[0-9]{10}$/.test(phone)) return null;
  const entries = Array.isArray(customer.entries)
    ? customer.entries.map(normalizeEntry).filter(Boolean)
    : [];
  return {
    id: customer.id ? String(customer.id) : uid(),
    name,
    phone,
    entries
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.customers)) {
        const seen = new Set();
        state.customers = parsed.customers
          .map(normalizeCustomer)
          .filter(c => {
            if (!c || seen.has(c.phone)) return false;
            seen.add(c.phone);
            return true;
          });
      }
    }
  } catch (e) {
    console.error(e);
    showStorageAlert(t("storageReadError"));
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ customers: state.customers }));
    hideStorageAlert();
  } catch (e) {
    showStorageAlert(t("storageSaveError"));
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
  els.theme.setAttribute("aria-label", dark ? t("switchLight") : t("switchDark"));
  els.theme.setAttribute("title", dark ? t("switchLight") : t("switchDark"));
}

function customerEntries(customer) {
  return Array.isArray(customer && customer.entries) ? customer.entries : [];
}

function totals() {
  const totalDue = state.customers.reduce((sum, customer) => sum + customerBalance(customer), 0);
  const totalCredit = state.customers.reduce((sum, customer) => sum + customerEntries(customer).reduce((a, e) => a + (e.type === "credit" ? e.amount : 0), 0), 0);
  const totalPayment = state.customers.reduce((sum, customer) => sum + customerEntries(customer).reduce((a, e) => a + (e.type === "payment" ? e.amount : 0), 0), 0);
  return { totalDue, totalCredit, totalPayment };
}

function customerBalance(customer) {
  return customerEntries(customer).reduce((sum, e) => sum + (e.type === "credit" ? e.amount : -e.amount), 0);
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
  try {
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
  } catch (e) {
    console.error("Render failed:", e);
    if (els.view) {
      els.view.innerHTML = `
        <section class="panel">
          <div class="empty">
            <h3>${t("renderErrorTitle")}</h3>
            <p>${t("renderErrorBody")}</p>
            <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
              <button class="button primary" type="button" data-action="reset-data">${t("resetData")}</button>
              <button class="button secondary" type="button" data-action="export-csv">${t("exportCsv")}</button>
            </div>
          </div>
        </section>`;
      els.view.querySelectorAll("[data-action='reset-data']").forEach(btn => btn.addEventListener("click", () => {
        if (!window.confirm(t("confirmReset"))) return;
        state.customers = [];
        state.route = { view: "overview" };
        save();
        render();
        toast(t("dataReset"));
      }));
      els.view.querySelectorAll("[data-action='export-csv']").forEach(btn => btn.addEventListener("click", exportCSV));
    }
  }
}

function updateNav() {
  document.querySelectorAll(".nav-item").forEach(el => el.removeAttribute("aria-current"));
  const map = { overview: "nav-overview", customers: "nav-customers" };
  const active = state.route.view === "customer" ? "customers" : state.route.view;
  const nav = document.getElementById(map[active]);
  if (nav) nav.setAttribute("aria-current", "page");
  document.getElementById("location").textContent = state.route.view === "customer" ? t("locCustomer") : (state.route.view === "customers" ? t("locCustomers") : t("locOverview"));
}

function renderOverview() {
  const t2 = totals();
  const filtered = state.customers.filter(c => String(c.name || "").toLowerCase().includes(state.search.toLowerCase()) || String(c.phone || "").includes(state.search));
  els.view.innerHTML = `
    <section class="page-head">
      <div>
        <p class="eyebrow">${t("eyebrowDashboard")}</p>
        <h1>${t("overviewTitle")}</h1>
        <p class="intro">${t("overviewIntro")}</p>
      </div>
      <button class="button primary" type="button" data-action="add-customer"><svg><use href="#i-plus"/></svg>${t("addCustomer")}</button>
      <button class="button secondary" type="button" data-action="export-csv"><svg><use href="#i-import"/></svg>${t("exportCsv")}</button>
    </section>
    <section class="summary">
      <article class="hero">
        <p class="hero-label"><span class="hero-icon"><svg><use href="#i-wallet"/></svg></span> ${t("totalOutstanding")}</p>
        <span class="amount">${money(t2.totalDue)}</span>
        <p>${state.customers.length === 1 ? t("acrossOne") : t("acrossMany", { count: state.customers.length })}</p>
        <svg class="hero-art"><use href="#i-book"/></svg>
      </article>
      <div class="metrics">
        <article class="metric"><span class="metric-icon"><svg><use href="#i-up"/></svg></span><div><p>${t("creditGiven")}</p><span class="amount">${money(t2.totalCredit)}</span></div></article>
        <article class="metric"><span class="metric-icon"><svg><use href="#i-down"/></svg></span><div><p>${t("paymentsReceived")}</p><span class="amount">${money(t2.totalPayment)}</span></div></article>
        <article class="metric"><span class="metric-icon warm"><svg><use href="#i-people"/></svg></span><div><p>${t("customersMetric")}</p><span class="amount">${state.customers.length}</span></div></article>
      </div>
    </section>
    <section class="panel" id="overdue">
      <div class="panel-head"><div><h2>${t("overdueTitle")}</h2><p>${t("overdueSub")}</p></div></div>
      ${overdueRows()}
    </section>
    <section class="panel" id="customers">
      <div class="panel-head">
        <div><h2>${t("customersTitle")}</h2><p>${t("customersSub")}</p></div>
        <label class="search" aria-label="${t("searchCustomers")}"><svg><use href="#i-search"/></svg><input id="search" value="${escapeAttr(state.search)}" placeholder="${t("searchPlaceholder")}"></label>
      </div>
      ${filtered.length ? `
        <div class="list-head"><span>${t("colName")}</span><span class="phone-head">${t("colPhone")}</span><span>${t("colBalance")}</span><span></span></div>
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
      <button class="icon-button" type="button" data-action="whatsapp" data-customer="${customer.id}" aria-label="${t("whatsappReminder")}"><svg><use href="#i-chat"/></svg></button>
    </article>
  `;
}

function emptyState() {
  return `
    <div class="empty">
      <svg class="empty-art"><use href="#i-people"/></svg>
      <h3>${t("noCustomersTitle")}</h3>
      <p>${t("noCustomersBody")}</p>
      <button class="button primary" type="button" data-action="add-customer"><svg><use href="#i-plus"/></svg>${t("addCustomer")}</button>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function overdueRows() {
  const overdue = state.customers
    .map(c => {
      const entries = customerEntries(c);
      const payments = entries.filter(e => e.type === "payment");
      const lastPayment = payments.length ? payments.reduce((a, b) => new Date(a.date) > new Date(b.date) ? a : b).date : null;
      const days = lastPayment ? Math.floor((Date.now() - new Date(lastPayment + "T00:00:00")) / 86400000) : (entries.length ? 999 : 0);
      return { c, balance: customerBalance(c), days, lastPayment };
    })
    .filter(x => x.balance > 0)
    .sort((a, b) => b.days - a.days);
  if (!overdue.length) return `<div class="empty"><h3>${t("noOverdue")}</h3></div>`;
  return overdue.map(x => `<div class="customer-row" data-customer="${x.c.id}" style="cursor:pointer;"><div class="customer-name">${escapeHtml(x.c.name)}</div><span class="phone">${x.lastPayment ? t("lastPaid", { date: dateText(x.lastPayment) }) : t("noPayments")}</span><span class="customer-balance due">${money(x.balance)} (${x.days}d)</span><span></span></div>`).join("");
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
  openDialog(t("addCustomerTitle"), `
    <form class="form" id="customer-form">
      <label>${t("fieldName")} <input name="name" required maxlength="60" placeholder="${t("namePlaceholder")}"></label>
      <label>${t("fieldPhone")} <input name="phone" required inputmode="numeric" pattern="[0-9]{10}" maxlength="10" placeholder="${t("phonePlaceholder")}"></label>
      <p class="hint">${t("phoneHint")}</p>
      <div id="customer-error" class="form-error" role="alert"></div>
      <div class="form-actions"><button class="button secondary" type="button" data-action="close">${t("cancel")}</button><button class="button primary" type="submit">${t("saveCustomer")}</button></div>
    </form>
  `);
  document.getElementById("customer-form").addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    if (!/^[0-9]{10}$/.test(phone)) {
      document.getElementById("customer-error").textContent = t("errPhone10");
      return;
    }
    if (state.customers.some(c => c.phone === phone)) {
      document.getElementById("customer-error").textContent = t("errPhoneExists");
      return;
    }
    state.customers.unshift({ id: uid(), name, phone, entries: [] });
    save();
    closeDialog();
    toast(t("toastCustomerAdded"));
    render();
  });
}

function renderCustomer(customer) {
  const balance = customerBalance(customer);
  const sorted = [...customerEntries(customer)].sort((a, b) => new Date(b.date) - new Date(a.date) || b.id.localeCompare(a.id));
  els.view.innerHTML = `
    <a href="#customers" class="back" data-action="back"><svg><use href="#i-back"/></svg>${t("backToCustomers")}</a>
    <section class="page-head">
      <div>
        <p class="eyebrow">${t("customerLedger")}</p>
        <h1>${escapeHtml(customer.name)}</h1>
        <p class="intro">${escapeHtml(customer.phone)} · ${t("balanceLabel", { amount: money(balance) })}</p>
      </div>
      <div class="detail-actions">
        <button class="button primary" type="button" data-action="credit"><svg><use href="#i-up"/></svg>${t("credit")}</button>
        <button class="button secondary" type="button" data-action="payment"><svg><use href="#i-down"/></svg>${t("payment")}</button>
        <button class="button reminder" type="button" data-action="whatsapp" data-customer="${customer.id}"><svg><use href="#i-chat"/></svg>${t("reminder")}</button>
        <button class="button secondary" type="button" data-action="delete-customer" data-customer="${customer.id}"><svg><use href="#i-close"/></svg>${t("delete")}</button>
      </div>
    </section>
    <section class="panel">
      <div class="panel-head"><div><h2>${t("transactions")}</h2><p>${t("newestFirst")}</p></div></div>
      ${sorted.length ? sorted.map(e => entryRow(customer, e)).join("") : `
        <div class="empty"><svg class="empty-art"><use href="#i-wallet"/></svg><h3>${t("noTransactionsTitle")}</h3><p>${t("noTransactionsBody")}</p></div>
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
    if (!window.confirm(t("confirmDeleteTransaction") || "Delete this transaction?")) return;
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
        <strong>${isCredit ? t("credit") : t("payment")}</strong>
        <p>${escapeHtml(entry.note || t("noNote"))}</p>
        ${entry.image ? `<button class="attachment" type="button" data-action="view-image" data-src="${entry.image}"><img src="${entry.image}" alt="${t("paymentScreenshot")}"><span>${t("viewScreenshot")}</span></button>` : ""}
        <div style="margin-top:6px;display:flex;gap:6px;">
          <button class="button secondary" style="min-height:30px;padding:4px 8px;font-size:.75rem;" type="button" data-action="edit-entry" data-customer="${customer.id}" data-entry="${entry.id}">${t("edit")}</button>
          <button class="button secondary" style="min-height:30px;padding:4px 8px;font-size:.75rem;" type="button" data-action="delete-entry" data-customer="${customer.id}" data-entry="${entry.id}">${t("delete")}</button>
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
  const title = type === "credit" ? t("addCreditTitle") : t("addPaymentTitle");
  openDialog(title, `
    <form class="form" id="entry-form">
      <div class="fields">
        <label>${t("fieldAmount")} <input name="amount" type="number" min="0.01" step="0.01" required placeholder="0"></label>
        <label>${t("fieldDate")} <input name="date" type="date" required value="${new Date().toISOString().slice(0, 10)}"></label>
      </div>
      <label>${t("fieldNote")} <input name="note" maxlength="120" placeholder="${t("notePlaceholder")}"></label>
      ${type === "payment" ? `<label>${t("fieldScreenshot")} <input name="image" id="entry-image" type="file" accept="image/*"></label><div id="ocr-status" class="hint"></div>` : ""}
      <div id="entry-error" class="form-error" role="alert"></div>
      <div class="form-actions"><button class="button secondary" type="button" data-action="close">${t("cancel")}</button><button class="button primary" type="submit">${t("saveEntry")}</button></div>
    </form>
  `);
  const imgInput = document.getElementById("entry-image");
  if (imgInput) {
    imgInput.addEventListener("change", async () => {
      const file = imgInput.files && imgInput.files[0];
      if (!file) return;
      const status = document.getElementById("ocr-status");
      status.textContent = t("ocrReading");
      try {
        const { amounts } = await detectAmount(file);
        if (!amounts.length) {
          status.textContent = t("ocrFail");
          return;
        }
        const amountInput = document.querySelector('#entry-form input[name="amount"]');
        if (amounts.length === 1) {
          amountInput.value = amounts[0];
          status.textContent = t("ocrDetectedOne", { amount: amounts[0] });
        } else {
          status.innerHTML = t("ocrMultiple") + amounts.map(a => `<button type="button" class="button secondary" style="min-height:28px;padding:2px 8px;font-size:.75rem;" data-ocr="${a}">${a}</button>`).join(" ") + " " + t("ocrClickUse");
          status.querySelectorAll("[data-ocr]").forEach(b => b.addEventListener("click", () => { amountInput.value = b.dataset.ocr; }));
        }
      } catch (e) {
        document.getElementById("ocr-status").textContent = t("ocrFail");
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
      document.getElementById("entry-error").textContent = t("errAmount");
      return;
    }
    if (!date) {
      document.getElementById("entry-error").textContent = t("errDate");
      return;
    }
    let image = "";
    const file = data.get("image");
    if (file && file.size) {
      try {
        image = await readFileAsDataUrl(file);
      } catch (err) {
        document.getElementById("entry-error").textContent = t("errScreenshot");
        return;
      }
    }
    customer.entries.unshift({ id: uid(), type, amount, date, note, image });
    save();
    closeDialog();
    toast(type === "credit" ? t("toastCreditAdded") : t("toastPaymentAdded"));
    render();
  });
}

function openEditEntry(customer, entry) {
  openDialog(t("editEntryTitle"), `
    <form class="form" id="edit-form">
      <div class="fields">
        <label>${t("fieldAmount")} <input name="amount" type="number" min="0.01" step="0.01" required value="${entry.amount}"></label>
        <label>${t("fieldDate")} <input name="date" type="date" required value="${entry.date}"></label>
      </div>
      <label>${t("fieldNote")} <input name="note" maxlength="120" value="${escapeAttr(entry.note)}"></label>
      <div id="edit-error" class="form-error" role="alert"></div>
      <div class="form-actions"><button class="button secondary" type="button" data-action="close">${t("cancel")}</button><button class="button primary" type="submit">${t("save")}</button></div>
    </form>
  `);
  document.getElementById("edit-form").addEventListener("submit", e => {
    e.preventDefault();
    const data = new FormData(e.target);
    const amount = Number(data.get("amount"));
    const date = String(data.get("date") || "");
    const note = String(data.get("note") || "").trim();
    if (!amount || amount <= 0) { document.getElementById("edit-error").textContent = t("errAmount"); return; }
    if (!date) { document.getElementById("edit-error").textContent = t("errDate"); return; }
    entry.amount = amount;
    entry.date = date;
    entry.note = note;
    save();
    closeDialog();
    toast(t("toastEntryUpdated"));
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
  openDialog(t("paymentScreenshot"), `<img class="full-image" src="${src}" alt="${t("paymentScreenshot")}">`);
}

function sendReminder(customerId) {
  const customer = state.customers.find(c => c.id === customerId);
  if (!customer) return;
  const balance = customerBalance(customer);
  if (balance <= 0) {
    toast(t("toastNoBalance"));
    return;
  }
  const message = t("reminderMessage", {
    name: customer.name,
    balance: balance.toLocaleString("en-IN"),
    upi: UPI_ID,
    amount: balance
  });
  const url = `https://wa.me/91${customer.phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function deleteCustomer(customerId) {
  const customer = state.customers.find(c => c.id === customerId);
  if (!customer) return;
  const ok = window.confirm(t("confirmDeleteCustomer", { name: customer.name }));
  if (!ok) return;
  state.customers = state.customers.filter(c => c.id !== customerId);
  save();
  state.route = { view: "overview" };
  toast(t("toastCustomerDeleted"));
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
  openDialog(t("importTitle"), `
    <form class="form" id="import-form">
      <label>${t("jsonData")} <textarea name="json" placeholder='{"customers":[...]}' required></textarea></label>
      <details><summary>${t("expectedFormat")}</summary><pre>{
  "customers": [
    { "name": "Ravi", "phone": "9876543210", "entries": [
      { "type": "credit", "amount": 500, "date": "2026-01-10", "note": "Rice and dal" },
      { "type": "payment", "amount": 200, "date": "2026-01-12", "note": "Paid cash" }
    ]}
  ]
}</pre></details>
      <div id="import-error" class="form-error" role="alert"></div>
      <div class="form-actions"><button class="button secondary" type="button" data-action="close">${t("cancel")}</button><button class="button primary" type="submit">${t("importBtn")}</button></div>
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
      toast(count === 1 ? t("importToastOne") : t("importToastMany", { count }));
      render();
    } catch (err) {
      document.getElementById("import-error").textContent = t("errJson");
    }
  });
}

function exportCSV() {
  const rows = [[t("csvCustomer"), t("csvPhone"), t("csvType"), t("csvAmount"), t("csvDate"), t("csvNote"), t("csvBalance")]];
  state.customers.forEach(c => {
    const bal = customerBalance(c);
    const entries = customerEntries(c);
    if (!entries.length) rows.push([c.name, c.phone, "", "", "", "", bal]);
    entries.forEach(e => rows.push([c.name, c.phone, e.type, e.amount, e.date, e.note, bal]));
  });
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "hisaab-export.csv";
  a.click();
  URL.revokeObjectURL(url);
  toast(t("toastCsvExported"));
}

function toggleLang() {
  state.lang = state.lang === "hi" ? "en" : "hi";
  localStorage.setItem("hisaab.lang", state.lang);
  applyStaticTranslations();
  updateLangButton();
  updateThemeButton();
  render();
}
function updateLangButton() {
  if (els.lang) {
    els.lang.textContent = state.lang === "hi" ? "HI" : "EN";
    els.lang.setAttribute("aria-label", t("toggleHindi"));
    els.lang.setAttribute("title", t("toggleHindi"));
  }
}
function applyStaticTranslations() {
  document.documentElement.lang = state.lang === "hi" ? "hi" : "en-IN";
  document.title = t("title");
  const map = {
    brandTag: t("brandTag"),
    navWorkspace: t("navWorkspace"),
    navOverview: t("navOverview"),
    navCustomers: t("navCustomers"),
    navTools: t("navTools"),
    importJson: t("importJson"),
    storedLocal: t("storedLocal"),
    noAccount: t("noAccount"),
    workspace: t("workspace")
  };
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (map[key] != null) el.textContent = map[key];
  });
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.setAttribute("aria-label", t("sidebarLabel"));
  const nav = document.querySelector(".nav");
  if (nav) nav.setAttribute("aria-label", t("mainNavLabel"));
  const footer = document.querySelector(".footer");
  if (footer) footer.innerHTML = `<svg><use href="#i-lock"/></svg> ${t("footerNote")}`;
  const mobileImport = document.querySelector(".mobile-import");
  if (mobileImport) {
    mobileImport.setAttribute("aria-label", t("importJson"));
    mobileImport.setAttribute("title", t("importJson"));
  }
  const closeBtn = document.querySelector("[data-action='close']");
  if (closeBtn) closeBtn.setAttribute("aria-label", t("closeDialog"));
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
  applyStaticTranslations();
  els.theme.addEventListener("click", toggleTheme);
  els.lang.addEventListener("click", toggleLang);
  updateLangButton();
  els.dialog.addEventListener("click", e => { if (e.target === els.dialog) closeDialog(); });
  document.addEventListener("click", e => {
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (action === "close") closeDialog();
    if (action === "import") openImport();
    if (action === "add-customer") openAddCustomer();
  });
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
});
