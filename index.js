const { readInput, inquirerMenu, pause } = require("./helpers/inquerer");
const Searches = require("./models/searches");


/*
 La función principal utiliza un bucle do- while para mostrar repetidamente un menú usando inquirerMenu, registrar el
 opción seleccionada y pausar si la opción no es 0.
 */
const main = async () => {

    const searches = new Searches();

    let opt
    do {
        
        opt = await inquirerMenu()
        
        switch (opt) {
            case 1:
                //mostrar mensaje
                const place = await readInput("Ciudad: ");
                await searches.city(place)

                //buscar lugar

                //seleccionar lugar

                //datos clima

                //mostrar resultados
                console.log("\nInformación de la ciudad\n".green);
                console.log("Ciudad:", );
                console.log("Lat:", );
                console.log("Log:", );
                console.log("Temperatura:", );
                console.log("Minima:", );
                console.log("Maxima:", );
        }

        if(opt !== 0)await pause();
        

    } while (opt !== 0);

}

main()