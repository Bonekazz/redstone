"use client";

import AIChat from "@/components/chat/AIChat";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect, useState } from "react";

export default function Page() {
  const { activeBranchId } = useChatStore();

  const [componentKey, setComponentKey] = useState(activeBranchId);
  
  useEffect(() => {
    setComponentKey(activeBranchId);
  }, [activeBranchId]);

  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <AIChat key={componentKey}/>
    </div>
   )
}