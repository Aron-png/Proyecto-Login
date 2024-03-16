//Si tuvieramos más propiedades, lo incluiriamos... menos password
//Por temas de seguridad
function getUserinfo(user){
    return {
        username: user.username,
        name: user.name,
        id: user.id || user._id,
    }
}
module.exports = getUserinfo;
