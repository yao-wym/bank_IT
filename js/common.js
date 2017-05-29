mui.plusReady(function() {

	self = plus.webview.currentWebview()
	self.addEventListener('show', function() {
		var current = self.id;
		if(['index_recive_list.html', 'index_order_list.html', 'index_check_list.html', 'index_message_sub.html', 'index_ucenter.html'].indexOf(current) >= 0) {
			var main = plus.webview.getLaunchWebview();
			console.log('show ' + current.id);
			mui.fire(main, 'init_header', {
				'title': document.getElementsByTagName('title')[0].innerText
			});
		}
	});
})
mui('body').on('tap', 'a,li,div', function(e) {
	var targetTab_url = this.getAttribute('link');
	if(!targetTab_url) {
		return;
	}
	targetTab = targetTab_url.split("?")[0];
	var params = parseQueryString(targetTab_url);
	if(targetTab != null) {
		console.log('link = ' + targetTab);
		var page = plus.webview.getWebviewById(targetTab);
		if(!page) {
			console.log('open new page ' + targetTab);
			console.log('params:' + JSON.stringify(params));
			mui.openWindow({
				url: targetTab,
				id: targetTab,
				styles: {
					top: '0px'
				},
				extras: params
			});
		} else {
			mui.fire(page, 'init_with_params', {
				'params': params
			});
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
			extras: params
		});
	} else {
		console.log('page ' + pageUrl + ' is loaded');
		mui.fire(page, 'init_with_params', {
			'params': params
		});
		page.show("slide-in-right", 300);
	}
}
bank = {
	"post": function(url, data, callback) {
		token = localStorage.getItem('token') ? localStorage.getItem('token') : '402848eb5bf02279015bf0369a73001';
		console.log('token=' + token);
		data['token'] = token;
		if(!data['uid']) {
			data['uid'] = localStorage.getItem('uid');
		}
		if(!data['account']) {
			data['account'] = localStorage.getItem('account') ? localStorage.getItem('account') : "402848eb5bf02279015bf0369a730017";
		}
		if(!data['sid']) {
			data['sid'] = '1232eds';
		}
		url=url+"?token="+token+"&account="+token+"&sid="+data['sid']
		console.log("body="+data['body']);
		console.log("url="+url);
		mui.ajax({
			url: url,
			type: 'post',
			data: data,
			dataType: 'json',
			success: function(res) {
				console.log('current page = ' + self.id + ' response=' + JSON.stringify(res));
				if(res.code == "A00001") {
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
	"get": function(url, params, callback) {
		console.log(url);
		token = localStorage.getItem('token') ? localStorage.getItem('token') : '402848eb5bf02279015bf0369a73001';

		params['token'] = token;
		if(!params['account']) {
			params['account'] = localStorage.getItem('account') ? localStorage.getItem('account') : "402848eb5bf02279015bf0369a730017";
		}
		if(!params['sid']) {
			params['sid'] = '1232eds';
		}
		console.log('current page = ' + self.id + ' getParams=' + JSON.stringify(params));
		mui.ajax({
			url: url,
			type: 'GET',
			data: params,
			dataType: 'json',
			success: function(res) {
				console.log('current page = ' + self.id + ' data=' + JSON.stringify(res));
				if(res.code == 'A00001') {
					if(callback) {
						callback(res.data);
					}
				} else {
					mui.toast(res.msg);
				}
			},
			error: function() {

				mui.toast('网络错误');
			},
			complete: function() {
				//				if(mui('#refreshContainer')!=undefined) {
				//					console.log(mui('#refreshContainer'));
				//					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
				//					mui('#refreshContainer').pullRefresh().endPullupToRefresh();
				//				}
			}

		})
	}
}

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

function parseQueryString(url) {
	var reg_url = /^[^\?]+\?([\w\W]+)$/,
		reg_para = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
		arr_url = reg_url.exec(url),
		ret = {};
	if(arr_url && arr_url[1]) {
		var str_para = arr_url[1],
			result;
		while((result = reg_para.exec(str_para)) != null) {
			ret[result[1]] = result[2];
		}
	}
	return ret;
}

function parseTimeStamp(timeStamp) {
	var date = new Date(timeStamp*1);
	Y = date.getFullYear() + '-';
	M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	D = date.getDate() + ' ';
	h = date.getHours() < 10 ? '0' + date.getHours()+ ':' : date.getHours() + ':'; 
	m =  date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
	return Y+M+D+h+m;
}