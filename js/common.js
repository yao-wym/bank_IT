self = plus.webview.currentWebview()
self.addEventListener('show', function() {
	var current = self.id;
	if(['index_recive.html', 'index_order.html', 'index_check.html', 'index_message.html', 'index_ucenter.html'].indexOf(current) >= 0) {
		var main = plus.webview.getLaunchWebview();
		console.log('show ' + current.id);
		mui.fire(main, 'init_header', {
			'title': document.getElementsByTagName('title')[0].innerText
		});
	}
});
mui('body').on('tap', 'a,li,div', function(e) {
	var targetTab_url = this.getAttribute('link');
	if(!targetTab_url){
		return;
	}
	targetTab = targetTab_url.split("?")[0];
	var params = parseQueryString(targetTab_url);
	if(targetTab != null) {
		console.log('link = ' + targetTab);
		var page = plus.webview.getWebviewById(targetTab);
		if(!page) {
			console.log('open new page ' + targetTab);
			mui.openWindow({
				url: targetTab,
				id: targetTab,
				styles: {
					top: '0px'
				},
				extras:params
			});
		} else {
			console.log('page ' + targetTab + ' is loaded');
			page.show("slide-in-right", 300);
		}
	}
	return true;
});

function redirect(pageFullUrl) {
	console.log('link = ' + pageFullUrl);
	pageUrl = pageFullUrl.split("?")[0];
	var params = parseQueryString(pageFullUrl);
	var page = plus.webview.getWebviewById(pageUrl);
	if(!page) {
		console.log('open new page ' + pageUrl);
		mui.openWindow({
			url: pageUrl,
			id: pageUrl,
			styles: {
				top: '0px'
			},
			extras:params
		});
	} else {
		console.log('page ' + pageUrl + ' is loaded');
		page.show("slide-in-right", 300);
	}
}
bank = {
	"post":function(url, data, callback) {
		mui.ajax({
			url: url,
			type: 'post',
			data: data,
			dataType: 'json',
			success: function(res) {
				if(res.code == 200) {
					if(callback) {
						callback(res.data);
					}
				} else {
					mui.toast(res.msg);
				}
			},
			error: function() {
				mui.toast('网络错误');
			}
		})
	},
	"get":function(url, params, callback) {
		mui.ajax({
			url: url,
			type: 'get',
			data: params,
			dataType: 'json',
			success: function(res) {
				if(res.code == 200) {
					if(callback) {
						callback(res.data);
					}
				} else {
					mui.toast(res.msg);
				}
			},
			error: function() {
				mui.toast('网络错误');
			}
		})
	}
}

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
function parseQueryString(url) {
 var reg_url = /^[^\?]+\?([\w\W]+)$/,
  reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
  arr_url = reg_url.exec(url),
  ret = {};
 if (arr_url && arr_url[1]) {
  var str_para = arr_url[1], result;
  while ((result = reg_para.exec(str_para)) != null) {
   ret[result[1]] = result[2];
  }
 }
 return ret;
}