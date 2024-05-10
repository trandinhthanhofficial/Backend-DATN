require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"Healthy care " <anxincandy.999@gmail.com>',
    to: dataSend.receiverEmail, //list user send
    subject: "Thông tin đặt lịch khám bệnh ✔",
    html: getBodyHTMLEmail(dataSend),
  });
};

let getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
            <h3>Xin chào ${dataSend.patientName}!</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên website HealthyCare.</p>
            <p>Thông tin đặt lịch khám bệnh:</p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
            <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để hoàn tất thủ tục đặt lịch khám bệnh.</p>
            <div><a href=${dataSend.redirectLink} target="_blank">Click here!</a></div>
            <div>Xin chân thành cảm ơn!</div>
        `;
  }
  if (dataSend.language === "en") {
    result = `
            <h3>Hello ${dataSend.patientName}!</h3>
            <p>You received this email because you booked an online medical appointment on the HealthyCare website.</p>
            <p>Information for scheduling medical examination:</p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>
            <p>If the above information is true, please click on the link below to complete the medical examination appointment procedure.</p>
            <div><a href=${dataSend.redirectLink} target="_blank">Click here!</a></div>
            <div>Sincerely thank!</div>
        `;
  }
  return result;
};

let sendAttachment = async (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      let contentImg = `${dataSend.imageBase64}`;
      let fileName = `remedy-${dataSend.patientId}-${new Date().getTime()}`;
      let info = await transporter.sendMail({
        from: '"Healthy care" <anxincandy.999@gmail.com>',
        to: dataSend.email, //list user send
        subject: "Kết quả khám bệnh ✔",
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: [
          {
            // encoded string as an attachment
            filename: `${fileName}.jpg`,
            content: contentImg.split("base64,")[1],
            encoding: "base64",
          },
        ],
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
            <h3>Xin chào ${dataSend.patientName}!</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên website Healthy Care thành công.</p>
            <p>Thông tin khám bệnh/hóa đơn được gửi trong file đính kèm.</p>
            <div>Xin chân thành cảm ơn!</div>
        `;
  }
  if (dataSend.language === "en") {
    result = `
            <h3>Hello ${dataSend.patientName}!</h3>
            <p>You are receiving this email because you have successfully booked an online medical appointment on the Healthy Care website.</p>
            <p>Medical examination/invoice information is sent in the attached file.</p>
            <div>Sincerely thank!</div>
        `;
  }
  return result;
};

module.exports = {
  sendSimpleEmail: sendSimpleEmail,
  getBodyHTMLEmail: getBodyHTMLEmail,
  sendAttachment: sendAttachment,
  getBodyHTMLEmailRemedy: getBodyHTMLEmailRemedy,
};
