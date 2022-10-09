import random
import tornado.ioloop
import tornado.httpserver
import tornado.web
import tornado.escape
import os
import json
import smtplib
import re
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from validate_email import validate_email
from pymongo import MongoClient

cluster = MongoClient("mongodb+srv://Tekser15:<pass>@cluster0.tc9nrxs.mongodb.net/Inventory?retryWrites=true&w=majority")
Nikis = cluster["Nikis-train"]
db = Nikis["Users"]
confirm_db = Nikis["Confirm_User"]


class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")


class mainpage(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        name = tornado.escape.xhtml_escape(self.current_user)
        self.write("Hello, " + name)


class checkCode(BaseHandler):
    def get(self):
        user = str(self.get_argument("nickname"))
        self.render('templates/checkCode.html')


class checkCodejs(BaseHandler):
    def get(self):
        self.render('templates/checkCode.js')


def send_registration_code(taker, data):
    sender = "nikis.trainer@gmail.com"
    password = "<pass>"
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    x = 0
    for i in range(6):
        x = x * 10 + random.randint(0, 9)
    message = str(x)
    try:
        server.login(sender, password)
        msg = MIMEText(message)
        msg["Subject"] = "Ваш код для регистрации на Nikis-train"
        server.sendmail(sender, taker, msg.as_string())
        data['check_code'] = message
        return message
    except Exception as _ex:
        return f"{_ex}\nFail with gmail"


class signUp(BaseHandler):
    def get(self):
        self.render('templates/signUp.html')

    async def post(self):
        x = self.request.body
        data = json.loads(x)
        print(data)
        '''
        check = {
            'email_valid': 'ok',              #Емайл невалидный
            'email_busy': 'ok',               #Емайл Занят
            'password_length': 'ok',          #Длина пароля меньше 8 символов
            'password_without_symbols': 'ok', #Пароль без символов (a-z), (A-Z)
            'password_equal': 'ok',           #Пароли не одинаковые
            'nickname_valid': 'ok',           #Никнейм не пустой
            'nickname_busy': 'ok',            #Никнейм занят
        }
        '''
        check = dict()
        response = {
            'status': 'ok',
        }

        #########################################
        ######### Валидация данных ##############
        #########################################

        email = data['login']
        password = data['password']
        passwordRepeat = data['passwordRepeat']
        nickname = data['nickname']

        #1.Проверка валидности емайла

        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if re.fullmatch(regex, email) is None:
            check['email_valid'] = 'error'

        #2.Емайл занят

        #3.Длина пароля меньше 8 символов

        if len(password) < 8:
            check['password_length'] = 'error'

        #4.Пароль без символов (a-z), (A-Z)

        if not (bool(re.match('^(?=.*[a-z])', password)) and bool(re.match('^(?=.*[A-Z])', password))):
            check['password_without_symbols'] = 'error'

        #5.Пароли не одинаковые

        if password != passwordRepeat:
            check['password_equal'] = 'error'

        #6.Пустой никнейм

        if not nickname:
            check['nickname_valid'] = 'error'

        #7.Никнейм занят

        #....

        print(check)

        if len(check) > 0:
            response['status'] = check
            self.write(response)
        else:
            data = {
                'nickname': nickname,
                'password': password,
                'email': email,
            }
            confirm_db.find_one_and_delete(data)
            send_registration_code(email, data)
            confirm_db.insert_one(data)
            response['nickname'] = nickname
            self.write(response)#redirect('/checkCode?nickname=' + str(nickname))
        #self.set_secure_cookie("user", '...')
        #self.write(response)
        #self.redirect("/")


class signUpjs(BaseHandler):
    def get(self):
        self.render("templates/signUp.js")


class login(BaseHandler):
    def get(self):
        self.render('templates/signIn.html')

    def post(self):
        x = self.request.body
        data = json.loads(x)
        print(data)
        print(send_registration_code())
        # self.set_secure_cookie("user", '...')
        self.write('ok')
        #self.redirect("/")


class loginjs(BaseHandler):
    def get(self):
        self.render("templates/signIn.js")


class logincss(BaseHandler):
    def get(self):
        self.render("login.css")


if __name__ == "__main__":
    BASE_DIR = os.path.dirname(os.path.dirname(__file__))
    settings = {
        "cookie_secret": "Secret_phrase",
        "login_url": "/login",
        # "static_path": os.path.join(os.path.dirname(BASE_DIR), "static"),
    }
    app = tornado.web.Application([
        (r"/", mainpage),
        (r"/checkCode", checkCode),
        (r"/checkCode.js", checkCodejs),
        (r"/signUp", signUp),
        (r"/signUp.js", signUpjs),
        (r"/login", login),
        (r"/login.css", logincss),
        (r"/signIn.js", loginjs),
        (r'/static/(.*)', tornado.web.StaticFileHandler, {'path': './static'}),
        (r'/static/img/(.*)', tornado.web.StaticFileHandler, {'path': './img'}),
    ], **settings)
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(80)
    tornado.ioloop.IOLoop.current().start()
