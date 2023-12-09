import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ISelectFormProps = {
  label: string;
  name: string;
  className?: string;
  isRequired?: boolean;
  form: any;
  options: { label: string; value: string }[];
  placeholder?: string;
};

export function SelectForm(props: ISelectFormProps) {
  const {
    label,
    name,
    className,
    isRequired,
    form,
    options,
    placeholder,
    ...rest
  } = props;
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>
            {label}
            {isRequired && <span className="text-destructive"> *</span>}
          </FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder ?? label} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option, index) => (
                  <SelectItem key={index} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {/* <FormMessage /> */}
        </FormItem>
      )}
    />
  );
}
