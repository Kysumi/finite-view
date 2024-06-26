import { Label } from '@renderer/components/ui/label';
import { cn } from '@renderer/utils';
import { PropsWithChildren } from 'react';

export const WithLabel = ({
  labelText,
  id,
  className,
  children
}: PropsWithChildren & { labelText: string; id: string; className?: string }) => {
  return (
    <div className={cn('grid items-center gap-1.5', className)}>
      <Label htmlFor={id}>{labelText}</Label>
      {children}
    </div>
  );
};
