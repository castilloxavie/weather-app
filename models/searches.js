const axios = require("axios");

class Searches {
    historial = ["Tegusigalpa", "Madril", "San Jose"];

    constructor() {
        // TODO: leer bd si existe
    }

    get paramsMapbox(){
        return {
            'access_token':'pk.eyJ1IjoieHhhdmllcmNhc3RpbGxvIiwiYSI6ImNsdXBwc3loMTF5NzQyam13Z3M5NHduazcifQ.rhLWhKAuu7S1s3K7OpbHlw',
            'language': 'es',
            "limit": 5
        }
    }

    async city( place = "") {
        try {
            //peticion http

            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ place }.json`,
                params: this.paramsMapbox 
            });

            const resp = await instance.get();
            console.log(resp.data);

            return [];
        } catch (error) {
            return [];
        }
    }
}

module.exports = Searches;
