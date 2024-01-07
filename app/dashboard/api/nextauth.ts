// nextauth.ts
import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    Providers.Microsoft({
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    }),
    // Puedes agregar otros proveedores aquí si es necesario
  ],
  // Puedes añadir opciones adicionales si lo requieres
});
