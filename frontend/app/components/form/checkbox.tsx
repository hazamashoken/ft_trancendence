import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type IInputFormProps = {
  label: string | React.ReactNode;
  name: string;
  className?: string;
  isRequired?: boolean;
  form: any;
  type?: string;
  description?: any;
};

export function CheckboxForm(props: IInputFormProps) {
  const {
    label,
    name,
    className,
    isRequired,
    form,
    type,
    description,
    ...rest
  } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md",
            className
          )}
        >
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              {label}
              {isRequired && <span className="text-destructive"> *</span>}
            </FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
        </FormItem>
      )}
    />
  );
}
