import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailService {
    private transporter: Transporter;


    constructor() {
        this.transporter = createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async sendUserConfirmation(user: any, token: string) {

        const url = `${process.env.serverUrl}/auth/confirm?token=${token}`;

        await this.transporter.sendMail({
            from: `noreply ${process.env.EMAIL}`,
            to: user.email,
            subject: 'Verify you account ',
            html: `  <table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; font-family: Arial, sans-serif;">
            <tr>
              <td style="padding: 20px;">
                <p>Dear ${user.username},</p>
                <p>Thank you for creating an account with us. Please verify your email address to complete the registration process.</p>
                <p style="text-align: center;">
                  <a href="${url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Account</a>
                </p>
                <p>If you did not sign up for this account, please ignore this email.</p>
              </td>
            </tr>
          </table>`,
        });
    }


    // async sendUserForgotInstructions(user: IUserFromDb, token: string) {
    //     const serverUrl = this.configService.get<string>('SERVER_URL');
    //     const url = `${serverUrl}/auth/forgotpass/verify?code=${token}&user=${user.username}`;

    //     await this.transporter.sendMail({
    //         from: `noreply ${this.configService.get<string>('MAIL_FROM')}`,
    //         to: user.email,
    //         subject: 'Instagram Password Reset',
    //         html: `<h1>Dear Instagram User</h1>
    //             <p>We have received a request to reset your instagram password</p>
    //             <br>
    //             <p>username: <strong>${user.username}</strong><br></p>
    //             <p>Please click <strong><a href=${url}>here</a></strong> to reset your password</p><br>
    //             <br>
    //             <h2>The Instagram Team</h2>
    //       `,
    //     });
    // }

}
