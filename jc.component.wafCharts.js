var jc=jc||{};
    jc.js=jc.js||{};
    jc.js.util=jc.js.util||{};

// require.config({
//     paths: {
//         echarts: 'http://static.08.biedese.cn/common/js/jc.components/jc.component.WafCharts'
//     }
// });
  
// 使用
	
(function(nameSpace){
	function WafCharts(){
		var _this = this;
		this.keysContainerClassName = 'keysContainer';
		this.valueContainerClassName = 'valueContainer';
		this.xClassName = 'waf_charts_x';
		this.yClassName = 'waf_charts_y';
		this.themeArr = ["default","dark","infographic","shine","vintage","macarons","roma"];
		//this.legendData = [];
		this.connected = false;
		window.waf_charts_select_x = undefined;
		window.waf_charts_select_y_left = undefined;
		window.waf_charts_select_y_right = undefined;
		window.waf_charts_select_theme = undefined;
		Array.prototype.query = function(name, value){
			for(var i = 0;i < this.length;i++){
				if(this[i][name] == value){
					return this[i]
				}
			}
		};
	};

	//获取所有字段
	WafCharts.prototype.getKeys = function(){
		var _this = this;
		var arr = [];
		$("." + _this.keysContainerClassName).find("td").each(function(i,e){
			var obj = {};
			obj.canBeX = false;
			obj.canBeY = false;
			$(e).is("." + _this.xClassName) && (obj.canBeX = true);
			$(e).is("." + _this.yClassName) && (obj.canBeY = true);
			obj.chartName = $(e).attr("waf-belong-chart")?$(e).attr("waf-belong-chart").split(","):undefined;
			obj.unit = $(e).attr("waf-chart-unit");
			obj.name = $(e).text();
			arr.push(obj);
		});
		return arr;
	};
	//获取各个字段的values
	WafCharts.prototype.getChartJson = function(){
		var _this = this;
		var data = [];
		for(var i = 0;i < _this.keysArr.length; i++){
			if(!_this.keysArr[i].name){
				continue;
			}
			var obj = {};
			obj = {};
			obj.name = _this.keysArr[i].name;
			obj.canBeX = _this.keysArr[i].canBeX;
			obj.canBeY = _this.keysArr[i].canBeY;
			obj.values = [];
			obj.chartName = _this.keysArr[i].chartName || "";
			obj.unit = _this.keysArr[i].unit || "";
			$("." + _this.valueContainerClassName).each(function(x,e){
				obj.values.push($(e).find("td").eq(i).text())
			})
			data.push(obj)
		}
		return data;
	};
	//生成wafChartsHtml
	WafCharts.prototype.initWafChartsHtml = function(){
		var str = '<center class="waf_charts_title"><hr><h2>趋势图</h2></center>';
		if(this.classifiedChartsJsonByChartName.length>0){
			for(var i = 0; i < this.classifiedChartsJsonByChartName.length; i++){
				str+='<div id="waf_charts_container_'+i+'" style="display:inline-block;width: 50%;height:300px"></div>'
			}
		}
		str += 
			'<center class="waf_charts_menu" style="margin:20px 0;"><h2>双轴图</h2>'+
			// '<label>\
			// 	开启多图对比功能\
			// 	<input '+(this.connected?'checked="true"':'')+' type="checkbox" class="waf_charts_connect" />\
			// </label>'+
			'<label style="margin-left:20px">\
				选择X轴\
				<select name="" class="waf_charts_select_x left"></select>\
			</label>\
			<label style="margin-left:20px">\
				选择Y轴-左\
				<select name="" class="waf_charts_select_y left"></select>\
			</label>\
			<label style="margin-left:20px">\
				选择Y轴-右\
				<select name="" class="waf_charts_select_y right"></select>\
			</label>\
			<label style="margin-left:20px">\
				切换主题\
				<select name="" class="waf_charts_select_theme right"></select>\
			</label></center>\
			<div id="waf_charts_container" style="display:inline-block;width: 100%;height:400px;"></div>';
		$("body").append(str);
	};
	//填充X轴、Y轴、主题选项
	WafCharts.prototype.initChartsSelect = function(){
		var _this = this;
		var strX = '';
		var strY = '';
		var strTheme = '';
		for(var i = 0; i < _this.keysArr.length; i++){
			if(_this.keysArr[i].name != ""){
				_this.keysArr[i].canBeX && (strX += "<option value='"+_this.keysArr[i].name+"'>"+_this.keysArr[i].name+"</option>")
				_this.keysArr[i].canBeY && (strY += "<option value='"+_this.keysArr[i].name+"'>"+_this.keysArr[i].name+"</option>")
			}
		};
		for(var i = 0; i < _this.themeArr.length; i++){
			strTheme += "<option value='"+_this.themeArr[i]+"''>"+_this.themeArr[i]+"</option>"
		}
		$(".waf_charts_select_x").html(strX);
		console.log(waf_charts_select_theme)
		waf_charts_select_x && $(".waf_charts_select_x").val(waf_charts_select_x)
		$(".waf_charts_select_y.left").html(strY);
		waf_charts_select_y_left && $(".waf_charts_select_y.left").val(waf_charts_select_y_left)
		$(".waf_charts_select_y.right").html(strY);
		waf_charts_select_y_right && $(".waf_charts_select_y.right").val(waf_charts_select_y_right)
		$(".waf_charts_select_theme").html(strTheme);
		waf_charts_select_theme && $(".waf_charts_select_theme").val(waf_charts_select_theme)
	};
	//根据选中的X轴,获取X轴数据
	WafCharts.prototype.getXAxisData = function(){
		var _this = this;
		var name = $(".waf_charts_select_x").val();
		var xAxisData = _this.chartsJson.query("name",name).values;
		return {
			xAxisData:xAxisData,
			name:name
		};
	};
	//根据选中的Y轴-左,获取左边Y轴数据
	WafCharts.prototype.getSeriesDataLeft = function(){
		var _this = this;
		var name = $(".waf_charts_select_y.left").val();
		var seriesData = _this.chartsJson.query("name",name).values;
		var chartName = _this.chartsJson.query("name",name).chartName;
		var unit = _this.chartsJson.query("name",name).unit;
		var isPersent = false;
		if(seriesData[0].indexOf("%")>=0){
			isPersent = true;
			seriesData = seriesData.map(function(e){
				return parseFloat(e)?parseFloat(e):0
			});
		};
		return {
			name: name,
			chartName: chartName,
			unit: unit,
			seriesData: seriesData,
			isPersent: isPersent
		};
	};
	//根据选中的Y轴-右,获取右边Y轴数据
	WafCharts.prototype.getSeriesDataRight = function(){
		var _this = this;
		var name = $(".waf_charts_select_y.right").val();
		var seriesData = _this.chartsJson.query("name",name).values;
		var chartName = _this.chartsJson.query("name",name).chartName;
		var unit = _this.chartsJson.query("name",name).unit;
		var isPersent = false;
		if(seriesData[0].indexOf("%")>=0){
			isPersent = true;
			seriesData = seriesData.map(function(e){
				return parseFloat(e)?parseFloat(e):0
			});
		};
		return {
			name: name,
			chartName: chartName,
			unit: unit,
			seriesData: seriesData,
			isPersent: isPersent
		};
	};

	WafCharts.prototype.getLegendData = function(){
		var legendData = [];
		for(var j = 0; j < this.keysArr.length; j++){
	    	this.keysArr[j].chartName !== undefined && legendData.push(this.keysArr[j].name)
	    };
	    return legendData;
	};

	//根据单位将数据分组
	WafCharts.prototype.classifyChartsJsonBychartName = function(){
		return this.chartsJson.reduce(function(a,b,c){
			if(!b.canBeY)
				return a;
			for(var i = 0; i < b.chartName.length; i++){
				var chartNameGroup = a.query("chartName",b.chartName[i]);
				if(!b.chartName[i])
					return a;
				var values = b.unit === "%" ? b.values.map(function(e){
					return parseFloat(e) ? parseFloat(e) : 0;
				}) : b.values;
				if(chartNameGroup){
					if(chartNameGroup.unit != b.unit){
						alert("error:同一个图中y轴单位必须相同");
						throw("error:同一个图中y轴单位必须相同");
					};
					chartNameGroup.data.push({
						name:b.name,
						values:values
					})
				}else{
					chartNameGroup = {};
					chartNameGroup.chartName = b.chartName[i];
					chartNameGroup.unit = b.unit;
					chartNameGroup.data = [{
						name:b.name,
						values:values
					}]
					a.push(chartNameGroup);
				}
			}
				
			return a;
		},[]);
	};
		

	//根据单位将数据分组后，生成多个echars配置项
	WafCharts.prototype.initChartsOptionBychartName = function(type){
		var _this = this;
		var optionList = [];
		var classifiedChartsJsonByChartName = this.classifiedChartsJsonByChartName;
		var xAxisData = this.getXAxisData();
		type = type || "line";
		for(var i = 0; i < classifiedChartsJsonByChartName.length; i++){
			var series = [];
			var legendData = [];
			var title = {
	            text: classifiedChartsJsonByChartName[i].chartName,
				x:'center',
				y:'-50',
				textStyle:{
				    fontSize: 18,
				    fontWeight: 'bolder',
				    color: '#333'
				}   
	        };
			var yAxis = [{
		        type : 'value',
		        axisLabel : {
		            formatter: '{value}'+classifiedChartsJsonByChartName[i].unit
		        }
		    }];
		    for(var j = 0; j < classifiedChartsJsonByChartName[i].data.length; j++){
		    	series.push({
		    		name: classifiedChartsJsonByChartName[i].data[j].name,
			        type: type,
			        data: classifiedChartsJsonByChartName[i].data[j].values,
		    	});
		    	legendData.push(classifiedChartsJsonByChartName[i].data[j].name)
		    };
		    var option = {
		    	title: title,
		        tooltip: {  
		        	trigger: 'axis',
		        	formatter: function(params) {
		        		var str = params[0].name + "<br>";
		        		for(var i = 0; i < params.length; i++){
		        			var name = params[i].seriesName;
		        			var isPersent = _this.chartsJson.query("name",name).values[0].indexOf("%")>=0;
		        			str += ("<span \
		        					style='display:inline-block;\
		        						width:10px;\
		        						height:10px;\
		        						border-radius:50%;\
		        						margin-right:5px;\
		        						background-color:"+ params[i].color
		        				+ "'></span>" 
		        				+ name  + ": " + params[i].value +  _this.chartsJson.query("name",name).unit)
		        			str += "<br>";
		        		}
		        		return str;
		        	}
		    	},
		        legend: {
		        	x:'center',
					y:'30',
		            data:legendData,
		            textStyle:{
		            	fontSize: 14,
		            	fontWeight: "bold",
		            	color: "#222"
		            }
		        },
		        grid:{
		        	x:60,
		        	y:60,
		        	x2:50,
		        	y2:60,
		        },
			    toolbox: {  
			    	x:"70%",
			    	y:'top',
			        show : true,
			        itemSize:14,
			        feature : {  
			            dataView : {show: true, readOnly: false},  
			            magicType : {show: true, type: ['line', 'bar']},  
			            restore : {show: true},  
			            saveAsImage : {show: true} 
			        }  
			    },	
		        xAxis: {
		            type : 'category',
		            boundaryGap : type!=="line",
		            data: xAxisData.xAxisData
		        },
		        yAxis: yAxis,
		        series: series
		    };
		    optionList.push(option);
		};
		return optionList;
	};

	//生成echars配置项
	WafCharts.prototype.initChartsOptionBySelect = function(){
		var _this = this;
		var xAxisData = this.getXAxisData();
		var seriesData1 = this.getSeriesDataLeft();
		var seriesData2 = this.getSeriesDataRight();
		var legendData = [seriesData1.name];
		var series = [{
	        name: seriesData1.name,
	        type: 'line',
	        data: seriesData1.seriesData,
	    }];
	    var yAxis = [{
	        type : 'value',
	        name: seriesData1.name,
	        axisLabel : {
	            formatter: '{value}'+seriesData1.unit
	        }
	    }];
		if(seriesData2.seriesData.length>0 && seriesData1.name != seriesData2.name){
			series.push({
				name: seriesData2.name,
	            type: 'line',
	            yAxisIndex: 1,
	            data: seriesData2.seriesData
			});
			legendData.push(seriesData2.name)
			yAxis.push({
				type : 'value',
	            name: seriesData2.name,
	            axisLabel : {
	                formatter: '{value}'+seriesData2.unit
	            }
	        });
		};
		// for(var i = 0; i < this.legendData.length; i++){
		// 	if(series.query('name',this.legendData[i])==undefined){
		// 		series.push({
		// 			name: this.legendData[i],
		//             type: 'line',
		//             data: []
		// 		});
		// 	}
		// };
		// 指定图表的配置项和数据
	    window.option = {
	        tooltip: {  
	        	trigger: 'axis',
	        	formatter: function(params) {
	        		var str = params[0].name + "<br>";
	        		for(var i = 0; i < params.length; i++){
	        			if(params[i].value=="-"){
	        				continue
	        			}
	        			var name = params[i].seriesName;
	        			var isPersent = _this.chartsJson.query("name",name).values[0].indexOf("%")>=0;
	        			str += ("<span \
	        					style='display:inline-block;\
	        						width:10px;\
	        						height:10px;\
	        						border-radius:50%;\
	        						margin-right:5px;\
	        						background-color:"+ params[i].color
	        				+ "'></span>" 
	        				+ name  + ": " + params[i].value +  _this.chartsJson.query("name",name).unit)
	        			str += "<br>";
	        		}
	        		return str;
	        	}
	    	},
	        grid:{
	        	x:60,
	        	y:30,
	        	x2:50,
	        	y2:60,
	        },
	        legend: {
	        	x:'center',
				y:'00',
	            data:legendData
	        },
		    toolbox: {  
		    	x:"80%",
				y:'00',
		        show : true,
		        feature : {   
		            dataView : {show: true, readOnly: false},  
		            magicType : {show: true, type: ['line', 'bar']},  
		            restore : {show: true},
					saveAsImage : {show: true} 
		        }  
		    },	
	        xAxis: {
	            type : 'category',
	            boundaryGap : false,
	            data: xAxisData.xAxisData
	        },
	        yAxis: yAxis,
	        series: series
	    };
	    return option;
	};
	//显示wafCharts
	WafCharts.prototype.showCharts = function(b){
		var option = this.initChartsOptionBySelect();
		this.myChart.clear();
	    this.myChart.setOption(option);
	    if(b)
	    	return;
		var optionList = this.initChartsOptionBychartName('line');
	    var chartsList = [this.myChart];
	    for(var i = 0; i < this.charts.length; i++){
	    	this.charts[i].clear();
	    	this.charts[i].setOption(optionList[i]);
	    	chartsList.push(this.charts[i])
	    };
		if(this.connected){
			// chartsList.forEach((e,i)=>{
			// 	e.connect(chartsList.filter((e,j)=> i!=j ))
			// })
			echarts.connect(chartsList);
		}
	};

	//设置echarts主题
	WafCharts.prototype.setTheme = function(theme){
		var _this = this;
		window.waf_charts_select_x = $(".waf_charts_select_x").val();
		window.waf_charts_select_y_left = $(".waf_charts_select_y.left").val();
		window.waf_charts_select_y_right = $(".waf_charts_select_y.right").val();
		window.waf_charts_select_theme = $(".waf_charts_select_theme").val();
		$("#waf_charts_container").remove();
		$(".waf_charts_menu").remove();
		$(".waf_charts_title").remove();
		this.myChart.clear();
		this.myChart = null;
		for(var i = 0; i < this.charts.length; i++){
			document.getElementById(this.charts[i]._dom.id).remove();
			this.charts[i].clear();
			this.charts[i]=null;
		}
		this.init(theme);
		// this.myChart.setTheme(theme);
		// for(var i = 0; i < this.charts.length; i++){
		// 	this.charts[i].setTheme(theme);
		// }
	};
	//给select绑定事件，根据选中内容改变图表
	WafCharts.prototype.bindEvents = function(){
		var _this = this;
		$(".waf_charts_select_x").on("change", function(){
			_this.showCharts.call(_this);
		});
		$(".waf_charts_select_y").on("change", function(){
			_this.showCharts.call(_this,true);
		});
		$(".waf_charts_select_theme").on("change", function(){
			var that = this;
			// require(
		 //    [
		 //        'http://echarts.baidu.com/echarts2/doc/example/theme/' + that.value
		 //    ],function(theme){
		 //    	_this.setTheme.call(_this,theme)
		 //    })
			_this.setTheme.call(_this,this.value)
		});
		$(".waf_charts_connect").on("change",this.toggleConnect.bind(this));
	};

	WafCharts.prototype.toggleConnect = function(){
		var chartsList = [this.myChart];
	    for(var i = 0; i < this.charts.length; i++){
	    	chartsList.push(this.charts[i])
	    };
		if(!this.connected){
			this.connected = true;
			echarts.connect(chartsList);
		}else{
			this.connected = false;
			echarts.disconnect(this.myChart.group);
		}
	};

	//入口
	WafCharts.prototype.init = function(theme){
		var _this = this;
		// require(
		//     [
		//         'echarts',
		//         'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
		//         'echarts/chart/line'
		//     ],
		//     function (echarts) {
		    	window.echarts = echarts;
				var theme = theme || "default";
				_this.charts = [];
				_this.keysArr = _this.keysArr || _this.getKeys();
				_this.chartsJson = _this.chartsJson || _this.getChartJson();
				//_this.legendData = _this.getLegendData();
				_this.classifiedChartsJsonByChartName = _this.classifiedChartsJsonByChartName || _this.classifyChartsJsonBychartName();
				_this.initWafChartsHtml();
				_this.initChartsSelect();
				_this.bindEvents();
				_this.myChart = echarts.init(document.getElementById('waf_charts_container'),theme);
				for(var i = 0; i < _this.classifiedChartsJsonByChartName.length; i++){
					_this['myChart'+i] = echarts.init(document.getElementById('waf_charts_container_'+i),theme);
					_this.charts.push(_this['myChart'+i]);
				}
				_this.showCharts();
				setTimeout(function (){
					window.onresize = function () {
				        _this.myChart.resize();
				        _this.charts.forEach(function(e){
				        	e.resize()
				        })
				    };
				},200);
		//     }
		// );
	};

	nameSpace.WafCharts = WafCharts;
})(window.jc.js.util);
	
