//note class
function Note(title,content){
    this.title = title;
    this.content = content;
    this.color = "#ffff00";
    this.pinned = false;
    this.created = Date.now();
}

let localStorage = window.localStorage;

//array of all notes
let notes = [];

//creating a new note
function createNote(){
    let note = new Note("title","content");
    notes.push(note);
    addNote(note);
    localStorage.setItem("notes",JSON.stringify(notes));
}

//building note from ground up
function addNote(note){
    let noteElement = document.createElement("div");
    noteElement.addEventListener("change",updateNote);
    noteElement.classList.add("noteid"+notes.indexOf(note));
    noteElement.classList.add("note");
    noteElement.style.backgroundColor = note.color;
    let pinElement = document.createElement("div");
    pinElement.classList.add("pin");
    if(note.pinned)
        pinElement.classList.add("pinoff");
    else
        pinElement.classList.add("pinon");
    pinElement.addEventListener("click",pinSwitch);
    noteElement.appendChild(pinElement);
    let titleElement = document.createElement("input");
    titleElement.type = "text";
    titleElement.name = "title";
    titleElement.value = note.title;
    noteElement.appendChild(titleElement);
    let contentElement = document.createElement("textarea");
    contentElement.value = note.content;
    contentElement.name = "content";
    noteElement.appendChild(contentElement);
    let colorElement = document.createElement("input");
    colorElement.type = "color";
    colorElement.name = "color";
    colorElement.value = note.color;
    noteElement.appendChild(colorElement);
    let created = document.createElement("p");
    let time = new Date(note.created);
    created.innerHTML =  "Created: " + time.toLocaleString();
    noteElement.appendChild(created);
    if(note.pinned)
        document.querySelector(".pinned").appendChild(noteElement);
    else
        document.querySelector(".notes").appendChild(noteElement);
}

//pinning and unpinning of notes
function pinSwitch(e){
    let note = notes[e.path[1].classList[0].split("id")[1]];
    let child = e.path[1];
    if(note.pinned){
        document.querySelector(".pinned").removeChild(child);
        document.querySelector(".notes").appendChild(child);
    }else{
        document.querySelector(".notes").removeChild(child);
        document.querySelector(".pinned").appendChild(child);
    }
    note.pinned = !note.pinned;
    localStorage.setItem("notes",JSON.stringify(notes));
}

//saving changes to notes like different title etc
function updateNote(e){
    let note = notes[e.path[1].classList[0].split("id")[1]];
    switch(e.target.name){
        case "title":
            note.title = e.target.value;
            break;
        case "content":
            note.content = e.target.value;
            break;
        case "color":
            e.path[1].style.backgroundColor = e.target.value;
            note.color = e.target.value;
            break;
    }
    localStorage.setItem("notes",JSON.stringify(notes));
}

//initial load of notes from storage
function init(){
    notes = JSON.parse(localStorage.getItem("notes"));
    notes.forEach(element => {
        addNote(element);
    });
}
init()