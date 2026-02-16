import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateActionSchema, CreateActionDto, ActionType, ActionOutcome } from "@repo/shared";
import { Button } from "@/components/ui/Button";
import {
  Form,
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
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/textarea";
import { CaseApi } from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddActionFormProps {
  caseId: number;
  onSuccess?: () => void;
}

export function AddActionForm({ caseId, onSuccess }: AddActionFormProps) {
  const queryClient = useQueryClient();
  
  const form = useForm<CreateActionDto>({
    resolver: zodResolver(CreateActionSchema),
    defaultValues: {
      type: ActionType.CALL,
      outcome: ActionOutcome.NO_ANSWER,
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateActionDto) => CaseApi.addActionLog(caseId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case", caseId] });
      onSuccess?.();
    },
  });

  const onSubmit = (values: CreateActionDto) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ActionType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="outcome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Outcome</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ActionOutcome).map((outcome) => (
                    <SelectItem key={outcome} value={outcome}>
                      {outcome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional details..." 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Adding Log..." : "Add Action Log"}
        </Button>
      </form>
    </Form>
  );
}