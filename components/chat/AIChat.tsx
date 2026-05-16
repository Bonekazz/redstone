"use client"

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GitBranch, GitBranchPlus, Send } from "lucide-react";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { UserMessage } from "@/components/chat/UserMessage";
import { MessageNode, useChatStore } from "@/stores/useChatStore";
import { AnimatePresence, motion } from "framer-motion";

export default function AIChat() {

  const [prompt, setPrompt] = useState("");

  const { 
    createBranch,
    syncMessagesFromChat, switchBranch,
    getActiveBranch, getChatHistoryFromMessage
  } = useChatStore();

  const currentBranch = getActiveBranch();
  const[fromMessage, setFromMessage] = useState<MessageNode|undefined>();

  const { messages, sendMessage, status } = useChat({
    chat: currentBranch.chatInstance, 
    experimental_throttle: 50
  });

  const chatHistoryRef = useRef<any>(null);

  useEffect(() => {
    scrollToBottom();
  }, [currentBranch]);

  useEffect(() => {
    chatHistoryRef.current = null;
  }, [currentBranch.id]);

  useEffect(() => {
    console.log("> (useEffect for fromMessage) FROM MESSAGE: ", fromMessage);
    if (!currentBranch.from) { 
      setFromMessage(undefined); return;
    }
    setFromMessage(currentBranch.from.message);
    if (chatHistoryRef.current) return;

    chatHistoryRef.current = getChatHistoryFromMessage(currentBranch.from.branchId, currentBranch.from.message.id);
  }, [ currentBranch, fromMessage,]);

  useEffect(() => {
    console.log("> MESSAGES: ", messages);
    if (status !== "ready") return;
    const newVBranch = syncMessagesFromChat(currentBranch.id, [...messages]);
    console.log("> (chat ready) CURRENT BRANCH: ", newVBranch);

  }, [messages, status]);

  function handleSubmit() {
    if (prompt.trim()) {
      console.log("> HISTORY: ", chatHistoryRef.current);
      sendMessage(
        { text: prompt },
        { 
          body: {
            context: chatHistoryRef.current || []
          }
        }
      );
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
    scrollToBottom()
  }, [messages])

  function handleCreateBranch(fromBranchId: string, fromMessage: MessageNode) {
    const newB = createBranch(fromBranchId, fromMessage);
    switchBranch(newB.id);
  }

  const handleSwitchToOriginalBranch = () => {
    if (currentBranch.from) {
      console.log("Switching to original branch:", currentBranch.from.branchId);
      switchBranch(currentBranch.from.branchId);
      setFromMessage(undefined);
    }
  };

  return (
    <AnimatePresence mode="popLayout">
      <motion.div key={currentBranch.id}
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        className="w-3xl h-full flex flex-col items-center px-8 py-4"
      >
        {/** CHAT CONTAINER */}
        <div 
          ref={chatContainerRef}
          className="w-full h-full overflow-y-scroll no-scrollbar pb-4 flex flex-col gap-4"
        >
          {fromMessage && (
            <div className="flex flex-col gap-2 mb-4 sticky top-0 bg-background pb-5">
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
                        handleCreateBranch(currentBranch.id, { 
                          id: message.id, role: message.role, content: text
                        });
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
      </motion.div>
    </AnimatePresence>
  )
}