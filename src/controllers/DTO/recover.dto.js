export default class RecoverDTO {
  constructor(recover) {
    this.email = recover.email;
    this.token = recover.token;
    this.expire = recover.expire;
  }
}
