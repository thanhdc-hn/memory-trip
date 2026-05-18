import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Modal } from "@/components/ui/modal"

export function CreateTeamSheet({
                                  open,
                                  onOpenChange,
                                  onCreate
                                }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  onCreate: (data: { name: string, password?: string, welcomeText?: string }) => void
}) {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [welcomeText, setWelcomeText] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name) return
    onCreate({ name, password, welcomeText })
    setName("")
    setPassword("")
    setWelcomeText("")
    onOpenChange(false)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Team"
      description="Set up a new space for memories."
      contentClassName="sm:max-w-[425px] rounded-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Team Name</label>
            <Input
              placeholder="e.g. Summer Trip 2024"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Invite Password (optional)</label>
            <Input
              type="password"
              placeholder="Keep it secret"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Welcome Text (optional)</label>
            <Textarea
              placeholder="Welcome to our trip memories!"
              value={welcomeText}
              onChange={(e) => setWelcomeText(e.target.value)}
              className="rounded-xl min-h-[80px]"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 rounded-xl"
            disabled={!name}
          >
            Create Team
          </Button>
        </div>
      </form>
    </Modal>
  )
}
