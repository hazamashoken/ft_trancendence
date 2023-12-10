import { WebSocketGateway, OnGatewayConnection, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './chatSocket.service';
import { ChannelsEntity } from '@backend/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { ChannelCreatedTO } from '@backend/channels/dto/create-channel.dto';
import { UpdateMessageDto } from '@backend/messages/dto/update-message.dto';
import { CreateMuteDto } from '@backend/muted/dto/create-muted.dto';

@WebSocketGateway({
	cors: {
		origin: '*'
	},
})
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: SocketService) {}

  /**
   * Обрабатывает подключение нового клиента к WebSocket серверу и возвращает его идентификатор.
   * Handles the connection of a new client to the WebSocket server and returns their ID.
   */
  handleConnection(socket: Socket): string {
    this.socketService.handleConnection(socket);
    return socket.id;
  }

  /**
   * Получает и отправляет список всех публичных каналов клиенту.
   * Retrieves and sends a list of all public channels to the client.
   */
  @SubscribeMessage('findAllPublicChannels')
  async handleFindAllPublicChannels(client: Socket): Promise<any> {
    const channels = await this.socketService.findAllPublicChannels();
    client.emit('findAllPublicChannelsResponse', channels);
    return channels;
  }

  /**
   * Получает и отправляет список приватных чатов пользователя.
   * Retrieves and sends a list of a user's private chats.
   */
  @SubscribeMessage('findUserPrivateChats')
  async handleFindUserPrivateChats(client: Socket, userId: number): Promise<any> {
    try {
      const channels = await this.socketService.findUserPrivateChats(userId);
      client.emit('findUserPrivateChatsResponse', channels);
      return channels;
    } catch (error) {
      this.server.emit('errorResponse', { event: 'findUserPrivateChats', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Получает и отправляет список защищенных чатов пользователя.
   * Retrieves and sends a list of a user's protected chats.
   */
  @SubscribeMessage('findUserProtectedChats')
  async handleFindUserProtectedChats(client: Socket, userId: number): Promise<any> {
    try {
      const channels = await this.socketService.findUserProtectedChats(userId);
      client.emit('findUserProtectedChatsResponse', channels);
      return channels;
    } catch (error) {
      this.server.emit('errorResponse', { event: 'findUserProtectedChats', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Получает и отправляет список чатов с прямыми сообщениями пользователя.
   * Retrieves and sends a list of a user's direct message chats.
   */
  @SubscribeMessage('findUserDmChats')
  async handeFindUserDmChats(client: Socket, userId: number): Promise<any> {
    try {
      const channels = await this.socketService.findUserDmChats(userId);
      client.emit('findUserDmChatsResponse', channels);
      return channels;
    } catch (error) {
      client.emit('errorResponse', { event: 'findUserDmChats', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }


  /**
   * Создает новый чат.
   * Creates a new chat.
   */
  @SubscribeMessage('createChat')
  async handleCreateChat(client: Socket, dto: ChannelCreatedTO): Promise<any> {
    try {
      const chat = await this.socketService.createChat(dto);
      this.server.emit('chatCreated', chat);
      return { status: 'success', chat };
    } catch (error) {
      client.emit('errorResponse', { event: 'createChat', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Находит чат по идентификатору.
   * Finds a chat by ID.
   */
  @SubscribeMessage('findChat')
  async handleFindChat(client: Socket, chatId: number): Promise<any> {
    try {
      const chat = await this.socketService.findChat(chatId);
      client.emit('findChatResponse', chat);
      return { status: 'success', chat };
    } catch (error) {
      client.emit('errorResponse', { event: 'findChat', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Находит владельца чата по идентификатору чата.
   * Finds the owner of a chat by the chat's ID.
   */
  @SubscribeMessage('findChatOwner')
  async handleFindChatOwner(client: Socket, chatId: number): Promise<any> {
    try {
      const user = await this.socketService.findChatOwner(chatId);
      client.emit('findChatOwnerResponse', user);
      return { status: 'success', user };
    } catch (error) {
      client.emit('errorResponse', { event: 'findChatOwner', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Удаляет чат.
   * Deletes a chat.
   */
  @SubscribeMessage('deleteChat')
  async handleDeleteChat(client: Socket, { chatId, userId }: { chatId: number, userId: number }): Promise<any> {
    try {
      const chats = await this.socketService.deleteChat(chatId, userId);
      this.server.emit('chatDeleted', chats); // Broadcasting to all clients
      return { status: 'success', chats };
    } catch (error) {
      client.emit('errorResponse', { event: 'deleteChat', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Добавляет пользователя в чат.
   * Adds a user to a chat.
   */
  @SubscribeMessage('addUserToChat')
  async handleAddUserToChat(client: Socket, { chatId, userId }: { chatId: number, userId: number }): Promise<any> {
    try {
      const updatedUsers = await this.socketService.addUserToChat(chatId, userId);
      this.server.emit('userAddedToChat', { chatId, updatedUsers }); // Broadcasting to all clients
      return { status: 'success', updatedUsers };
    } catch (error) {
      client.emit('errorResponse', { event: 'addUserToChat', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Удаляет пользователя из чата.
   * Removes a user from a chat.
   */
  @SubscribeMessage('removeUserFromChat')
  async handleRemoveUserFromChat(client: Socket, { chatId, userId }: { chatId: number, userId: number }): Promise<any> {
    try {
      const updatedUsers = await this.socketService.removeUserFromChat(chatId, userId);
      this.server.emit('userRemovedFromChat', { chatId, updatedUsers }); // Broadcasting to all clients
      return { status: 'success', updatedUsers };
    } catch (error) {
      client.emit('errorResponse', { event: 'removeUserFromChat', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }


  /**
   * Добавляет администратора в чат.
   * Adds an administrator to a chat.
   */
  @SubscribeMessage('addAdminToChat')
  async handleAddAdminToChat(client: Socket, { chatId, userId }: { chatId: number, userId: number }): Promise<any> {
    try {
      const updatedAdmins = await this.socketService.addAdminToChat(chatId, userId);
      this.server.emit('adminAddedToChat', { chatId, updatedAdmins }); // Broadcasting to all clients
      return { status: 'success', updatedAdmins };
    } catch (error) {
      client.emit('errorResponse', { event: 'addAdminToChat', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Удаляет администратора из чата.
   * Removes an administrator from a chat.
   */
  @SubscribeMessage('removeAdminFromChat')
  async handleRemoveAdminFromChat(client: Socket, { chatId, adminId }: { chatId: number, adminId: number }): Promise<any> {
    try {
      const updatedAdmins = await this.socketService.removeAdminFromChat(chatId, adminId);
      this.server.emit('adminRemovedFromChat', { chatId, updatedAdmins }); // Broadcasting to all clients
      return { status: 'success', updatedAdmins };
    } catch (error) {
      client.emit('errorResponse', { event: 'removeAdminFromChat', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Находит администраторов чата.
   * Finds the administrators of a chat.
   */
  @SubscribeMessage('findChatAdmins')
  async handleFindChatAdmins(client: Socket, chatId: number): Promise<any> {
    try {
      const chatAdmins = await this.socketService.findChatAdmins(chatId);
      this.server.emit('chatAdminsFound', { chatId, chatAdmins }); // Broadcasting to all clients
      return { status: 'success', chatAdmins };
    } catch (error) {
      client.emit('errorResponse', { event: 'findChatAdmins', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Получает и отправляет список забаненных пользователей в чате.
   * Retrieves and sends a list of banned users in a chat.
   */
  @SubscribeMessage('getBannedUsers')
  async handleGetBannedUsers(client: Socket, chatId: number): Promise<any> {
    try {
      const bannedUsers = await this.socketService.getBannedUsers(chatId);
      client.emit('getBannedUsersResponse', bannedUsers);
      return { status: 'success', bannedUsers };
    } catch (error) {
      client.emit('errorResponse', { event: 'getBannedUsers', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Добавляет пользователя в список забаненных в чате.
   * Adds a user to the list of banned users in a chat.
   */
  @SubscribeMessage('addBannedUser')
  async handleAddBannedUser(client: Socket, { chatId, adminId, dto }): Promise<any>{
    try {
      const bannedUsers = await this.socketService.addBannedUser(chatId, adminId, dto);
      this.server.emit('addBannedUserResponse', bannedUsers);
      return { status: 'success', bannedUsers };
    } catch (error) {
      client.emit('errorResponse', { event: 'addBannedUser', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Удаляет пользователя из списка забаненных в чате.
   * Removes a user from the list of banned users in a chat.
   */
  @SubscribeMessage('removeBannedUser')
  async handleRemoveBannedUser(client: Socket, { chatId, bannedId }): Promise<any>{
    try {
      const bannedUsers = await this.socketService.removeBannedUser(chatId, bannedId);
      this.server.emit('removeBannedUserResponse', bannedUsers);
      return { status: 'success', bannedUsers };
    } catch (error) {
      client.emit('errorResponse', { event: 'removeBannedUser', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Обновляет сообщение в чате.
   * Updates a message in the chat.
   */
  @SubscribeMessage('updateMessage')
  async handleUpdateMessage(client: Socket, dto: UpdateMessageDto): Promise<any>{
    try {
      const updatedMessage = await this.socketService.updateMessage(dto);
      this.server.emit('updateMessageResponse', updatedMessage);
      return { status: 'success', updatedMessage };
    } catch (error) {
      client.emit('errorResponse', { event: 'updateMessage', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Создает новое сообщение в чате.
   * Creates a new message in the chat.
   */
  @SubscribeMessage('createMessage')
  async handleCreateMessage(client: Socket, { chatId, dto }): Promise<any>{
    try {
      const newMessage = await this.socketService.createMessage(chatId, dto);
      this.server.emit('createMessageResponse', newMessage);
      return { status: 'success', newMessage };
    } catch (error) {
      client.emit('errorResponse', { event: 'createMessage', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
 * Удаляет сообщение из чата.
 * Deletes a message from the chat.
 */
  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(client: Socket, { messageId, chatId }): Promise<any> {
    try {
      const messages = await this.socketService.deleteMessage(messageId, chatId);
      this.server.emit('deleteMessageResponse', messages);
      return { status: 'success', messages };
    } catch (error) {
      client.emit('errorResponse', { event: 'createMessage', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Получает все сообщения в чате.
   * Retrieves all messages in the chat.
   */
  @SubscribeMessage('findAllMessagesByChannel')
  async handleFindAllMessagesByChannel(client: Socket, chatId: number): Promise<any> {
    try {
      const messages = await this.socketService.findAllMessagesByChannel(chatId);
      client.emit('findAllMessagesByChannelResponse', messages);
      return { status: 'success', messages };
    } catch (error) {
      client.emit('errorResponse', { event: 'createMessage', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Получает список всех заглушенных пользователей в чате.
   * Retrieves a list of all muted users in the chat.
   */
  @SubscribeMessage('findAllMutedAtChat')
  async handleFindAllMutedAtChat(client: Socket, chatId: number): Promise<any> {
    try {
      const mutedUsers = await this.socketService.findAllMutedAtChat(chatId);
      client.emit('findAllMutedAtChatResponse', mutedUsers);
      return { status: 'success', mutedUsers };
    } catch (error) {
      client.emit('errorResponse', { event: 'createMessage', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Заглушает пользователя в чате.
   * Mutes a user in the chat.
   */
  @SubscribeMessage('muteUser')
  async handleMuteUser(client: Socket, dto: CreateMuteDto): Promise<any> {
    try {
      const mutedUsers = await this.socketService.muteUser(dto);
      this.server.emit('muteUserResponse', mutedUsers);
      return { status: 'success', mutedUsers };
    } catch (error) {
      client.emit('errorResponse', { event: 'createMessage', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Обновляет статус заглушения пользователя в чате.
   * Updates the mute status of a user in the chat.
   */
  @SubscribeMessage('updateMute')
  async handleUpdateMute(client: Socket, { dto, chatId }) : Promise<any> {
    try {
      const mutedUser = await this.socketService.updateMute(dto, chatId);
      this.server.emit('updateMuteResponse', mutedUser);
      return { status: 'success', mutedUser };
    } catch (error) {
      client.emit('errorResponse', { event: 'createMessage', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

  /**
   * Разmмючивает пользователя в чате.
   * Unmutes a user in the chat.
   */
  @SubscribeMessage('unMute')
  async handleUnMute(client: Socket, { mutedId, chatId }): Promise<any> {
    try {
      const mutedUsers = await this.socketService.unMute(mutedId, chatId);
      this.server.emit('unMuteResponse', mutedUsers);
      return { status: 'success', mutedUsers };
    } catch (error) {
      client.emit('errorResponse', { event: 'createMessage', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

   /**
   * Присоединяет пользователя к чату.
   * Joins a user to the chat.
   */
  @SubscribeMessage('joinChat')
  async handleJoinChat(client: Socket, { chatId, userId }): Promise<any> {
    try {
      const users = await this.socketService.joinChannel(chatId, userId);
      this.server.emit('joinChatResponse', users);
      return { status: 'success', users };
    } catch (error) {
      client.emit('errorResponse', { event: 'createMessage', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }
 
   /**
    * Выходит пользователя из чата.
    * Quits a user from the chat.
    */
  @SubscribeMessage('quitChat')
  async handleQuitChat(client: Socket, { chatId, userId }): Promise<any> {
    try {
      const users = await this.socketService.quitChannel(chatId, userId);
      this.server.emit('quitChatResponse', users);
      return { status: 'success', users };
    } catch (error) {
      client.emit('errorResponse', { event: 'createMessage', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }

   /**
    * Получает активных пользователей в чате.
    * Retrieves active users in the chat.
    */
  @SubscribeMessage('getActiveUsers')
  async handleGetActiveUsers(client: Socket, chatId: number): Promise<any> {
    try {
      const activeUsers = await this.socketService.getActiveUsers(chatId);
      this.server.emit('getActiveUsersResponse', activeUsers);
      return { status: 'success', activeUsers };
    } catch (error) {
      client.emit('errorResponse', { event: 'createMessage', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
   }
 
   /**
    * Получает пароль чата.
    * Retrieves the chat's password.
    */
  @SubscribeMessage('getChatPassword')
  async handleGetChatPassword(client: Socket, chatId: number): Promise<any> {
    try {
      const password = await this.socketService.getPassword(chatId);
      client.emit('getChatPasswordResponse', password);
      return { status: 'success', password };
    } catch (error) {
      client.emit('errorResponse', { event: 'createMessage', error: error.message });
      return { status: error.response.status, message: error.response.message };
    }
  }
}