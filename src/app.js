import fastify from "fastify";
import { prisma } from './db.js'
import booksRoutes from "./routes/books.js";

export function buildApp(){
    const app = fastify({loogger: true});

    //Deixa o Prisma disponível no Fastify
    app.decorate('prisma', prisma);

    // Rotas
    app.register(booksRoutes);

    // Fecha o Prisma ao encerrar o app
    app.addHook('onClose', async (instance) => {
        await instance.prisma.$disconnect();
    });

    return app;
}