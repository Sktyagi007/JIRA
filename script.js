let addBtn = document.querySelector(".add-btn");
let modalCont = document.querySelector(".model-cont");
let taskAreaCont = document.querySelector(".textarea-cont");
let mainCont = document.querySelector(".main-cont");
let allPriorityColor = document.querySelectorAll(".priority-color");
let toolBoxColors = document.querySelectorAll(".color");
let removeBtn = document.querySelector(".remove-btn");
let addModal = true;
let removeFlag = false;
let colors = ['lightpink','blue','green','black'];
let modalPriorityColor = colors[colors.length-1];
var uid = new ShortUniqueId();

let ticketArr = [];

if(localStorage.getItem("tickets")){
    let str = localStorage.getItem("tickets");
    let arr = JSON.parse(str);
    ticketArr = arr;
    for(let i = 0; i<arr.length;i++){
        let ticketObj = arr[i];
        createTicket(ticketObj.color,ticketObj.task,ticketObj.id);
    }
}

for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener("click", function () {
        let currentColor = toolBoxColors[i].classList[1];
        let filteredArr = [];
        for (let i = 0; i < ticketArr.length; i++) {
            if (ticketArr[i].color == currentColor) {
                filteredArr.push(ticketArr[i]);
            }
        }
        // console.log(filteredArr);
        let allTickets = document.querySelectorAll(".ticket-cont");
        for (let j = 0; j < allTickets.length; j++) {
            allTickets[j].remove();
        }
        for (let i = 0; i < filteredArr.length; i++) {
            let ticket = filteredArr[i];
            let color = ticket.color;
            let task = ticket.task;
            let id = ticket.id;
            createTicket(color, task, id)
        }
    })

    toolBoxColors[i].addEventListener("dblclick",function(){
        let allTickets = document.querySelectorAll(".ticket-cont");
        for (let j = 0; j < allTickets.length; j++) {
            allTickets[j].remove();
        }
        for (let i = 0; i < ticketArr.length; i++) {
            let ticket = ticketArr[i];
            let color = ticket.color;
            let task = ticket.task;
            let id = ticket.id;
            createTicket(color, task, id)
        }
    })
}

// step 1111111111111111111111111111111111111111111111
addBtn.addEventListener("click",function(){
    if(addModal){
        //show modal
        modalCont.style.display = "flex";
    }else{
        //hide modal
        modalCont.style.display = "none";
    }
    addModal = !addModal;
})

for(let i = 0; i<allPriorityColor.length; i++){
    let priorityDivOneColor = allPriorityColor[i];
    priorityDivOneColor.addEventListener("click",function(){
        for(let j = 0; j<allPriorityColor.length; j++){
            allPriorityColor[j].classList.remove("active");
        }
        priorityDivOneColor.classList.add("active");
        modalPriorityColor = priorityDivOneColor.classList[0];
    })
}
// step 2222222222222222222222222222222222222222222222222222
modalCont.addEventListener("keydown",function(e){
    let key = e.key;
    if(key == 'Enter'){
        createTicket(modalPriorityColor,taskAreaCont.value);
        taskAreaCont.value = "";
        modalCont.style.display = "none";
        addModal = !addModal;
    }
})

removeBtn.addEventListener("click",function(){
    if(removeFlag){
        removeBtn.style.color = 'black';
    }else{
        removeBtn.style.color = 'red';
    }
    removeFlag = !removeFlag;
})

// Step 333333333333333333333333333333333333333333333333333 
function createTicket(ticketColor,task,ticketId){

    let id;
    if (ticketId == undefined) {
        id = uid();
    } else {
        id = ticketId;
    }
    // <div class="ticket-cont">
    //         <div class="ticket-color"></div>
    //         <div class="ticket-id">#qzu03</div>
    //         <div class="task-area">some task</div>
    //     </div>
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute('class','ticket-cont');
    ticketCont.innerHTML = `<div class="ticket-color ${ticketColor}"></div>
                            <div class="ticket-id">#${id}</div>
                            <div class="task-area">${task}</div>
                            <div class="lock-unlock"><i class="fa fa-lock"></i></div>`
    mainCont.appendChild(ticketCont);

    // lock-unlock handle
    let lockUnlockBtn = ticketCont.querySelector(".lock-unlock i");
    let taskArea = ticketCont.querySelector(".task-area");
    lockUnlockBtn.addEventListener("click",function(){
        if(lockUnlockBtn.classList.contains("fa-lock")){
            lockUnlockBtn.classList.remove("fa-lock");
            lockUnlockBtn.classList.add("fa-unlock");
            taskArea.setAttribute("contentEditable","true");
        }else{
            lockUnlockBtn.classList.remove("fa-unlock");
            lockUnlockBtn.classList.add("fa-lock");
            taskArea.setAttribute("contentEditable","false");
        }
        let ticketIdx = getTicketIdx(id);
        ticketArr[ticketIdx].task = taskArea.textContent;
        updateLocalStorage();
    })

    // handling ticket delete
    ticketCont.addEventListener("click",function(){
        if(removeFlag){
            ticketCont.remove();

            let ticketIdx = getTicketIdx(id);
            ticketArr.splice(ticketIdx,1);
            updateLocalStorage();
        }

    })

    // handlink ticket color band
    let ticketColorBand = ticketCont.querySelector(".ticket-color");
    ticketColorBand.addEventListener("click",function(){
        let currentTicketColor = ticketColorBand.classList[1];
        let currentTicketColorIdx = 0;
        for(let i = 0; i<colors.length; i++){
            if(currentTicketColor == colors[i]){
                currentTicketColorIdx = i;
                break;
            }
        }
        let nextColorIdx = (currentTicketColorIdx+1)%(colors.length);
        let nextColor = colors[nextColorIdx];
        ticketColorBand.classList.remove(currentTicketColor);
        ticketColorBand.classList.add(nextColor);

        // update ticketArr (color)
        let ticketIdx = getTicketIdx(id);
        ticketArr[ticketIdx].color = nextColor;
        updateLocalStorage();

    })
    if (ticketId == undefined){
        ticketArr.push({ "color": ticketColor, "task": task, "id":id })
        updateLocalStorage();
    }
        
    // console.log(ticketArr);
}

function getTicketIdx(id){
    for(let i = 0; i<ticketArr.length; i++){
        if(ticketArr[i].id == id){
            return i;
        }
    }
}

function updateLocalStorage(){
    let stringifyArr = JSON.stringify(ticketArr);
    localStorage.setItem("tickets",stringifyArr);
}