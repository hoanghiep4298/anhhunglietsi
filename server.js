const express = require("express");
const bodyParser = require("body-parser")
const knex = require("knex")
// app.use(express.static("puclic"));
// app.set("view engine", 	"html");
// app.set("views", "./views")
//app.use(bodyParser.json());
const app = express();
app.listen(8888);

const db = knex({
	client: 'pg',
  	connection: {
    host : '127.0.0.1',
    port: 5000,
    user : 'postgres',
    password : 'admin',
    database : 'anhhunglietsi'
  }
});
// var knex = require('knex')({
//   client: 'pg',
//   //version: '7.2',
//   connection: {
//     host : '127.0.0.1',
//     user : 'admin',
//     password : 'admin',
//     database : 'anhhunglietsi'
//   }
// });


//const db = knex()
app.get('/', (req, res) => {
	res.send("hello")
	
});

// function replaceAt(string, index, replace) {
//   return string.substring(0, index) + replace + string.substring(index + 1);
// }

// function titleCase(str) { // hàm in hoa chữ cái đầu mỗi từ
//   var convertToArray = str.toLowerCase().split(' ');
//   var result = ''
//   for (var i = 0; i < convertToArray.length; i++ ){
//   	result += replaceAt(convertToArray[i], 0, convertToArray[i][0].toUpperCase());
//   	if (i+1 < convertToArray.length) {
//   		result += ' '
//   	}
//   }
  
//   return result;
// }

app.get('/timkiem', function(req, res) {
	//console.log(req.body)

	const lietsi = {
		hoten: req.query.hovaten,
		namsinh: req.query.namsinh,
		nammat: req.query.nammat,
		quequan: req.query.quequan,
		lo: req.query.lo,
		hang: req.query.hang,
		mo: req.query.mo


	}

	console.log(req.query)


	if (lietsi.hoten != '') {
		lietsi.hoten = lietsi.hoten.toUpperCase();
	}
	if (lietsi.quequan != ''){
		lietsi.quequan = lietsi.quequan.toUpperCase();
	}
	if (lietsi.lo != ''){
		lietsi.lo = lietsi.lo.toUpperCase();
	}
	if (lietsi.hang != ''){
		lietsi.hang = lietsi.hang.toUpperCase();
	}
	if (lietsi.mo != ''){
		lietsi.mo = lietsi.mo.toUpperCase()
	}
	
	
	// Req tìm thông tin cá nhân liet si
	if(req.query.loai == 'thongtin') {

	// Truy vấn: Nếu có nhập dữ liệu mơi thực hiện truy vấn
		var queryStr = db.select('*').from('anhhunglietsi').where(function(){
			if (lietsi.hovaten != ''){
				this.where('hovaten', 'like' , '%' + lietsi.hoten)
			}	
		}).andWhere( function(){
			if (lietsi.nammat != ''){
				this.where('nammat' , '%'+lietsi.nammat+'%')
			}
		}).andWhere(function() {
			if (lietsi.namsinh != ''){
				this.where('namsinh', lietsi.namsinh)
			}
					
		}).andWhere(function() {
			if(lietsi.quequan != ''){
				this.where('quequan', lietsi.quequan)
			}					
		})
		.limit(50)
		// OderBy
		if(lietsi.hoten != '' && lietsi.namsinh == ''){
			queryStr.orderBy('namsinh', 'asc');
		} else {
			queryStr.orderBy('hovaten', 'asc');
		} 

		queryStr.then(result => {
			res.send(JSON.stringify(result))
			console.log(result)		

		})
		.catch(err => res.status(400).json('Wrong credentials'))
	} 
	//Req tìm thông tin vị trí mộ
	else if (req.query.loai == 'vitri') {
		db.select('*').from('anhhunglietsi').where(function() {
			if (lietsi.lo != ''){
				this.where('lo', lietsi.lo)
			}
		}).andWhere(function() {
			if (lietsi.hang != ''){
				this.where('hang', lietsi.hang)
			}
		}).andWhere(function() {
			if (lietsi.mo != ''){
				this.where('mo', lietsi.mo)
			}
		})
		.limit(50)
		.orderBy('hovaten', 'desc')
		.then(result => {
			res.send(JSON.stringify(result));
			console.log(result)		
		})
		.catch(err => res.status(400).json('Wrong credentials'))
	}
	
	
});




