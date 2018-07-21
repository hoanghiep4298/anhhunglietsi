const express = require("express");
const bodyParser = require("body-parser")
const knex = require("knex")
const app = express();
//app.use(express.static("puclic"));
app.set("view engine", 	"ejs");
app.set("views", "./views")
app.use(express.static(__dirname + '/public'));
//app.use(bodyParser.json());

//app.listen(8888);


// query: express-engiate
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



app.get("/print/:id", function(req, res){

	var i = req.params.id;
	//res.render('printing', {hoten:});
	console.log(i)
	db.select('*').from('anhhunglietsi').where('id', i)
	.then(result => {
			
			//console.log(lietsi.hovaten)
			console.log(result[0].hovaten)
			res.render('printing',{result:result[0]} )

	})
	.catch(err => res.status(400).json('Wrong credentials'))



})


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
	 res.setHeader('Content-Type', 'application/json');
 	 res.setHeader('Access-Control-Allow-Origin', '*');
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

	// Truy vấn: Nếu có nhập dữ liệu mơi thực hiện truy vấn     .count('id as totalpage')
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
		.limit(200)
		// OderBy
		if(lietsi.hoten != '' && lietsi.namsinh == ''){
			queryStr.orderBy('namsinh', 'asc');
		} else {
			queryStr.orderBy('hovaten', 'asc');
		} 

		console.log(queryStr.toString())

		queryStr.then(result => {
			res.send(JSON.stringify(result))
	

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
		.limit(200)
		.orderBy('hovaten', 'desc')
		.then(result => {
			res.send(JSON.stringify(result));
			//console.log(result)		
		})
		.catch(err => res.status(400).json('Wrong credentials'))
	}
	
	
});

//-----------------------------------------------------------------------








app.listen(8888);


























