import { Input } from '@renderer/components/ui/input'
import { Label } from '@renderer/components/ui/label'

// Define the types for the props that the InputWithLabel component accepts
type InputWithLabelProps = {
  id: string
  labelText: string
  inputType: string
  placeholder: string
}

export const InputWithLabel = ({ id, labelText, inputType, placeholder }: InputWithLabelProps) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{labelText}</Label>
      <Input type={inputType} id={id} placeholder={placeholder} />
    </div>
  )
}
