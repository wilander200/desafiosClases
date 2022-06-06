const socket = io.connect()

function addMessage(e) {
    //preventDefault(e)
    const fecha = new Date()
    const date = fecha.toLocaleDateString()
    const hour = fecha.toLocaleTimeString()
    const messages = {
        email: document.getElementById("email").value,
        date: date,
        hour: hour,
        message: document.getElementById("text").value
    }
    socket.emit("new-message", messages);
    return false
}

function render(chat) {
    const html = chat.map((elem) => {
        return (`<div><spam class="fw-bolder text-primary m-2"> ${elem.email}</spam><spam style="color: brown;">[${elem.date}  ${elem.hour}]</spam> <spam class="fst-italic text-success m-2"> ${elem.message} </spam></div>`)
    })
            .join("  ")
        document.getElementById("messages").innerHTML = html
    }

socket.on("messages", function(chat) {render(chat)})