import { Friendship } from '@entities/friendship.entity'

const friendshipSeed: any[] = [
  {
    id: 1,
    status: 'ACCEPTED',
    user: {
      id: 1
    },
    friend: {
      id: 2
    },
  },
  {
    id: 2,
    status: 'REQUESTED',
    user: {
      id: 1
    },
    friend: {
      id: 3
    },
  },
  {
    id: 3,
    status: 'ACCEPTED',
    user: {
      id: 1
    },
    friend: {
      id: 5
    },
  },
  {
    id: 4,
    status: 'REQUESTED',
    user: {
      id: 1
    },
    friend: {
      id: 7
    },
  },
  {
    id: 5,
    status: 'ACCEPTED',
    user: {
      id: 1
    },
    friend: {
      id: 9
    },
  },
];

export default friendshipSeed;