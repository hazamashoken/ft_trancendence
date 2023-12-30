import { create } from "zustand";

export interface IChatStore {
  chatId: any;
  chatList: any[];
  chatUserList: any[];
  chatMeta: any;
  chatIsLoading: boolean;
  setChatId: (chatId: string) => void;
  setChatList: (chatList: any[]) => void;
  setChatUserList: (chatUserList: any[]) => void;
  setChatMeta: (chatMeta: any) => void;
  setChatIsLoading: (chatIsLoading: boolean) => void;
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
  chatIsLoading: false,
  setChatId: (chatId: string) => set({ chatId }),
  setChatList: (chatList: any[]) => set({ chatList }),
  setChatUserList: (chatUserList: any[]) => set({ chatUserList }),
  setChatMeta: (chatMeta: any) => set({ chatMeta }),
  setChatIsLoading: (chatIsLoading: boolean) => set({ chatIsLoading }),
}));
