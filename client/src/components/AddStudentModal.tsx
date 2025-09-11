import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { insertStudentSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { z } from "zod";

type FormData = z.infer<typeof insertStudentSchema>;

interface AddStudentModalProps {
  onStudentAdded?: () => void;
}

export default function AddStudentModal({ onStudentAdded }: AddStudentModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(insertStudentSchema),
    defaultValues: {
      name: "",
      grade: "",
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/students', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/students'] });
      toast({
        title: "Success!",
        description: "Student added successfully.",
      });
      form.reset();
      setOpen(false);
      onStudentAdded?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add student: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createStudentMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          data-testid="button-add-student"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter student name"
                      data-testid="input-student-name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 3, 4, 5"
                      data-testid="input-student-grade"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createStudentMutation.isPending}
                data-testid="button-save-student"
              >
                {createStudentMutation.isPending ? "Adding..." : "Add Student"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}