Synchronous-blocking Asynchronous-non-blocking

StatusCode(https://www.restapitutorial.com/httpstatuscodes.html)

200 - ok

404-failed

201-created

204-NoContent

400-BadRequest

401-Unauthorized

403-Forbidden

404-NotFound

500-Internal-ServerError

Data Modelling

Hotels ------ users(hotel-admin) ===> 1:few child-referencing

Hotels ------ reviews ===> 1:many parent-referencing

Hotels ------ rooms ===> 1:many embedding

users ------ reviews ===> 1:many parent-referencing

users ------ bookings ===> 1:many parent-referencing


//HTML => PUG CONVERTER
https://pughtml.com/