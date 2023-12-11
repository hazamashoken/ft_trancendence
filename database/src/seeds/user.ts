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
  },
  {
    id: 2,
    intraId: 171877,
    intraLogin: "npraneep",
    intraUrl: "https://api.intra.42.fr/v2/users/npraneep",
    firstName: "Nutchaphat",
    lastName: "Praneeprachachon",
    email: "npraneep@student.42bangkok.com",
    displayName: "Nutchaphat Praneeprachachon",
    imageUrl: "https://cdn.intra.42.fr/users/092ecdce5717f9c08cf4e6b8af9a39ea/npraneep.jpg",
  },
  {
    id: 3,
    intraId: 171788,
    intraLogin: "kphimpha",
    intraUrl: "https://api.intra.42.fr/v2/users/kphimpha",
    firstName: "Kewalin",
    lastName: "Phimpha",
    email: "kphimpha@student.42bangkok.com",
    displayName: "Kewalin Phimpha",
    imageUrl: "https://cdn.intra.42.fr/users/cce0f7c9f102704a185d8584e65907b6/kphimpha.jpg",
  },
  {
    id: 4,
    intraId: 171786,
    intraLogin: "pwasuwiw",
    intraUrl: "https://api.intra.42.fr/v2/users/pwasuwiw",
    firstName: "Pawi",
    lastName: "Wasuwiwath",
    email: "pwasuwiw@student.42bangkok.com",
    displayName: "Kewalin Phimpha",
    imageUrl: "https://cdn.intra.42.fr/users/0787d84049ea2d488ecb990f3d5ba832/pwasuwiw.jpg",
  },
  {
    id: 5,
    intraId: 171781,
    intraLogin: "dhapakde",
    intraUrl: "https://api.intra.42.fr/v2/users/dhapakde",
    firstName: "Dhanut",
    lastName: "Pakdesontiskul",
    email: "pwasuwiw@student.42bangkok.com",
    displayName: "Dhanut Pakdesontiskul",
    imageUrl: "https://cdn.intra.42.fr/users/84c6f0ad8ade8f35a8e4b7c36cbd40d7/dhapakde.jpg",
  }
];

export default userSeed;