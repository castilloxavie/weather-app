const fs = require("fs");
const axios = require("axios");

/* La clase `Búsquedas` en JavaScript se encarga de buscar ubicaciones, recuperar información meteorológica,
y gestionar el historial de búsqueda con métodos de búsqueda de ciudades, recuperación climática y gestión del historial. */
class Searches {
    /* El fragmento de código `HistorySearch = []; dbPath = "./db/database.json";` dentro de `Búsquedas`
    La clase está inicializando dos propiedades: `HistorySearch` y `dbPath`. */
    HistorySearch = [];
    dbPath = "./db/database.json";

   //La función constructora lee de una base de datos si existe.
    constructor() {
        
        this.readDB()
    }

    /*
     La función `historyCapitalized` toma una serie de cadenas, pone en mayúscula la primera letra de
     cada palabra en cada cadena y devuelve las cadenas modificadas en una matriz.
     @returns El método `get HistoryCapitalized()` devuelve una matriz donde cada elemento es un
     cadena con la primera letra de cada palabra en mayúscula. El método primero se mapea sobre el
     matriz `HistorySearch`, luego divide cada elemento en palabras individuales. Luego capitaliza el
     primera letra de cada palabra y las une nuevamente antes de devolver la matriz modificada.
     */
    get  historyCapitalized(){

        return this.HistorySearch.map(pleace => {
            let word = pleace.split(' ')
            word = word.map(w => w[0].toUpperCase() + w.substring(1))

            return word.join(' ')

        })
    }

    /*
     La función `paramsMapbox` devuelve un objeto con parámetros que incluyen un token de acceso,
     idioma y límite para solicitudes de API de Mapbox.
     @returns Un objeto que contiene parámetros para la solicitud de API de Mapbox. El objeto incluye un
     token de acceso de las variables de entorno, una configuración de idioma de "es" (español) y un límite
     de 5 resultados.
     */
    get paramsMapbox() {
        return {
            access_token: process.env.MAPBOX_KEY,
            language: "es",
            limit: 5,
        };
    }

    /**
     La función devuelve un objeto con parámetros para OpenWeather API, incluida la clave API, unidades,
     y lenguaje.
     @returns La función `get paramsOpenWeather()` devuelve un objeto con tres propiedades:
     `appid`, `unidades` y `lang`. La propiedad `appid` se establece en el valor de `OPENWEATHER_KEY`
     variable de entorno, la propiedad `units` se establece en "metric" y la propiedad `lang` se establece en
     "es".
     */
    get paramsOpenWeather() {
        return {
            appid: process.env.OPENWEATHER_KEY,
            units: "metric",
            lang: "es",
        };
    }

    /*
    La función `ciudad` es una función asincrónica que realiza una solicitud a la API de codificación geográfica de Mapbox.
    para recuperar información sobre un lugar específico y devuelve una serie de objetos con el lugar
    identificación, nombre, longitud y latitud.
    @param [lugar] - El parámetro `lugar` en la función `ciudad` se utiliza para especificar la ubicación
    para el cual desea recuperar información de geocodificación. Se utiliza para construir la URL del
    Solicitud de API de codificación geográfica de Mapbox.
    @returns La función `city` es una función asincrónica que realiza una solicitud HTTP al
    API de codificación geográfica de Mapbox para recuperar información sobre un lugar específico. Luego mapea la respuesta.
    datos para extraer la identificación, nombre, longitud y latitud de cada lugar. Si ocurre un error durante
    la solicitud HTTP, se devuelve una matriz vacía.
     */
    async city(place = "") {
        try {
            //peticion http

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
                params: this.paramsMapbox,
            });

            const resp = await instance.get();
            return resp.data.features.map((place) => ({
                id: place.id,
                name: place.place_name,
                lon: place.center[0],
                lat: place.center[1],
            }));
        } catch (error) {
            return [];
        }
    }

    /**
    La función `climatePlace` recupera información meteorológica basada en latitud y longitud usando
    la API OpenWeatherMap.
    @param lat: coordenada de latitud de la ubicación de la que desea recuperar el clima.
    información.
    @param lon: longitud de la ubicación de la que desea recuperar información climática.
    @returns La función `climatePlace` devuelve un objeto con las siguientes propiedades:
    - `descripción`: La descripción del clima obtenida de la respuesta API.
    - `minimumTemperature`: La temperatura mínima obtenida de la respuesta API.
    - `maximumTemperature`: La temperatura máxima obtenida de la respuesta API.
    - `temperatura`: La temperatura actual obtenida de la respuesta API.
     */
    async climatePlace(lat, lon) {
        const instance = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
            params: { ...this.paramsOpenWeather, lat, lon },
        });

        const resp = await instance.get();
        const { weather, main } = resp.data;

        return {
            description: weather[0].description,
            minimumTemperature: main.temp_min,
            maximumTemperature: main.temp_max,
            temperature: main.temp,
        };
    }

    /**
    La función `addHistory` en JavaScript agrega un lugar a una matriz del historial de búsqueda, asegurando que sea
    no repetirlo y guardarlo en una base de datos.
    @param [por favor] - La función `addHistory` está diseñada para agregar un nuevo lugar a una lista del historial.
    El parámetro `pleace` representa el nombre del lugar que desea agregar al historial.
    @returns Si el parámetro `pleace` ya está incluido en la matriz `HistorySearch`, nada
    Se agregará y la función volverá sin realizar ningún cambio.
     */
    addHistory(pleace = "") {
        //validar que no se repita el lugar
        if (this.HistorySearch.includes(pleace.toLocaleLowerCase())) {
            return;
        }
        this.HistorySearch.splice(0, 10)

        this.HistorySearch.unshift(pleace.toLocaleLowerCase());

        //grabar DB
        this.saveDB();
    }

    //La función `saveDB` guarda los datos de `HistorySearch` en un archivo en formato JSON.
    saveDB() {
        const payload = {
            HistorySearch: this.HistorySearch,
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    /**
    La función `readDB` lee datos de un archivo de base de datos y los asigna a `HistorySearch`
    propiedad.
    @returns Si el archivo `dbPath` no existe, la función regresará sin realizar ninguna
    otras acciones. Si el archivo existe, leerá el contenido del archivo, lo analizará como JSON,
    y asigne la propiedad `HistorySearch` de los datos a la propiedad `HistorySearch` del
    objeto donde se define esta función.
     */
    readDB() {
        //verificar si existe

        if(!fs.existsSync(this.dbPath)){
            return;
        }

        const info = fs.readFileSync(this.dbPath, {encoding: "utf-8"})
        const data = JSON.parse(info)

        this.HistorySearch = data.HistorySearch


        
    }
}

module.exports = Searches;
