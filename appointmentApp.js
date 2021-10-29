//defining a global variable for database that can be accessed by any function
let DB;

let form = document.querySelector("form");
let patientName = document.querySelector("#patient-name");
let contact = document.querySelector("#contact");
let date = document.querySelector("#date");
let time = document.querySelector("#time");
let symptoms = document.querySelector("#symptoms");
let consultations = document.querySelector("#consultations");
let services = document.querySelector("#services");

document.addEventListener("DOMContentLoaded", () => {
    //creation of DB
    let scheduleDB = window.indexedDB.open("consultations", 1);

    scheduleDB.onerror = function(){
        console.log("Oops, there is an error!")
    }
    scheduleDB.onsuccess = function() {
        console.log("You are good to go!")

        DB = scheduleDB.result;

        showConsultations();
    }
    scheduleDB.onupgradeneeded = function(e) {
        //onupgradeneeded is for updating the database structure
        let db = e.target.result;

        let objectStore = db.createObjectStore("consultations", {
            keyPath: "key", autoIncrement: true});
            //createObjectStore

        objectStore.createIndex("patientname", "patientname", {unique:false});
        objectStore.createIndex("contact", "contact", {unique:false});
        objectStore.createIndex("date", "date", {unique:false});
        objectStore.createIndex("time", "time", {unique:false});
        objectStore.createIndex("symptoms", "symptoms", {unique:false});

        //console.log("No issues user!")  
    }
    //consultations
form.addEventListener("submit", addConsultations);

function addConsultations(e) {
    e.preventDefault();
    let newConsultation = {
        patientname: patientName.value,
        contact: contact.value,
        date: date.value,
        time: time.value,
        symptoms: symptoms.value
    }

    let transaction = DB.transaction(["consultations"], "readwrite");
    let objectStore = transaction.objectStore("consultations");

    let request = objectStore.add(newConsultation);

    request.onsuccess = () => {
        form.reset();
    }
    transaction.oncomplete = () => {
        console.log("add new schedule");

        showConsultations();
    }
    transaction.onerror = () => {
        console.log("kindly fix the error")
    }
}

function showConsultations() {
    while(consultations.firstChild) {
        consultations.removeChild(consultations.firstChild);
    }
    let objectStore = DB.transaction("consultations").objectStore("consultations");

    objectStore.openCursor().onsuccess = function(e) {
        let cursor = e.target.result;
         if(cursor) {
             let consultationHTML = document.createElement("li");

             consultationHTML.setAttribute("data-consultation-id", cursor.value.key);
             consultationHTML.classList.add("list-group-item");

             consultationHTML.innerHTML = `<p class="font-weight-bold">
             Patient Name: <span class="font-weight-light"> ${
                 cursor.value.patientname} </span> </p>
             <p class="font-weight-bold">
             Date: <span class="font-weight-light"> ${
                 cursor.value.data} </span> </p>
             <p class="font-weight-bold">
             Time: <span class="font-weight-light"> ${
                 cursor.value.time} </span> </p>
             <p class="font-weight-bold">
             Symptoms: <span class="font-weight-light"> ${
                 cursor.value.symptoms} </span> </p>;`

            //cancel btn
            const cancelBtn = document.createElement("button");

            cancelBtn.classList.add("btn", "btn-danger");
            cancelBtn.innerHTML = "Cancel";
            cancelBtn.onclick = removeConsultation;


            consultationHTML.appendChild(cancelBtn);
            consultations.appendChild(consultationHTML);

            cursor.continue();
         }

         else {
            if (!consultations.firstChild) {
                services.textContent = "Change Your Visiting Hours";

                let noSchedule = document.createElement("p");
                noSchedule.classList.add("text-center");
                noSchedule.textContent = "No results Found";

                consultations.appendChild(noSchedule);
            }
            else {
                services.textContent = "Cancel Your Consultations"
            }
         }
    }
}

function removeConsultation(e) {
    let scheduleID = Number(e.target.parentElement.getAttribute("data-consultation-id"));
    
    let transaction = DB.transaction(["consultations"], "readwrite");
    let objectStore = transaction.objectStore("consultations");
    objectStore.delete(scheduleID);

    transaction.oncomplete = () => {
        e.target.parentElement.parentElement.removeChild(e.target.parentElement);
        if(!consultations.firstChild) {
            services.textContent = "Change Your Visiting Hours"

            let noSchedule = document.createElement("p");
            noSchedule.classList.add("text-center");
            noSchedule.textContent = "No results Found";

            consultations.appendChild(noSchedule);
        }
        else {
            services.textContent = "Cancel Your Consultations";
        }
    }
}

});

