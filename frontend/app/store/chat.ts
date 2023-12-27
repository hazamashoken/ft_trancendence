import { create } from "zustand";

export interface IChatStore {
  chatId: string;
  chatList: any[];
  chatUserList: any[];
  chatMeta: any;
  setChatId: (chatId: string) => void;
  setChatList: (chatList: any[]) => void;
  setChatUserList: (chatUserList: any[]) => void;
  setChatMeta: (chatMeta: any) => void;
}

export const useChatStore = create<IChatStore>((set) => ({
  chatId: "",
  chatList: [],
  chatUserList: [],
  chatMeta: {
    id: "",
    name: "",
    type: "text",
  },
  setChatId: (chatId: string) => set({ chatId }),
  setChatList: (chatList: any[]) => set({ chatList }),
  setChatUserList: (chatUserList: any[]) => set({ chatUserList }),
  setChatMeta: (chatMeta: any) => set({ chatMeta }),
}));