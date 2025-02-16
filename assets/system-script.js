
// جلب كود التاجر من عنوان الصفحة تلقائيًا
const traderId = window.location.pathname.split("/").pop().replace(".html", "");

// تحديث الرصيد تلقائيًا كل ثانية في صفحة التاجر
function autoUpdateTraderBalance() {
    const savedBalance = localStorage.getItem(`balance_${traderId}`);
    
    if (savedBalance) {
        document.getElementById("currentBalance").textContent = savedBalance;
    }
}

// استماع لتحديثات الرصيد من `index.html`
window.addEventListener("storage", function (event) {
    if (event.key === "balanceUpdate") {
        const updateData = JSON.parse(event.newValue);
        if (updateData.traderId === traderId) {
            document.getElementById("currentBalance").textContent = updateData.newBalance;
        }
    }
});

// تنفيذ التحديث كل ثانية
setInterval(autoUpdateTraderBalance, 1000);

// تحديث الرصيد عند فتح الصفحة
autoUpdateTraderBalance();

