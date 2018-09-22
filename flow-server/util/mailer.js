const nodemailer = require('nodemailer');

const outbox = [];
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'flowfluidproject@gmail.com',
    pass: '', // insert password here
  },
});

function genContent(props, type) {
  const templates = {
    signup: {
      subject: `Welcome to Flow, ${props.username}!`,
      text: 'Now you\'ll get up-to-the-minute water consumptions online.',
    },
    limit: {
      subject: 'You\'re using too much water',
      text: `Flow ${props.id} reports that consumption is over your limit.`,
    },
  };
  return templates[type];
}

function send(recipient, props, type) {
  if (outbox.includes(recipient)) return;
  transporter.sendMail({
    from: 'flowfluidproject@gmail.com',
    to: recipient,
    ...genContent(props, type),
  }, (err) => {
    if (!err) {
      outbox.push(recipient);
      setTimeout(() => {
        const index = outbox.indexOf(recipient);
        if (index >= 0) {
          outbox.splice(index, 1);
        }
      }, 3600000);
    }
  });
}

module.exports = send;
