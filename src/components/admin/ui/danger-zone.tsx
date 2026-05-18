import { useState } from "react"
import { AlertTriangle, Trash2, Eraser } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"

export function ConfirmDialog({
                                open,
                                onOpenChange,
                                title,
                                description,
                                confirmText,
                                confirmVariant = "destructive",
                                onConfirm,
                                requireMatch,
                                matchValue,
                              }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  confirmText: string
  confirmVariant?: "default" | "destructive" | "outline" | "secondary"
  onConfirm: () => void
  requireMatch?: boolean
  matchValue?: string
}) {
  const [inputValue, setInputValue] = useState("")

  const canConfirm = !requireMatch || (inputValue === matchValue)

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      contentClassName="sm:max-w-[400px] rounded-3xl"
    >
      <div className="space-y-6 py-4">
        {requireMatch && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">
              Type <span className="font-bold text-gray-900">"{matchValue}"</span> to confirm:
            </p>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type here..."
              className="rounded-xl border-red-100 focus:ring-red-500"
            />
          </div>
        )}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant={confirmVariant}
            className="flex-1 rounded-xl"
            disabled={!canConfirm}
            onClick={() => {
              onConfirm()
              onOpenChange(false)
              setInputValue("")
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export function DangerZone({
                             teamName,
                             onDeleteTeam,
                             onClearData
                           }: {
  teamName: string,
  onDeleteTeam: () => void,
  onClearData: () => void
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  return (
    <Card className="border-red-100 bg-red-50/30 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-5 h-5"/>
          <CardTitle className="text-lg">Danger Zone</CardTitle>
        </div>
        <CardDescription className="text-red-600/70 font-sans text-xs">
          Irreversible actions for this team. Please be careful.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-14 rounded-2xl border-red-100 hover:bg-red-50 hover:text-red-600 hover:border-red-200 group transition-all"
          onClick={() => setShowClearConfirm(true)}
        >
          <div
            className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-200 transition-colors">
            <Eraser className="w-4 h-4"/>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-sm">Clear team data</span>
            <span className="text-[10px] opacity-60">Delete all posts and images</span>
          </div>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-14 rounded-2xl border-red-100 hover:bg-red-600 hover:text-white hover:border-red-600 group transition-all"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <div
            className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 group-hover:bg-white/20 group-hover:text-white transition-colors">
            <Trash2 className="w-4 h-4"/>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-bold text-sm">Delete team permanently</span>
            <span className="text-[10px] opacity-60">This cannot be undone</span>
          </div>
        </Button>
      </CardContent>

      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Clear Team Data?"
        description={`This will delete all posts and images associated with ${teamName}. You cannot undo this action.`}
        confirmText="Clear All Data"
        onConfirm={onClearData}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Team Permanently?"
        description={`Are you sure you want to delete ${teamName}? All data will be lost forever.`}
        confirmText="Delete Permanently"
        requireMatch
        matchValue={teamName}
        onConfirm={onDeleteTeam}
      />
    </Card>
  )
}
