const socket = io.connect()

function addMessage(e) {
    //preventDefault(e)
    const fecha = new Date()
    const date = fecha.toLocaleDateString()
    const hour = fecha.toLocaleTimeString()
    const messages = {
        author:{
            id: document.getElementById("email").value,
            nombre: document.getElementById('nombreUsuario').value,
            apellido: document.getElementById('apellidoUsuario').value,
            edad: document.getElementById('edadUsuario').value,
            alias: document.getElementById('aliasUsuario').value,
            avatar: document.getElementById('fotoUsuario').value
        },
        date: date,
        hour: hour,
        message: document.getElementById("text").value
    }
    socket.emit("new-message", messages);
    return false
}

function render(chat) {
    const html = chat.map((elem) => {
        return (`<div><spam class="fw-bolder text-primary m-2"> ${elem.author.id}</spam><spam style="color: brown;">[${elem.date}  ${elem.hour}]</spam> <spam class="fst-italic text-success m-2"> ${elem.message} </spam>  <spam class="m-2"><img width="50" src=${elem.author.avatar} alt="not found"></spam></div>`)
    })
            .join("  ")
        document.getElementById("messages").innerHTML = html
    }

socket.on("messages", function(chat) {render(chat)})