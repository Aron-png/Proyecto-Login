Empezndo con auth/AuthProvider:
/*
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
    */
