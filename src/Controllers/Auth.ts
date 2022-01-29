import { Request, Response, NextFunction } from 'express';
import { APIError } from '../Middlewares/Error';
import { Account } from '../Types/Account';
import { AccountType } from '../Types/AccountType';
import { compare, genSalt, hash } from 'bcrypt';
import { dbConfig } from '../Config/db.config';
import { Pool } from 'pg';
import nodemailer, { SendMailOptions } from 'nodemailer';
import { config } from 'dotenv';
import { sign } from 'jsonwebtoken';
config();

interface Auth {
  signup(request: Request, response: Response, next: NextFunction): Promise<void>;
  signin(request: Request, response: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
  activate(request: Request, response: Response, next: NextFunction): Promise<void>;
}

export class AuthController implements Auth {
  async signup(request: Request, response: Response, next: NextFunction) {
    const { universityName, email, address, password, firstName, lastName, accountType } = request.body;

    if (!accountType) {
      next(APIError.badRequest('Account type is required'));
      return;
    }

    if (AccountType.STUDENT === accountType) {
      if (!email || !address || !password || !firstName || !lastName) {
        next(APIError.badRequest('All fields are required to create account'));
      }

      const query = `
        INSERT INTO Account (email, address, password, firstName, lastName, accountType, verified) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      const salt: string = await genSalt(18);
      const hashedPassword: string = await hash(password, salt);

      const pool: Pool = new dbConfig().getPool();

      try {
        // const cipher: Hash = encrypt(email);
        await pool.query(query, [email, address, hashedPassword, firstName, lastName, AccountType.STUDENT, false]);
        const transporter = nodemailer.createTransport({
          service: 'SendinBlue', // no need to set host or port etc.
          auth: {
            user: process.env.sendinblue_login,
            pass: process.env.sendinblue_pass,
          },
        });

        const baseURL = {
          dev: `http://localhost:5000/api/signup/verify/${email}-${'asd9997asdasda'}`,
          prod: '',
        };
        const url = process.env.NODE_ENV === 'production' ? baseURL.prod : baseURL.dev;
        const mailOptions: SendMailOptions = {
          from: 'noreply@schoolconnect.co.za',
          to: email,
          subject: 'Account Verification',
          priority: 'high',
          html: `
            <!DOCTYPE html>
            <html lang="en-US">
              <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>New Account Email Template</title>
                <meta name="description" content="New Account Email Template." />
                <style type="text/css">
                  a:hover {
                    text-decoration: underline !important;
                  }
            
                  a {
                    color: black;
                    font-size: 32px;
                    text-decoration: none;
                  }
                </style>
              </head>
            
              <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8" leftmargin="0">
                <!-- 100% body table -->
                <table
                  cellspacing="0"
                  border="0"
                  cellpadding="0"
                  width="100%"
                  bgcolor="#f2f3f8"
                  style="
                    @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);
                    font-family: 'Open Sans', sans-serif;
                  "
                >
                  <tr>
                    <td>
                      <table
                        style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto"
                        width="100%"
                        border="0"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td style="height: 80px">&nbsp;</td>
                        </tr>
                        <tr>
                          <td style="text-align: center">
                            <a href="#" title="logo" target="_blank">Uni Connect</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="height: 20px">&nbsp;</td>
                        </tr>
                        <tr>
                          <td>
                            <table
                              width="95%"
                              border="0"
                              align="center"
                              cellpadding="0"
                              cellspacing="0"
                              style="
                                max-width: 670px;
                                background: #fff;
                                border-radius: 3px;
                                text-align: center;
                                -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                              "
                            >
                              <tr>
                                <td style="height: 40px">&nbsp;</td>
                              </tr>
                              <tr>
                                <td style="padding: 0 35px">
                                  <h1 style="color: #1e1e2d; font-weight: 500; margin: 0; font-size: 32px; font-family: 'Rubik', sans-serif">
                                    Get started
                                  </h1>
                                  <p style="font-size: 15px; color: #455056; margin: 8px 0 0; line-height: 24px">
                                    Your account has been created with <b>Uni Connect!</b><br /><strong
                                      >Click button below to activate your account to start with your School Applications</strong
                                    >.
                                  </p>
            
                                  <a
                                    href=${url}
                                    style="
                                      background: #20e277;
                                      text-decoration: none !important;
                                      display: block;
                                      font-weight: 500;
                                      margin-top: 24px;
                                      color: #fff;
                                      text-transform: uppercase;
                                      font-size: 14px;
                                      padding: 10px 24px;
                                      border-radius: 50px;
                                    "
                                    >Activate Account</a
                                  >
                                </td>
                              </tr>
                              <tr>
                                <td style="height: 40px">&nbsp;</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="height: 20px">&nbsp;</td>
                        </tr>
                        <tr>
                          <td style="text-align: center">
                            <p style="font-size: 14px; color: rgba(69, 80, 86, 0.7411764705882353); line-height: 18px; margin: 0 0 0">
                              &copy; <strong>www.uniconnect.co.za</strong>
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="height: 80px">&nbsp;</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <!--/100% body table-->
              </body>
            </html>
          
          `,
        };
        transporter.sendMail(mailOptions, (error, _info) => {
          if (error) {
            next(APIError.internalError('Network Error: Failed to send account activation email'));
            return;
          }
          return response.status(200).json({ msg: `Account created, activation email sent to ${email}` });
        });
      } catch (error) {
        next(APIError.conflict(error.code, error.detail));
      }
    } else {
      if (!email || !address || !password || !firstName || !lastName || !universityName) {
        next(APIError.badRequest('All fields are required to create account'));
      }

      const query = `
        INSERT INTO Account (email, address, password, firstName, lastName, accountType, verified, universityName) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `;

      const salt: string = await genSalt(18);
      const hashedPassword: string = await hash(password, salt);

      const pool: Pool = new dbConfig().getPool();

      try {
        await pool.query(query, [
          email,
          address,
          hashedPassword,
          firstName,
          lastName,
          AccountType.STUDENT,
          false,
          universityName,
        ]);
        const transporter = nodemailer.createTransport({
          service: 'SendinBlue', // no need to set host or port etc.
          auth: {
            user: process.env.sendinblue_login,
            pass: process.env.sendinblue_pass,
          },
        });

        // const cipher: Hash = encrypt(email);
        const baseURL = {
          dev: `http://localhost:5000/api/signup/verify/${email}-${'asd9997asdasda'}`,
          prod: '',
        };
        const url = process.env.NODE_ENV === 'production' ? baseURL.prod : baseURL.dev;
        const mailOptions: SendMailOptions = {
          from: 'noreply@uniconnect.co.za',
          to: email,
          subject: 'Account Verification',
          priority: 'high',
          html: `
            <!DOCTYPE html>
            <html lang="en-US">
              <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>New Account Email Template</title>
                <meta name="description" content="New Account Email Template." />
                <style type="text/css">
                  a:hover {
                    text-decoration: underline !important;
                  }
            
                  a {
                    color: black;
                    font-size: 32px;
                    text-decoration: none;
                  }
                </style>
              </head>
            
              <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8" leftmargin="0">
                <!-- 100% body table -->
                <table
                  cellspacing="0"
                  border="0"
                  cellpadding="0"
                  width="100%"
                  bgcolor="#f2f3f8"
                  style="
                    @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);
                    font-family: 'Open Sans', sans-serif;
                  "
                >
                  <tr>
                    <td>
                      <table
                        style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto"
                        width="100%"
                        border="0"
                        align="center"
                        cellpadding="0"
                        cellspacing="0"
                      >
                        <tr>
                          <td style="height: 80px">&nbsp;</td>
                        </tr>
                        <tr>
                          <td style="text-align: center">
                            <a href="#" title="logo" target="_blank">Uni Connect</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="height: 20px">&nbsp;</td>
                        </tr>
                        <tr>
                          <td>
                            <table
                              width="95%"
                              border="0"
                              align="center"
                              cellpadding="0"
                              cellspacing="0"
                              style="
                                max-width: 670px;
                                background: #fff;
                                border-radius: 3px;
                                text-align: center;
                                -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                                box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                              "
                            >
                              <tr>
                                <td style="height: 40px">&nbsp;</td>
                              </tr>
                              <tr>
                                <td style="padding: 0 35px">
                                  <h1 style="color: #1e1e2d; font-weight: 500; margin: 0; font-size: 32px; font-family: 'Rubik', sans-serif">
                                    Get started
                                  </h1>
                                  <p style="font-size: 15px; color: #455056; margin: 8px 0 0; line-height: 24px">
                                    Your account has been created with <b>Uni Connect!</b><br /><strong
                                      >Click button below to activate your account to start with your School Applications</strong
                                    >.
                                  </p>
            
                                  <a
                                    href="login.html"
                                    style="
                                      background: #20e277;
                                      text-decoration: none !important;
                                      display: block;
                                      font-weight: 500;
                                      margin-top: 24px;
                                      color: #fff;
                                      text-transform: uppercase;
                                      font-size: 14px;
                                      padding: 10px 24px;
                                      border-radius: 50px;
                                    "
                                    >Activate Account</a
                                  >
                                </td>
                              </tr>
                              <tr>
                                <td style="height: 40px">&nbsp;</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="height: 20px">&nbsp;</td>
                        </tr>
                        <tr>
                          <td style="text-align: center">
                            <p style="font-size: 14px; color: rgba(69, 80, 86, 0.7411764705882353); line-height: 18px; margin: 0 0 0">
                              &copy; <strong>www.schoolconnect.com</strong>
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="height: 80px">&nbsp;</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <!--/100% body table-->
              </body>
            </html>
          
          `,
        };
        transporter.sendMail(mailOptions, (error, _info) => {
          if (error) {
            next(APIError.internalError('Network Error: Failed to send account activation email'));
            return;
          }
          return response.status(200).json({ msg: `Account created, activation email sent to ${email}` });
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  async signin(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;

    if (!email || !password) {
      return next(APIError.badRequest('All fields are required to signin'));
    }

    const query = `
      SELECT id, email, password, verified FROM Account WHERE email=$1
    `;

    const pool: Pool = new dbConfig().getPool();

    try {
      const user: Account = await (await pool.query(query, [email])).rows[0];
      if (!user.verified) {
        return next(APIError.forbidden('Activate account to continue'));
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        return next(APIError.unAuthorized('Invalid login credentials'));
      }

      const token_payload = {
        email: user.email,
      };
      const token = sign(token_payload, process.env.cookie_secret as string, { expiresIn: '365d' });
      return response.status(200).json({ token });
    } catch (error) {
      next(APIError.internalError('Network Error: Failed to sign you in try again later'));
    }
  }

  async activate(request: Request, response: Response, next: NextFunction) {
    const account = request.params.account.split('-')[0];

    const query = `
      Update Account SET verified=$1 WHERE email=$2
    `;
    try {
      const pool: Pool = new dbConfig().getPool();
      await pool.query(query, [true, account]);
      const transporter = nodemailer.createTransport({
        service: 'SendinBlue', // no need to set host or port etc.
        auth: {
          user: process.env.sendinblue_login,
          pass: process.env.sendinblue_pass,
        },
      });

      const mailOptions: SendMailOptions = {
        from: 'noreply@schoolconnect.co.za',
        to: account,
        subject: 'Account Activation Success',
        priority: 'high',
        html: `
          <!DOCTYPE html>
          <html lang="en-US">
            <head>
              <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
              <title>New Account Email Template</title>
              <meta name="description" content="New Account Email Template." />
              <style type="text/css">
                a:hover {
                  text-decoration: underline !important;
                }
          
                a {
                  color: black;
                  font-size: 32px;
                  text-decoration: none;
                }
              </style>
            </head>
          
            <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8" leftmargin="0">
              <!-- 100% body table -->
              <table
                cellspacing="0"
                border="0"
                cellpadding="0"
                width="100%"
                bgcolor="#f2f3f8"
                style="
                  @import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700);
                  font-family: 'Open Sans', sans-serif;
                "
              >
                <tr>
                  <td>
                    <table
                      style="background-color: #f2f3f8; max-width: 670px; margin: 0 auto"
                      width="100%"
                      border="0"
                      align="center"
                      cellpadding="0"
                      cellspacing="0"
                    >
                      <tr>
                        <td style="height: 80px">&nbsp;</td>
                      </tr>
                      <tr>
                        <td style="text-align: center">
                          <a href="#" title="logo" target="_blank">School Connect</a>
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 20px">&nbsp;</td>
                      </tr>
                      <tr>
                        <td>
                          <table
                            width="95%"
                            border="0"
                            align="center"
                            cellpadding="0"
                            cellspacing="0"
                            style="
                              max-width: 670px;
                              background: #fff;
                              border-radius: 3px;
                              text-align: center;
                              -webkit-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                              -moz-box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                              box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.06);
                            "
                          >
                            <tr>
                              <td style="height: 40px">&nbsp;</td>
                            </tr>
                            <tr>
                              <td style="padding: 0 35px">
                                <h1 style="color: #1e1e2d; font-weight: 500; margin: 0; font-size: 32px; font-family: 'Rubik', sans-serif">
                                  Get started
                                </h1>
                                <p style="font-size: 15px; color: #455056; margin: 8px 0 0; line-height: 24px">
                                  Your account has been activated<br /><strong
                                    >Click button below to start with your School Applications</strong
                                  >.
                                </p>
          
                                <a
                                  href="#"
                                  style="
                                    background: #20e277;
                                    text-decoration: none !important;
                                    display: block;
                                    font-weight: 500;
                                    margin-top: 24px;
                                    color: #fff;
                                    text-transform: uppercase;
                                    font-size: 14px;
                                    padding: 10px 24px;
                                    border-radius: 50px;
                                  "
                                  >login</a
                                >
                              </td>
                            </tr>
                            <tr>
                              <td style="height: 40px">&nbsp;</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 20px">&nbsp;</td>
                      </tr>
                      <tr>
                        <td style="text-align: center">
                          <p style="font-size: 14px; color: rgba(69, 80, 86, 0.7411764705882353); line-height: 18px; margin: 0 0 0">
                            &copy; <strong>www.schoolconnect.com</strong>
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="height: 80px">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <!--/100% body table-->
            </body>
          </html>
        `,
      };
      transporter.sendMail(mailOptions, (error, _info) => {
        if (error) {
          next(APIError.internalError('Network Error: Failed to send email of activation confirmation'));
          return;
        }
        return response.status(200).json({ msg: `Account activated, confirmation email sent to ${account}` });
      });
    } catch (error) {}
  }
}
