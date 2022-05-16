const socket = io.connect()

function addMessage(e) {
    const fecha = new Date()
    const date = fecha.toLocaleDateString()
    const hour = fecha.toLocaleTimeString()
    const message = {
        email: document.getElementById("email").value,
        fyh: {date: date, hour: hour},
        message: document.getElementById("text").value
    }
    socket.emit("new-message", message);
    return false
}

function render(data) {
    const html = data.map((elem) => {
        return(`<div><spam class="fw-bolder text-primary m-2"> ${elem.email}</spam><spam style="color: brown;">[${elem.fyh.date}   ${elem.fyh.hour}] : </spam> <spam class="fst-italic text-success m-2"> ${elem.message} </spam></div>`)})
            .join("  ")
        document.getElementById("messages").innerHTML = html
    }

socket.on("messages", function(data) {render(data)})