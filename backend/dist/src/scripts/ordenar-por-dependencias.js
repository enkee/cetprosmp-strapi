"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordenarColeccionesPorDependencias = void 0;
// Exportamos la función principal que devuelve un orden lógico de colecciones según sus dependencias
function ordenarColeccionesPorDependencias(strapi) {
    var _a;
    // Creamos un grafo para registrar las dependencias entre colecciones
    const grafo = {};
    // Obtenemos todos los contentTypes definidos en Strapi
    const contentTypes = strapi.contentTypes;
    // Recorremos cada contentType
    for (const uid in contentTypes) {
        // Nos aseguramos de trabajar solo con colecciones tipo API
        if (!uid.startsWith('api::'))
            continue;
        // Inicializamos el conjunto de dependencias para esta colección
        grafo[uid] = new Set();
        // Recorremos los atributos del contentType
        for (const key in contentTypes[uid].attributes) {
            const attr = contentTypes[uid].attributes[key];
            // Si el atributo es una relación y apunta a otra colección API
            if (attr.type === 'relation' && ((_a = attr.target) === null || _a === void 0 ? void 0 : _a.startsWith('api::'))) {
                // Añadimos la relación como dependencia
                grafo[uid].add(attr.target);
            }
        }
    }
    // Arreglo para el orden correcto de importación
    const orden = [];
    // Arreglo para las colecciones que forman ciclos
    const conCiclo = [];
    // Conjuntos de visitados y en proceso para el algoritmo DFS
    const visitados = new Set();
    const enProceso = new Set();
    // Función recursiva para recorrer el grafo y detectar orden y ciclos
    function visitar(uid) {
        var _a;
        // Si ya se visitó, no hacemos nada
        if (visitados.has(uid))
            return;
        // Si ya está en proceso, detectamos un ciclo
        if (enProceso.has(uid)) {
            if (!conCiclo.includes(uid))
                conCiclo.push(uid);
            return;
        }
        // Marcamos el nodo como en proceso
        enProceso.add(uid);
        // Recorremos sus dependencias
        (_a = grafo[uid]) === null || _a === void 0 ? void 0 : _a.forEach(dep => visitar(dep));
        // Terminamos el proceso de este nodo
        enProceso.delete(uid);
        // Lo marcamos como visitado
        visitados.add(uid);
        // Lo añadimos al orden
        orden.push(uid);
    }
    // Iniciamos el recorrido DFS por cada colección
    for (const uid of Object.keys(grafo)) {
        visitar(uid);
    }
    // Aseguramos que las colecciones cíclicas estén al final del orden
    const final = orden.concat(conCiclo.filter(u => !orden.includes(u)));
    // Devolvemos el orden total y los ciclos detectados
    return { orden: final, ciclicos: conCiclo };
}
exports.ordenarColeccionesPorDependencias = ordenarColeccionesPorDependencias;
