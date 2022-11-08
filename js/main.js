const wrapperWorkLife = document.querySelector(".work-life-balance-graph-section > .wrapper");
const graph1CanvasContainer = wrapperWorkLife.querySelector(".canvas-container");

const prevGraphButton = graph1CanvasContainer.querySelector(".previous-button");
const nextGraphButton = graph1CanvasContainer.querySelector(".next-button");

const graphNamesUl = graph1CanvasContainer.querySelector(".graph1-names");
const graphNamesLis = graphNamesUl.querySelectorAll("li");

let graph1Canvas;

// Setting up Scene, Camera & Renderer
const graph1Renderer = new THREE.WebGLRenderer({antialias: true});
graph1Renderer.setSize(document.body.clientWidth * 0.85, window.innerHeight * 1.5);
graph1CanvasContainer.insertBefore(graph1Renderer.domElement, graph1CanvasContainer.children[0]);
graph1Canvas = wrapperWorkLife.querySelector("canvas");

const graph1Scene = new THREE.Scene();
var graph1Camera = new THREE.PerspectiveCamera(45, (document.body.clientWidth * 0.85) / (window.innerHeight * 1.5) , 1, 1000);

const graph1Holder = new THREE.Group();
graph1Scene.add(graph1Holder);

let graph1MovementX = 0,
	graph1CurrentMovementX = 1,
	graph1MouseXCanvas = 0,
	graph1Timer1,
	graph1Timer2,
	rotations = [-360, -180, -90, 90, 180, 360];

const graph1Raycaster = new THREE.Raycaster();
const graph1Mouse = new THREE.Vector2();

const graph1OnMouseMove = (event) => {
	graph1MovementX =  event.movementX;
	const rect = event.target.getBoundingClientRect();

	graph1MouseXCanvas = event.clientX - rect.left;
	const mouseYCanvas = event.clientY - rect.top;

	graph1Mouse.x = (graph1MouseXCanvas / rect.width) * 2 - 1;
	graph1Mouse.y = -(mouseYCanvas / rect.height) * 2 + 1;
}
	
graph1Canvas.addEventListener('mousemove', graph1OnMouseMove, false);

const options = {threshold: 0.3};

const handleIntersect = (entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			graph1CalculateBarsHeightAndAddThemInScene();
			observer.unobserve(entry.target);
		}
	});
}

const observer = new IntersectionObserver(handleIntersect, options);
observer.observe(graph1Canvas);

// const graph1AxesHelper = new THREE.AxesHelper(15);
// graph1Holder.add(graph1AxesHelper);

// const graph1Orbit = new THREE.OrbitControls(graph1Camera, graph1Renderer.domElement);

const graph1Light = new THREE.AmbientLight(0xffffff, 0.5); // dim white light
graph1Holder.add(graph1Light);

const graph1DirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
graph1DirectionalLight.position.set(1, 0, 0);
graph1Scene.add(graph1DirectionalLight);

const workLifeGraphs = [
	[8, 8, 8, 10, 7],
	[8, 8, 8, 8, 8],
	[10, 10, 10, 10, 8],
	[9, 9, 9, 9, 8],
	[9, 8, 9, 9, 9],
	[9, 9, 9, 9, 10]
];
const graph1XValuesNames = ["communication", "quality", "timeliness", "partnership", "pricing"];
let graph1FirstTime = true;
let graph1CurrentGraph = 3;

let graph1Bars = [];
let graph1BarsHeight = [];

let graph1ValuesAppended = false;
let graph1XValuesAppended = false;

const wrapperProjectByNumbers = document.querySelector(".project-by-numbers-section > .wrapper");
const canvasContainer = wrapperProjectByNumbers.querySelector(".canvas-container");

let canvas;

// Setting up Scene, Camera & Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(document.body.clientWidth * 0.85, window.innerHeight * 1.5);
renderer.setClearColor(0xffffff, 0);

