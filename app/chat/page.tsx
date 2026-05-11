"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GitBranchPlus, Send } from "lucide-react";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { UserMessage } from "@/components/chat/UserMessage";
import { useChatStore } from "@/stores/useChatStore";


export default function Page() {
  const [prompt, setPrompt] = useState("");

  const [fromMessage, setFromMessage] = useState<any>(null);

  const { 
    branches, createBranch, activeBranchId,
    syncMessagesFromChat, getBranchMessage
  } = useChatStore();

  const { messages, sendMessage, status, error } = useChat({
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
    console.log("> BRANCHES: ", branches);
    console.log("> ACTIVE BRANCH ID: ", activeBranchId);

    if (!activeBranchId) return;
    const currentBranch = branches[activeBranchId];
    const fromBranchId = currentBranch.fromBranchId;
    const fromMessageId = currentBranch.fromMessageId;
    console.log("> FROM BRANCH ID: ", fromBranchId);
    console.log("> FROM MESSAGE ID: ", fromMessageId);

    if (!fromMessageId && !fromBranchId) return;

    const fM = getBranchMessage(fromBranchId as string, fromMessageId as string);
    setFromMessage(fM);
    console.log("> FROM MESSAGE: ", fM);

  }, [branches, activeBranchId, getBranchMessage]);

  useEffect(() => {
    console.log("> BRANCHES: ", branches);
    console.log("> ACTIVE BRANCH ID: ", activeBranchId);
    console.log("> MESAGES: ", messages);

    if (activeBranchId && messages.length > 0) {
      syncMessagesFromChat((activeBranchId as string), messages);
    }

  }, [messages, activeBranchId, syncMessagesFromChat]);

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


  return (
    <div className="w-screen h-screen flex flex-col items-center">
      <div className="w-3xl h-full flex flex-col items-center px-8 py-4">

        {/** CHAT CONTAINER */}
        <div 
          ref={chatContainerRef}
          className="w-full h-full overflow-y-scroll no-scrollbar pb-4 flex flex-col gap-4"
        >
          {fromMessage && (
            <div 
              className="flex flex-col opacity-50"
            >
              <p className="bg-muted text-card-foreground px-4 py-3 rounded-lg">{fromMessage.content}</p>
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
                      onClick={() => handleCreateBranch(activeBranchId as string, message.id)}
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
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              value={prompt}
              onInput={(e) => {
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
    </div>
   )
}