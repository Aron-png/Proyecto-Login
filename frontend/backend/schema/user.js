const Mongoose = require("mongoose");
const bcrypt = require('bcrypt');// Importamos bcrypt para el hash de contraseñas

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

//Para Comparar el password que vamos a utilizar en el login.
UserSchema.methods.comparePassword = async function (password, hash){
    const same = await bcrypt.compare(password, hash);
    return same;
}

//Vamos a exportar el esquema
module.exports = Mongoose.model("User",UserSchema);