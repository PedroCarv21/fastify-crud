export default async function booksRoutes(app){
    //Schemas simples da validação (JSON Schema)
    const bookBodySchema = {
        type: 'object',
        required: ['title', 'author'],
        properties: {
            title: {type: 'string', minLength: 1},
            author: {type: 'string', minLength: 1}
        }
    };

    const idParamSchema = {
        type: 'object',
        required: ['id'],
        properties: {
            // Mantemos como string e convertemos manualmente
            id: {type: 'string', pattern: '^[0-9]+$'}
        }
    };

    //CREATE
    app.post('/books', {schema: {body: bookBodySchema} }, async (req, reply) => {
        const {title, author} = req.body;
        const book = await app.prisma.book.create({data: {title, author}});
        return reply.code(201).send(book);
    })

    //READ (lista)
    app.get('/books', async (req, reply) => {
        const books = await app.prisma.book.findMany({
            orderBy: {id: 'asc'}
        });
        return reply.send(books);
    });

    //READ (POR ID)
    app.get('/books/:id', { schema: { params: idParamSchema } }, async (req, reply) => {
        const { id } = req.params;
        const book = await app.prisma.book.findUnique({
            where: { id: Number(id) }
        });

        if (!book) {
            return reply.code(404).send({ message: 'Book not found' });
        }

        return reply.send(book);
    });

    //UPDATE
    app.put('/books/:id', { schema: { params: idParamSchema, body: bookBodySchema } }, async (req, reply) => {
        const { id } = req.params;
        const { title, author } = req.body;

        try {
            const book = await app.prisma.book.update({
                where: { id: Number(id) },
                data: { title, author }
            });
            return reply.send(book);
        } catch (error) {
            return reply.code(404).send({ message: 'Book not found' });
        }
    });

    //DELETE
    app.delete('/books/:id', { schema: { params: idParamSchema } }, async (req, reply) => {
        const { id } = req.params;

        try {
            await app.prisma.book.delete({
                where: { id: Number(id) }
            });
            return reply.code(204).send();
        } catch (error) {
            return reply.code(404).send({ message: 'Book not found' });
        }
    });
}