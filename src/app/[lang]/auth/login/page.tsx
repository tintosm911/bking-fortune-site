import { AuthForm } from "@/components/AuthForm";
import { getDictionary } from "@/i18n/dictionaries";

export default async function AuthPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);
  return <AuthForm lang={lang} dict={dict} />;
}
