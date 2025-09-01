import { redirect } from 'next/navigation';

export default function SSORedirectPage() {
    redirect('/api/sso/discourse');
}