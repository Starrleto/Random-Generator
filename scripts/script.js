class person{
    name;
    static num = 0;
    constructor(n){
        this.name = n
        num++;
    }
}

let names = [];

const randomName = document.getElementById("randomName");
const randomGroup = document.getElementById("randomGroup");
const submit = document.getElementById("submit");
const input = document.getElementById("input");
const clear = document.getElementById("clear");
const itemContainer = document.getElementById("itemContainer");
const modalHeader = document.getElementById("modalHeader");
const modalText = document.getElementById("modalText");
const groupText = document.getElementById("groupText");
const myRange = document.getElementById("myRange");

getStorage();
populate();
updateSlider();

submit.addEventListener('click', () =>{ // Submit Name
    if(input.value != ""){
        names.push(input.value);
        input.value = '';
    }
    console.log(names);
    pushArray();
})

clear.addEventListener('click', () => { // Clear Array
    names = [];
    pushArray();
})

randomName.addEventListener('click', () => {
    modalHeader.innerText = "Your name is..."
    modalText.innerHTML = '';
    if(names.length > 0)
        modalText.innerText = names[Math.floor(Math.random() * names.length)];
    else
        modalText.innerText = "You need at least one name to randomize!";
})

randomGroup.addEventListener('click', () => {
    modalHeader.innerText = "Your Groups are...";
    modalText.innerHTML = '';
    if(names.length > 1){
        const groups = createGroups();

        for(let i = 0; i < groups.length; i++){
            const t = document.createElement("h4");
            t.innerText = "Group "+(i+1);
            const p = document.createElement("p");
            
            groups[i].forEach(element => {
                p.innerText += element+", ";
            });
            p.innerText = p.innerText.substring(0, p.innerText.length-2);

            modalText.appendChild(t);
            modalText.appendChild(p);
        }

    }
    else
        modalText.innerText = "You need at least two names to create groups!";
})

myRange.addEventListener('input', () => {
    updateSlider();
});

function pushArray(){ // Sets to local storage, then resets display
    localStorage.setItem("names", JSON.stringify(names))
    populate();
    updateSlider();
}

function getStorage(){
    if(localStorage.getItem("names") != undefined){
        names = JSON.parse(localStorage.getItem("names"));
    }
}

function populate(){ // Create all elements
    itemContainer.innerHTML = '';
    for(let i = 0; i < names.length; i++){
        addItem(names[i], i);
    }
    if(names.length == 0){
        const d = document.createElement("h4");
        d.innerText = "No names added yet!"
        d.className = "header";
        itemContainer.appendChild(d)
    }
}

function addItem(name, index){ // Create Person HTML elements
    const container = document.createElement("div");
    itemContainer.appendChild(container);
    container.className = "flex";

    const nameText = document.createElement("h3");
    nameText.innerText = name;
    nameText.className = "separate-side";
    container.appendChild(nameText);

    const button = document.createElement("button");
    button.addEventListener('click', () => {
        names.splice(index, 1);
        pushArray();
    })
    button.innerText = "Remove Person";
    button.className = "btn btn-danger";
    container.appendChild(button);

    itemContainer.appendChild(document.createElement("hr"));
}

function createGroups(){
    const result = [];
    const groupSize = parseInt(myRange.value);

    let randomized = names.slice(0, names.length);

    // Randomize
    for(let i = 0; i < randomized.length; i++){
        const randomindex = Math.floor(Math.random() * randomized.length);
        const item = randomized[i];
        randomized[i] = randomized[randomindex]
        randomized[randomindex] = item;
    }

    //Create Groups
    for(let i = 0; i < randomized.length; i+=groupSize){
        if(i+groupSize > randomized.length){
            if(randomized.length - i > 1){
                result.push(randomized.slice(i, randomized.length));
            }
            else{
                result[result.length-1].push(randomized[i]);
            }
        }
        else{
            result.push(randomized.slice(i, i+groupSize))
        }
    }
    console.log(result);
    return result;
}

function updateSlider(){
    myRange.max = names.length;
    if(names.length > 1)
        groupText.innerText = "Group Size: "+myRange.value;
    else
        groupText.innerText = "Add at least two names to select group sizes!";
}