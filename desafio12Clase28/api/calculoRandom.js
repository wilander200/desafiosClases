function numerosRandom () {
    const numeroRandom = Math.floor(Math.random()*1000 + 1)
    console.log(numeroRandom)
    return numeroRandom
}

function numerosRepe (nums) {
console.log('se repitieron')
}

let numerosGenerados = []

const calculo = (num) => {
if (!isNaN(num)) {
    for (let i = 0; i < (num); i++) {
        numerosGenerados.push(numerosRandom())
}}
    return numerosGenerados
}

const numerosRepetido = numerosRepe(numerosGenerados)


process.on('exit', () => {
    console.log(`worker #${process.pid} cerrado`)
})

process.on('message', msg => {
    console.log(`worker #${process.pid} iniciando su tarea`)
    const numeroRandom = calculo(msg)
    const numerosRepet = numerosRepe(numeroRandom)
    process.send(numeroRandom)
    console.log(`worker #${process.pid} finalizó su trabajo`)
    process.exit()
})

process.send('listo')