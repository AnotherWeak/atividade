import express, {Request, Response} from "express";
import mysql from "mysql2/promise";

const app = express();

// Configura EJS como a engine de renderização de templates
app.set('view engine', 'ejs');
app.set('views', `${__dirname}/views`);

const connection = mysql.createPool({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "mudar123",
    database: "unicesumar"
});

// Middleware para permitir dados no formato JSON
app.use(express.json());
// Middleware para permitir dados no formato URLENCODED
app.use(express.urlencoded({ extended: true }));

app.get('/categories', async function (req: Request, res: Response) {
    const [rows] = await connection.query("SELECT * FROM categories");
    return res.render('categories/index', {
        categories: rows
    });
});

app.get("/categories/form", async function (req: Request, res: Response) {
    return res.render("categories/form");
});

app.post("/categories/save", async function(req: Request, res: Response) {
    const body = req.body;
    const insertQuery = "INSERT INTO categories (name, created_at) VALUES (?, CURRENT_DATE())";
    await connection.query(insertQuery, [body.name]);

    res.redirect("/categories");
});

app.post("/categories/delete/:id", async function (req: Request, res: Response) {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM categories WHERE id = ?";
    await connection.query(sqlDelete, [id]);

    res.redirect("/categories");
});

app.get('/users', async function (req: Request, res: Response) {
    const [rows] = await connection.query("SELECT * FROM users");
    return res.render('users/index', {
        users: rows
    });
});

app.get("/users/form", async function (req: Request, res: Response) {
    return res.render("users/form");
});

app.post("/users/save", async function(req: Request, res: Response) {
    const body = req.body;
    const insertQuery = "INSERT INTO users (name, email, password, role, active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_DATE(), CURRENT_DATE())";
   console.log(body.active)
   if(body.active == "on"){
    body.active = 1;
   }
    await connection.query(insertQuery, [body.name, body.email, body.password, body.role, body.active]);

    res.redirect("/users");
});

app.post("/users/delete/:id", async function (req: Request, res: Response) {
    const id = req.params.id;
    const sqlDelete = "DELETE FROM users WHERE id = ?";
    await connection.query(sqlDelete, [id]);

    res.redirect("/users");
});

app.get("/login", async function (req: Request, res: Response) {
    return res.render("./login/form");
});

app.post('/login', async function (req: Request, res: Response) {
    const body = req.body;
    const [rows] = await connection.query("SELECT email, password FROM users where email = ? and password = ?", [body.email, body.password]);
    if (rows[0] == undefined){
        res.redirect("/login");
        return;
        
    }

    res.redirect("/users");
});

app.get("/", async function (req: Request, res: Response) {
    return res.render("./home");
});



app.listen('3000', () => console.log("Server is listening on port 3000"));


