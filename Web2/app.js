const input = document.querySelector("input");
const addBtn = document.querySelector(".btn-add");
const ul = document.querySelector("ul");
const empty = document.querySelector(".empty");
let temp;
let tasks = [];
let geo = null;

function update_storage() {
  sessionStorage.setItem('tasks', JSON.stringify(tasks));
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const text = input.value;
  temp = text;

  if (text !== "") {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.textContent = text;

    const id = tasks.length === 0 ? 0 : tasks[tasks.length - 1].id + 1;
    li.setAttribute("data-id", id);
    tasks.push({
      id: id,
      task: text,
      done: false,
      geo: geo
    })
    update_storage();

    ul.appendChild(li);
    li.appendChild(addCheckboxBtn());
    li.appendChild(p);
    li.appendChild(addClipboardBtn());
    li.appendChild(addShareBtn());
    li.appendChild(addDeleteBtn());

    input.value = "";
    empty.style.display = "none";
  }
});

function toggleFullscreen(button) {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    button.innerHTML = '<i class="fa fa-compress"></i>';
  } else if (document.exitFullscreen) {
    document.exitFullscreen();
    button.innerHTML = '<i class="fa fa-expand"></i>';
  }
}

//en esta función hice varios cambios...
function addCheckboxBtn(status) { //recibo status para saber si el checbox tiene q dibujarse marcado o no
  const checkBtn = document.createElement("input");
  checkBtn.type = "checkbox";
  checkBtn.className = "btn-checkbox";

  if(status){
    checkBtn.checked = true;
  }
  checkBtn.addEventListener("change", (e) => {
    let id = parseInt(e.target.closest("li").getAttribute("data-id")); // obtengo el li para poder saber el id y con eso trabajar en el array

    //actualizo el estado en el array
    if(e.target.checked) {
      tasks[id-1].done = true;
    } else {
      tasks[id-1].done = false;
    }
    //actualizo el estado en storage
    update_storage();
  });

  return checkBtn;
}

function addClipboardBtn() {
  const clipboardBtn = document.createElement("button");
  clipboardBtn.innerHTML = '<i class="fa fa-clone"></i>';
  clipboardBtn.className = "Btn-clipboard";

  clipboardBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(temp)
      .then(
        () => window.alert("¡La Tarea " + temp + " ha sido copiada correctamente!"))
      .catch(
        err => window.alert("Ups... Hubo Un Error al Copiar: " + err));
  });

  return clipboardBtn;
}

function addShareBtn() {
  const shareBtn = document.createElement("button");
  shareBtn.innerHTML = '<i class="fa fa-share-alt"></i>';
  shareBtn.className = "btn-share";

  shareBtn.addEventListener("click", () => {
    navigator.share({
      title: "Compartir Tarea",
      text: temp,
      url: document.URL
    }).then(
      () => console.log("¡Tarea Compartida!")
    ).catch(
      () => window.alert("Ups... Hubo Un Error al Compartir.")
    )
  });

  return shareBtn;
}

function addDeleteBtn() {
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';
  deleteBtn.className = "btn-delete";

  deleteBtn.addEventListener("click", (e) => {
    const item = e.target.closest("li"); // busco el li mas cercano (no se bien en que nivel estará) para poder manipularlo
    console.log(item);
    const nuevoid = parseInt(item.getAttribute("data-id")); // busco el id desde el atributo data-id y lo parseo a entero
    console.log(nuevoid);
    tasks = tasks.filter((e) => e.id !== nuevoid); // filtro el array de tareas y elimino el elemento que tenga el id igual al id que busco
    console.log("tasks: ", tasks); // muestro el array de tareas
    ul.removeChild(item);
    update_storage();

    const items = document.querySelectorAll("li");

    if (items.length === 0) {
      empty.style.display = "block";
    }
  });

  return deleteBtn;
}

window.onload = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      geo = { lat: position.coords.latitude, lon: position.coords.longitude }
    });
  }

  tasks = JSON.parse(sessionStorage.getItem("tasks")) || [];

  for (let i = 0; i < tasks.length; i++) {
    const li = document.createElement("li");
    li.setAttribute("data-id", tasks[i].id); // busco el id en el objeto y lo cargo en mi elemento del dom
    const p = document.createElement("p");
    p.textContent = tasks[i].task; // busco el texto en el objeto y se lo cargo al elemento del dom
    li.appendChild(addCheckboxBtn(tasks[i].done));
    li.appendChild(p);
    li.appendChild(addClipboardBtn());
    li.appendChild(addShareBtn());
    li.appendChild(addDeleteBtn());

    ul.appendChild(li);
  }
}