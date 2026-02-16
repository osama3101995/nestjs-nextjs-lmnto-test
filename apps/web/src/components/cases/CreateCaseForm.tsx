import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCaseSchema, CreateCaseDto } from "@repo/shared";
import {CaseStatus, CaseStage} from '@repo/database/enums'
import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { CaseApi } from "@/services/api.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreateCaseFormProps {
  onSuccess?: () => void;
}

export function CreateCaseForm({ onSuccess }: CreateCaseFormProps) {
  const queryClient = useQueryClient();
  
  const form = useForm<CreateCaseDto>({
    resolver: zodResolver(CreateCaseSchema),
    defaultValues: {
      customerId: 0,
      loanId: 0,
      dpd: 0,
      stage: CaseStage.SOFT,
      status: CaseStatus.OPEN,
      assignedTo: "",
    },
  });

  const mutation = useMutation({
    mutationFn: CaseApi.createCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      onSuccess?.();
    },
  });

  const onSubmit = (values: CreateCaseDto) => {
    mutation.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer ID</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="loanId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loan ID</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dpd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Days Past Due (DPD)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stage</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(CaseStage).map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(CaseStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
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
          name="assignedTo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Assigned To (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Agent ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create Case"}
        </Button>
      </form>
    </Form>
  );
}