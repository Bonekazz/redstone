import { Chat, UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport, generateId } from "ai";
import { create } from "zustand";

function createChatInstance(branchId: string): Chat<UIMessage> {
  return new Chat<UIMessage>({
    id: branchId,
    transport: new DefaultChatTransport({
      api: '/api/chat',
    })
  });
}

export interface MessageNode {
  id: string,
  role: "user" | "assistant",
  content: string;
}

export interface ChatBranch {
  id: string, 
  name?: string,
  from?: {                  // initial branch if not provided
    branchId: string,
    message: MessageNode,
  }
  messages: MessageNode[] | [],
  chatInstance: Chat<UIMessage>,
}

export interface ChatStore {
  branches: Record<string, ChatBranch>,
  activeBranchId: string | null,

  // Actions
  createBranch: (fromBranchId?: string, fromMessage?: MessageNode) => ChatBranch,
  syncMessagesFromChat: (branchId: string, chatMessages: any[]) => ChatBranch | undefined,
  getBranchMessage: (branchId: string, messageId: string) => void,
  switchBranch: (branchId: string) => void,

  getActiveBranch: () => ChatBranch,

  getFromMessage: (branchId: string) => MessageNode | undefined;

  getBranchesList: () => ChatBranch[];
}

export const useChatStore = create<ChatStore>((set, get) => ({
  branches: {},
  activeBranchId: null,

  createBranch: (fromBranchId?: string, fromMessage?: MessageNode): ChatBranch => { 
    const newId = generateId();

    set({
      branches: {
        ...get().branches,
        [newId]: {
          id: newId,
          chatInstance: createChatInstance(newId),
          messages: [],
          ...(fromBranchId && fromMessage && { from: {
            branchId: fromBranchId,
            message: fromMessage 
          }})
        }
      },
    });

    return get().branches[newId];
  },

  syncMessagesFromChat: (branchId: string, chatMessages: any[]): ChatBranch | undefined => {
    const branches = get().branches;
    const currentBranch = branches[branchId];
    if (!currentBranch) { console.error("[!] Branch id not found: ", branchId); return currentBranch;}

    const messages = chatMessages.map((m: any) => ({
      id: m.id,
      role: m.role,
      content: m.content || m.parts?.find((p: any) => p.type === "text")?.text || ""
    }));

    set({
      branches: {
        ...branches,
        [branchId]: {
          ...currentBranch,
          messages
        }
      }
    })

    return get().branches[currentBranch.id];

  },

  getBranchMessage: (branchId: string, messageId: string) => {
    const branch = get().branches[branchId];
    const message = branch?.messages?.find(x => x.id === messageId);
    return message;
  },

  switchBranch: (branchId: string) => {
    set({ activeBranchId: branchId });
  },

  getActiveBranch: () => {
    const activeBranchId = get().activeBranchId;
    if (!activeBranchId) {
      const newB = get().createBranch();
      console.log("(chat store) No active branch detected. Creating and setting new active branch: ", newB);
      set({ activeBranchId: newB.id });
      return newB;
    };
    return get().branches[activeBranchId];
  },

  getFromMessage: (branchId: string): MessageNode | undefined => {
    const branch = get().branches[branchId];
    console.log("> (chat store) BRANCHES: ", get().branches);
    if (!branch) { console.log("[!] Branch id not found: ", branchId); return;} 
    if (!branch.from) return;

    return branch.from.message;
  },

  getBranchesList: () => {
    return Object.values(get().branches);
  }
}))