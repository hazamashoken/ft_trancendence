export interface FtUser {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  url: string;
  displayName: string;
  kind: string | 'student' | 'staff';
  image: {
    link: string;
    versions: {
      large: string;
      medium: string;
      small: string;
      micro: string;
    };
  };
  titles: string[];
}
