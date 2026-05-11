"use client";

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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyRound } from "lucide-react";
import { useEffect, useState } from "react";

export function APIKeyControl() {
  const [key, setKey] = useState<string>("");

  useEffect(() => {
    const localKey = sessionStorage.getItem("userApiKey");
    setKey(localKey || "");
  }, [])

  function handleSubmit() {
    sessionStorage.setItem("userApiKey", key);
    console.log("userApiKey: ", key);
  }

  return (
    <Dialog>
      <form>
        <DialogTrigger render={
          <Button variant="outline">
            <KeyRound />
          </Button>
        } />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>API Key</DialogTitle>
            <DialogDescription>
              Set your Gemini api key.
            </DialogDescription>
          </DialogHeader>
          <Field>
            <Input 
              type="text"
              placeholder="AIzaSyD..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </Field>
          <DialogFooter className="border-none">
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" onClick={handleSubmit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}