canvasContainer.insertBefore(renderer.domElement, canvasContainer.children[0]);
canvas = wrapperProjectByNumbers.querySelector("canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, (document.body.clientWidth * 0.85) / (window.innerHeight * 1.5) , 1, 1000);

const holder = new THREE.Group();
scene.add(holder);

let movementX = 0,
	currentMovementX = 1,
	mouseXCanvas = 0,
	timer1,
	timer2;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onMouseMove = (event) => {
	movementX =  event.movementX;
	const rect = event.target.getBoundingClientRect();

	mouseXCanvas = event.clientX - rect.left;
	const mouseYCanvas = event.clientY - rect.top;

	mouse.x = (mouseXCanvas / rect.width) * 2 - 1;
	mouse.y = -(mouseYCanvas / rect.height) * 2 + 1;
}
	
canvas.addEventListener('mousemove', onMouseMove, false);

// const handleIntersect = (entries) => {
// 	entries.forEach(entry => {
// 		if (entry.isIntersecting) {
// 			observer.unobserve(entry.target);
// 		}
// 	});
// }

// const observer = new IntersectionObserver(handleIntersect, options);
// observer.observe(canvas);

// const axesHelper = new THREE.AxesHelper(15);
// holder.add(axesHelper);

// const orbit = new THREE.OrbitControls(camera, renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 0.5); // dim white light
holder.add(light);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(1, 0, 0);
scene.add(directionalLight1);

const graphXNames = ["JavaScript", "HTML", "CSS", "jQuery", "React", "WordPress"];
const graphXValues = [41, 36, 36, 30, 22, 16];

let firstTime = true;

let bars = [];
let barsHeight = [];

const enableOrDisablePrevAndNextButtons = (enable) => {
	if (enable) {
		prevGraphButton.removeAttribute("disabled");
		nextGraphButton.removeAttribute("disabled");
		prevGraphButton.setAttribute("title", "Previous");
		nextGraphButton.setAttribute("title", "Next");
	} else {
		prevGraphButton.setAttribute("disabled", "");
		nextGraphButton.setAttribute("disabled", "");
		prevGraphButton.setAttribute("title", "Disabled");
		nextGraphButton.setAttribute("title", "Disabled");
	}
}

const graph1CalculateBarsHeightAndAddThemInScene = (prevGraphNum) => {
	// Cubes
	const graph = workLifeGraphs[graph1CurrentGraph - 1];
	const barColors = [0x7fff00, 0x8a2be2, 0x8b0000, 0xffd700, 0x008080];
	const barMaxHeight = 15;
	let xPos = -16;
	let maxValue = 10;

	if (graph1FirstTime) {
		for (let i = 0; i < graph.length; i++) {
			const geometryBar = new THREE.BoxGeometry(2.5, 0.1, 2.5);
			geometryBar.translate( 0, 0.1 / 2, 0 );
			const materialBar = new THREE.MeshPhongMaterial({
				color: barColors[i],
				emissive: 0x000000,
				specular: 0x111111,
				shininess: 100,
				reflectivity: 1,
				refractionRatio: 0.98,
				combine: THREE.MultiplyOperation,
				side: THREE.DoubleSide
			});
			graph1Bars[i] = new THREE.Mesh(geometryBar, materialBar);
			graph1Bars[i].position.x = xPos;
			graph1Bars[i].rotation.y = Math.PI / 4;
			graph1Holder.add(graph1Bars[i]);
			xPos = xPos + 8;
			
			if (!graph1ValuesAppended) {
				if (i == (graph.length - 1)) {
					graph1ValuesAppended = true;
				}
				let timer = setTimeout(() => {
					clearTimeout(timer);
					appendOrUpdateValuesInGraph(i);
				}, 50);
			}
		}
		graph1FirstTime = false;
	} else {
		if (!graph1XValuesAppended) {
			graph1XValuesAppended = true;
			graph1AppendGraphXValues();
		}
		for (let i = 0; i < graph.length; i++) {
			const currentBarHeight = graph[i] / maxValue * barMaxHeight;
			graph1BarsHeight[i] = currentBarHeight;
			let newY;

			enableOrDisablePrevAndNextButtons(false);
			if (prevGraphNum == undefined) {
				newY = graph1BarsHeight[i] / 0.1 * graph1Bars[i].scale.y;
				playCounterAnimation(".graph1-value-" + (i+1), workLifeGraphs[graph1CurrentGraph - 1][i], 2000);
				gsap.to(graph1Bars[i].scale, {
					y: newY, 
					duration: 2, 
					ease: "power2.out", 
					onUpdate: () => {
						updatePositionOfGraphValues(i);
					},
					onComplete: () => {
						enableOrDisablePrevAndNextButtons(true);
					}
				});
			} else {
				appendOrUpdateValuesInGraph(i);
				const prevGraphArr = workLifeGraphs[prevGraphNum - 1];
				newY = graph[i] / prevGraphArr[i] * graph1Bars[i].scale.y;
				playCounterAnimation(".graph1-value-" + (i+1), workLifeGraphs[graph1CurrentGraph - 1][i], 1600);
				gsap.to(graph1Bars[i].scale, {
					y: newY, 
					duration: 1.6, 
					ease: "power2.out", 
					onUpdate: () => {
						updatePositionOfGraphValues(i);
					},
					onComplete: () => {
						enableOrDisablePrevAndNextButtons(true);
					}});
			}
		}
	}
}

// Changes graph name with animation when next or previous button is clicked
const changeGraphNameWithSlideAnimation = (prevSlideNum, currentSlideNum, prevOrNext) => {
	const prevGraph = graphNamesLis[prevSlideNum - 1];
	const currentGraph = graphNamesLis[currentSlideNum - 1];

	prevGraph.classList.remove("active");
	currentGraph.classList.add("active");

	if (prevOrNext == 1) {
		graphNamesUl.scroll({
			left: prevGraph.getBoundingClientRect().left,
			behavior: "smooth"
		});
		const timer = setTimeout(() => {
			clearTimeout(timer);
			graphNamesUl.append(graphNamesUl.children[0]);
			graphNamesUl.scroll({
				left: 0
			});
		}, 500);
	} else {
		graphNamesUl.insertBefore(graphNamesUl.children[graphNamesLis.length - 1], graphNamesUl.children[0]);
		graphNamesUl.scroll({
			left: graphNamesLis[1].getBoundingClientRect().left
		});
		graphNamesUl.scroll({
			left: 0,
			behavior: "smooth"
		});
	}
}

const prevOrNextButtonClick = (prevOrNext) => {
	graph1ValuesAppended = false;
	const prevGraph = graph1CurrentGraph;
	if (graph1CurrentGraph == workLifeGraphs.length && prevOrNext == 1) {
		graph1CurrentGraph = 1;
	} else if (graph1CurrentGraph == 1 && prevOrNext == -1) {
		graph1CurrentGraph = workLifeGraphs.length;
	} else {
		graph1CurrentGraph += prevOrNext;
	}
	changeGraphNameWithSlideAnimation(prevGraph, graph1CurrentGraph, prevOrNext);
	graph1CalculateBarsHeightAndAddThemInScene(prevGraph);
}

prevGraphButton.addEventListener("click", prevOrNextButtonClick.bind(this, -1));
nextGraphButton.addEventListener("click", prevOrNextButtonClick.bind(this, 1));

graph1CalculateBarsHeightAndAddThemInScene();

graph1Camera.lookAt(new THREE.Vector3(0, 0, 0));
graph1Camera.position.y = 0;
graph1Camera.position.z = 55;
// graph1Orbit.update();

let graph1RotationTl = [], graph1CurrentRotationSpeedAndDirectionOfBars = [];
for (let i = 0; i < graph1Bars.length; i++) {
	graph1CurrentRotationSpeedAndDirectionOfBars[i] = 0;
	graph1RotationTl[i] = gsap.timeline();
}

const graph1RotateBar = (cube, currentBarTL, currentBarRotation) => {
	if (!currentBarTL.isActive() && graph1MovementX != graph1CurrentMovementX) {
		graph1CurrentMovementX = graph1MovementX;
		if (graph1CurrentMovementX < -25) {
			currentBarRotation = rotations[0];
			// rotate bar -(360 + 30) degrees ie. -390 degrees
			currentBarTL.to(cube.rotation, {y: "-=6.806784083", ease: "none", duration: 1})
			// rotate back the extra 30 degrees added previously for getting the effect on site
				.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
		} else if (graph1CurrentMovementX < -15) {
			currentBarRotation = rotations[1];
			// rotate bar -(180 + 30) degrees ie. -210 degrees
			currentBarTL.to(cube.rotation, {y: "-=3.66519143", ease: "none", duration: 0.75})
				.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
		} else if (graph1CurrentMovementX < 0) {
			if (currentBarRotation == rotations[2]) {
				if (!graph1Timer1) {
					graph1Timer1 = setTimeout(() => {
						clearTimeout(graph1Timer1);
						// rotate bar -(90 + 30) degrees ie. -120 degrees
						currentBarTL.to(cube.rotation, {y: "-=2.094395103", ease: "none", duration: 0.5})
							.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
					}, 500);
				}
			} else {
				currentBarRotation = rotations[2];
				currentBarTL.to(cube.rotation, {y: "-=2.094395103", ease: "none", duration: 0.5})
					.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
			}
		} else if (graph1CurrentMovementX == 0) {
			currentBarTL.clear();
		} else if (graph1CurrentMovementX <= 15) {
			if (currentBarRotation == rotations[3]) {
				if (!graph1Timer2) {
					graph1Timer2 = setTimeout(() => {
						clearTimeout(graph1Timer2);
						currentBarTL.to(cube.rotation, {y: "+=2.094395103", ease: "none", duration: 0.5})
							.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
					}, 500);
				}
			} else {
				currentBarRotation = rotations[3];
				currentBarTL.to(cube.rotation, {y: "+=2.094395103", ease: "none", duration: 0.5})
					.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
			}
		} else if (graph1CurrentMovementX <= 25) {
			currentBarRotation = rotations[4];
			currentBarTL.to(cube.rotation, {y: "+=3.66519143", ease: "none", duration: 0.75})
				.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
		} else {
			currentBarRotation = rotations[5];
			currentBarTL.to(cube.rotation, {y: "+=6.806784083", ease: "none", duration: 1})
				.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
		}
	}
}

const scale = (number, inMin, inMax, outMin, outMax) => {
	return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const graph1CanvasDistanceFromTop = window.pageYOffset + graph1Canvas.getBoundingClientRect().top;
const graph1CanvasVisibleMin =  graph1CanvasDistanceFromTop - window.innerHeight;
const graph1CanvasHeight = graph1Canvas.getBoundingClientRect().height;
const graph1CanvasVisibleMax = graph1CanvasVisibleMin + graph1CanvasHeight;
let graph1CurrentWindowY = undefined;

// Sets Vertical rotation of bars based on scroll position 
const setRotationAngleOfBarsBasedOnScrollPosition = () => {
	let windowY;
	if (graph1CurrentWindowY != undefined) {
		windowY = graph1CurrentWindowY;
	} else {
		windowY = undefined;
	}
	graph1CurrentWindowY = window.scrollY - graph1CanvasVisibleMin;

	if (graph1CurrentWindowY != windowY && windowY != undefined) {
		if (graph1CurrentWindowY >= 0 && graph1CurrentWindowY <= graph1CanvasHeight) {
			const percent = Math.round(graph1CurrentWindowY / graph1CanvasHeight * 100);
			if (percent >= 25 && percent <= 90) {
				graph1Camera.position.y = scale(percent, 25, 90, 15, -2);
				graph1Camera.lookAt(0, 0, 0);
			}
		}
	}
}

// For tilting graph based on left-right position of mouse cursor
const tiltGraphBasedOnMouseXPosition = (canvas, mouseXCanvas, holder) => {
	const percent = Math.round(mouseXCanvas / canvas.getBoundingClientRect().width * 100);
	// Tilts graph by 4 degrees both directions based on mouse x position
	const newY = scale(percent, 0, 100, 0.06981317, -0.06981317);
	if (holder.rotation.y != newY) {
		holder.rotation.y = newY;
	}
}

// Starts counter increment/decrement animation from previous to new value
const playCounterAnimation = (spanClassName, counterMaxValue, counterDuration) => {
	const span = graph1CanvasContainer.querySelector(spanClassName);
	let counterMinValue = 0;
	if (span.getAttribute("data-counter-value")) {
		counterMinValue = parseFloat(span.getAttribute("data-counter-value"));
	}

	const timerInterval = 40;
	const step = counterDuration / timerInterval;

	let counterIncrement;
	let counterValue = counterMinValue;

	counterIncrement = parseFloat(( counterMaxValue - counterMinValue) / step);

	let i = 1; 
	const interval = setInterval(() => {
		if (i <= step) {
			counterValue += counterIncrement;
			span.innerText = Math.round(counterValue * 100) / 100;
			++i;
		} else {
			span.setAttribute("data-counter-value", counterMaxValue);
			clearInterval(interval);
		}
	}, timerInterval);
}

let graph1BarWidth;
// Calculates & returns html coordinates of a given bar of graph
function graph1CalculateCoordinatesOfBarInCanvas(i, yPos, appendToTopOrBottom = "top") {
	const vector = new THREE.Vector3(graph1Bars[i].position.x - 1.8, yPos, graph1Bars[i].position.z);
	vector.project(graph1Camera);
	vector.x = (vector.x + 1) * graph1Canvas.getBoundingClientRect().width / 2;
	vector.y =  - (vector.y - 1) * graph1Canvas.getBoundingClientRect().height / 2;
	const x = vector.x;

	const vector2 = new THREE.Vector3(graph1Bars[i].position.x + 1.8, yPos, graph1Bars[i].position.z);
	vector2.project(graph1Camera);
	vector2.x = (vector2.x + 1) * graph1Canvas.getBoundingClientRect().width / 2;
	const x2 = vector2.x;

	graph1BarWidth = x2 - x;

	let y;
	if (appendToTopOrBottom == "top") {
		y = vector.y - 70;
	} else if (appendToTopOrBottom == "bottom") {
		y = vector.y + 50;
	}
	return {x, y};
}

// appends the graph values (Written as Normal function as it needs to get hoisted)
function appendOrUpdateValuesInGraph(i) {
	const obj = graph1CalculateCoordinatesOfBarInCanvas(i, graph1Bars[i].position.y + 0.1);

	let span = graph1CanvasContainer.querySelector(".graph1-value-" + (i+1));
	if (!span) {
		span = document.createElement("span");
	}
	
	if (!graph1CanvasContainer.querySelector(".graph1-value-" + (i+1))) {
		span.innerText = workLifeGraphs[graph1CurrentGraph - 1][i];
		span.classList.add("graph1-value");
		span.classList.add("graph1-value-" + (i+1));
		span.style.top = obj.y + "px";
		span.style.left = obj.x + "px";
		graph1CanvasContainer.append(span);

		const xDiffBy2 = (span.getBoundingClientRect().width - graph1BarWidth) / 2;
		if (xDiffBy2 < 0 && xDiffBy2 != -Infinity) {
			span.style.left = (span.offsetLeft - xDiffBy2) + "px";
		}

		span.innerText = 0;
	} else {
		let prevValue;
		if (span.getAttribute("data-counter-value")) {
			prevValue = span.getAttribute("data-counter-value");
			span.innerText = workLifeGraphs[graph1CurrentGraph - 1][i];
			span.style.left = obj.x + "px";
			const xDiffBy2 = (span.getBoundingClientRect().width - graph1BarWidth) / 2;
			if (xDiffBy2 < 0 && xDiffBy2 != -Infinity) {
				span.style.left = (span.offsetLeft - xDiffBy2) + "px";
			}
			span.innerText = prevValue;
		}
	}
}

// Updates y-position of appended percent graph values when bar size changes
const updatePositionOfGraphValues = (i) => {
	const obj = graph1CalculateCoordinatesOfBarInCanvas(i, graph1Bars[i].position.y + graph1Bars[i].scale.y * 0.1);

	let span = graph1CanvasContainer.querySelector(".graph1-value-" + (i+1));
	span.style.top = obj.y + "px";
}

// Appends values of x-axis of the graph at proper position
function graph1AppendGraphXValues() {
	for (let i = 0; i < graph1XValuesNames.length; i++) {
		const obj = graph1CalculateCoordinatesOfBarInCanvas(i, graph1Bars[i].position.y, "bottom");

		const span = document.createElement("span");
		span.classList.add("graph1-x-name");
		span.innerText = graph1XValuesNames[i];
		span.style.left = obj.x + "px";
		span.style.top = obj.y + "px";

		graph1CanvasContainer.append(span);

		if (!isNaN(graph1BarWidth) && graph1BarWidth != Infinity && graph1BarWidth != -Infinity) {
			const xDiffBy2 = (span.getBoundingClientRect().width - graph1BarWidth) / 2;
			span.style.left = (span.offsetLeft - xDiffBy2) + "px";
		}
	}
}

const calculateBarsHeightAndAddThemInScene = () => {
	// Cubes
	const barColor = 0xe31c79;
	const topAndBotFaceColor = 0xf39ec6;
	const barMaxHeight = 15;
	const maxBars = 5;
	let xPos = -17.5;
	let maxValue = graphXValues[0];
	let individualBarHeight;
	let numOfBars = [];

	for (let i = 1; i < graphXValues.length; i++) {
		if (graphXValues[i] > maxValue) {
			maxValue = graphXValues[i];
		}
	}

	for (let i = 0; i < graphXValues.length; i++) {
		numOfBars[i] = Math.round(graphXValues[i] / maxValue * maxBars); 
	}

	individualBarHeight = barMaxHeight / maxBars;

	for (let i = 0; i < graphXNames.length; i++) {
		bars[i] = [];
		for (let j = 0; j < numOfBars[i]; j++) {
			const geometryBar = new THREE.BoxGeometry(2.5, individualBarHeight, 2.5).toNonIndexed();
			geometryBar.translate( 0, individualBarHeight / 2, 0 );
			const materialBar = new THREE.MeshPhongMaterial({
				emissive: 0x000000,
				specular: 0x111111,
				shininess: 100,
				reflectivity: 1,
				refractionRatio: 0.98,
				combine: THREE.MultiplyOperation,
				side: THREE.DoubleSide,
				vertexColors: true
			});
			const positionAttribute = geometryBar.getAttribute('position');
			const color = new THREE.Color();
			geometryBar.setAttribute('color', new THREE.BufferAttribute(new Float32Array(positionAttribute.count * 3), 3));
			const vertexColor = geometryBar.getAttribute('color');

			const botFace = { min: 18, max: 24 };
			const topFace = { min: 12, max: 18 };
			for (let i = 0; i < positionAttribute.count; i++) {
				if ((i >= botFace.min && i < botFace.max) || (i >= topFace.min && i < topFace.max)) {
					color.setHex(topAndBotFaceColor);
				} else {
					color.setHex(barColor);
				}
				vertexColor.setXYZ(i, color.r, color.g, color.b);
			}

			bars[i][j] = new THREE.Mesh(geometryBar, materialBar);
			bars[i][j].position.x = xPos;
			
			if (j == 0 ) {
				bars[i][j].position.y = 0;
			} else {
				bars[i][j].position.y = (individualBarHeight + 0.1) * j;
			}

			bars[i][j].rotation.y = Math.PI / 4;
			holder.add(bars[i][j]);

			if (i == (graphXNames.length - 1) && j == (numOfBars[i] - 1)) {
				const timer = setTimeout(() => {
					clearTimeout(timer);
					appendGraphXValues();
				}, 400);
			}
		}
		xPos = xPos + 7;
	}
}

calculateBarsHeightAndAddThemInScene();

camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.position.y = 0;
camera.position.z = 60;
// orbit.update();

let rotationTl = [], currentRotationSpeedAndDirectionOfBars = [];
for (let i = 0; i < bars.length; i++) {
	currentRotationSpeedAndDirectionOfBars[i] = [];
	rotationTl[i] = [];
	for (let j = 0; j < bars[i].length; j++) {
		currentRotationSpeedAndDirectionOfBars[i][j] = 0;
		rotationTl[i][j] = gsap.timeline();
	}
}

const rotateBar = (cube, currentBarTL, currentBarRotation) => {
	if (!currentBarTL.isActive() && movementX != currentMovementX) {
		currentMovementX = movementX;
		if (currentMovementX < -25) {
			currentBarRotation = rotations[0];
			// rotate bar -(360 + 30) degrees ie. -390 degrees
			currentBarTL.to(cube.rotation, {y: "-=6.806784083", ease: "none", duration: 1})
			// rotate back the extra 30 degrees added previously for getting the effect on site
				.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
		} else if (currentMovementX < -15) {
			currentBarRotation = rotations[1];
			// rotate bar -(180 + 30) degrees ie. -210 degrees
			currentBarTL.to(cube.rotation, {y: "-=3.66519143", ease: "none", duration: 0.75})
				.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
		} else if (currentMovementX < 0) {
			if (currentBarRotation == rotations[2]) {
				if (!timer1) {
					timer1 = setTimeout(() => {
						clearTimeout(timer1);
						// rotate bar -(90 + 30) degrees ie. -120 degrees
						currentBarTL.to(cube.rotation, {y: "-=2.094395103", ease: "none", duration: 0.5})
							.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
					}, 500);
				}
			} else {
				currentBarRotation = rotations[2];
				currentBarTL.to(cube.rotation, {y: "-=2.094395103", ease: "none", duration: 0.5})
					.to(cube.rotation, {y: "+=0.523598776", ease: "none", duration: 0.5});
			}
		} else if (currentMovementX == 0) {
			currentBarTL.clear();
		} else if (currentMovementX <= 15) {
			if (currentBarRotation == rotations[3]) {
				if (!timer2) {
					timer2 = setTimeout(() => {
						clearTimeout(timer2);
						currentBarTL.to(cube.rotation, {y: "+=2.094395103", ease: "none", duration: 0.5})
							.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
					}, 500);
				}
			} else {
				currentBarRotation = rotations[3];
				currentBarTL.to(cube.rotation, {y: "+=2.094395103", ease: "none", duration: 0.5})
					.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
			}
		} else if (currentMovementX <= 25) {
			currentBarRotation = rotations[4];
			currentBarTL.to(cube.rotation, {y: "+=3.66519143", ease: "none", duration: 0.75})
				.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
		} else {
			currentBarRotation = rotations[5];
			currentBarTL.to(cube.rotation, {y: "+=6.806784083", ease: "none", duration: 1})
				.to(cube.rotation, {y: "-=0.523598776", ease: "none", duration: 0.5});
		}
	}
}

const canvasDistanceFromTop = window.pageYOffset + canvas.getBoundingClientRect().top;
const canvasVisibleMin =  canvasDistanceFromTop - window.innerHeight;
const canvasHeight = canvas.getBoundingClientRect().height;
const canvasVisibleMax = canvasVisibleMin + canvasHeight;
let currentWindowY = undefined;

// Sets Vertical rotation of bars based on scroll position 
const graph2SetRotationAngleOfBarsBasedOnScrollPosition = () => {
	let windowY;
	if (currentWindowY != undefined) {
		windowY = currentWindowY;
	} else {
		windowY = undefined;
	}
	currentWindowY = window.scrollY - canvasVisibleMin;

	if (currentWindowY != windowY && windowY != undefined) {
		if (currentWindowY >= 0 && currentWindowY <= canvasHeight) {
			const percent = Math.round(currentWindowY / canvasHeight * 100);
			if (percent >= 25 && percent <= 90) {
				camera.position.y = scale(percent, 25, 90, 18, -8);
				camera.lookAt(0, 0, 0);
			}
		}
	}
}

let barWidthInHTMLCordinates;

// Calculates & returns html coordinates of a given bar of graph
function calculateCoordinatesOfBarInCanvas(i, yPos, appendToTopOrBottom = "top") {
	const vector = new THREE.Vector3(bars[i][0].position.x - 1.7, yPos, bars[i][0].position.z);

	vector.project(camera);
	vector.x = (vector.x + 1) * canvas.getBoundingClientRect().width / 2;
	vector.y =  - (vector.y - 1) * canvas.getBoundingClientRect().height / 2;

	const x = vector.x;

	if (!barWidthInHTMLCordinates) {
		const vector2 = new THREE.Vector3(bars[i][0].position.x + 1.7, yPos, bars[i][0].position.z);
		vector2.project(camera);
		vector2.x = (vector2.x + 1) * canvas.getBoundingClientRect().width / 2;
		const x2 = vector2.x;
		barWidthInHTMLCordinates = x2 - x;
	}

	let y;
	if (appendToTopOrBottom == "top") {
		y = vector.y - 70;
	} else if (appendToTopOrBottom == "bottom") {
		y = vector.y + 50;
	}
	return {x, y};
}

// Appends values of x-axis of the graph at proper position
const appendGraphXValues = () => {
	for (let i = 0; i < graphXNames.length; i++) {
		const obj = calculateCoordinatesOfBarInCanvas(i, bars[i][0].position.y, "bottom");

		const div = document.createElement("div");
		div.classList.add("graph2-x");
		div.style.left = obj.x + "px";
		div.style.top = obj.y + "px";

		const span1 = document.createElement("span");
		span1.classList.add("graph-x-name");
		span1.innerText = graphXNames[i];
		div.append(span1);

		const span2 = document.createElement("span");
		span2.classList.add("graph-x-value");
		span2.innerText = graphXValues[i];
		div.append(span2);

		canvasContainer.append(div);

		const xDiffBy2 = (div.getBoundingClientRect().width - barWidthInHTMLCordinates) / 2;
		div.style.left = (div.offsetLeft - xDiffBy2) + "px";
	}
}

const calculateMinorSectionsMargins = () => {
	const minorSections = document.querySelectorAll(".minor-section");

	if (document.body.clientWidth > 1329) {
		const margin = scale(document.body.clientWidth, 1330, 2560, -200, -600);
		for (let i = 0; i < minorSections.length; i++) {
			minorSections[i].style.marginTop = margin + "px";
		}
	}
}
calculateMinorSectionsMargins();

const animate = () => {
	requestAnimationFrame(animate);
	graph1Raycaster.setFromCamera(graph1Mouse, graph1Camera);
	// calculate objects intersecting the picking ray
	const graph1Intersects = graph1Raycaster.intersectObjects(graph1Holder.children);
	if (graph1Intersects.length == 2) {
		for (let i = 0; i < graph1Bars.length; i++) {
			if (graph1Bars[i].uuid == graph1Intersects[0].object.uuid) {
				graph1RotateBar(graph1Bars[i], graph1RotationTl[i], graph1CurrentRotationSpeedAndDirectionOfBars[i]);
			}
		}
	}
	setRotationAngleOfBarsBasedOnScrollPosition();
	tiltGraphBasedOnMouseXPosition(graph1Canvas, graph1MouseXCanvas, graph1Holder);
	graph1Renderer.render(graph1Scene, graph1Camera);

	raycaster.setFromCamera(mouse, camera);
	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects(holder.children);
	if (intersects.length == 2) {
		for (let i = 0; i < bars.length; i++) {
			for (let j = 0; j < bars[i].length; j++) {
				if (bars[i][j].uuid == intersects[0].object.uuid) {
					rotateBar(bars[i][j], rotationTl[i][j], currentRotationSpeedAndDirectionOfBars[i][j]);
				}
			}
		}
	}
	graph2SetRotationAngleOfBarsBasedOnScrollPosition();
	tiltGraphBasedOnMouseXPosition(canvas, mouseXCanvas, holder);
	renderer.render(scene, camera);
}
animate();