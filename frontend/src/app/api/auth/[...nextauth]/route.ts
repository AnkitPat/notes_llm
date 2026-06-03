import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { Resend } from 'resend';

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
            to: ['siddeshgandhe@gmail.com','ankitpatidar030@gmail.com'],
            subject: 'Verify your account',
            html: `<p>Please verify your email: <a href="http://localhost:8000/verify?email=${user.email}">Verify Email</a></p>`,
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
