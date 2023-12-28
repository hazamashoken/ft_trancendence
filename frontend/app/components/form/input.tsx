import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ReactElement } from "react";

type IInputFormProps = {
  label: string;
  name: string;
  className?: string;
  isRequired?: boolean;
  form: any;
  type?: string;
  placeholder?: string;
  lang?: string;
  msg?: boolean;
  help?: ReactElement;
  disabled?: boolean;
  onFocus?: () => void;
};

export function InputForm(props: IInputFormProps) {
  const {
    label,
    name,
    className,
    isRequired,
    form,
    type,
    placeholder,
    lang = "en-US",
    msg,
    help,
    disabled,
    onFocus,
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
            <Input
              type={type ?? "text"}
              lang={lang}
              placeholder={placeholder}
              onFocus={onFocus}
              disabled={disabled}
              {...field}
            />
          </FormControl>
          {msg ? <FormMessage /> : null}
        </FormItem>
      )}
    />
  );
}
