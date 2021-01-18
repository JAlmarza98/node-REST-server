
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

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

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