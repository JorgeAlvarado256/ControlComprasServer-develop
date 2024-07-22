const Imap = require('imap-simple');
const { simpleParser } = require('mailparser');
const dotenv = require('dotenv');

dotenv.config();

const imapConfig = {
    imap: {
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD,
        host: 'imap.gmail.com',
        port: 993,
        tls: true,
        authMethods: ['PLAIN', 'LOGIN', 'CRAM-MD5']  // Configura los métodos soportados por tu servidor
    }
};

async function recibirCorreos() {
    try {
        const connection = await Imap.connect(imapConfig);
        await connection.openBox('INBOX');

        const searchCriteria = ['UNSEEN'];
        const fetchOptions = {
            bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
            markSeen: true
        };

        const messages = await connection.search(searchCriteria, fetchOptions);

        const emails = [];

        for (const message of messages) {
            const all = message.parts.find(part => part.which === 'TEXT');
            const id = message.attributes.uid;
            const idHeader = `Imap-Id: ${id}\r\n`;

            const parsed = await simpleParser(idHeader + all.body);
            emails.push({
                subject: parsed.subject,
                from: parsed.from.text,
                to: parsed.to.text,
                date: parsed.date,
                text: parsed.text
            });
        }

        connection.end();

        // Aquí puedes agregar lógica para procesar los correos recibidos
        console.log(emails);

        return emails;
    } catch (error) {
        console.error('Error al recibir correos:', error);
        throw new Error('No se pudieron recibir los correos');
    }
}

module.exports = recibirCorreos;

