"use client";

import AIChat from "@/components/chat/AIChat";
import { 
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ChatBranch, useChatStore } from "@/stores/useChatStore";

export default function Page() {
  const { getBranchesList, switchBranch } = useChatStore();
  const branches = getBranchesList() || [];

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              {branches.map((branch: ChatBranch, i: number) => (
                <SidebarMenuItem key={i}>
                  <SidebarMenuButton
                    onClick={() => switchBranch(branch.id)}
                  >
                    <span>{branch.id}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <AIChat/>
      </SidebarProvider>
    </div>
   )
}