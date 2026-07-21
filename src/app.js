import express from 'express';
import morgan from 'morgan';
import { engine } from 'express-handlebars';
import path from 'path';
import appRouters from './routes/index.js';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import 'dotenv/config';

const app = express();

app.use(morgan('dev')); // Kích hoạt Middleware ghi log chi tiết cho mọi request

app.use(express.json()); // Kích hoạt Middleware để tự động parse JSON body của request
app.use(express.urlencoded({ extended: true })); // Kích hoạt Middleware để tự động parse URL-encoded body (form data) của request
app.use(cookieParser()); // Kích hoạt Middleware để parse cookie từ request header vào req.cookies
app.use(methodOverride('_method')); // Kích hoạt Middleware để hỗ trợ HTTP method PUT và DELETE thông qua query parameter _method
app.use(express.static(path.join(path.resolve(), 'public')));

app.engine(
  'hbs',
  engine({
    defaultLayout: 'main', // Đặt file main.handlebars làm bộ khung mặc định (có thể đổi tên file mặc định)
    layoutsDir: './src/views/layouts', // Đặt thư mục chứa file layout là ./views/layouts
    helpers: {
      checkAge: (age) => {
        return age >= 18 ? 'Đủ tuổi' : 'Chưa đủ tuổi';
      },
    },
    extname: '.hbs', // Đặt đuôi file giao diện là .hbs thay vì .handlebars
  }),
);

app.set('view engine', 'hbs');

app.set('views', './src/views');

const API_VERSION = '/api';

app.use(API_VERSION, appRouters);

app.use((err, req, res, _next) => {
  res.status(500).json({
    message: 'Hệ thống đang bảo trì, vui lòng quay lại sau!',
    errorDetails: err.message,
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Không tìm thấy API bạn đang yêu cầu!',
  });
});

connectDB(); // Kết nối tới MongoDB Atlas trước khi khởi động server

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
