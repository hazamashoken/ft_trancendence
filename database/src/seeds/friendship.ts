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
    status: 'ACCEPTED',
    user: {
      id: 2
    },
    friend: {
      id: 1
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
    status: 'ACCEPTED',
    user: {
      id: 5
    },
    friend: {
      id: 1
    },
  },
  {
    id: 5,
    status: 'REQUESTED',
    user: {
      id: 1
    },
    friend: {
      id: 9
    },
  },
  {
    id: 6,
    status: 'WAITING',
    user: {
      id: 9
    },
    friend: {
      id: 1
    },
  },
  {
    id: 5,
    status: 'WAITING',
    user: {
      id: 1
    },
    friend: {
      id: 7
    },
  },
  {
    id: 6,
    status: 'REQUESTED',
    user: {
      id: 7
    },
    friend: {
      id: 1
    },
  },
];

export default friendshipSeed;