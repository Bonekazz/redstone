"use client";

import AIChat from "@/components/chat/AIChat";
import { 
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { ChatBranch, useChatStore } from "@/stores/useChatStore";
import { cn } from "@/lib/utils";
import { CornerDownRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { getBranchesList, switchBranch, activeBranchId, createBranch } = useChatStore();
  const branches = getBranchesList() || [];

  const rootBranches = branches.filter((b: ChatBranch) => b.from === undefined);

  function handleCreateBranch() {
    const newB = createBranch();
    switchBranch(newB.id);
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <Sidebar className="border-none bg-sidebar">
        <SidebarHeader>
          <Button className="bg-muted text-card-foreground cursor-pointer" onClick={handleCreateBranch}>new chat</Button>
        </SidebarHeader>
        <SidebarContent>
          { rootBranches.length > 0 && activeBranchId && rootBranches.map((rootBranch: ChatBranch, i: number) => (
            <RecursiveSubBranchItem key={i} {...{
              branch: rootBranch,
              branches, branchFunctions: { switchBranch },
              activeBranchId,
              isRoot: true
            }}/>
          ))}
        </SidebarContent>
      </Sidebar>
      <AIChat/>
    </div>
   )
}

interface RecursiveSubBranchItemProps {
  branch: ChatBranch
  branches: ChatBranch[]
  branchFunctions: any;
  activeBranchId: string,
  isRoot: boolean,
}
function RecursiveSubBranchItem({ branch: b, branches, branchFunctions, activeBranchId, isRoot: root }: RecursiveSubBranchItemProps) {
  const { switchBranch } = branchFunctions;

  const branchSubs = branches.filter((x: ChatBranch) => x.from?.branchId === b.id);

  const [isRoot] = useState(root);

  return (
    <SidebarMenu>
      <SidebarMenuButton
        onClick={() => switchBranch(b.id)}
      >
        <span
          className={cn(
            "border",
            !isRoot && "flex gap-2",
            b.id === activeBranchId ? "border-amber-300" : "border-transparent"
          )}
        >
          { !isRoot && (<CornerDownRight />)}
          {b.id}
        </span>
      </SidebarMenuButton>

      {/** SUB ITEMS */}
      { branchSubs.length > 0 && (
        <SidebarMenuSub>
          {branchSubs.map((x: ChatBranch, i: number) => (
            <RecursiveSubBranchItem key={i} {...{ branch: x, branches, branchFunctions, activeBranchId, isRoot: false }}/>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenu>
  )
}