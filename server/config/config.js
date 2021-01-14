
// ==========================================
// Configuracion dinamica del puerto
// ==========================================

process.env.PORT = process.env.PORT || 3000;


// ==========================================
// Configuracion dinamica del entorno
// ==========================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ==========================================
// Configuracion dinamica de la Base de Datos
// ==========================================

let urlDB;

if( process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe-node';
} else {
    urlDB = 'mongodb+srv://JAlmarza98:cafe1234@cluster0.jqf60.mongodb.net/cafe';
}

process.env.URLDB = urlDB;