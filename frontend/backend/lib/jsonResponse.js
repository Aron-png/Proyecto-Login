//Códio de respuesta de una solicitud http
exports.jsonResponse = function(statusCode, body){
    return{
        statusCode,
        body,
    };
};
