const express = require('express')
const session = require('express-session');
const https = require('https')
const fs = require('fs')

const app = express()
const config = require('./config.json')
const mongoose = require("mongoose");

let Product = require('./schemas/product')
let Commentaire = require('./schemas/commentaire')
let Account = require('./schemas/compte')

app.set('view engine', 'ejs')
app.set('views', 'public/views/')
app.use(express.static('public'))

app.use(session({
    secret: 'temp_test_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(express.json());

console.log('\x1b[38;2;0;170;170m%s\x1b[0m', '⌛ | Starting website...')
mongoose.connect(config.mongoToken, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('\x1b[38;2;0;170;0m%s\x1b[0m', '✅ | Connected to DataBase'))

app.get('/', function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/')")
    res.render('index.ejs')
})

app.get('/api/getproducts', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/api/getproducts')")
    let option = await Product.find()
    res.json(option)
})

app.get('/api/getproduct/:ID', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/api/getproduct/:ID')")
    let option = await Product.findOne({ id: req.params.ID})
    res.json(option)
})

app.get('/api/getuser/:ID', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/api/getuser/:ID')")
    let option = await Account.findOne({ id: req.params.ID})
    res.json(option)
})

app.get('/api/getcomments/:ID', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/api/getcomments/:ID')")
    let option = await Commentaire.find({ productID: req.params.ID})
    res.json(option)
})

app.get('/api/featured', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/api/featured')")
    try {
        let today = new Date();
        let seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

        let products = await Product.find();

        if (products.length === 0) {
            return res.status(404).json({ error: 'No products found' });
        }
        let index = seed % products.length;
        let featuredProduct = products[index];

        res.json(featuredProduct.id);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/topproducts', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/api/topproducts')")
    try {
        const topProducts = await Commentaire.aggregate([
            {
                $group: {
                    _id: "$productID",
                    averageScore: { $avg: "$score" }
                }
            },
            {
                $sort: { averageScore: -1 }
            },
            {
                $limit: 3
            },
            {
                $project: {
                    _id: 0,
                    productID: "$_id",
                    averageScore: 1
                }
            }
        ]);

        res.json(topProducts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/setdummyaccounts', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/api/setdummyaccounts')")
    const urls = [
        "http://localhost/api/setaccounts?ID=1&name=Roy+Torp&email=Roy.Torp54@yahoo.com&pass=jHxJMEwzLL",
        "http://localhost/api/setaccounts?ID=2&name=Earnest+Grant&email=Earnest.Grant91@hotmail.com&pass=lj7ipnIRG2",
        "http://localhost/api/setaccounts?ID=3&name=Rosie+Anderson&email=Rosie.Anderson@yahoo.com&pass=jSDdnfem8u",
        "http://localhost/api/setaccounts?ID=4&name=Miss+Holly+Schuppe&email=MissHolly.Schuppe@gmail.com&pass=jHy8tK0gFd",
        "http://localhost/api/setaccounts?ID=5&name=Jessica+Stark&email=Jessica.Stark@gmail.com&pass=kfrc78SD7i",
        "http://localhost/api/setaccounts?ID=6&name=Gloria+Brown&email=Gloria.Brown@hotmail.com&pass=LgHdYYK6T9",
        "http://localhost/api/setaccounts?ID=7&name=Allen+Miller&email=Allen.Miller93@yahoo.com&pass=V9SYkJzHcO",
        "http://localhost/api/setaccounts?ID=8&name=Gail+Coleman&email=Gail.Coleman46@hotmail.com&pass=rcyjL3OhFb",
        "http://localhost/api/setaccounts?ID=9&name=Jerome+Kihn&email=Jerome.Kihn92@gmail.com&pass=8dsHjcULy5",
        "http://localhost/api/setaccounts?ID=10&name=Veronica+Gulgowski&email=Veronica.Gulgowski@gmail.com&pass=9C6QXsF2hA"
    ]

    await (async () => {
        for (let url of urls) {
            try {
                let response = await fetch(url);
                let data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error fetching URL:', url, error);
            }
        }
    })()

    res.json("done")
})

