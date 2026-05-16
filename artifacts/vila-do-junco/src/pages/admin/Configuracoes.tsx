import { useEffect } from "react";
import { useGetSettings, useUpdateSettings } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const settingsSchema = z.object({
  siteName: z.string().min(1),
  tagline: z.string(),
  email: z.string().email().or(z.literal('')),
  phone: z.string(),
  whatsapp: z.string(),
  address: z.string(),
  instagram: z.string(),
  facebook: z.string(),
  aboutText: z.string(),
});

export default function Configuracoes() {
  const { data: settings, isLoading } = useGetSettings();
  const updateSettings = useUpdateSettings();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: "",
      tagline: "",
      email: "",
      phone: "",
      whatsapp: "",
      address: "",
      instagram: "",
      facebook: "",
      aboutText: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        siteName: settings.siteName || "",
        tagline: settings.tagline || "",
        email: settings.email || "",
        phone: settings.phone || "",
        whatsapp: settings.whatsapp || "",
        address: settings.address || "",
        instagram: settings.instagram || "",
        facebook: settings.facebook || "",
        aboutText: settings.aboutText || "",
      });
    }
  }, [settings, form]);

  const onSubmit = async (values: z.infer<typeof settingsSchema>) => {
    try {
      await updateSettings.mutateAsync({ data: values });
      toast({ title: "Configurações salvas com sucesso!" });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao salvar" });
    }
  };

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-10 w-1/3" /><Skeleton className="h-96 w-full" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações do Site</h1>
        <p className="text-muted-foreground mt-1">Altere informações públicas do site, contatos e redes sociais.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="siteName" render={({ field }) => (
                  <FormItem><FormLabel>Nome do Site</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="tagline" render={({ field }) => (
                  <FormItem><FormLabel>Slogan</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>E-mail Contato</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="whatsapp" render={({ field }) => (
                  <FormItem><FormLabel>WhatsApp</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="address" render={({ field }) => (
                <FormItem><FormLabel>Endereço Completo</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
              )} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="instagram" render={({ field }) => (
                  <FormItem><FormLabel>Instagram URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
                <FormField control={form.control} name="facebook" render={({ field }) => (
                  <FormItem><FormLabel>Facebook URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />
              </div>

              <FormField control={form.control} name="aboutText" render={({ field }) => (
                <FormItem><FormLabel>Texto Sobre a Empresa</FormLabel><FormControl><Textarea className="h-32" {...field} /></FormControl></FormItem>
              )} />

              <div className="flex justify-end pt-4 border-t">
                <Button type="submit" disabled={updateSettings.isPending}>
                  {updateSettings.isPending ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
