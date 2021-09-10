var express = require("express");
var mongoose = require("mongoose");
const app = express();
const PORT = 7000;

mongoose.connect("mongodb+srv://gustavo_antonelli:<password>@cluster0.dyuuc.mongodb.net/....?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology:true});

const Livros = mongoose.model("Livros", {
    nome: String,
    autor: String,
    categoria: String
});

const Usuario = mongoose.model("usuario", {
    username: String,
    email: String,
    password: String
});

app.set("view engine", "ejs");
app.set("views",__dirname,"/views");
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static("public"));


//ROTA PAGINA PRINCIPAL
app.get("/", (req, res)=> {
    res.send("Home");
});


//ROTA LISTAGEM DE LIVROS
app.get("/livros", (req, res)=>{
    let consulta = Livros.find({}, (err, livro)=>{
        if(err){
            return res.status(500).send("Erro ao consultar livro");
        }
        return res.render("livros", {livros_lista:livro})
    })
});

app.get("/procuraLivros", (req, res) => {
    var resName = req.query.procura;
    var resAutor = req.query.procura;
    var resCategoria = req.query.procura;

    Livros.find({$or:[{nome: resName}, {autor: resAutor}, {categoria: resCategoria}]}, (err, livro)=>{
        if(err){
            return res.status(500).send("Erro ao consultar livro");
        }
        res.render("livros", {livros_lista:livro})
    })
});

//ROTA CADASTRO LIVROS
app.get("/cadastrarLivro", (req, res)=>{
    res.render("formlivro");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.get("/login_submit", (req, res)=>{
    let user_type = req.query.username
    let pass_type = req.query.password
    console.log(user_type, pass_type)
    Usuario.find({$and: [{username: user_type}, {password: pass_type}]}, (err, usuario)=>{
    // Usuario.find({username: user_type}, (err, usuario)=>{
            if(err){
                return res.status(500).send("Erro ao comunicar com o Banco");
            }
            else{
                
                if(usuario.length == 0){
                    return res.render("login", {usuario: usuario});
                }
                console.log('Login successfuly')
                res.redirect("/livros");
            };
        });
});



// app.post("/login", (req, res)=>{
//     let user_type = req.query.username
//     let pass_type = req.query.password

//     Usuario.find({$and: [{username: user_type}, {password: pass_type}]}, (err, user_permision)=>{
//         if(err){
//             return res.status(500).send("Este usuario nao existe");
//         }
//         console.log('Login successfuly')
//         res.redirect("/livros");
//     });
// });

app.get("/register", (req, res)=>{
    res.render("register");
});

app.post("/register", (req, res)=>{
    let usuario = new Usuario();
    usuario.username = req.body.username;
    usuario.email = req.body.email;
    usuario.password = req.body.password;
    usuario.save((err)=>{
        if(err){
            return res.status(500).send("Erro ao cadastrar usuario no BANCOD DE DADOS");
        };
        return res.redirect("/login");
    });
});

//ROTA CADASTRANDO LIVRO
app.post("/cadastrarLivro", (req, res)=>{
    let livro = new Livros();
    livro.nome = req.body.nome;
    livro.autor = req.body.autor;
    livro.categoria = req.body.categoria;
    livro.save((err)=>{
        if(err){
            return res.status(500).send("Erro ao salvar livro no BANCOD DE DADOS");
        }
        return res.redirect("/livros");
    });
});

//ROTA DELETAR LIVRO DO DB
app.get("/deletarLivro/:id", (req, res)=>{
    var del = req.params.id;

    Livros.deleteOne({_id:del}, (err)=>{
        if(err){
            return res.status(500).send("Erro ao deletar livro");
        }
        return res.redirect("/livros");
    });
});

//ROTA DE EDIÇAO
app.get("/editarLivro/:id", (req, res)=>{
    Livros.findById(req.params.id, (err, livro)=>{
        if(err){
            return res.status(500).send("Erro ao consultar livro");
        }
        return res.render("editarformlivro", {livro_item:livro})
        
    });
});

//ROTA EDITANDO LIVRO
app.post("/editarLivro", (req, res)=>{
    var id = req.body.id;
    Livros.findById(id, (err, livro)=>{
        if(err){
            return res.status(500).send("Erro ao editar livro");
        }
        livro.nome = req.body.nome;
        livro.autor = req.body.autor;
        livro.categoria = req.body.categoria;
        livro.save((err)=>{
            if(err){
                return res.status(500).send("Erro ao editar livro");
            }
            return res.redirect("/livros") 
        });
    });
})

app.listen(PORT, ()=>{
    console.log(`server running gate ${PORT}`)
});