import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from './button'
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from './command'
import { cn } from '@renderer/utils'
import { Popover, PopoverTrigger, PopoverContent } from './popover'

interface ComboBoxOption {
  value: string
  label: string
}

interface ComboBoxProps {
  placeHolder?: string
  className?: string
  options: ComboBoxOption[]
  onChange: (option: ComboBoxOption) => void
  selectedOption?: ComboBoxOption
}

export const ComboBox = ({
  className,
  options,
  onChange,
  selectedOption,
  placeHolder
}: ComboBoxProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={options.length === 0}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('justify-between', className)}
        >
          {selectedOption
            ? options.find((option) => option.value === selectedOption.value)?.label
            : 'Select framework...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeHolder} />
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(option)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedOption?.value === option.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
