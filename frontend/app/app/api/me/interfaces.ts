export interface User {
  id: number;
  intraId: number;
  intraLogin: string;
  intraUrl: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  imageUrl: string;
}

export interface FtUser {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  url: string;
  displayname: string;
  image: {
    link: string;
  }
}
