"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GitBranch, GitBranchPlus, Send } from "lucide-react";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { UserMessage } from "@/components/chat/UserMessage";
import { useChatStore } from "@/stores/useChatStore";

export default function AIChat() {

  const [prompt, setPrompt] = useState("");

  const { 
    branches, createBranch, activeBranchId,
    syncMessagesFromChat, getBranchMessage, switchBranch
  } = useChatStore();

  const currentBranch = activeBranchId ? branches[activeBranchId] : null;
  const fromMessage = currentBranch && currentBranch.fromBranchId && currentBranch.fromMessageId ? 
    branches[currentBranch.fromBranchId].messages?.find(x => x.id === currentBranch.fromMessageId) : null

  const { messages, sendMessage, status, setMessages } = useChat({
    id: activeBranchId || undefined,
    transport: new DefaultChatTransport({
      api: '/api/chat'
    }),
    experimental_throttle: 50,
    onFinish: () => {}
  });

  useEffect(() => {
    if (Object.keys(branches).length === 0) {
      createBranch();
    }
  }, [branches, activeBranchId, getBranchMessage]);

  useEffect(() => {
    if (activeBranchId && messages.length > 0 && status === "ready") {
      syncMessagesFromChat((activeBranchId as string), messages);
    }
  }, [status, messages, activeBranchId, syncMessagesFromChat]);

  useEffect(() => {
    console.log("> MESSAGES: ", messages);
    console.log(`> BRANCH (${currentBranch?.id}) MESSAGES: `, currentBranch?.messages);
  }, [ currentBranch, status, messages]);

  function handleSubmit() {
    if (prompt.trim()) {
      sendMessage({ text: prompt });
      scrollToBottom()
      setPrompt("");
    }
  }

  const handleKeyDown = (e: any) => {
    // Se pressionou Enter (sem Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Impede a quebra de linha
      handleSubmit()
    }
  }

  const chatContainerRef = useRef<any>(null)
  const [shouldAutoScroll] = useState(true)

  // Função para rolar suavemente
  function scrollToBottom() {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  // Rola condicionalmente quando novas mensagens chegam
  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom()
    }
  }, [messages, shouldAutoScroll])

  function handleCreateBranch(fromBranchId: string, fromMessageId: string) {
    createBranch(fromBranchId, fromMessageId);
  }

  const handleSwitchToOriginalBranch = () => {
    if (!activeBranchId) return;
    const currentBranch = branches[activeBranchId];
    if (currentBranch?.fromBranchId) {
      console.log("Switching to original branch:", currentBranch.fromBranchId);
      switchBranch(currentBranch.fromBranchId);
    }
  };

  return (
    <div className="w-3xl h-full flex flex-col items-center px-8 py-4">
      {/** CHAT CONTAINER */}
      <div 
        ref={chatContainerRef}
        className="w-full h-full overflow-y-scroll no-scrollbar pb-4 flex flex-col gap-4"
      >
        {fromMessage && (
          <div className="flex flex-col gap-2 mb-4">
            {/* Label indicativo */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <GitBranch className="w-3 h-3" />
              <span>Você está em um branch desta conversa:</span>
            </div>
            
            {/* Card clicável */}
            <div 
              onClick={handleSwitchToOriginalBranch}
              className="relative group cursor-pointer transition-all hover:opacity-80"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative bg-muted/50 rounded-lg p-3 border border-border">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {fromMessage.content}
                </p>
                <p className="text-xs text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Clique para voltar à conversa original →
                </p>
              </div>
            </div>
          </div>
        )}
        {messages.map((message: any, i: number) => {
          const text = message.parts?.find((x: any) => x.type === "text")?.text;
          return (
            <div key={i} className={cn(
              "w-full flex",
              message.role === "user" && "justify-end"
            )}>
              {message.role === "user" && (<UserMessage message={text}/>)}
              {message.role === "assistant" && (
                <div className="flex flex-col">
                  <p className="bg-muted text-card-foreground px-4 py-3 rounded-lg">{text}</p>
                  <Button 
                    variant={"ghost"}
                    size="sm"
                    className={cn(
                      "w-fit text-input hover:text-muted-foreground hover:cursor-pointer",
                      status !== "ready" && "invisible"
                    )}
                    onClick={() => {
                      console.log("> switching to new branch...")
                      handleCreateBranch(activeBranchId as string, message.id)
                    }}
                  >
                    <GitBranchPlus size={15}/>
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/** INPUT CONTAINER */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden w-full">
        <div className="px-3 pt-3 pb-2 grow">
          <Textarea
            placeholder="Ask anything"
            className="w-full bg-transparent! p-0 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder-muted-foreground resize-none border-none outline-none text-sm min-h-10 max-h-[25vh]"
            rows={1}
            onChange={(e: any) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            value={prompt}
            onInput={(e: any) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />
        </div>

        <div className="mb-2 px-2 flex items-center justify-end">
          <div>
            <Button
              type="submit"
              className="size-7 p-0 rounded-full bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
            >
              <Send className="size-3 fill-primary" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}