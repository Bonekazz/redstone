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
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChatBranch, useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import { CornerDownRight } from "lucide-react";

export default function Page() {
  const { getBranchesList, switchBranch, activeBranchId } = useChatStore();
  const branches = getBranchesList() || [];

  const rootBranches = branches.filter((b: ChatBranch) => b.from === undefined);
  const subBranches = branches.filter((b: ChatBranch) => b.from !== undefined);

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <Sidebar className="border-none">
        <SidebarContent className="bg-card">
          <SidebarMenu>
            {rootBranches.length > 0 && rootBranches.map((branch: ChatBranch, i: number) => (
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

                {/** SIDER BAR MENU SUB HERE */}
                { subBranches.length && (
                  <SidebarMenuSub className="border-l-0">
                  { subBranches.map((b: ChatBranch, i: number) => (
                    <SidebarMenuSubItem key={i}>
                      <SidebarMenuButton
                        onClick={() => switchBranch(b.id)}
                      >
                        <span
                          className={cn(
                            "border flex gap-2",
                            b.id === activeBranchId ? "border-amber-300" : "border-transparent"
                          )}
                        >
                          <CornerDownRight />
                          {b.id}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuSubItem>
                  ))}
                  </SidebarMenuSub>
                )}

              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <AIChat/>
    </div>
   )
}