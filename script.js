function getToday() {
  let d = new Date();
  return d.getFullYear() + "-" +
    String(d.getMonth()+1).padStart(2,'0') + "-" +
    String(d.getDate()).padStart(2,'0');
}

function getTime() {
  return new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});
}

let today = getToday();
document.getElementById("date").innerText = "📅 " + today;

let data = JSON.parse(localStorage.getItem("expenses")) || {};
let d = data[today];

if (!d) window.location.href = "index.html";

window.onload = function () {
  d.list.forEach((e,i)=> addToUI(e.item,e.amount,e.time,i));
  updateUI();
  updateMonthly();
};

// ADD
function addExpense() {
  let item = document.getElementById("item").value;
  let amount = Number(document.getElementById("amount").value);
  if (!item || amount<=0) return alert("Enter valid");

  let time = getTime();
  d.list.push({item,amount,time});
  d.total += amount;

  addToUI(item,amount,time,d.list.length-1);

  document.getElementById("item").value="";
  document.getElementById("amount").value="";

  save();
  updateUI();
  updateMonthly();
}

// UI
function addToUI(item,amount,time,index) {
  let li = document.createElement("li");

  li.innerHTML = `
    <div>
      ${item} - ₹${amount}
      <div class="small">(${time})</div>
    </div>

    <div>
      <button class="edit" onclick="editExpense(${index})">E</button>
      <button class="delete" onclick="deleteExpense(${index})">X</button>
    </div>
  `;

  document.getElementById("list").appendChild(li);
}

// DELETE
function deleteExpense(index) {
  let removed = d.list[index];
  d.total -= removed.amount;

  d.list.splice(index,1);
  reload();
}

// EDIT
function editExpense(index) {
  let e = d.list[index];

  let newItem = prompt("Edit item", e.item);
  let newAmount = Number(prompt("Edit amount", e.amount));

  if (!newItem || newAmount<=0) return;

  d.total -= e.amount;
  d.total += newAmount;

  d.list[index] = { item:newItem, amount:newAmount, time:getTime() };

  reload();
}

// RELOAD UI
function reload(){
  document.getElementById("list").innerHTML="";
  d.list.forEach((e,i)=> addToUI(e.item,e.amount,e.time,i));
  save();
  updateUI();
  updateMonthly();
}

// UPDATE
function updateUI(){
  document.getElementById("total").innerText = d.total;

  let bal = d.budget - d.total;
  let warn = document.getElementById("warning");
  let balText = document.getElementById("balance");

  if (d.total > d.budget){
    warn.innerText=`⚠️ Exceeded ₹${Math.abs(bal)}`;
    warn.className="red";
    balText.innerText="";
  } else {
    warn.innerText="✅ Within budget";
    warn.className="green";
    balText.innerText=`Remaining ₹${bal}`;
  }
}

// SAVE
function save(){
  localStorage.setItem("expenses", JSON.stringify(data));
}

// FINISH
function finishDay(){
  alert("Saved ✅");
  window.location.href="index.html";
}

// HISTORY
function viewHistory(){
  window.location.href="history.html";
}

// MONTH
function updateMonthly(){
  let month = today.slice(0,7);
  let sum = 0;

  for(let key in data){
    if(key.startsWith(month)){
      sum += data[key].total;
    }
  }

  document.getElementById("month").innerText = sum;
}