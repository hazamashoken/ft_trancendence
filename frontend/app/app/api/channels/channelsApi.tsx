import { BanUserDto, ChannelCreatedTO, ChannelsEntity, ChatUserDto, CreateMessageDto, CreateMuteDto, ReturnBannedDto, ReturnMessageDto, ReturnMutedDto, UpdateMessageDto, UpdateMuteDto } from "./interfaces";

const BASE_URL = 'http://loclahost:3000/api/channels'; // Replace with your API's URL if different

// Function to send GET request
const fetchGet = async (path: string): Promise<any> => {
  const response = await fetch(`${BASE_URL}${path}`);
  return response.json();
};

// Function to send POST request
const fetchPost = async (path: string, body?: any): Promise<any> => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    });
    return response.json();
  };

// Fetch all channels
export const findAllChannels = async (): Promise<ChannelsEntity[]> => {
  return await fetchGet('/all');
};

// Fetch public channels
export const findPublicChannels = async (): Promise<ChannelsEntity[]> => {
  return await fetchGet('/public');
};

// Fetch private channels of a user
export const findPrivateChannels = async (userId: number): Promise<ChannelsEntity[]> => {
  return await fetchGet(`/usersPrivate/${userId}`);
};

// Fetch protected channels of a user
export const findProtectedChannels = async (userId: number): Promise<ChannelsEntity[]> => {
  return await fetchGet(`/usersProtect/${userId}`);
};

// Fetch direct message channels of a user
export const findDmChannels = async (userId: number): Promise<ChannelsEntity[]> => {
  return await fetchGet(`/usersDm/${userId}`);
};

// Fetch details of a specific channel
export const findOneChannel = async (chatId: number): Promise<ChannelsEntity> => {
  return await fetchGet(`/${chatId}`);
};

// Fetch the owner of a channel
export const findChannelOwner = async (chatId: number): Promise<ChatUserDto> => {
  return await fetchGet(`/${chatId}/owner`);
};

// Create a channel (WebSocket event: 'chat created')
export const createChannel = async (dto: ChannelCreatedTO): Promise<ChannelsEntity> => {
  return await fetchPost('/create', dto);
};

// Delete a channel (WebSocket event: {message: 'chat deleted', chatId: chatId})
export const deleteChannel = async (chatId: number, userId: number): Promise<ChannelsEntity[]> => {
  return await fetchPost(`/${chatId}/delete/${userId}`);
};

// Update a channel (WebSocket event: {event: 'chat updated', chatId: chatId})
export const updateChannel = async (chatId: number, dto: ChannelCreatedTO): Promise<ChannelsEntity[]> => {
  return await fetchPost(`/${chatId}/update`, dto);
};

// Add a user to a channel (WebSocket event: {message: 'user added', chatId: chatId, event: 'getChatUsers'})
export const addUserToChannel = async (chatId: number, userId: number): Promise<ChatUserDto[]> => {
  return await fetchPost(`/${chatId}/addUser/${userId}`);
};

// Remove a user from a channel (WebSocket event: {message: 'user removed', chatId: chatId, event: 'getChatUsers'})
export const removeUserFromChannel = async (chatId: number, userId: number): Promise<ChatUserDto[]> => {
  return await fetchPost(`/${chatId}/removeUser/${userId}`);
};

// Fetch users of a channel
export const getChannelUsers = async (chatId: number): Promise<ChatUserDto[]> => {
  return await fetchGet(`/${chatId}/users`);
};

// Add an admin to a channel (WebSocket event: {message: 'admin added', chatId: chatId, event: 'getChatAdmins'})
export const addAdminToChannel = async (chatId: number, userId: number): Promise<ChatUserDto[]> => {
  return await fetchPost(`/${chatId}/addAdmin/${userId}`);
};

// Remove an admin from a channel (WebSocket event: {message: 'admin removed', chatId: chatId, event: 'getChatAdmins'})
export const removeAdminFromChannel = async (chatId: number, adminId: number): Promise<ChatUserDto[]> => {
  return await fetchPost(`/${chatId}/removeAdmin/${adminId}`);
};

