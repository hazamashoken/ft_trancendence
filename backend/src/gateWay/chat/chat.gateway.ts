import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { ChatSocketService } from './chatSocket.service';
import { ChannelsEntity } from '@backend/typeorm';
import { ForbiddenException, Inject, Logger, forwardRef } from '@nestjs/common';
import { CreateMuteDto } from '@backend/features/muted/dto/create-muted.dto';
import * as bcrypt from 'bcrypt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Socket;

  constructor(
    @Inject(forwardRef(() => ChatSocketService))
    private chatSocketService: ChatSocketService,
  ) {}

  /**
   * Обрабатывает подключение нового клиента к WebSocket серверу и возвращает его идентификатор.
   * Handles the connection of a new client to the WebSocket server and returns their ID.
   */
  handleConnection(socket: Socket): string {
    this.chatSocketService.handleConnection(socket);
    return socket.id;
  }

  /**
   * Получает и отправляет список всех публичных каналов клиенту.
   * Retrieves and sends a list of all public channels to the client.
   */
  //   @SubscribeMessage('findAllPublicChannels')
  //   async handleFindAllPublicChannels(client: Socket): Promise<any> {
  //     const channels = await this.chatSocketService.findAllPublicChannels();
  //     client.emit('findAllPublicChannelsResponse', channels);
  //     return channels;
  //   }

  //   /**
  //    * Получает и отправляет список приватных чатов пользователя.
  //    * Retrieves and sends a list of a user's private chats.
  //   */
  //   @SubscribeMessage('findUserPrivateChats')
  //   async handleFindUserPrivateChats(client: Socket, userId: number): Promise<any> {
  //     try {
  //       const channels = await this.chatSocketService.findUserPrivateChats(userId);
  //       client.emit('findUserPrivateChatsResponse', channels);
  //       return channels;
  //     } catch (error) {
  //       this.server.emit('errorResponse', { event: 'findUserPrivateChats', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Получает и отправляет список защищенных чатов пользователя.
  //    * Retrieves and sends a list of a user's protected chats.
  //    */
  //   @SubscribeMessage('findUserProtectedChats')
  //   async handleFindUserProtectedChats(client: Socket, userId: number): Promise<any> {
  //     try {
  //       const channels = await this.chatSocketService.findUserProtectedChats(userId);
  //       client.emit('findUserProtectedChatsResponse', channels);
  //       return channels;
  //     } catch (error) {
  //       this.server.emit('errorResponse', { event: 'findUserProtectedChats', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Получает и отправляет список чатов с прямыми сообщениями пользователя.
  //    * Retrieves and sends a list of a user's direct message chats.
  //    */
  //   @SubscribeMessage('findUserDmChats')
  //   async handeFindUserDmChats(client: Socket, userId: number): Promise<any> {
  //     try {
  //       const channels = await this.chatSocketService.findUserDmChats(userId);
  //       client.emit('findUserDmChatsResponse', channels);
  //       return channels;
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'findUserDmChats', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Создает новый чат.
  //    * Creates a new chat.
  //    */
  //   @SubscribeMessage('createChat')
  //   async handleCreateChat(client: Socket, dto: ChannelCreatedTO): Promise<any> {
  //     try {
  //       const chat = await this.chatSocketService.createChat(dto);
  //       this.server.emit('chatCreated', chat);
  //       return { status: 'success', chat };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'createChat', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Находит чат по идентификатору.
  //    * Finds a chat by ID.
  //    */
  //   @SubscribeMessage('findChat')
  //   async handleFindChat(client: Socket, chatId: number): Promise<any> {
  //     try {
  //       const chat = await this.chatSocketService.findChat(chatId);
  //       client.emit('findChatResponse', chat);
  //       return { status: 'success', chat };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'findChat', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Находит владельца чата по идентификатору чата.
  //    * Finds the owner of a chat by the chat's ID.
  //    */
  //   @SubscribeMessage('findChatOwner')
  //   async handleFindChatOwner(client: Socket, chatId: number): Promise<any> {
  //     try {
  //       const user = await this.chatSocketService.findChatOwner(chatId);
  //       client.emit('findChatOwnerResponse', user);
  //       return { status: 'success', user };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'findChatOwner', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Удаляет чат.
  //    * Deletes a chat.
  //    */
  //   @SubscribeMessage('deleteChat')
  //   async handleDeleteChat(client: Socket, { chatId, userId }: { chatId: number, userId: number }): Promise<any> {
  //     try {
  //       const chats = await this.chatSocketService.deleteChat(chatId, userId);
  //       this.server.emit('chatDeleted', chats); // Broadcasting to all clients
  //       return { status: 'success', chats };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'deleteChat', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Добавляет пользователя в чат.
  //    * Adds a user to a chat.
  //    */
  //   @SubscribeMessage('addUserToChat')
  //   async handleAddUserToChat(client: Socket, { chatId, userId }: { chatId: number, userId: number }): Promise<any> {
  //     try {
  //       const updatedUsers = await this.chatSocketService.addUserToChat(chatId, userId);
  //       this.server.to(`chat_${chatId}`).emit('userAddedToChat', { chatId, updatedUsers }); // Broadcasting to all clients
  //       return { status: 'success', updatedUsers };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'addUserToChat', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Удаляет пользователя из чата.
  //    * Removes a user from a chat.
  //    */
  //   @SubscribeMessage('removeUserFromChat')
  //   async handleRemoveUserFromChat(client: Socket, { chatId, userId }: { chatId: number, userId: number }): Promise<any> {
  //     try {
  //       const updatedUsers = await this.chatSocketService.removeUserFromChat(chatId, userId);
  //       this.server.to(`chat_${chatId}`).emit('userRemovedFromChat', { chatId, updatedUsers }); // Broadcasting to all clients
  //       return { status: 'success', updatedUsers };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'removeUserFromChat', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Добавляет администратора в чат.
  //    * Adds an administrator to a chat.
  //    */
  //   @SubscribeMessage('addAdminToChat')
  //   async handleAddAdminToChat(client: Socket, { chatId, userId }: { chatId: number, userId: number }): Promise<any> {
  //     try {
  //       const updatedAdmins = await this.chatSocketService.addAdminToChat(chatId, userId);
  //       this.server.to(`chat_${chatId}`).emit('adminAddedToChat', { chatId, updatedAdmins }); // Broadcasting to all clients
  //       return { status: 'success', updatedAdmins };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'addAdminToChat', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Удаляет администратора из чата.
  //    * Removes an administrator from a chat.
  //    */
  //   @SubscribeMessage('removeAdminFromChat')
  //   async handleRemoveAdminFromChat(client: Socket, { chatId, adminId }: { chatId: number, adminId: number }): Promise<any> {
  //     try {
  //       const updatedAdmins = await this.chatSocketService.removeAdminFromChat(chatId, adminId);
  //       this.server.to(`chat_${chatId}`).emit('adminRemovedFromChat', { chatId, updatedAdmins }); // Broadcasting to all clients
  //       return { status: 'success', updatedAdmins };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'removeAdminFromChat', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Находит администраторов чата.
  //    * Finds the administrators of a chat.
  //    */
  //   @SubscribeMessage('findChatAdmins')
  //   async handleFindChatAdmins(client: Socket, chatId: number): Promise<any> {
  //     try {
  //       const chatAdmins = await this.chatSocketService.findChatAdmins(chatId);
  //       this.server.emit('chatAdminsFound', { chatId, chatAdmins }); // Broadcasting to all clients
  //       return { status: 'success', chatAdmins };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'findChatAdmins', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Получает и отправляет список забаненных пользователей в чате.
  //    * Retrieves and sends a list of banned users in a chat.
  //    */
  //   @SubscribeMessage('getBannedUsers')
  //   async handleGetBannedUsers(client: Socket, chatId: number): Promise<any> {
  //     try {
  //       const bannedUsers = await this.chatSocketService.getBannedUsers(chatId);
  //       client.emit('getBannedUsersResponse', bannedUsers);
  //       return { status: 'success', bannedUsers };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'getBannedUsers', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Добавляет пользователя в список забаненных в чате.
  //    * Adds a user to the list of banned users in a chat.
  //    */
  //   @SubscribeMessage('addBannedUser')
  //   async handleAddBannedUser(client: Socket, { chatId, adminId, dto }): Promise<any>{
  //     try {
  //       const bannedUsers = await this.chatSocketService.addBannedUser(chatId, adminId, dto);
  //       this.server.to(`chat_${chatId}`).emit('addBannedUserResponse', bannedUsers);
  //       return { status: 'success', bannedUsers };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'addBannedUser', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Удаляет пользователя из списка забаненных в чате.
  //    * Removes a user from the list of banned users in a chat.
  //    */
  //   @SubscribeMessage('removeBannedUser')
  //   async handleRemoveBannedUser(client: Socket, { chatId, bannedId }): Promise<any>{
  //     try {
  //       const bannedUsers = await this.chatSocketService.removeBannedUser(chatId, bannedId);
  //       this.server.to(`chat_${chatId}`).emit('removeBannedUserResponse', bannedUsers);
  //       return { status: 'success', bannedUsers };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'removeBannedUser', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Обновляет сообщение в чате.
  //    * Updates a message in the chat.
  //    */
  //   @SubscribeMessage('updateMessage')
  //   async handleUpdateMessage(client: Socket, dto: UpdateMessageDto): Promise<any>{
  //     try {
  //       const updatedMessage = await this.chatSocketService.updateMessage(dto);
  //       this.server.emit('updateMessageResponse', updatedMessage);
  //       return { status: 'success', updatedMessage };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'updateMessage', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Создает новое сообщение в чате.
  //    * Creates a new message in the chat.
  //    */
  //   @SubscribeMessage('createMessage')
  //   // async handleCreateMessage(client: Socket, { chatId, dto }): Promise<any>{
  //   //   try {
  //   //     const newMessage = await this.chatSocketService.createMessage(chatId, dto);
  //   //     // this.server.emit('createMessageResponse', newMessage);
  //   //     client.to(chatId).emit('createMessage', newMessage);
  //   //     Logger.log(newMessage)
  //   //     return { status: 'success', newMessage };
  //   //   } catch (error) {
  //   //     client.emit('errorResponse', { event: 'createMessage', error: error.message });
  //   //     return { status: error.response.status, message: error.response.message };
  //   //   }
  //   // }
  //   async handleCreateMessage(client: Socket, { chatId, dto }): Promise<any>{
  //     try {
  //       const newMessage = await this.chatSocketService.createMessage(chatId, dto);
  //       // Отправка сообщения только в комнату этого чата
  //       this.server.to(`chat_${chatId}`).emit('createMessage', newMessage);
  //       Logger.log(newMessage)
  //       return { status: 'success', newMessage };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'createMessage', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //  * Удаляет сообщение из чата.
  //  * Deletes a message from the chat.
  //  */
  //   @SubscribeMessage('deleteMessage')
  //   async handleDeleteMessage(client: Socket, { messageId, chatId }): Promise<any> {
  //     try {
  //       const messages = await this.chatSocketService.deleteMessage(messageId, chatId);
  //       this.server.to(`chat_${chatId}`).emit('deleteMessageResponse', messages);
  //       return { status: 'success', messages };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'createMessage', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Получает все сообщения в чате.
  //    * Retrieves all messages in the chat.
  //    */
  //   @SubscribeMessage('findAllMessagesByChannel')
  //   async handleFindAllMessagesByChannel(client: Socket, chatId: number): Promise<any> {
  //     try {
  //       const messages = await this.chatSocketService.findAllMessagesByChannel(chatId);
  //       client.emit('findAllMessagesByChannelResponse', messages);
  //       return { status: 'success', messages };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'createMessage', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Получает список всех заглушенных пользователей в чате.
  //    * Retrieves a list of all muted users in the chat.
  //    */
  //   @SubscribeMessage('findAllMutedAtChat')
  //   async handleFindAllMutedAtChat(client: Socket, chatId: number): Promise<any> {
  //     try {
  //       const mutedUsers = await this.chatSocketService.findAllMutedAtChat(chatId);
  //       client.emit('findAllMutedAtChatResponse', mutedUsers);
  //       return { status: 'success', mutedUsers };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'createMessage', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Заглушает пользователя в чате.
  //    * Mutes a user in the chat.
  //    */
  //   @SubscribeMessage('muteUser')
  //   async handleMuteUser(client: Socket, dto: CreateMuteDto): Promise<any> {
  //     try {
  //       const mutedUsers = await this.chatSocketService.muteUser(dto);
  //       this.server.to(`chat_${dto.channelId}`).emit('muteUserResponse', mutedUsers);
  //       return { status: 'success', mutedUsers };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'createMessage', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Обновляет статус заглушения пользователя в чате.
  //    * Updates the mute status of a user in the chat.
  //    */
  //   @SubscribeMessage('updateMute')
  //   async handleUpdateMute(client: Socket, { dto, chatId }) : Promise<any> {
  //     try {
  //       const mutedUser = await this.chatSocketService.updateMute(dto, chatId);
  //       this.server.to(`chat_${chatId}`).emit('updateMuteResponse', mutedUser);
  //       return { status: 'success', mutedUser };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'createMessage', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //   /**
  //    * Разmмючивает пользователя в чате.
  //    * Unmutes a user in the chat.
  //    */
  //   @SubscribeMessage('unMute')
  //   async handleUnMute(client: Socket, { mutedId, chatId }): Promise<any> {
  //     try {
  //       const mutedUsers = await this.chatSocketService.unMute(mutedId, chatId);
  //       this.server.emit('unMuteResponse', mutedUsers);
  //       return { status: 'success', mutedUsers };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'createMessage', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //    /**
  //    * Присоединяет пользователя к чату.
  //    * Joins a user to the chat.
  //    */
  //   @SubscribeMessage('joinChat')
  //   // async handleJoinChat(client: Socket, { chatId, userId }): Promise<any> {
  //   //   try {
  //   //     const users = await this.chatSocketService.joinChannel(chatId, userId);
  //   //     this.server.emit('joinChatResponse', users);
  //   //     return { status: 'success', users };
  //   //   } catch (error) {
  //   //     client.emit('errorResponse', { event: 'createMessage', error: error.message });
  //   //     return { status: error.response.status, message: error.response.message };
  //   //   }
  //   // }
  //   async handleJoinChat(client: Socket, { chatId, userId }): Promise<any> {
  //     try {
  //       // Логика добавления пользователя к чату
  //       const users = await this.chatSocketService.joinChannel(chatId, userId);
  //       await this.chatSocketService.joinChannel(chatId, userId);
  //       // Присоединение пользователя к комнате
  //       client.join(`chat_${chatId}`);
  //       this.server.to(`chat_${chatId}`).emit('joinChatResponse', { chatId, users: users /* актуализированный список пользователей */ });
  //       // return { status: 'success', users };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'createMessage', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //    /**
  //     * Выходит пользователя из чата.
  //     * Quits a user from the chat.
  //     */
  //   @SubscribeMessage('quitChat')
  //   async handleQuitChat(client: Socket, { chatId, userId }): Promise<any> {
  //     try {
  //       const users = await this.chatSocketService.quitChannel(chatId, userId);
  //       this.server.to(`chat_${chatId}`).emit('quitChatResponse', users);
  //       return { status: 'success', users };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'createMessage', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  //    /**
  //     * Получает активных пользователей в чате.
  //     * Retrieves active users in the chat.
  //     */
  //   @SubscribeMessage('getActiveUsers')
  //   async handleGetActiveUsers(client: Socket, chatId: number): Promise<any> {
  //     try {
  //       const activeUsers = await this.chatSocketService.getActiveUsers(chatId);
  //       this.server.to(`chat_${chatId}`).emit('getActiveUsersResponse', activeUsers);
  //       return { status: 'success', activeUsers };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'createMessage', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //    }

  //    /**
  //     * Получает пароль чата.
  //     * Retrieves the chat's password.
  //     */
  //   @SubscribeMessage('getChatPassword')
  //   async handleGetChatPassword(client: Socket, chatId: number): Promise<any> {
  //     try {
  //       const password = await this.chatSocketService.getPassword(chatId);
  //       client.emit('getChatPasswordResponse', password);
  //       return { status: 'success', password };
  //     } catch (error) {
  //       client.emit('errorResponse', { event: 'createMessage', error: error.message });
  //       return { status: error.response.status, message: error.response.message };
  //     }
  //   }

  sendEvents(event: any): Promise<any> {
    this.server.emit('event', event);
    return event;
  }

  emit(event: string, message: string) {
    this.server.emit(event, message);
  }
}
