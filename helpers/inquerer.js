const inquirer = require("inquirer");
require("colors");

/* una lista de preguntas para el mensaje del investigador. esta configurando
Aparece un menú con un mensaje de tipo lista donde el usuario puede seleccionar una opción. Cada opción tiene un valor y un
nombre, donde el nombre incluye un número en color rojo seguido de la descripción de la opción. Las opciones
en este caso son "Buscar Ciudad", "Historial" y "Salir" con valores 1, 2 y 3 respectivamente. */
const questions = [
    {
        type: "list",
        name: "opcion",
        message: "¿Que desa hacer?",
        choices: [
            {
                value: 1,
                name: `${"1.".red} Buscar Ciudad`,
            },
            {
                value: 2,
                name: `${"2.".red} Historial`,
            },
            {
                value: 3,
                name: `${"3.".red} Salir`,
            },
        ],
    },
];

/*
 La función `inquirerMenu` muestra un menú con opciones para que el usuario seleccione y devuelve el
 opción elegida.
 @returns La función `inquirerMenu` devuelve la opción seleccionada de la entrada del usuario.
 */
const inquirerMenu = async () => {
    console.clear();

    console.log("=======================".red);
    console.log(" Seleccione una Opción ".green);
    console.log("=======================\n".red);

    const { opcion } = await inquirer.prompt(questions);
    return opcion;
};

/*
 La función "pausa" en JavaScript solicita al usuario que presione Entrar para continuar usando la biblioteca "inquirer".
 */
const pause = async () => {
    const questions = [
        {
            type: "input",
            name: "enter",
            message: `Presione ${"ENTER".red} para Continuar`,
        },
    ];
    console.log("\n");
    await inquirer.prompt(questions);
};

/*
 La función `readInput` es una función asincrónica que muestra al usuario un mensaje y
 valida la entrada antes de devolverla.
 @param message: el parámetro `message` en la función `readInput` es una cadena que representa el
 mensaje rápido que se mostrará al usuario cuando solicite información. Se utiliza para preguntar al usuario.
 para recibir aportes y orientarlos sobre qué tipo de aporte se espera.
 @returns La función `readInput` devuelve el valor de entrada del usuario ingresado en respuesta a la
 proporcionó un mensaje de "mensaje".
 */
const readInput = async (message) => {
    const question = [
        {
            type: "input",
            name: "desc",
            message,
            validate(value) {
                if (value.length === 0) {
                    return "Por favor ingrese un valor";
                }
                return true;
            },
        },
    ];
    const { desc } = await inquirer.prompt(question);
    return desc;
};

/*
 La función `listTasksDelete` muestra una lista de tareas con los índices correspondientes para su eliminación y
 devuelve el ID de la tarea seleccionada.
 @param [tareas] - El parámetro `tareas` es una serie de tareas. Cada tarea es un objeto con
 propiedades como `id` y `desc`. La función `listTasksDelete` toma este conjunto de tareas y
 crea una lista de opciones para que el usuario seleccione. El usuario puede elegir una tarea para eliminar.
 @returns La función `listTasksDelete` devuelve el `id` de la tarea seleccionada que se eliminará.
 */
const listTasksDelete = async (tareas = []) => {
    const choices = tareas.map((tarea, i) => {
        const idx = `${i + 1}. `.green;

        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
        };
    });

    choices.unshift({
        value: "0",
        name: "0.".green + " Cancelar",
    });

    const preguntas = [
        {
            type: "list",
            name: "id",
            message: "borrar",
            choices,
        },
    ];

    const { id } = await inquirer.prompt(preguntas);
    return id;
};

/*
 La función `confirmDelete` utiliza `inquirer` para enviarle al usuario un mensaje de confirmación y
 devuelve un booleano que indica la elección del usuario.
 @param message: el parámetro `message` es una cadena que representa el mensaje que se mostrará
 el usuario al confirmar la acción de eliminación. Suele ser un mensaje que pide al usuario que confirme.
 si quieren continuar con la eliminación.
 @returns La función `confirmDelete` devuelve un valor booleano (`true` o `false`) basado en el
 respuesta del usuario al mensaje de confirmación mostrado.
 */
const confirmDelete = async (message) => {
    const question = [
        {
            type: "confirm",
            name: "ok",
            message,
        },
    ];
    const { ok } = await inquirer.prompt(question);
    return ok;
};

/*
 La función `showListChecklist` muestra una lista de tareas con casillas de verificación para seleccionar.
 @param [tareas] - El parámetro `tareas` es una matriz de tareas con la siguiente estructura:
 @returns La función `showListChecclist` devuelve una serie de ID de tareas seleccionadas por el usuario
 de una lista de tareas.
 */
const showListChecclist = async (tareas = []) => {
    const choices = tareas.map((tarea, i) => {
        const idx = `${i + 1}. `.green;

        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: tarea.compleatdoEn ? true : false,
        };
    });

    const preguntass = [
        {
            type: "checkbox",
            name: "ids",
            message: "Seleccione",
            choices,
        },
    ];

    const { ids } = await inquirer.prompt(preguntass);
    return ids;
};

/* La declaración `module.exports` en JavaScript se utiliza para exportar las funciones o variables especificadas.
desde un módulo para que otros módulos que requieran este módulo puedan acceder a ellos. */
module.exports = {
    inquirerMenu,
    pause,
    readInput,
    listTasksDelete,
    confirmDelete,
    showListChecclist,
};
