
// ==========================================
// Configuracion dinamica del puerto
// ==========================================

process.env.PORT = process.env.PORT || 3000;


// ==========================================
// Configuracion dinamica del entorno
// ==========================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ==========================================
// Fecha de expiración del Token
// ==========================================

process.env.CADUCIDAD_TOKEN = '48h';

// ==========================================
// SEED de autentocación
// ========================================== 

process.env.SEED = process.env.SEED || 'secret'

// ==========================================
// Configuracion dinamica de la Base de Datos
// ==========================================

let urlDB;

if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe-node';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// ==========================================
// GOOGLE Client ID
// ==========================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '234146209472-s4vqv5en4m8fqg93sa837v8dr2v378m4.apps.googleusercontent.com';