app.get('/api/setdummyproducts', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/api/setdummyproducts')")
    const urls = [
        "http://localhost/api/setproducts?name=Incredible%20Granite%20Table&description=Ergonomic%20executive%20table&imageURL=https%3A%2F%2Fpicsum.photos%2F2000&creatorID=1&price=388.89&g1=https%3A%2F%2Fpicsum.photos%2F1330%2F1770&g2=https%3A%2F%2Fpicsum.photos%2F1360%2F1690&g3=https%3A%2F%2Fpicsum.photos%2F1210%2F1720",
        "http://localhost/api/setproducts?name=Sleek%20Plastic%20Keyboard&description=Sleek%20keyboard%20with%20mechanical%20keys&imageURL=https%3A%2F%2Fpicsum.photos%2F2000&creatorID=2&price=98.79&g1=https%3A%2F%2Fpicsum.photos%2F1230%2F1760&g2=https%3A%2F%2Fpicsum.photos%2F1290%2F1750&g3=https%3A%2F%2Fpicsum.photos%2F1390%2F1780",
        "http://localhost/api/setproducts?name=Ergonomic%20Steel%20Mouse&description=High-performance%20ergonomic%20mouse&imageURL=https%3A%2F%2Fpicsum.photos%2F2000&creatorID=3&price=48.90&g1=https%3A%2F%2Fpicsum.photos%2F1360%2F1610&g2=https%3A%2F%2Fpicsum.photos%2F1350%2F1760&g3=https%3A%2F%2Fpicsum.photos%2F1220%2F1780",
        "http://localhost/api/setproducts?name=Intelligent%20Wooden%20Chair&description=Elegant%20and%20comfortable%20wooden%20chair&imageURL=https%3A%2F%2Fpicsum.photos%2F2000&creatorID=4&price=157.45&g1=https%3A%2F%2Fpicsum.photos%2F1260%2F1690&g2=https%3A%2F%2Fpicsum.photos%2F1380%2F1640&g3=https%3A%2F%2Fpicsum.photos%2F1390%2F1730",
        "http://localhost/api/setproducts?name=Awesome%20Concrete%20Bottle&description=Durable%20bottle%20with%20modern%20design&imageURL=https%3A%2F%2Fpicsum.photos%2F2000&creatorID=5&price=26.45&g1=https%3A%2F%2Fpicsum.photos%2F1220%2F1610&g2=https%3A%2F%2Fpicsum.photos%2F1290%2F1750&g3=https%3A%2F%2Fpicsum.photos%2F1310%2F1640",
        "http://localhost/api/setproducts?name=Sleek%20Frozen%20Pants&description=Comfortable%20pants%20with%20modern%20style&imageURL=https%3A%2F%2Fpicsum.photos%2F2000&creatorID=6&price=59.99&g1=https%3A%2F%2Fpicsum.photos%2F1290%2F1790&g2=https%3A%2F%2Fpicsum.photos%2F1380%2F1790&g3=https%3A%2F%2Fpicsum.photos%2F1320%2F1780",
        "http://localhost/api/setproducts?name=Awesome%20Steel%20Hat&description=Durable%20hat%20with%20modern%20look&imageURL=https%3A%2F%2Fpicsum.photos%2F2000&creatorID=7&price=25.25&g1=https%3A%2F%2Fpicsum.photos%2F1350%2F1790&g2=https%3A%2F%2Fpicsum.photos%2F1250%2F1770&g3=https%3A%2F%2Fpicsum.photos%2F1210%2F1650",
        "http://localhost/api/setproducts?name=Ergonomic%20Cotton%20Shoes&description=Comfortable%20and%20stylish%20cotton%20shoes&imageURL=https%3A%2F%2Fpicsum.photos%2F2000&creatorID=8&price=49.99&g1=https%3A%2F%2Fpicsum.photos%2F1270%2F1670&g2=https%3A%2F%2Fpicsum.photos%2F1250%2F1770&g3=https%3A%2F%2Fpicsum.photos%2F1220%2F1620",
        "http://localhost/api/setproducts?name=Incredible%20Steel%20Table&description=Stylish%20and%20durable%20steel%20table&imageURL=https%3A%2F%2Fpicsum.photos%2F2000&creatorID=9&price=199.99&g1=https%3A%2F%2Fpicsum.photos%2F1300%2F1660&g2=https%3A%2F%2Fpicsum.photos%2F1210%2F1680&g3=https%3A%2F%2Fpicsum.photos%2F1330%2F1710",
        "http://localhost/api/setproducts?name=Intelligent%20Rubber%20Gloves&description=Durable%20rubber%20gloves%20with%20ergonomic%20design&imageURL=https%3A%2F%2Fpicsum.photos%2F2000&creatorID=10&price=5.99&g1=https%3A%2F%2Fpicsum.photos%2F1370%2F1680&g2=https%3A%2F%2Fpicsum.photos%2F1340%2F1670&g3=https%3A%2F%2Fpicsum.photos%2F1360%2F1770",
        "http://localhost/api/setproducts?name=Small%20Steel%20Bottle&description=Portable%20steel%20bottle%20perfect%20for%20travel&imageURL=https%3A%2F%2Fpicsum.photos%2F2000&creatorID=11&price=29.99&g1=https%3A%2F%2Fpicsum.photos%2F1360%2F1640&g2=https%3A%2F%2Fpicsum.photos%2F1290%2F1750&g3=https%3A%2F%2Fpicsum.photos%2F1230%2F1780"
        ]

    await (async () => {
        for (let url of urls) {
            try {
                let response = await fetch(url);
                let data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error fetching URL:', url, error);
            }
        }
    })()

    res.json("done")
})

