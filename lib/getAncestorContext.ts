// lib/getAncestorContext.ts
import { Node, Edge } from '@xyflow/react';
import { UIMessage } from 'ai';
import { ChatInstance } from '@/stores/useChatStore';

/**
 * Coleta todas as mensagens de todos os nós prompt ancestrais (incluindo o nó atual)
 * ordenadas da raiz para o nó atual.
 */
export function getAncestorContext(
  startPromptId: string,           // ID do nó prompt a partir do qual coletar
  getNodes: () => Node[],          // função do React Flow
  getEdges: () => Edge[],
  getChat: (nodeId: string) => ChatInstance | undefined
): UIMessage[] {
  const nodes = getNodes();
  const edges = getEdges();

  // Mapeamento de nó -> seus antecessores (nós que têm aresta saindo para ele)
  const incomingEdgesMap = new Map<string, Edge[]>();
  edges.forEach(edge => {
    if (!incomingEdgesMap.has(edge.target)) incomingEdgesMap.set(edge.target, []);
    incomingEdgesMap.get(edge.target)!.push(edge);
  });

  // Função para percorrer a árvore "para trás" e coletar IDs dos nós prompt
  const collectAncestorPromptIds = (nodeId: string): string[] => {
    const ancestors: string[] = [];
    let currentId: string | undefined = nodeId;

    while (currentId) {
      const node = nodes.find(n => n.id === currentId);
      if (node?.type === 'prompt') {
        ancestors.unshift(currentId); // insere no início para manter ordem da raiz
      }
      // Encontra o nó que tem aresta saindo para currentId (o pai)
      const incomingEdges = (incomingEdgesMap.get(currentId) || []) as any;
      // Assumindo que um nó prompt só tem uma aresta de entrada (vindo de um AnswerNode ou direto)
      const parentEdge = incomingEdges.find((edge: any) => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        return sourceNode?.type === 'answer' || sourceNode?.type === 'prompt';
      });
      if (parentEdge) {
        // O pai de um prompt é um answer; o pai de um answer é um prompt
        const sourceNode = nodes.find(n => n.id === parentEdge.source);
        if (sourceNode?.type === 'answer') {
          // Procurar o prompt que gerou esse answer (aresta que chega no answer)
          const answerParentEdges = incomingEdgesMap.get(parentEdge.source) || [];
          const promptEdge = answerParentEdges.find(e => {
            const src = nodes.find(n => n.id === e.source);
            return src?.type === 'prompt';
          });
          if (promptEdge) currentId = promptEdge.source;
          else currentId = undefined;
        } else if (sourceNode?.type === 'prompt') {
          currentId = sourceNode.id;
        } else {
          currentId = undefined;
        }
      } else {
        currentId = undefined;
      }
    }
    return ancestors;
  };

  const ancestorPromptIds = collectAncestorPromptIds(startPromptId);
  // Coleta todas as mensagens de todos os chats ancestrais, na ordem correta
  const allMessages: UIMessage[] = [];
  for (const promptId of ancestorPromptIds) {
    const chat = getChat(promptId);
    if (chat && chat.messages.length) {
      allMessages.push(...chat.messages);
    }
  }
  return allMessages;
}