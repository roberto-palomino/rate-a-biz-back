# Rate a Biz ✅

-   Se trata de una web donde los usuarios valoran empresas y hacen comentarios.

-   Cada entrada puede ser votada con una puntuación entre 1 y 5.

## Endpoints del usuario

-   POST - [/signup] - Crea un usuario pendiente de activar.
-   POST - [/login] - Logea a un usuario retornando un token.
-   GET - [/users/validate/:registrationCode] - Valida un usuario recién registrado.
-   DELETE - [/users/:idUser] - Borra un usuario.

-   GET - [/users/:idUser] - Retorna información de un usuario concreto.

-   PUT - [/users/:idUser] - Edita el nombre o el email de un usuario.
-   PUT - [/users/:idUser/avatar] - Edita el avatar de un usuario.
-   PUT - [/users/:idUser/password] - Edita la contraseña de un usuario.
-   PUT - [/users/password/recover] - Envia un correo con el código de reseteo de contraseña a un email.
-   PUT - [/users/password/reset] - Cambia la contraseña de un usuario con un código de reseteo.

## Endpoints del diario

-   GET - [/entries] - Retorna el listado de entradas. ✅
-   GET - [/entries/:idEntry] - Retorna una entrada en concreto. ✅
-   POST - [/entries] - Crea una entrada. ✅
-   POST - [/entries/:idEntry/photos] - Añade una imagen a una entrada. ✅
-   POST - [/entries/:idEntry/votes] - Vota una entrada. ✅
-   PUT - [/entries/:idEntry] - Edita la descripción o el título de una entrada. ✅
-   DELETE - [/entries/:idEntry] - Borra una entrada. ✅
-   DELETE - [/entries/:idEntry/photos/:idPhoto] - Elimina una foto de una entrada. ✅
