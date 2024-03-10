const Mongoose = require("mongoose");
const bcrypt = require('bcrypt');// Importamos bcrypt para el hash de contraseñas
const { generateAccessToken, generateRefreshToken } = require("../auth/generateTokens");
const Token = require("../schema/token");
const getUserinfo = require("../lib/getUserInfo");

// Definimos el esquema del usuario utilizando Mongoose
const UserSchema = new Mongoose.Schema({
    //Unico: va a tronar el query y no se creara el usuario 
    //(Para crear el usuario mongo hace una TRANSACCIÓN)
    id: {type:Object},
    username: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    name: {type:String, required:true}
});

//Middleware o manejador: ayuda a "Hashear nuestro password", encriptarlo
//         pre() -> método que se ejecuta antes de culminar la TRANSACCIÓN de mongoDB
UserSchema.pre('save',function(next){
    // Verificamos si el password se ha modificado o es una nueva entrada
    if(this.isModified('password') || this.isNew){
        const document = this;
        // Hasheamos la contraseña utilizando bcrypt
        bcrypt.hash(document.password, 10, (err,hash)=>{
            // Si hay un error al hashear la contraseña
            if(err){
                next(err);
                /*
                Pasamos el error al siguiente middleware o manejador:
                No vamos a cachear directamente el error sino, que éste 
                lo vamos a forguardear a la siguiente solicitud que pueda atraparlo. 
                Sino se puede atrapar tons va tronar
                */
            }else{
                //Si todo sale bien...
                document.password = hash;//Contraseña hasheada
                next();// Continuamos con la siguiente middleware o manejador
                //Los next harian que se complete la TRANSACCIÓN 
                //del mongoDB
            }
        })
    //¿Y si no estamos creando o modificando la contraseña?
    }else{
        next();
    }
})

//¿Qué pasa si ya ingresamos un nombre de usuario que ya teniamos?
UserSchema.methods.usernameExist = async function (username){
    //Encuentra a uno con el mismo valor = .find({username})
    const result = await Mongoose.model('User').findOne({username});
    return !!result;//Si encuentra 1, verdadero = 1.
}

//Para comparar los passwords, lo vamos a utilizar en el login.
//password = ingresado y hash = la contraseña q tengo en la bd.
UserSchema.methods.comparePassword = async function (password, hash){
    const same = await bcrypt.compare(password, hash);
    return same;
}

//Crear AccessToken
UserSchema.methods.createAccessToken = function(){
/*
El AccessToken sirve para acceder a recursos protegidos durante un periodo corto.
Podriamos pasarle el objeto con "this" de nuestro usuario y con él nuestra
contraseña incriptada, aún así es peligroso porque esos datos se expone fuera
de mi servidor. Voy a crear una función que permita tomar mi usuario y regresar 
un objeto con las propiedades que yo quiero guardar en mi AccessToken.
this = UserSchema = new Mongoose.Schema
 */
    return generateAccessToken(getUserinfo(this));
};
//Crear RefreshToken
UserSchema.methods.createRefreshToken = async function(){
/*
El refreshToken sirve para generar un nuevo AccessToken después de que el actual 
ha expirado sin requerir una nueva autenticación del usuario.
Podemos guardar ese refreshToken, validar si éso está guardado en mi bd
    si lo está:
        Sabemos que el usuerio no ah cerrado su sesión.
    sino:
        Ah cerrado su sesión, lo que significa que...
        El AccessToken caduca y el refreshToken pasaría ser el AccessToken.
        Tons ya no hay un refreshToken en la bd.

*/
    const refreshToken = generateRefreshToken(getUserinfo(this));
    try {
        //el .save() guarda en la bd
        await new Token({token: refreshToken}).save();
        return refreshToken;
    } catch (error) {
        console.log(error)
    }
};

//Vamos a exportar el esquema
module.exports = Mongoose.model("User",UserSchema);