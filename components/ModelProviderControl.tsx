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

const STORAGE_MODEL_KEY = "modelProviderModel"
const STORAGE_API_KEY = "modelProviderApiKey"

interface Props {
  triggerComponent?: React.ReactElement
}
export function ModelProviderControl({ triggerComponent: TriggerComponent }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false);
  const [providers, setProviders] = useState(AI_PROVIDERS);

  const { register, control, handleSubmit, reset, watch, formState } = useForm<AIFormValues>({
    resolver: zodResolver(aiFormSchema),
    defaultValues: {
      provider: 'groq',
      model: "llama-3.3-70b-versatile",
      apiKey: '',
      baseUrl: undefined,
    } 
  })

  const selectedModel = watch("model");
  const selectedProvider = watch("provider");
  const selectedBaseUrl = watch("baseUrl");

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
      ) : React.cloneElement(TriggerComponent)}
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
                        {Object.entries(providers).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {key}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>

            {selectedProvider === "custom" && (
              <Field>
                <FieldLabel>Base Url</FieldLabel>
                <Input
                  type="text"
                  placeholder={providers["custom"].placeholderUrl}
                  {...register("baseUrl")}
                />
              </Field>
            )}

            {
              (selectedModel || (selectedModel && (selectedProvider === "custom" && selectedBaseUrl)) && (
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
              ))
            }
          </FieldGroup>

          <DialogFooter className="border-none mt-5">
            <DialogClose render={<Button variant="outline">Cancelar</Button>} />
            <DialogClose render={<Button type="submit">Salvar</Button>} />
            
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
