import { create } from "zustand";

export interface IChatStore {
  chatId: string;
  chatList: any[];
  chatUserList: any[];
  setChatId: (chatId: string) => void;
  setChatList: (chatList: any[]) => void;
  setChatUserList: (chatUserList: any[]) => void;
}

export const useChatStore = create<IChatStore>((set) => ({
  chatId: "1",
  chatList: [],
  chatUserList: [],
  setChatId: (chatId: string) => set({ chatId }),
  setChatList: (chatList: any[]) => set({ chatList }),
  setChatUserList: (chatUserList: any[]) => set({ chatUserList }),
}));