const nodemailer = require('nodemailer')
const hbs = require('nodemailer-express-handlebars');

const emailConfig = require('../config/email')


let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.password
    }
});

transport.use('compile', hbs({
    viewEngine: {
        extName: '.handlebars',
        partialsDir: __dirname+'/../views/emails',
        layoutsDir: __dirname+'/../views/emails',
        defaultLayout: 'reset.handlebars',
    },
    viewPath : __dirname+'/../views/emails',
    extName : '.handlebars'
}));

exports.enviar = async(opciones) => {
    const opcEmail = {
        from: 'UpTaskNode<no-reply@utn.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        template: opciones.archivo,
        context: { //todo dentro de va a visualizar en el temple
            resetUrl: opciones.resetUrl,
            nombre: opciones.usuario.nombre,
        }
    };
    
    await transport.sendMail(opcEmail);
}