// Fetch admins of a channel
export const getChannelAdmins = async (chatId: number): Promise<ChatUserDto[]> => {
  return await fetchGet(`/${chatId}/admins`);
};

// Fetch banned users of a channel
export const getBannedUsers = async (chatId: number): Promise<ReturnBannedDto[]> => {
  return await fetchGet(`/${chatId}/bannedUsers`);
};

// Ban a user in a channel (WebSocket event: {message: 'user banned', chatId: chatId, event: 'getChatBanned'})
export const banUserInChannel = async (chatId: number, adminId: number, dto: BanUserDto): Promise<ReturnBannedDto[]> => {
  return await fetchPost(`/${chatId}/banUser/${adminId}`, dto);
};

// Unban a user in a channel (WebSocket event: {message: 'user unbanned', chatId: chatId, event: 'getChatBanned'})
export const unbanUserInChannel = async (bannedId: number, chatId: number): Promise<ReturnBannedDto[]> => {
  return await fetchPost(`/${chatId}/removeBanned/${bannedId}`);
};

// Update a message in a channel (WebSocket event: {message: 'message updated', event: 'getChatMessages'})
export const updateChannelMessage = async (dto: UpdateMessageDto): Promise<ReturnMessageDto[]> => {
  return await fetchPost('/:messageId/updateMessage', dto);
};

// Create a message in a channel (WebSocket event: {message: 'message created', chatId: chatId, event: 'getChatMessages'})
export const createChannelMessage = async (chatId: number, dto: CreateMessageDto): Promise<ReturnMessageDto[]> => {
  return await fetchPost(`/${chatId}/createmessage`, dto);
};

// Delete a message in a channel (WebSocket event: {message: 'message deleted', chatId: chatId, event: 'getChatMessages'})
export const deleteChannelMessage = async (messageId: number, chatId: number): Promise<ReturnMessageDto[]> => {
  return await fetchPost(`/${chatId}/deleteMessage/${messageId}`);
};

// Fetch messages of a channel
export const getChannelMessages = async (chatId: number): Promise<ReturnMessageDto[]> => {
  return await fetchGet(`/${chatId}/messages`);
};

// Fetch muted users in a channel
export const getMutedUsersInChannel = async (chatId: number): Promise<ReturnMutedDto[]> => {
  return await fetchGet(`/${chatId}/muted`);
};

// Mute a user in a channel (WebSocket event: {message: 'user muted', event: 'getChatMuted'})
export const muteUserInChannel = async (dto: CreateMuteDto): Promise<ReturnMutedDto[]> => {
  return await fetchPost(`/muteUser`, dto);
};

// Update a mute in a channel (WebSocket event: {message: 'mute updated', event: 'getChatMuted'})
export const updateMuteInChannel = async (chatId: number, dto: UpdateMuteDto): Promise<ReturnMutedDto[]> => {
  return await fetchPost(`/${chatId}/muteUpdate`, dto);
};

// Unmute a user in a channel (WebSocket event: {message: 'mute update', event: 'getChatMuted'})
export const unmuteUserInChannel = async (mutedId: number, chatId: number): Promise<ReturnMutedDto[]> => {
  return await fetchPost(`/${chatId}/unmute/${mutedId}`);
};

// Join a user to a channel (WebSocket event: {message: 'user joined chat', event: 'getActiveUsers'})
export const joinChannel = async (chatId: number, userId: number): Promise<ChatUserDto[]> => {
  return await fetchPost(`/${chatId}/joinChat/${userId}`);
};

// User quits a channel (WebSocket event: {message: 'user quit chat', event: 'getActiveUsers'})
export const quitChannel = async (chatId: number, userId: number): Promise<ChatUserDto[]> => {
  return await fetchPost(`/${chatId}/quitChat/${userId}`);
};

// Fetch active users in a channel
export const getActiveUsersInChannel = async (chatId: number): Promise<ChatUserDto[]> => {
  return await fetchGet(`/${chatId}/activeUsers`);
}