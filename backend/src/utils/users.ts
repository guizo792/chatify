export type User = {
  id: any;
  username: string;
  room: string;
};

const users: User[] = [];

// Join user to chat
function joinUser(id: any, username: string, room: string) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// Get current user
function getCurrentUser(id: any) {
  return users.find((user) => user.id === id);
}

// Leaving chat
function userLeave(id: any) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Ge room users
function getRoomUsers(room: string) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  joinUser,
  getCurrentUser,
  userLeave,
  getRoomUsers,
};
