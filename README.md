Empezando con auth/AuthProvider:

    ¿Por qué cada vez que el usuario se ah registrado, 
    se pierde con cada actualizar página?        
        Cuando tenemos un AccessToken en memoria significa 
        que el usuario está autenticado o loginADO.                
        refreshNewAccessToken
            Se utiliza para obtener un nuevo 
            accessToken utilizando el refreshToken.
        getUserInfo 
            Retorna información del usuario.
        checkAuth
            Al actualizar la pág, genera un accessToken,
            te regresa la información del usuario y lo guarda
        signOut
            Para cerrar sesión. 
            localStorage.removeItem("token") Elimina el token            
        getAccessToken, getUser, getAllToDoUsers, getRefreshToken
            Es el get de POO, llama info. En routes/dashboard 
            necesitamos pintar el nombre del usuario, x ejem.
        saveSessionInfo
            Guarda: access, refresh, si estoy autorizado para
            entrar a una página, guarda info del usuario.
        getAllAccessToken
            Retorna todos los accessTokens de los usuarios
        getAllToDo
            Retorna todos los To Do's de los usuarios
        RefreshToDo
            Organiza la info de los To Do's de los usuarios
            TodayDate = fecha (falta pasar de UTC a local)
routes/Dahsboard:

    (e: React.FormEvent<HTMLFormElement>): Este es el parámetro de la función. 
    "e" es un objeto de tipo React.FormEvent, que representa el evento de envío 
    del formulario.  HTMLFormElement es el tipo del elemento que está siendo enviado, 
    es decir, el formulario HTML. Al proporcionar el tipo, TypeScript puede realizar 
    comprobaciones de tipo estático para garantizar que la función solo se use 
    con eventos de formularios válidos.

