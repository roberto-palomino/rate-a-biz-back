# Rate a Biz ✅

-   Se trata de una web donde los usuarios valoran empresas y hacen comentarios.

-   Cada entrada puede ser votada con una puntuación entre 1 y 5 distintos campos.

## Endpoints comunes (martin)

-   POST - [/signup] - Crea un usuario pendiente de activar. (Enviar en el body el accountType) ✅
-   GET - [users/validate/:registrationCode] - Valida un usuario recién registrado.✅
-   GET - [business/validate/:registrationCode] - Valida una empresa recién registrada.✅
-   POST - [/login] - Logea a un usuario retornando un token.✅
-   PUT - [/password/recover] - Envia un correo con el código de reseteo de contraseña a un email.✅
-   PUT - [/users/password/reset/:recoverCode] - Cambia la contraseña de un usuario con un código de reseteo.✅
-   PUT - [/business/password/reset/:recoverCode] - Cambia la contraseña de un usuario con un código de reseteo.✅

## Endpoints del usuario (roberto)

-   GET - [/users/:idUser] - Retorna información de un usuario concreto.✅
-   PUT - [/users/:idUser] - Editar perfil de usuario.✅
-   PUT - [/users/:idUser/avatar] - Edita el avatar de un usuario.✅
-   PUT - [/users/:idUser/password] - Edita la contraseña de un usuario.✅
-   DELETE - [/users/:idUser] - Borra un usuario.✅

## Endpoints de la empresa (todos)

-   GET - [/business] - Retorna información de las empresas (Devuelve el top15)
<!-- -   GET - [/business/search] - Buscador -->
-   GET - [/business/idBusiness] - Retorna información de una empresa en concreto.
-   PUT - [/business/:idBusiness] - Editar perfil de empresa
-   PUT - [/business/:idBusiness/avatar] - Edita el avatar de una empresa.
-   PUT - [/business/:idBusiness/password] - Edita la contraseña de una empresa.
-   DELETE - [/business/idBusiness] - Borra una empresa

## Endpoints de comment (cris)

-   GET - [/comments/:idBusiness] - Retorna los comentarios de una empresa en concreto
-   GET - [/comments/:idUser] - Retorna los comentarios de un usuario
-   POST - [/comments/:idBusiness] - Crea un comentario
-   PUT - [/comments/:idBusiness/:idComment] - Edita la descripción o el título de un comentario.
-   DELETE - [/comments/:idBusiness/:idComment] - Borra un comentario.

## Endpoints de votes (martin)

-   POST - [/votes/:idBusiness] - Vota una empresa.
-   PUT - [/votes/:idBusiness/:idVote] - Edita el voto durante 24 horas (comparar createdAt con fecha actual)
