function numerosRandom () {
    const numeroRandom = Math.floor(Math.random()*1000 + 1)
    return numeroRandom
}

function numerosRepe (nums) {
console.log('se repitieron')
}

let numerosGenerados = []

const calculo = (num) => {
if (num) {
    for (let i = 0; i < (num); i++) {
        numerosGenerados.push(numerosRandom())
}} else {
    for (let i = 0; i < (100000000); i++) {
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
    process.send({numeroRandom, numerosRepet})
    console.log(`worker #${process.pid} finalizó su trabajo`)
    process.exit()
})

process.send('listo')