//***************************
//        FUNCTIONS
//***************************

//--------------------
//  Math functions
//--------------------

//generates a random number between 0 (inclusive) and the chosen number (exclusive).
export function random(integer){
	var  rNumber = Math.random() * integer;
	return rNumber;
}

//generates a random integer between 0 (inclusive) and the chosen integer (inclusive).
export function irandom_inc(integer){
	var  rNumber = Math.floor(Math.random() * (integer+1));
	return rNumber;
}

//generates a random integer between 0 (inclusive) and the chosen integer (exclusive).
export function irandom(integer){
	var  rNumber = Math.floor(Math.random() * integer);
	return rNumber;
}

//generates a random integer between int1 (inclusive) and int2 (inclusive).
export function irandom_range(int1,int2){
	if(int1 > int2) return "The 1st number needs to be smaller than the 2nd";
	var diff = int2-int1+1 //*
	var rNumber = Math.floor(Math.random() * diff)+ int1; //**
	return rNumber;
}

//generates a random integer between int1 (inclusive) and int2 (inclusive) and gives it a random sign (+,-)
export function random_sign(int1,int2){
	var diff = int2-int1+1;
	var rNumber = Math.floor(Math.random() * diff)+ int1;
	if(random(1)){
		return rNumber;
	} else {
		return -rNumber;
	}
}

//distance between 2 points //need to check that this function works properly.
export function distance(x1,y1,x2,y2){
	var dis;
	dis = Math.sqrt(Math.pow((x2-x1),2)+Math.pow((y2-y1),2));
	return dis;
}

//-----------------------
//   Other functions
//-----------------------


//easily draw text to the screen
export function draw_text(ctx,string,x,y){
	ctx.fillStyle = "black";
	ctx.font = "30px Arial";
	ctx.fillText(string,x,y);
}

//track mouse position
export function track_mouse(event){
	mouse_x = event.clientX;
	mouse_y = event.clientY;
}

//remove element from array
export function remElFromArr(arr, el) {
	for(let i = arr.length - 1; i >= 0; i--) {
		if(arr[i] === el) {
			arr.splice(i,1);
		}
	}
}

//heuristic
export function heuristic(a, b) {
	const d = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
	return d;
}

// export function heuristic(a, b) {
// 	const d = Math.sqrt((a.x - b.x)**2 + (a.y - b.y)**2);
// 	return d;
// }

//-------------------