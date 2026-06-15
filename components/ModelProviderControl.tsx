"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings } from "lucide-react"

const STORAGE_MODEL_KEY = "modelProviderModel"
const STORAGE_API_KEY = "modelProviderApiKey"

const MODEL_OPTIONS = [
  { value: "llama-3.3-70b-versatile", label: "llama-3.3-70b-versatile" },
]

function getDefaultModel() {
  return MODEL_OPTIONS[0]?.value ?? ""
}

interface Props {
  triggerComponent?: React.ReactElement
}
export function ModelProviderControl({ triggerComponent: TriggerComponent }: Props) {
  const [model, setModel] = useState<string>(getDefaultModel())
  const [apiKey, setApiKey] = useState<string>("")
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const savedModel = localStorage.getItem(STORAGE_MODEL_KEY)
    const savedKey = localStorage.getItem(STORAGE_API_KEY)

    setModel(savedModel ?? getDefaultModel())

    if (savedKey) {
      setApiKey(savedKey)
    }

    setLoaded(true)
  }, [])

  function handleSave() {
    localStorage.setItem(STORAGE_MODEL_KEY, model)
    localStorage.setItem(STORAGE_API_KEY, apiKey)
  }

  return (
    <Dialog>
      { !TriggerComponent ? (
        <DialogTrigger
          render={
            <Button variant="outline" className="w-full justify-between" aria-label="Configurar provedor de IA">
              <span>IA Provider</span>
              <Settings className="size-4" />
            </Button>
          }
        />
      ) : React.cloneElement(TriggerComponent)
      }
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Configurar Groq</DialogTitle>
          <DialogDescription>
            Escolha o modelo Groq e insira sua chave de API.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field>
            <FieldLabel>Modelo</FieldLabel>
            <Select value={model} onValueChange={(value) => setModel(value ?? getDefaultModel())}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um modelo" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {MODEL_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              Escolha o modelo Groq que será usado.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Chave de API</FieldLabel>
            <Input
              type="text"
              placeholder="Digite sua chave de API"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
            <FieldDescription>
              A chave será armazenada apenas no seu navegador.
            </FieldDescription>
          </Field>
        </FieldGroup>

        {loaded && (
          <div className="mt-4 rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground">
            Provedor atual: <span className="font-semibold text-foreground">Groq</span>
            <br />
            Modelo atual: <span className="font-semibold text-foreground">{model}</span>
          </div>
        )}

        <DialogFooter className="border-none">
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <DialogClose
            render={
              <Button onClick={handleSave}>
                Salvar
              </Button>
            }
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
