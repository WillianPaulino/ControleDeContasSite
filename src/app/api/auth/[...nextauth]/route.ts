import NextAuth, { NextAuthOptions, User, Session } from "next-auth"
import { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

// --- INÍCIO DA CORREÇÃO ---
// Estendemos a interface padrão do NextAuth para incluir nosso campo 'id'
// e o campo 'hasPaid' que talvez queiramos usar no futuro.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      hasPaid: boolean;
    } & User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    hasPaid: boolean;
  }
}
// --- FIM DA CORREÇÃO ---


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Este callback é chamado sempre que um token JWT é criado ou atualizado.
    async jwt({ token, user }) {
      // Na primeira vez que o usuário faz login, o objeto 'user' está disponível.
      if (user) {
        // Buscamos o usuário no nosso banco de dados para pegar o status de pagamento.
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
        });
        token.id = user.id;
        token.hasPaid = dbUser?.hasPaid ?? false;
      }
      return token;
    },
    // Este callback é chamado sempre que a sessão é acessada no lado do cliente.
    async session({ session, token }) {
      // Passamos os dados do token (que tem o ID e o status de pagamento) para a sessão.
      if (session.user) {
        session.user.id = token.id;
        session.user.hasPaid = token.hasPaid;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }