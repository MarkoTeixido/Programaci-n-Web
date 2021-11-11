const input = document.querySelector("input");
const addBtn = document.querySelector(".btn-add");
addBtn.innerHTML = '<i class="fa fa-check"</i>';
const ul = document.querySelector("ul");
const empty = document.querySelector(".empty");
let temp;
let geo = null;
const url = "http://localhost:3000/tareas";

function display_task(task){
  ul.appendChild(li);
  li.appendChild(div1);
  li.appendChild(div2);
}

addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const text = input.value;
  temp = text;

  if (text !== "") {
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.textContent = text;

    tasks = {
      taskName: text,
      done: false,
      geo: geo
    };

    config = {
      method:'POST',
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify(tasks)
    }

    fetch(url, config)
        .then(response => response.json())
        .then(data => {
            display_task(data)
            InputValue.value = null
        })
        .catch((err) => {
            console.log(err)
        })
    
    const div1 = document.createElement("div");
    div1.className = "div1";
    const div2 = document.createElement("div");
    div2.className ="div2";

    div1.appendChild(addCheckboxBtn());
    div1.appendChild(p);
    div2.appendChild(addClipboardBtn());
    div2.appendChild(addShareBtn());
    div2.appendChild(addDeleteBtn());

    ul.appendChild(li);
    li.appendChild(div1);
    li.appendChild(div2);

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

function addCheckboxBtn() { 
  const checkBtn = document.createElement("input");
  checkBtn.type = "checkbox";
  checkBtn.className = "btn-checkbox";

  checkBtn.addEventListener("change", (e) => {
    let elemnt = parseInt(e.target.closest("li")); 

    config = {
      method:'PATCH',
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify({done: div.classList.contains('checked')})
    }

    fetch(`${url}/${elemnt.id}`, config)
        .then(response => response.json())
        .catch((err) => {
            console.log(err)
        })
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

function addDeleteBtn(e) {
  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<i class="fa fa-trash"></i>';
  deleteBtn.className = "btn-delete";

  deleteBtn.addEventListener("click", (e) => {
    const item = e.target.closest("li");
    ul.removeChild(item);

    config = {
      method:'DELETE',
    }

    fetch(`${url}/${item.id}`, config)
      .then(response => {
          response.json()
          item.remove()
      })
      .catch((err) => {
          console.log(err)
      })

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
          geo = {lat: position.coords.latitude, lon: position.coords.longitude}
      });
  }

  root = document.querySelector(":root");

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    console.log("el tema es oscuro");
    root.style.setProperty("--primary", "rgba(34,34,34,1)");
    root.style.setProperty("--secundary", "rgba(255,255,255,0.16)");
    root.style.setProperty("--search", "rgb(60, 60, 60)");
    root.style.setProperty("--font", "rgba(255,255,255,1)");
  }
  else {
    console.log("es claro");
    root.style.setProperty("--primary", "rgba(255,255,255,1)");
    root.style.setProperty("--secundary", "rgba(34,34,34,0.1)");
    root.style.setProperty("--search", "rgba(34,34,34,0.1)");
    root.style.setProperty("--font", "rgba(34,34,34,1)");
  }

  fetch(url)
    .then(response => response.json())
    .then(data => {
      tasks = data == null ? [] : data
      console.log(tasks)
      tasks.map(tarea => {
        const li = document.createElement('li');
        li.innerHTML = `
              <div class="div1">
                <input type="checkbox" class="btn-checkbox" ${tarea.done ? 'checked' : ''}/>
                <p>${tarea.taskName}</p>
              </div>
              <div class="div2">
                <button class="Btn-clipboard">
                  <i class="fa fa-clone"></i>
                </button>
                <button class="btn-share">
                  <i class="fa fa-share-alt"></i>
                </button>
                <button class="btn-delete">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
        `
        li.id = tarea._id;
        ul.appendChild(li);
      })
    })
    .catch((err) => {
      console.log(err)
    })
}