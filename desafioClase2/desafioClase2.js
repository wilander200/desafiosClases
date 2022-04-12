class usuario {
    constructor (nombre , apellido) {
        this.nombre= nombre;
        this.apellido= apellido;
        this.libro= [];
        this.mascotas= [];
        this.cuentaMascota = 0;
    }

    getFullName(){
        console.log(`${this.nombre} ${this.apellido}`)
    }

    countMascotas() {
      const cuenta = this.cuentaMascota++
        return cuenta
    }

    addMascota(nuevaMascota){
        this.countMascotas()
        const masc = [...this.mascotas , this.mascotas.push(nuevaMascota)]
        return masc;
    }


    addBook(titulo, autor){
        const libros = this.libro.push({tit: titulo , aut: autor})
        return libros
    }

    getBookNames () {
       return this.libro.map((libros) => {
            return libros.tit
        })
    }
}


const pepe = new usuario ("José" , "Perez")

//console.log('\n');

pepe.addMascota("perro");
pepe.addMascota("loro");
pepe.addMascota("gato");

//console.log(pepe.mascotas);
//console.log('\n');

//console.log(pepe.countMascotas());
//console.log('\n');

pepe.addBook("Game of Thrones" , "George R. R. Martin");
pepe.addBook("Star Wars" , "George Lucas");

//console.log(pepe.libro);
//console.log('\n');

//console.log(pepe.getBookNames());
//console.log('\n');
//
const maria = new usuario ("Maria" , "Espinoza")

maria.addMascota("gato");
maria.addMascota("pez");

//console.log(maria.mascotas);
//console.log('\n');

//console.log(maria.countMascotas());
//console.log('\n');

maria.addBook("Amor en tiempos de Verano" , "Beatriz Pinzon Solano");
maria.addBook("El Show de la vida" , "Martin Cancamo");
//console.log(maria.libro);
//console.log(maria.getBookNames());


//console.log('\n');
//console.log('\n');


const usuario1 = {nombre: pepe.nombre , apellido: pepe.apellido , libros: pepe.getBookNames() , mascotas: pepe.mascotas , cantidad : pepe.countMascotas()};
const usuario2 = {nombre: maria.nombre , apellido: maria.apellido , libros: maria.getBookNames() , mascotas: maria.mascotas , cantidad : maria.countMascotas()};

console.log(usuario1);
console.log('\n');
console.log(usuario2);
