let vox = window.vox;

export function show(id, num, size){
	num = parseInt(num);
	num = isFinite(num) ? num : 0;
	size = parseInt(size);
	size = isFinite(size) ? size : 0;

	if (window.external.showTakePhoto) {
		var params = {
			show: true,
			photoId: id,
			photoNum: num,
			photoSize: size
		};
		params = JSON.stringify(params);
		window.external.showTakePhoto(params);
	} else {
		console.log('查找不到图片上传API');
	}
}

vox.task.uploadPhotoCallback = function(result){

}