var globalfunction = {
	loaded : false,
	setCookies : function (cookie_name, value){
					var Days = 30; //此 cookie 将被保存 30 天
					var exp  = new Date();
					exp.setTime(exp.getTime() + Days*24*60*60*1000);
				//	var str ="{v1:'"+value+"',v2:'v2'}";//v1 v2 两个值 多个值接格式写
					document.cookie = cookie_name+"=" + escape(value) + ";expires=" + exp.toGMTString();//value 就是下面的cookie_name
				},
	getCookies : function(cookie_name){
					var allcookies = document.cookie;
					var value = "";
					var cookie_pos = allcookies.indexOf(cookie_name); 
				//	alert(cookie_pos);
					if (cookie_pos != -1){
						// 把cookie_pos放在值的开始，只要给值加1即可。
						cookie_pos += cookie_name.length + 1;   
						var cookie_end = allcookies.indexOf(";", cookie_pos);    
						if (cookie_end == -1){  
							cookie_end = allcookies.length;
						}  
						value = unescape(allcookies.substring(cookie_pos, cookie_end));
					}
					return value;
				},
	string2json : function(string){
					return eval("(" + string + ")");
				},
	print_r : function(obj){
					if(typeof obj == "string"){
						console.log(obj);
					}else{
						for(i in obj){
							console.log(i + ":" + obj[i]);
						}	
					}
				},
	obj2string : function(obj){
					var str = "{";
					for(i in obj){
						str += '"'+i+'"' +':"'+ obj[i] + '",';
					}
					str = str.substr(0, str.length-1);
					str += "}";
					return str;
				},
	objArray2string : function(array){
					if(array.length > 0){
						var str = "[";
						for(var i = 0; i<array.length; i++){
							str += this.obj2string(array[i])+",";
						}
						str = str.substr(0, str.length-1);
						str += "]";
						return str;
					}else{
						return "";
					}
				},
	getById : function(id){
					return document.getElementById(id);
				},
	etoggle : function(id){
				var obj = this.getById(id);
				obj.style.display = obj.style.display == "none" ? "block" : "none";
			}
}