
const socket = io()

const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')
let user

Swal.fire({
    title: "Inicio de Sesion",
    input: "text",
    text: "Por favor ingrese su nombre de usuario para continuar",
    inputValidator: (valor) => {
        return !valor && 'Ingrese un valor valido'
    },
    allowOutsideClick: false
}).then(resultado => {
    user = resultado.value
    console.log(user)
})








// const socket = io()

// socket.emit('movimiento', "Ca7")

// socket.emit('rendirse', "Me he rendido")

// socket.on('mensaje-jugador', info => {
//     console.log(info)
// })

// socket.on('rendicion', info => {
//     console.log(info)
// })