app.get('/api/setdummycomments', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/api/setdummycomments')")
    const productIDs = [1, 985030, 629533, 421393, 759927, 300079, 21767, 926852, 513954, 835844, 257000];
    const comments = [
        "C'est un produit fantastique, je le recommande vivement!",
        "Pas mal, mais je m'attendais à mieux pour le prix.",
        "Service client déplorable. Je ne recommande pas.",
        "Qualité correcte, mais il y a des améliorations à faire.",
        "Excellent produit, répond à toutes mes attentes.",
        "Très déçu, l'article ne correspondait pas à la description.",
        "Bon rapport qualité/prix, satisfait de mon achat.",
        "Produit de très bonne qualité, livraison rapide.",
        "Moyen, quelques défauts de fabrication mais fonctionnel.",
        "Très satisfait, je recommande sans hésiter!",
        "Un produit correct, mais le service client pourrait être meilleur.",
        "Le produit est arrivé endommagé, très déçu.",
        "Bonne qualité, mais prix un peu élevé.",
        "Livraison rapide et produit conforme à la description.",
        "Déçu par la qualité, ne vaut pas le prix.",
        "Produit pratique et facile à utiliser.",
        "Je suis très satisfait de ce produit, il est parfait.",
        "Produit moyen, je m'attendais à mieux.",
        "Qualité excellente, je recommande!",
        "Produit inutilisable, très mauvaise qualité.",
        "Le service client a été très utile, je suis satisfait.",
        "Article reçu rapidement, très content de mon achat.",
        "La qualité laisse à désirer, je ne recommande pas.",
        "Super produit, très content de mon achat.",
        "Produit correct mais sans plus, rapport qualité/prix moyen."
    ];

    const urls = [];

    for (let i = 1; i <= 25; i++) {
        const creatorID = Math.floor(Math.random() * 10) + 1;
        const productID = productIDs[Math.floor(Math.random() * productIDs.length)];
        const comment = comments[Math.floor(Math.random() * comments.length)];
        const score = Math.floor(Math.random() * 11);

        const url = `http://localhost/api/setcomments?productID=${productID}&creatorID=${creatorID}&comment=${encodeURIComponent(comment)}&score=${score}`;
        urls.push(url);
    }

    await (async () => {
        for (let url of urls) {
            try {
                let response = await fetch(url);
                let data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error fetching URL:', url, error);
            }
        }
    })()

    res.json("done")
})

