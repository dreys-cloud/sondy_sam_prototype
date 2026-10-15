const pages = ["home","services","booking","confirmation","admin"];
const storageKey = "sssms_demo_appointments_v1";
let appointments = loadAppointments();
let inventory = [
  {id:1,name:"Shampoo",stock:12},
  {id:2,name:"Conditioner",stock:4},
  {id:3,name:"Hair Color",stock:3},
  {id:4,name:"Treatment Cream",stock:8},
  {id:5,name:"Hair Serum",stock:10}
];
let toastTimer;
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const money = n => "₱" + Number(n).toLocaleString("en-PH");
const prices = {"Haircut & Styling":150,"Hair Coloring":500,"Hair Treatment":350,"Hair Rebond":1200,"Blow Dry":200,"Hair Spa":450};

function loadAppointments(){
  try { return JSON.parse(localStorage.getItem(storageKey) || "[]"); }
  catch { return []; }
}
function saveAppointments(){
  try { localStorage.setItem(storageKey, JSON.stringify(appointments)); }
  catch { showToast("Could not save to browser storage. The booking is visible until you refresh."); }
}
function showToast(message){
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("show"), 3000);
}
function navigate(page){
  if(!pages.includes(page)) return;
  $$(".page").forEach(el=>el.classList.toggle("active", el.id === `page-${page}`));
  $$(".nav-link").forEach(el=>el.classList.toggle("active", el.dataset.page === page));
  $("#mainNav").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded","false");
  window.scrollTo({top:0,behavior:"smooth"});
  if(page==="admin") renderAdmin();
}
$$("[data-page]").forEach(button=>button.addEventListener("click",()=>navigate(button.dataset.page)));
$("#menuToggle").addEventListener("click",()=>{
  const nav=$("#mainNav");
  const open=nav.classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded",String(open));
});

const dateInput=$("#date");
const today = new Date();
const localToday = new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().slice(0,10);
dateInput.min = localToday;

$$(".choose-service").forEach(button=>button.addEventListener("click",()=>{
  $("#service").value=button.dataset.service;
  navigate("booking");
  setStep(1);
  showToast(`${button.dataset.service} selected`);
}));

