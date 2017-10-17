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
            downloadForJS(strs[0] + ".jpg");
        }
    };
}

function downloadForJS(fileName) {
    //使用html2canvas 转换html为canvas
    html2canvas($('#lable'), {
        allowTaint: true, taintTest: false,
        onrendered: function (canvas) {
        canvas.id = "mycanvas";
            var imgUri = canvas.toDataURL("image/jpg"); // 获取生成的图片的url 　
            var saveLink = document.createElement('a');
            saveLink.href = imgUri;
            saveLink.download = fileName;
            saveLink.click();
        }
    });
}