import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Resend } from 'resend';
import { getAdminApprovalEmail } from '../../../../lib/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("Sign in attempt for:", user.email);
      return true; // Return true to allow sign in
    },
  },
  events: {
    async signIn({ user }) {
      console.log("DEBUG: signIn event triggered for:", user.email);
      if (user.email) {
        try {
          console.log("DEBUG: Attempting to send email to:", ['siddeshgandhe@gmail.com','ankitpatidar030@gmail.com']);
          const result = await resend.emails.send({
            from: 'onboarding@resend.dev', // Use a verified domain or onboarding
            to: ['ms.aaabb@gmail.com'],
            subject: 'New User Pending Approval',
            html: getAdminApprovalEmail(user.email),
          });
          console.log("DEBUG: Email send result:", result);
        } catch (error) {
          console.error('DEBUG: Error sending verification email:', error);
        }
      } else {
        console.log("DEBUG: No email address found for user");
      }
    },
  },
});

export { handler as GET, handler as POST };