app.get('/api/setproducts', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/api/setproducts')")
    let rq = req.query
    // if (!rq.name || !rq.description || !rq.imageURL || !rq.creatorID || !rq.price || rq.gallery) return res.json({"Error": "Missing content", "Potential URL": "http://localhost/api/setproducts?name=Lorem&description=LoremIpsum&imageURL=https://picsum.photos/200&creatorID=1&price=23.45&gallery=[https://picsum.photos/200/300, https://picsum.photos/200/300, https://picsum.photos/200/300]"})

    let ID = 1
    let c = await Product.findOne({ id: ID.toString() })

    while (c) {
        ID = Math.floor(Math.random() * (999999 - 1 + 1) + 1)
        c = await Product.findOne({ ID: ID })
    }

    let option = {
        id: ID.toString(),
        name: rq.name,
        description: rq.description,
        imageURL: rq.imageURL,
        creatorID: rq.creatorID,
        price: rq.price,
        gallery: [rq.g1, rq.g2, rq.g3]
    }

    let card = new Product(option)
    await card.save()

    res.json(option)
})

app.get('/api/setcomments', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/api/setcomments')")
    let rq = req.query

    let ID = 1
    let c = await Commentaire.findOne({ id: ID.toString() })

    while (c) {
        ID = Math.floor(Math.random() * (999999 - 1 + 1) + 1)
        c = await Commentaire.findOne({ ID: ID })
    }

    let option = {
        id: ID.toString(),
        productID: rq.productID,
        creatorID: rq.creatorID,
        comment: rq.comment,
        score: rq.score
    }

    let card = new Commentaire(option)
    await card.save()

    res.json(option)
})

app.get('/api/setaccounts', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/api/setaccounts')")
    let rq = req.query

    let option = {
        id: rq.ID,
        name: rq.name,
        email: rq.email,
        password: rq.pass
    }

    let card = new Account(option)
    await card.save()

    res.json(option)
})

app.delete('/api/accounts/:id', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.delete('/api/accounts/:id')")
    try {
        const accountId = req.params.id;
        const result = await Account.deleteOne({ id: accountId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Account not found' });
        }

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/comments/:id', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.delete('/api/comments/:id')")
    try {
        const commentId = req.params.id;
        const result = await Commentaire.deleteOne({ id: commentId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/login', function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/login')")
    res.render('login.ejs')
})

app.post('/api/login', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.post('/api/login')")
    try {
        const { email, password } = req.body;

        const user = await Account.findOne({ email: email });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });
        if (password !== user.password) return res.status(401).json({ error: 'Invalid email or password' });

        req.session.userId = user.id;
        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/logout', function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.post('/api/logout')")
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.json({ message: 'Logout successful' });
    });
});

app.get('/acheter', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/acheter')")
    let products = await fetch('http://localhost/api/getproducts')
    let data = await products.json()

    res.render('buy.ejs', {data: data})
})

app.get('/acheter/:ID', async function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/acheter/:ID')")
    let product = await fetch(`http://localhost/api/getproduct/${req.params.ID}`)
    let data = await product.json()

    let commentaires = await fetch(`http://localhost/api/getcomments/${req.params.ID}`)
    let comms = await commentaires.json()

    function chunkArray(arr) {
        const result = [];
        for (let i = 0; i < arr.length; i += 2) {
            result.push(arr.slice(i, i + 2));
        }
        return result;
    }

    for (let c in comms) {
        let temp = await fetch(`http://localhost/api/getuser/${comms[c].creatorID}`)
        let user = await temp.json()

        comms[c].name = user.name
    }

    res.render('product.ejs', {data: data, gallery: chunkArray(data.gallery), comms: comms})
})

app.get('/404', function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('/404')")
    res.render('404.ejs')
})

app.get('*', function (req, res) {
    console.log('\x1b[38;2;0;170;170m%s\x1b[0m', "app.get('*')")
    res.render('404.ejs')
})

try {
    let key = fs.readFileSync('../../../etc/letsencrypt/live/[domain]/privkey.pem')
    let cert = fs.readFileSync('../../../etc/letsencrypt/live/[domain]/fullchain.pem')

    https.createServer({key: key, cert: cert}, app)
        .listen(443, () => { console.log('\x1b[38;2;0;170;170m%s\x1b[0m', '✅ | HTTPS server online.\n✅ | https://localhost:443') })

    const portHttp = express()
    portHttp.get('*', function(req, res) { res.redirect(`https://${req.headers.host}${req.url}`) })
    portHttp.listen(80)

} catch { app.listen(80, () => { console.log('\x1b[38;2;255;85;85m%s\x1b[0m', '✖ | Failed to start on HTTPS. Stating on HTTP.\n✖ | http://localhost:80') }) }
