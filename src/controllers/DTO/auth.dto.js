export default class AuthDTO {
  constructor(auth) {
    this.firstName = auth.firstName;
    this.lastName = auth.lastName;
    this.email = auth.email;
    this.age = auth.age;
    this.password = auth.password;
    this.cartID = auth.cartID;
    this.rol = auth.rol;
    this.documents = auth.documents;
    this.last_connection = auth.last_connection;
  }
}
