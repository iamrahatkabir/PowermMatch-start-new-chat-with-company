// Chat / Email / SMS composer while the conversation isn't assigned to you:
// disabled box "Assign to yourself to join this conversation" + Assign to me. Notes don't need this.
import { PmButton } from '@/ds'

type Props = { onAssign: () => void }

export function AssignToJoin({ onAssign }: Props) {
  return (
    <div className="flex flex-col">
      <textarea
        disabled
        rows={3}
        placeholder="Assign to yourself to join this conversation"
        className="block w-full cursor-not-allowed resize-none bg-transparent px-4 py-3 text-sm outline-none placeholder:text-gray-400"
      />
      <div className="flex px-3 pb-3">
        <PmButton size="sm" className="ml-auto" onClick={onAssign}>Assign to me</PmButton>
      </div>
    </div>
  )
}
