export class UserResponseDto {
  _id: string;
  username: string;
  email: string;

  constructor(_id: string, username: string, email: string) {
    this._id = _id;
    this.username = username;
    this.email = email;
  }
}
