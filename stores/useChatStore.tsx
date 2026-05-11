import { generateId } from "ai";
import { create } from "zustand";

export interface MessageNode {
  id: string,
  role: "user" | "assistant",
  content: string;
}

export interface ChatBranch {
  id: string, 
  name: string | null,
  fromBranchId?: string,  // null (if its the root branch)
  fromMessageId?: string, // null (if its the root branch)
  messages?: MessageNode[],
}

export interface ChatStore {
  branches: Record<string, ChatBranch>,
  activeBranchId: string | null,

  // Actions
  createBranch: (fromBranchId?: string, fromMessageId?: string) => void,
  syncMessagesFromChat: (branchId: string, chatMessages: any[]) => void;
  getBranchMessage: (branchId: string, messageId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  branches: {},
  activeBranchId: null,

  createBranch: (fromBranchId?: string, fromMessageId?: string) => { 
    const bId = generateId();
    const newId = "popa" + bId;
    set({
      branches: {
        ...get().branches,
        [newId]: {
          id: newId,
          name: "fodasi",
          fromBranchId,
          fromMessageId,
        }
      },
      activeBranchId: newId
    })
  },

  syncMessagesFromChat: (branchId: string, chatMessages: any[]) => {
    const branches = get().branches;
    const currentBranch = branches[branchId];
    if (!currentBranch) { console.error("[!] Branch id not found: ", branchId); return;}

    if (!currentBranch.messages) currentBranch.messages = [];
    
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

  },

  getBranchMessage: (branchId: string, messageId: string) => {
    const branches = get().branches;
    const currentBranch = branches[branchId];
    if (!currentBranch) { console.error("[!] Branch id not found: ", branchId); return;}
    if (!currentBranch.messages) return;

    return currentBranch.messages.find(x => x.id === messageId);
  }
}))