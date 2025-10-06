const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const session = require("express-session");
const passport = require("passport");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.disable("x-powered-by");
app.use(express.static(path.join(__dirname, "../admin/public")));

app.use(helmet());

app.use(mongoSanitize());
app.use(compression());
app.use(cookieParser());
// Configure session middleware
app.use(
  session({
    secret: process.env.PASPORTJS_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: ['https://srivarumotors.com', 'http://localhost:3000','https://admin.srivarumotors.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

app.options('*', cors());

app.use(express.json({ limit: "1gb", parameterLimit: 50000 }));
app.use(
  express.urlencoded({ limit: "1gb", extended: true, parameterLimit: 50000 })
);

const uri = process.env.MONGO_DB_URL;
mongoose.set("strictQuery", false);
mongoose.connect(uri, {
  useNewUrlParser: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("connection MongoDB");
});

// instalition db import
const installDB = require("./routes/installdb.js");
app.use("/installdb", installDB);

//Private Root import
const turkeyRouter = require("./routes/turkey");
const userRouter = require("./routes/users");
const uploadRouter = require("./routes/upload");
const staffRouter = require("./routes/staff");
const customerRouter = require("./routes/customers");
const countryRouter = require("./routes/country");
const productsRouter = require("./routes/products");
const productimagesRouter = require("./routes/productimages");
const variantsRouter = require("./routes/variants");
// const categoriesRouter = require("./routes/categories");
const cargoesRouter = require("./routes/cargoes");
const homeSliderRouter = require("./routes/homeslider");
const ordersRouter = require("./routes/orders");
const orderstatusRouter = require("./routes/orderstatus");
const brandsRouter = require("./routes/brands");
const paymentmethodsRouter = require("./routes/paymentmethods");
const topmenuRouter = require("./routes/topmenu");
const settingsRouter = require("./routes/settings");
const basketRouter = require("./routes/basket");
const Agent = require("./routes/agent.routes.js");
const Dealer = require("./routes/dealer.routes.js");
const paytmPaymentRouter = require("./routes/paytmPayment.js");

//Public Root import
const settingsPublicRouter = require("./routes/settingspublic");
const topmenuPublicRouter = require("./routes/topmenupublic");
const categoriesPublicRouter = require("./routes/categoriespublic");
const brandsPublicRouter = require("./routes/brandspublic");
const homeSliderPublicRouter = require("./routes/homesliderpublic");
const productsPublicRouter = require("./routes/productspublic");
const cargoesPublicRouter = require("./routes/cargoespublic");
const customerPublicRouter = require("./routes/customerspublic");
const paymentPublicRouter = require("./routes/payment");
const paymentMethodsPublicRouter = require("./routes/paymentmethodspublic");
const championRouter = require("./routes/champion.routes");
const blogRouter = require("./routes/blog.routes.js");
const testdriveRouter = require("./routes/testdrive.routes.js");
const StoreLocator = require("./routes/store.routes.js");
const Testimonial = require("./routes/testimonial.routes.js");
const FAQ = require("./routes/faq.routes.js");
const Banner = require("./routes/banner.routes.js");
const BikeVarient = require("./routes/bikeVarient.routes.js");
const Partner = require("./routes/partner.routes.js");
const Categories = require("./routes/categories.routes.js");
const Aboutus = require("./routes/aboutus.routes.js");
const VisitUs = require("./routes/visitus.routes.js");
const ProductBanner = require("./routes/productbanner.routes.js");
const Enquiry = require("./routes/enquiry.routes.js");
const News = require("./routes/news.routes.js");
const Event = require("./routes/event.routes.js");
const Gallery = require("./routes/gallery.routes.js");
const Accessory = require("./routes/accessories.routes");
const CustomerNewRouter = require("./routes/customer.routes.js");
const Incentive = require("./routes/incentive.routes.js");
const Footer = require("./routes/footer.routes.js");
const websiteCount = require("./routes/website-count.routes.js");
const aliveRoutes = require("./routes/alive.routes.js"); 
const pranaClassRoutes = require("./routes/pranaclass.routes.js");
const Subscriber = require("./routes/subscriber.routes.js");
const financialInput = require("./routes/financial-input.routes.js");
const tco = require("./routes/tco.routes.js");
const career = require("./routes/career.routes.js");
const CareerApplication = require("./routes/career-application.routes.js");
const Value = require("./routes/values.routes.js");
const cityMasterRouter = require("./routes/cityMaster.js");
const brochureRoutes = require("./routes/browchers.routes.js");
//Private Root
app.use("/financial-input", financialInput);
app.use("/values", Value);
app.use("/tco", tco);
app.use("/career", career);
app.use("/career-application", CareerApplication);
app.use("/cargoes", cargoesRouter);
app.use("/homeslider", homeSliderRouter);
app.use("/orders", ordersRouter);
app.use("/orderstatus", orderstatusRouter);
app.use("/paymentmethods", paymentmethodsRouter);
app.use("/topmenu", topmenuRouter);
app.use("/users", userRouter);
app.use("/staff", staffRouter);
app.use("/champion", championRouter);
app.use("/customers", customerRouter);
app.use("/customer", CustomerNewRouter);
app.use("/country", countryRouter);
app.use("/products", productsRouter);
app.use("/productimages", productimagesRouter);
app.use("/variants", variantsRouter);
app.use("/agent", Agent);
app.use("/dealer", Dealer);
app.use("/incentive", Incentive);
app.use("/brochure", brochureRoutes);
// app.use("/categories", categoriesRouter);
app.use("/brands", brandsRouter);
app.use("/turkey", turkeyRouter);
app.use("/upload", uploadRouter);
app.use("/settings", settingsRouter);
app.use("/basket", basketRouter);
app.use("/blog", blogRouter);
app.use("/testdrive", testdriveRouter);
app.use("/store", StoreLocator);
app.use("/testimonial", Testimonial);
app.use("/faq", FAQ);
app.use("/banner", Banner);
app.use("/bikevarient", BikeVarient);
app.use("/partner", Partner);
app.use("/categories", Categories);
app.use("/aboutus", Aboutus);
app.use("/visitus", VisitUs);
app.use("/productbanner", ProductBanner);
app.use("/enquiry", Enquiry);
app.use("/news", News);
app.use("/event", Event);
app.use("/gallery", Gallery);
app.use("/accessories", Accessory);
app.use("/cities", cityMasterRouter);
app.use("/footer", Footer);
app.use("/websitecount", websiteCount);
//public Root
app.use("/settingspublic", settingsPublicRouter);
app.use("/topmenupublic", topmenuPublicRouter);
// app.use("/categoriespublic", categoriesPublicRouter);
app.use("/brandspublic", brandsPublicRouter);
app.use("/homesliderpublic", homeSliderPublicRouter);
app.use("/productspublic", productsPublicRouter);
app.use("/cargoespublic", cargoesPublicRouter);
app.use("/customerspublic", customerPublicRouter);
app.use("/payment/alive", require("./routes/paytmAlivaPayment"));
app.use("/payment/pranaclass", require("./routes/paytmPranaClassPayment"));
app.use("/payment", paytmPaymentRouter);
app.use("/paymentmethodspublic", paymentMethodsPublicRouter);
app.use("/subscriber", Subscriber);
app.use("/alive", aliveRoutes);
app.use("/pranaclass", pranaClassRoutes); 

app.listen(port, () => {
  console.log("sever is runnin port: " + port);
});
