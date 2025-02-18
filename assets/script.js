


document.addEventListener("DOMContentLoaded", function () {
    loadTraders();
});

// تحميل التجار المخزنين في localStorage عند فتح الصفحة
function loadTraders() {
    let tradersList = document.getElementById("tradersList");
    tradersList.innerHTML = ""; // مسح القائمة قبل إعادة التحميل
    let traders = JSON.parse(localStorage.getItem("traders")) || [];

    // إضافة التجار إلى القائمة (الأحدث أولًا)
    traders.reverse().forEach(traderId => {
        // استعادة الرصيد المخزن لكل تاجر عند تحميل الصفحة
let savedBalance = localStorage.getItem(`balance_${traderId}`);
if (savedBalance) {
    let balanceDisplay = document.getElementById(`currentBalance${traderId}`);
    if (balanceDisplay) {
        balanceDisplay.textContent = savedBalance;
    }
}

        addTrader(traderId, false);
    });
}

// إنشاء عنصر HTML لعرض التاجر في القائمة
function createTraderElement(traderId) {
    let div = document.createElement("div");
    div.classList.add("trader-box");
    div.id = `trader-${traderId}`; // تعيين ID للتاجر ليسهل حذفه

    div.innerHTML = `
        <p> كود التاجر: ${traderId}</p>
        <p> الرصيد: <span id="currentBalance${traderId}">0</span> جنيه</p>
        <input type="number" id="balance${traderId}" placeholder="أدخل الرصيد">
        <button onclick="updateBalance('${traderId}')">حفظ الرصيد</button>
        <a href="users/${traderId}.html" download>📂 تحميل صفحة التاجر</a>
        <button class="delete-btn" onclick="deleteTrader('${traderId}')">❌ حذف</button>
    `;

    return div;
}
// استعادة الرصيد المخزن إذا كان موجودًا
let savedBalance = localStorage.getItem(`balance_${traderId}`);
if (savedBalance) {
    document.getElementById(`currentBalance${traderId}`).textContent = savedBalance;
}


// تحديث الرصيد في localStorage وإرسال تحديث إلى جميع الصفحات المفتوحة
function updateBalance(traderId) {
    let inputField = document.getElementById(`balance${traderId}`);
    let balanceDisplay = document.getElementById(`currentBalance${traderId}`);

    if (inputField && balanceDisplay) {
        let newBalance = inputField.value.trim();

        if (newBalance !== "") {
            // حفظ الرصيد في localStorage
            localStorage.setItem(`balance_${traderId}`, newBalance);
            balanceDisplay.textContent = newBalance;

            // إرسال إشارة تحديث عبر localStorage لجميع الصفحات المفتوحة
            localStorage.setItem("balanceUpdate", JSON.stringify({ traderId, newBalance }));

            showPopup(`✅ تم تحديث رصيد التاجر ${traderId} بنجاح!`);
        }
    }
}


// فتح صفحة التاجر عند الضغط على الزر
function openTraderPage(traderId) {
    window.location.href = `users/${traderId}.html`;
}

// دالة لطلب كود التاجر
function promptForTrader() {
    let traderId = prompt("أدخل كود التاجر الجديد:");
    if (!traderId || traderId.trim() === "") {
        showPopup("⚠️ يجب إدخال كود التاجر!");
        return;
    }

    traderId = traderId.trim();
    let traders = JSON.parse(localStorage.getItem("traders")) || [];

    if (traders.includes(traderId)) {
        showPopup("⚠️ هذا التاجر موجود بالفعل!");
        return;
    }

    addTrader(traderId, true);
    createTraderFile(traderId);
}

// إضافة تاجر جديد
function addTrader(traderId, save) {
    const tradersList = document.getElementById("tradersList");

    if (save) {
        let traders = JSON.parse(localStorage.getItem("traders")) || [];
        traders.unshift(traderId); // إضافة التاجر في البداية
        localStorage.setItem("traders", JSON.stringify(traders));
    }

    let traderElement = createTraderElement(traderId);
    tradersList.prepend(traderElement); // إضافة التاجر في الأعلى
}
// إنشاء عنصر التاجر في الصفحة
function addTrader(traderId, save) {
    const tradersList = document.getElementById("tradersList");

    if (save) {
        let traders = JSON.parse(localStorage.getItem("traders")) || [];
        traders.unshift(traderId);
        localStorage.setItem("traders", JSON.stringify(traders));
    }

    let traderElement = document.createElement("div");
    traderElement.classList.add("trader-box");
    traderElement.id = `trader-${traderId}`;

    traderElement.innerHTML = `
        <p>🔹 كود التاجر: ${traderId}</p>
        <p>💰 الرصيد: <span id="currentBalance${traderId}">0</span> جنيه</p>
        <input type="number" id="balance${traderId}" placeholder="أدخل الرصيد">
        <button onclick="updateBalance('${traderId}')">حفظ الرصيد</button>
        <button class="delete-btn" onclick="deleteTrader('${traderId}')">❌ حذف</button>
        <!--<a href="users/${traderId}.html" class="redirect"> تحميل صفحة التاجر</a>-->
    `;

    tradersList.prepend(traderElement);

    // استعادة الرصيد المخزن إذا كان موجودًا
    let savedBalance = localStorage.getItem(`balance_${traderId}`);
    if (savedBalance) {
        document.getElementById(`currentBalance${traderId}`).textContent = savedBalance;
    }
}

// حذف تاجر من القائمة و localStorage
function deleteTrader(traderId) {
    if (!confirm(`هل أنت متأكد من حذف التاجر ${traderId}؟`)) return;

    let traders = JSON.parse(localStorage.getItem("traders")) || [];

    // إزالة التاجر من القائمة
    traders = traders.filter(id => id !== traderId);
    localStorage.setItem("traders", JSON.stringify(traders));

    // إزالة العنصر من الصفحة
    document.getElementById(`trader-${traderId}`).remove();

    showPopup(`❌ تم حذف التاجر ${traderId} بنجاح!`);
}

// دالة لإظهار إشعار Popup
function showPopup(message) {
    const popup = document.getElementById("popup");
    
    popup.textContent = message;
    popup.style.display = "block";
    popup.style.opacity = "1";

    setTimeout(() => {
        popup.style.opacity = "0"; // تأثير اختفاء تدريجي
        setTimeout(() => {
            popup.style.display = "none";
        }, 500);
    }, 3000);
}

// إنشاء ملف التاجر تلقائيًا
function createTraderFile(traderId) {
    const pageContent = `
<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pronox partner</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>

    <div class="container">
    <img src="assets/pronox.png" class="the-logo">
        <h2>${traderId}</h2>
        <p>رصيدك :<span id="currentBalance">0</span> جنيه</p>
        <div class="the-links">
            <a id="partnersstore" href="#" class="link-button">your store</a>
            <a id="pronoxstoreLink" href="#" class="link-button">pronox store</a>
            <a id="orderform" href="#" class="link-button">Order now</a>
            <a id="withdraw" href="#" class="link-button">withdraw</a>
        </div>
        <div class="social-media">
            <a id="facebooklink" href="#"><img src="assets/facebook.png"></a>
            <a id="instagramlink" href="#"><img src="assets/instagram.png"></a>
            <a id="telegramlink" href="#"><img src="assets/telegram.png"></a>
        </div>
    </div>
    <script src="assets/system-script.js"></script>
    <script src="assets/script.js"></script>
    <script src="assets/links.js"></script>
    

</body>
</html>`;

    const blob = new Blob([pageContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${traderId}.html`;
    link.click();

    showPopup(`✅ تم إنشاء ملف ${traderId}.html`);
}

