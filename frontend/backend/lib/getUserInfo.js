//Si tuvieramos más propiedades, lo incluiriamos... menos password
function getUserinfo(user){
    return {
        username: user.name,
        name: user.name,
        id: user.id,
    }
}
module.exports = getUserinfo;
