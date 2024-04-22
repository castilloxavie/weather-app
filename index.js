/* El fragmento de código importa los módulos y configuraciones necesarios para la aplicación JavaScript.*/
require("dotenv").config();
const {
    readInput,
    inquirerMenu,
    pause,
    listPlaces,
} = require("./helpers/inquerer");
const Searches = require("./models/searches");

/*
La función principal en este código JavaScript utiliza el buscador para buscar y mostrar interactivamente
 información meteorológica de una ciudad, lo que permite al usuario seleccionar una ciudad, ver los detalles del tiempo y ver una
 Historia de las ciudades buscadas.
 */
const main = async () => {
    /* `está creando una nueva instancia de la clase `Búsquedas`. Este
    le permite utilizar los métodos y propiedades definidos dentro de la clase `Búsquedas` para realizar
    operaciones relacionadas con la búsqueda de ciudades, la recuperación de información meteorológica y la gestión de la búsqueda
    historial dentro de su aplicación JavaScript. Al crear una nueva instancia de la clase `Búsquedas`,
    puede acceder y utilizar su funcionalidad en toda su aplicación.*/
    const searches = new Searches();

    let opt;
    do {
        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //mostrar mensaje
                /* solicita al usuario que ingrese una ciudad
                nombre mostrando el mensaje "Ciudad: " y esperando que el usuario ingrese a la ciudad
                nombre. La función `readInput` es probablemente una función personalizada que lee la entrada del usuario.
                asincrónicamente, permitiendo que el programa se detenga y espere la entrada del usuario antes de
                proceder. Una vez que el usuario ingresa el nombre de la ciudad y presiona Enter, el valor de entrada es
                almacenado en la constante "lugar" para su posterior procesamiento en la aplicación.
                */
                const place = await readInput("Ciudad: ");

                //buscar lugar
                /* está llamando al método `city`
                en el objeto "búsquedas", que es una instancia de la clase "Búsquedas". Este método
                probablemente sea responsable de buscar información sobre la ciudad proporcionada como
                parámetro `lugar`. */
                const pleaces = await searches.city(place);

                //seleccionar lugar
                /* Este bloque de código maneja la selección de un lugar específico de una lista delugares.*/
                const id = await listPlaces(pleaces);
                if (id === "0") continue;
                const pleaceSel = pleaces.find((site) => site.id === id);

                //guardar en db
                /* agrega el nombre del seleccionado
                lugar al historial de búsqueda. 
                se encarga de almacenar los nombres de las ciudades que han sido buscadas por el
                usuario. Al llamar a `addHistory` con el nombre del lugar seleccionado como argumento,
                la aplicación realiza un seguimiento de las ciudades que se han buscado durante
                La sesión. Esto permite al usuario ver posteriormente un historial de las ciudades que tiene.
                buscado para. */
                searches.addHistory(pleaceSel.name);

                //datos clima
                /* está llamando al método `climatePlace` en el objeto `searches`, que es una instancia
                de la clase `Búsquedas`. Es probable que este método sea responsable de obtener el tiempo.
                información para una ubicación específica basada en las coordenadas de latitud y longitud
                proporcionados como argumentos (`pleaceSel.lat` y `pleaceSel.lon`). */
                const weather = await searches.climatePlace(
                    pleaceSel.lat,
                    pleaceSel.lon
                );

                //mostrar resultados
                console.clear();
                console.log("\nInformación de la ciudad\n".green);
                console.log("Ciudad:".red, pleaceSel.name.green);
                console.log("Lat:".red, pleaceSel.lat);
                console.log("Log:".red, pleaceSel.lon);
                console.log("Temperatura:".red, weather.temperature);
                console.log("Minima:".red, weather.minimumTemperature);
                console.log("Maxima:".red, weather.maximumTemperature);
                console.log(
                    "¿Como está el clima ?:".red,
                    weather.description.yellow
                );
                break;

            case 2:
                /* Este fragmento de código itera sobre el historial en mayúsculas de los lugares almacenados en el
                `busca` objeto e imprime cada lugar junto con su índice de forma formateada. */
                searches.historyCapitalized.forEach((plece, i) => {
                    const idx = `${i + 1}`.green;
                    console.log(`${idx} ${plece}`);
                });
                break;
        }

       /* está verificando si la entrada del usuario `opt` no es
       igual a 0. Si el usuario no eligió salir del programa (opción 0), esperará la
       Función `pausa()`. La función `pause()` probablemente pausa la ejecución del programa y espera
       El usuario debe presionar una tecla antes de continuar. Esto permite al usuario revisar la información.
       se muestra en la pantalla antes de continuar con la siguiente iteración del bucle. El "hacer mientras"
       El bucle continuará ejecutándose mientras el usuario no elija salir del programa
       seleccionando la opción 0. */
        if (opt !== 0) await pause();
    } while (opt !== 0);
};

main();
