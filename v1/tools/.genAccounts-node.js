// The digit parameter is the number of accounts to create.

var user_num = 0 ;	// default 0 users
var workdir = '../' ;

for( var aai=2;aai<process.argv.length;++aai ){
	if( process.argv[aai] == '0' )		user_num = 0 ;
	else if(parseInt(process.argv[aai]))	user_num = parseInt(process.argv[aai]) ;
	else					workdir = process.argv[aai] ;
}

var autobahn ;
try {
  autobahn = require('autobahn');
} catch (e) {
}
var fs = require('fs');


console.log('Generating '+user_num+' users (realms).') ;

var f1 = fs.readFileSync( '.crossbar/config.src1.json' , 'utf-8' ) ;
var f2 = fs.readFileSync( '.crossbar/config.src2.json' , 'utf-8' ) ;

var ins_str = '' , users_str = '' , pwd_list = '' ;


for( var i=0 ; i<=user_num ; ++i ){
	var u = {
		salt : 'Kadecot'
		,realm : 'v1.'+i
		,role : 'registered_user'
		,iterations : 100
		,keylen : 16
	} ;

	var username = 'user'+i ;
	var pwd = Math.random().toString(36).slice(-8) ;

	if( i==0 )	{ username = 'guest' ; pwd = 'pass' ; }
	else 		{ users_str += ',' ; }

	u.secret = autobahn.auth_cra.derive_key(pwd , u.salt , 100 , 16 ) ;


	ins_str += f2.replace('%%%%%',i) ;

	

	users_str += '"'+username + '":'+JSON.stringify(u) ;
	pwd_list += username + ':'+pwd+"\n" ;
}

f1 = f1.replace('%%%%%',ins_str).replace('%%%WORKDIR%%%',workdir) ;


fs.writeFileSync( '.crossbar/config.json',f1 ) ;
console.log( 'New config file was written to .crossbar/config.json' ) ;

fs.writeFileSync( 'users.json' , '{'+users_str+'}' ) ;
console.log( 'Users information is stored in ./users.json' ) ;

fs.writeFileSync( 'passwords.txt' , pwd_list ) ;
console.log( 'Users login information is stored in ./passwords.txt' ) ;