function setStep(step){
  $$(".booking-step").forEach(el=>el.classList.toggle("active", Number(el.dataset.step)===step));
  $$(".step").forEach(el=>{
    const n=Number(el.dataset.stepIndicator);
    el.classList.toggle("active",n===step);
    el.classList.toggle("done",n<step);
  });
  $("#formError").textContent="";
}
function error(message){ $("#formError").textContent=message; }
function validSchedule(){
  if(!$("#service").value) return "Please choose a salon service.";
  if(!dateInput.value) return "Please choose your preferred date.";
  if(dateInput.value<localToday) return "Please choose today or a future date.";
  if(!$("#time").value) return "Please choose a preferred time.";
  return "";
}
$("#toDetails").addEventListener("click",()=>{
  const issue=validSchedule();
  if(issue){error(issue);return;}
  setStep(2);
});
$("#toReview").addEventListener("click",()=>{
  const name=$("#customerName").value.trim();
  const phone=$("#phone").value.trim();
  const email=$("#email").value.trim();
  if(!name){error("Please enter your full name.");$("#customerName").focus();return;}
  if(!phone){error("Please enter a contact number.");$("#phone").focus();return;}
  if(email && !$("#email").checkValidity()){error("Please enter a valid email address or leave it blank.");$("#email").focus();return;}
  if(!/^[0-9+()\-\s]{7,20}$/.test(phone)){error("Please enter a valid contact number (at least 7 characters).");$("#phone").focus();return;}
  const scheduleIssue=validSchedule();
  if(scheduleIssue){setStep(1);error(scheduleIssue);return;}
  renderReview();
  setStep(3);
});
$$("[data-back-step]").forEach(button=>button.addEventListener("click",()=>setStep(Number(button.dataset.backStep))));
function dateLabel(value){
  if(!value) return "—";
  return new Date(value+"T12:00:00").toLocaleDateString("en-PH",{year:"numeric",month:"long",day:"numeric"});
}
function currentFormData(){
  return {
    service:$("#service").value,
    date:dateInput.value,
    time:$("#time").value,
    name:$("#customerName").value.trim(),
    phone:$("#phone").value.trim(),
    email:$("#email").value.trim(),
    notes:$("#notes").value.trim(),
    price:prices[$("#service").value] || 0
  };
}
function renderReview(){
  const d=currentFormData();
  const rows=[
    ["Service",d.service],["Estimated price",money(d.price)],["Date",dateLabel(d.date)],
    ["Preferred time",d.time],["Full name",d.name],["Contact number",d.phone],["Email",d.email||"Not provided"],["Notes",d.notes||"None"]
  ];
  $("#reviewBox").innerHTML=rows.map(([label,value])=>`<div class="review-row"><span>${escapeHTML(label)}</span><strong>${escapeHTML(String(value))}</strong></div>`).join("");
}
function escapeHTML(value){
  return String(value).replace(/[&<>"']/g, char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
$("#bookingForm").addEventListener("submit",event=>{
  event.preventDefault();
  const issue=validSchedule();
  if(issue){setStep(1);error(issue);return;}
  const d=currentFormData();
  if(!d.name||!d.phone){setStep(2);error("Please complete your name and contact number.");return;}
  d.id = "SS-" + String(Date.now()).slice(-7);
  d.createdAt = new Date().toISOString();
  appointments.unshift(d);
  saveAppointments();
  $("#confirmName").textContent=d.name.split(" ")[0];
  $("#confirmationDetails").innerHTML=[
    ["Reference number",d.id],["Service",d.service],["Estimated price",money(d.price)],
    ["Preferred date",dateLabel(d.date)],["Preferred time",d.time],["Contact number",d.phone]
  ].map(([label,value])=>`<div class="review-row"><span>${escapeHTML(label)}</span><strong>${escapeHTML(String(value))}</strong></div>`).join("");
  $("#bookingForm").reset();
  dateInput.min=localToday;
  setStep(1);
  navigate("confirmation");
});
$("#bookAnother").addEventListener("click",()=>{navigate("booking");setStep(1);});
$("#refreshAdmin").addEventListener("click",()=>{appointments=loadAppointments();renderAdmin();showToast("Dashboard refreshed");});

function renderAdmin(){
  appointments=loadAppointments();
  $("#appointmentCount").textContent=appointments.length;
  $("#productCount").textContent=inventory.length;
  $("#lowStockCount").textContent=inventory.filter(p=>p.stock<=5).length;
  const list=$("#appointmentList");
  if(!appointments.length){
    list.innerHTML='<div class="empty-state"><span>▦</span><strong>No appointments yet</strong><p>Bookings made through the prototype will appear here.</p></div>';
  } else {
    list.innerHTML=appointments.slice(0,8).map(a=>`<article class="appointment-item"><strong>${escapeHTML(a.name)} · ${escapeHTML(a.service)}</strong><span>${escapeHTML(dateLabel(a.date))} at ${escapeHTML(a.time)} · ${escapeHTML(a.phone)}</span><span>Reference: ${escapeHTML(a.id)}</span></article>`).join("");
  }
  $("#inventoryBody").innerHTML=inventory.map(p=>`<tr><td>${escapeHTML(p.name)}</td><td>${p.stock}</td><td><span class="stock-status ${p.stock<=5?"low":""}">${p.stock<=5?"Low stock":"In stock"}</span></td><td><button class="stock-update" data-stock-id="${p.id}" aria-label="Update stock for ${escapeHTML(p.name)}">+ Update</button></td></tr>`).join("");
  $$("[data-stock-id]").forEach(button=>button.addEventListener("click",()=>{
    const product=inventory.find(p=>p.id===Number(button.dataset.stockId));
    const answer=prompt(`Update stock quantity for ${product.name}:`,String(product.stock));
    if(answer===null) return;
    const quantity=Number(answer);
    if(!Number.isInteger(quantity)||quantity<0||quantity>9999){showToast("Enter a whole number from 0 to 9999.");return;}
    product.stock=quantity;
    renderAdmin();
    showToast(`${product.name} stock updated`);
  }));
}
renderAdmin();
