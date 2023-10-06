import { User } from '@entities/user.entity'

const userSeed: Partial<User>[] = [
  {
    id: 1,
    intraId: 103071,
    intraLogin: "tsomsa",
    intraUrl: "https://api.intra.42.fr/v2/users/tsomsa",
    firstName: "Thitiwut",
    lastName: "Somsa",
    email: "tsomsa@student.42bangkok.com",
    displayName: "tsomsa",
    imageUrl: "https://cdn.intra.42.fr/users/419d49d85cb790463bc56724cb424880/tsomsa.png",
  }
];

export default userSeed;