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
	    connectionString:process.env.DATABASE_URL,
	    ssl:true,
  }
});


function change_alias(alias) {
	
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim(); 
    str = str.toUpperCase();
	
    return str;
}

function compare(a, b){
	var ten_a = a.hovaten.split(' ').slice(-1).join(' ');
	var ten_b = b.hovaten.split(' ').slice(-1).join(' ');

	if (ten_a < ten_b) {
		return -1;
	}
	if (ten_a > ten_b) {
		return 1;
	}
	return 0;
}

function pushUnloop(arrObj1, arrObj2){
	var arrObj = arrObj1;
	for (var i in arrObj2){
		var flag = true;
		for (var j in arrObj1){
			if(arrObj2[i].id == arrObj1[j].id){
				flag = false;
				break;
			}
		}
		if (flag == true) {
			arrObj.push(arrObj2[i])
		}
	}
	return arrObj;
}


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
	console.log(req.body)
	res.setHeader('Content-Type', 'application/json');
	res.setHeader('Access-Control-Allow-Origin','*')

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
		
		// Query lần 1 lấy 200 kết quả chính xác nhất
		var tenkhongdau;
		var qqkhongdau;


		var queryStr = db.select('id', 'hovaten', 'quequan', 'lo', 'hang', 'mo', 'donvi', 'chucvu', 'namsinh', 'nammat').from('anhhunglietsi').where(function(){
		if (lietsi.hoten != ''){
			tenkhongdau = change_alias(lietsi.hoten)
			
			this.where('hotenkhongdau', 'like' , '%' + tenkhongdau)
		}	
		}).andWhere( function(){
			if (lietsi.nammat != ''){
				
				this.where('nammat' , 'like', '%'+lietsi.nammat+'%')
			}
		}).andWhere(function() {
			if (lietsi.namsinh != ''){
				this.where('namsinh', lietsi.namsinh)
			}
					
		}).andWhere(function() {
			if(lietsi.quequan != ''){
				qqkhongdau = change_alias(lietsi.quequan)
				this.where('quequankhongdau', 'like', '%'+qqkhongdau+'%')
			}					
		})
		.limit(200)
		console.log(queryStr.toString())

		queryStr.then(result => {
			// LỒNG: query lần 2 lấy cách kết quả liên quan

			var queryStr2 = db.select('id','hovaten', 'quequan', 'lo', 'hang', 'mo', 'donvi', 'chucvu', 'namsinh', 'nammat').from('anhhunglietsi').where(function(){
			if (lietsi.hoten != ''){			
				this.where('hotenkhongdau', 'like' , '%' + tenkhongdau + '%')
			}	
			}).andWhere( function(){
				if (lietsi.nammat != ''){
					this.where('nammat' , 'like', '%' +lietsi.nammat+'%')
				}
			}).andWhere(function() {
				if (lietsi.namsinh != ''){
					this.where('namsinh', lietsi.namsinh)
				}
						
			}).andWhere(function() {
				if(lietsi.quequan != ''){
				
				this.where('quequankhongdau', 'like', '%'+qqkhongdau+'%')
			}					
			})
			.limit(800)
		
			console.log(queryStr2.toString())
			queryStr2.then(result2 => {
				

				var result1 = result.sort(compare);
				var main_result = pushUnloop(result1, result2);

				res.send(JSON.stringify(main_result))

			})
		.catch(err => res.status(400).json('ERROR2'))
			
			
		})
		.catch(err => res.status(400).json('ERROR1'))
		
		//TIM KIEM TUONG DOI--------------------------------------

		

	} 
	//Req tìm thông tin vị trí mộ
	else if (req.query.loai == 'vitri') {
		var queryStr = db.select('id','hovaten', 'quequan', 'lo', 'hang', 'mo', 'donvi', 'chucvu', 'namsinh', 'nammat').from('anhhunglietsi').where(function() {
			if (lietsi.lo != ''){
				this.where('lo', lietsi.lo)
			}
		}).andWhere(function() {
			if (lietsi.hang != ''){
				this.where('hang', 'like', '_'+ lietsi.hang)
			}
		}).andWhere(function() {
			if (lietsi.mo != ''){
				this.where('mo', 'like', '_' + lietsi.mo)
			}
		})
		.limit(500)
		.orderBy('hovaten', 'desc')
		console.log(queryStr.toString())

		queryStr.then(result => {
			res.send(JSON.stringify(result));
					
		})
		.catch(err => res.status(400).json('ERROR'))
	}
	
	
});

//-----------------------------------------------------------------------


app.listen(process.env.PORT||8888);


























