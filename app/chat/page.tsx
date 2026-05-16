"use client";

import AIChat from "@/components/chat/AIChat";
import { AnimatePresence, motion } from "motion/react"
import { 
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ChatBranch, useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";

export default function Page() {
  const { getBranchesList, switchBranch, activeBranchId } = useChatStore();
  const branches = getBranchesList() || [];

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <Sidebar>
        <SidebarContent>
          <SidebarMenu>
            {branches.length > 0 && branches.map((branch: ChatBranch, i: number) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton
                  onClick={() => switchBranch(branch.id)}
                >
                  <span
                    className={cn(
                      "border",
                      branch.id === activeBranchId ? "border-amber-300" : "border-transparent"
                    )}
                  >
                    {branch.id}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <AIChat/>
    </div>
   )
}