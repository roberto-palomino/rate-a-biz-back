# Rate a Biz ✅

-   Se trata de una web donde los usuarios valoran empresas y hacen comentarios.

-   Cada entrada puede ser votada con una puntuación entre 1 y 5 distintos campos.

## Endpoints comunes

-   POST - [/signup] - Crea un usuario pendiente de activar. (Enviar en el body el accountType) ✅
-   GET - [/validate/:registrationCode] - Valida un usuario recién registrado.✅
-   POST - [/login] - Logea a un usuario retornando un token.✅
-   PUT - [/password/recover] - Envia un correo con el código de reseteo de contraseña a un email.✅
-   PUT - [/password/reset/:recoverCode] - Cambia la contraseña de un usuario con un código de reseteo.✅

## Endpoints del usuario

-   GET - [/users/:idUser] - Retorna información de un usuario concreto.✅
-   PUT - [/users/:idUser] - Editar perfil de usuario.✅
-   PUT - [/users/:idUser/avatar] - Edita el avatar de un usuario.✅
-   PUT - [/users/:idUser/password] - Edita la contraseña de un usuario.✅
-   DELETE - [/users/:idUser] - Borra un usuario.✅

## Endpoints de la empresa

(Los datos se obtienen a través del idUser que es lo que enlaza business con users).

-   GET - [/business] - Retorna información de las empresas (Filtramos a nuestro gusto)✅
-   GET - [/business/idUser] - Retorna información de una empresa en concreto.✅
-   PUT - [/business/:idUser] - Editar perfil de empresa.✅
-   PUT - [/business/:idUser/avatar] - Edita el avatar de una empresa.✅

## Endpoints de review

-   GET - [/review/:idBusiness] - Retorna la review de una empresa en concreto
-   GET - [/review/:idUser] - Retorna las reviews de un usuario
-   GET - [/states] - Retorna la tabla de provincias ✅
-   GET - [/jobs] - Retorna la tabla de trabajos ✅
-   GET - [/sectors] - Retorna la tabla de sectores ✅
-   GET - [/salaries] - Retorna la tabla de rango de salarios ✅
-   POST - [/review/:idBusiness] - Crea un review de una empresa
-   PUT - [/review/:idBusiness/:idReview] - Edita la review. (solo las primeras 24h)
-   DELETE - [/review/:idBusiness/:idReview] - Borra una review.
