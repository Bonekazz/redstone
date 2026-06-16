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
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { aiFormSchema, AIFormValues } from "@/lib/providers/schema"
import { AI_PROVIDERS } from "@/lib/providers/providers"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const STORAGE_MODEL_KEY = "modelProviderModel"
const STORAGE_API_KEY = "modelProviderApiKey"

interface Props {
  triggerComponent?: React.ReactElement
}
export function ModelProviderControl({ triggerComponent: TriggerComponent }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false);

  const { register, control, handleSubmit, reset, watch } = useForm<AIFormValues>({
    resolver: zodResolver(aiFormSchema),
    defaultValues: {
      provider: 'groq',
      model: "llama-3.3-70b-versatile",
      apiKey: '',
      baseUrl: undefined,
    },
  })

  const selectedModel = watch("model");
  const selectedProvider = watch("provider");

  useEffect(() => {
    const savedModel = localStorage.getItem(STORAGE_MODEL_KEY)
    const savedKey = localStorage.getItem(STORAGE_API_KEY)

    reset({
      provider: 'groq',
      model: savedModel ?? "",
      apiKey: savedKey ?? '',
      baseUrl: undefined,
    })

    setLoaded(true)
  }, [])

  function handleSave(values: AIFormValues) {
    localStorage.setItem(STORAGE_MODEL_KEY, values.model)
    localStorage.setItem(STORAGE_API_KEY, values.apiKey)

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <DialogTitle>Configure Your AI</DialogTitle>
          <DialogDescription>
            Choose your provider, model and set your api key.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSave)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Provider</FieldLabel>
              <Controller
                control={control}
                name="provider"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => field.onChange(v ?? "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(AI_PROVIDERS).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldDescription>
                Escolha o modelo Groq que será usado.
              </FieldDescription>
            </Field>

            { selectedProvider && (
              <Field>
                <FieldLabel>Model</FieldLabel>
                <Controller 
                  {...{control, name: "model" }}
                  render={({ field }) => (
                    <Combobox 
                      items={AI_PROVIDERS[selectedProvider].models}
                      value={field.value || selectedModel}
                      onValueChange={(val) => field.onChange(val)}
                    >
                      <ComboboxInput placeholder="Select your model"/>
                      <ComboboxContent>
                        <ComboboxList>
                          {(item) => (
                            <ComboboxItem key={item} value={item}>{item}</ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  )}
                />
              </Field>
            )}

            { (selectedProvider && selectedModel) && (
              <Field>
                <FieldLabel>Chave de API</FieldLabel>
                <Input
                  type="text"
                  placeholder="Digite sua chave de API"
                  {...register('apiKey')}
                />
                <FieldDescription>
                  A chave será armazenada apenas no seu navegador.
                </FieldDescription>
              </Field>
            )}
          </FieldGroup>

          {loaded && (
            <div className="mt-4 rounded-md border border-border bg-muted p-3 text-sm text-muted-foreground">
              Provedor atual: <span className="font-semibold text-foreground">{selectedProvider}</span>
              <br />
              Modelo atual: <span className="font-semibold text-foreground">{selectedModel}</span>
            </div>
          )}

          <DialogFooter className="border-none">
            <DialogClose render={<Button variant="outline">Cancelar</Button>} />
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
