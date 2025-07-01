// 📁 Define la configuración de la(s) ruta(s) personal(es) del plugin o controlador

export default {
    routes: [
        {
            // 🔧 Método HTTP que se usará para esta ruta
            method: 'POST',

            // 🌐 Ruta expuesta en la API: http://localhost:1337/api/google-sync
            path: '/google-sync',

            // 🎯 Nombre del controlador y función que manejará esta ruta
            handler: 'google-sync.sync',

            // ⚙️ Configuración adicional de la ruta
            config: {
                auth: false, // 🔓 No requiere autenticación (útil para login inicial)
                // Cambia a `auth: true` si luego quieres protegerla con JWT
            },
        },
    ],
};
