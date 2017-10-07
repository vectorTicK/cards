# 利用html、javascript批量制作标签并保存为图像
> 开发背景：公司要给每个人的衣柜上贴上标签，标签内容为一张背景图片，里面显示了姓名、地址、电话等信息。之前的做法是用ps做好模版后，给每个人挨个修改信息，完成标签制作。人少还好，耽误不了多少功夫，但现在要给好几百号人做标签，工作量着实不小，每个人挨着去改，很费时间。正好最近在学web前端，学了点html、css、js的皮毛，想通过实践来强化提高。于是，考虑利用网页读取本地数据批量生成标签图片，然后保存到本地。
### 关键技术
* 读取本地数据
* 将网页元素保存为本地图像

### 具体实现
### 1. 网页布局 
 因为只考虑功能实现，具体网页布局非常简单，仅仅一个单一div包含一个img元素，也就是我们标签制作好的背景模版图像，和我们需要批量修改的几个文本元素，利用CSS的定位，将其布局在背景的合适位置。
``` html
<div id="lable" class="info">
    <img style="width:400px; height:250px" src="images/card.png" />
    <div class="name">
        <span id="name">XXX</span>
    </div>
    <div class="phone">
        <span id="phone_number">18608831183</span>
    </div>
    <div class="tel">
        <span id="tel_number">0123-1234567</span>
    </div>
    <div class="email">
        <span id="email">XXXX@XX.com</span>
    </div>
</div> 
```
### 2. 利用js读取本地数据
为了简单考虑，数据使用文本文档存储，每一行为一条数据，每条数据里的不同自动用制表符分隔，如：
```
data.txt
小明  18512344321 qq@123.com
```
在解决读取本地数据这个问题上走了不少弯路。
刚开始各种百度goolge，发现浏览器读取本地数据的方法基本都是利用
```ActiveXObject```这一古老的对象，而且还只能在低版本的IE中实现。
刚开始硬着头皮上，虽然能读数据了，但这一方法只能读unicode、assic、ansi这三种编码格式的文本，而自己坚持使用utf-8，导致乱码问题始终解决不了。
最后都想放弃了，突然搜到html5原生支持读取本地文件，瞬间解脱。
* 具体方法
``` javascript
function openfile() {
	var selectedFile = document.getElementById("files").files[0];//获取读取的File对象
	var name = selectedFile.name;//读取选中文件的文件名
	var size = selectedFile.size;//读取选中文件的大小
	console.log("文件名:" + name + "大小：" + size);

	var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
	reader.readAsText(selectedFile);//读取文件的内容

	reader.onload = function () {
		console.log(this.result);//当读取完成之后会回调这个函数，然后此时文件的内容存储到了result中。直接操作即可。
		s = this.result;
		console.log(s);
		infos = s.split("\n"); //字符分割
		for (var i = 0; i < infos.length; i++) {
			strs = infos[i].split(/\t/g);
			document.getElementById("name").innerHTML = strs[0];
			document.getElementById("phone_number").innerHTML = strs[1];
			document.getElementById("tel_number").innerHTML = strs[2];
			document.getElementById("email").innerHTML = strs[3];
			downloadForJS(strs[0] + ".jpg");
		}
	};
}
```
上面的代码就是打开一个文本文件、读取数据、修改网页上对应元素数据。还有一点，使用此方法，需要在html文件添加```file```元素用于选择本地文件
``` html
<input type="file" id="files" onchange="openfile()" />
```
```downloadForJS()```函数是保存html为图片，下面会具体讲。
### 3. 保存网页元素为图像

代码实现完全是百度后 拿来主义了,主要是用了html2canvas这个库，需要自行下载。里面具体实现的一些参数每太研究具体是干什么的，试了可以用就没管了。
``` javascript
function downloadForJS(fileName) {
	//使用html2canvas 转换html为canvas
	html2canvas($('#lable'), { allowTaint: true, taintTest: false,
onrendered: function(canvas) { canvas.id = "mycanvas";
		var imgUri = canvas.toDataURL("image/jpg"); // 获取生成的图片的url 　
		var saveLink = document.createElement('a');
		saveLink.href = imgUri;
		saveLink.download = fileName;
		saveLink.click();

	}});
}
```
还有一个关键问题，上面这段代码如果是直接用浏览器打开本地html文件，是不能完整的保存下网页元素的，比如img就不会保存下来。必须建一个web服务器访问功能就正常了。

至此，整个功能就实现了。 vscode
