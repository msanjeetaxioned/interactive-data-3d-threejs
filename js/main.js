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
	[0.9, 7.8, 22.5, 50.3, 18.5],
	[2.4, 18, 31.4, 38, 10.4],
	[0.1, 10, 22.2, 48, 19.6],
	[1.1, 16.9, 30.4, 41, 10.6],
	[0.7, 10.5, 28.2, 48.4, 12.2],
	[0.4, 5.9, 17.8, 57.6, 18.3]
];
const graph1XValuesNames = ["< 10", "10 - 20", "20 - 30", "30 - 40", "40+"];
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

const graphXNames = ["design", "engineering", "product", "writing", "marketing", "social"];
const graphXValues = [3, 2, 3, 3, 4, 4];

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
	let xPos = -12;
	let maxValue = graph[0];

	for (let i = 1; i < graph.length; i++) {
		if (graph[i] > maxValue) {
			maxValue = graph[i];
		}
	}

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
			xPos = xPos + 6;
			
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
			span.innerText = Math.round(counterValue * 100) / 100 + "%";
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
	const vector = new THREE.Vector3(graph1Bars[i].position.x - 1.7, yPos, graph1Bars[i].position.z);
	vector.project(graph1Camera);
	vector.x = (vector.x + 1) * graph1Canvas.getBoundingClientRect().width / 2;
	vector.y =  - (vector.y - 1) * graph1Canvas.getBoundingClientRect().height / 2;
	const x = vector.x;

	const vector2 = new THREE.Vector3(graph1Bars[i].position.x + 1.7, yPos, graph1Bars[i].position.z);
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
		span.innerText = workLifeGraphs[graph1CurrentGraph - 1][i] + "%";
		span.classList.add("graph1-value");
		span.classList.add("graph1-value-" + (i+1));
		span.style.top = obj.y + "px";
		span.style.left = obj.x + "px";
		graph1CanvasContainer.append(span);

		const xDiffBy2 = (span.getBoundingClientRect().width - graph1BarWidth) / 2;
		if (xDiffBy2 < 0 && xDiffBy2 != -Infinity) {
			span.style.left = (span.offsetLeft - xDiffBy2) + "px";
		}

		span.innerText = 0 + "%";
	} else {
		let prevValue;
		if (span.getAttribute("data-counter-value")) {
			prevValue = span.getAttribute("data-counter-value");
			span.innerText = workLifeGraphs[graph1CurrentGraph - 1][i] + "%";
			span.style.left = obj.x + "px";
			const xDiffBy2 = (span.getBoundingClientRect().width - graph1BarWidth) / 2;
			if (xDiffBy2 < 0 && xDiffBy2 != -Infinity) {
				span.style.left = (span.offsetLeft - xDiffBy2) + "px";
			}
			span.innerText = prevValue + "%";
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
	let xPos = -17.5;
	let maxValue = graphXValues[0];
	let individualBarHeight;

	for (let i = 1; i < graphXValues.length; i++) {
		if (graphXValues[i] > maxValue) {
			maxValue = graphXValues[i];
		}
	}

	individualBarHeight = barMaxHeight / maxValue;

	for (let i = 0; i < graphXNames.length; i++) {
		bars[i] = [];
		for (let j = 0; j < graphXValues[i]; j++) {
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

			if (i == (graphXNames.length - 1) && j == (graphXValues[i] - 1)) {
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

class SpheresInteraction {
	canvasContainer;
	canvas;
	renderer;
	scene;
	camera;
	holder;
	raycaster;
	mouse;
	movementX;
	movementY;
	mouseXCanvas;
	light;
	data;
	titles;
	sphere;
	currentInteractionNum;

	constructor() {
		this.canvasContainer = document.querySelector(".spheres-section .canvas-container");
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.renderer.setSize(document.body.clientWidth * 0.85, window.innerHeight * 1.5);
		this.canvasContainer.insertBefore(this.renderer.domElement, this.canvasContainer.children[0]);
		this.canvas = this.canvasContainer.querySelector("canvas");
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(45, (document.body.clientWidth * 0.85) / (window.innerHeight * 1.5) , 1, 1000);
		this.holder = new THREE.Group();
		this.scene.add(this.holder);
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();

		this.canvas.addEventListener("mousemove", this.onMouseMove, false);
		this.canvas.addEventListener("sphereadded", this.addSphereModelToHolder, false);

		this.light = new THREE.AmbientLight(0xffffff, 1);
		this.light.position.z = 5;
		this.holder.add(this.light);

		this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		this.directionalLight.position.set(0, 0, 5);
		this.holder.add(this.directionalLight);

		this.data = [
			[{"name": "native", "value": 2.8}, {"name": "kanban", "value": 12.8}, {"name": "mobile", "value": 15.7}, {"name": "sass", "value": 3}, {"name": "scrum", "value": 20.6}, {"name": "management", "value": 3.7}, {"name": "agile", "value": 24.9}, {"name": "waterfall", "value": 4.5}, {"name": "apps", "value": 1.9}],
			[{"name": "editing", "value": 1.3}, {"name": "content", "value": 3.5}, {"name": "social media", "value": 5.7}, {"name": "email", "value": 1.4}, {"name": "copywriting", "value": 7.9}, {"name": "landing pages", "value": 1.7}, {"name": "advertising", "value": 2}, {"name": "blogging", "value": 12.6}],
			[{"name": "facebook", "value": 5.6}, {"name": "email", "value": 3.2}, {"name": "strategy", "value": 3.6}, {"name": "content", "value": 5.9}, {"name": "adwords", "value": 4.2}, {"name": "growth", "value": 3}, {"name": "ads", "value": 3}, {"name": "social media", "value": 9}, {"name": "product", "value": 4.9}],
			[{"name": "content creation", "value": 9.1}, {"name": "design", "value": 2.1}, {"name": "twitter", "value": 9.6}, {"name": "pinterest", "value": 2.2}, {"name": "video", "value": 2.2}, {"name": "facebook", "value": 9.9}, {"name": "management", "value": 2.1}, {"name": "instagram", "value": 14.4}, {"name": "linkedin", "value": 4}],
			[{"name": "branding", "value": 6.1}, {"name": "print", "value": 2.7}, {"name": "graphic design", "value": 3.3}, {"name": "web", "value": 6.6}, {"name": "mobile", "value": 3.7}, {"name": "ui", "value": 9.1}, {"name": "illustration", "value": 1.6}, {"name": "ux", "value": 9.5}, {"name": "product", "value": 4.4}],
			[{"name": "java", "value": 2.5}, {"name": "angularjs", "value": 5.2}, {"name": "node", "value": 9.1}, {"name": "vue", "value": 2.6}, {"name": "typescript", "value": 2.9}, {"name": "javascript", "value": 10.5}, {"name": "laravel", "value": 2.5}, {"name": "react", "value": 14}, {"name": "python", "value": 3.8}]
		];

		this.titles = ["product", "writing", "marketing", "social", "design", "engineering"];

		this.currentInteractionNum = 3;

		this.sphere = new Sphere(this.canvas, this.data[this.currentInteractionNum - 1][0]);
		this.camera.position.z = 20;
	}

	onMouseMove = (event) => {
		this.movementX =  event.movementX;
		this.movementY = event.movementY;
		const rect = event.target.getBoundingClientRect();
	
		this.mouseXCanvas = event.clientX - rect.left;
		const mouseYCanvas = event.clientY - rect.top;
	
		this.mouse.x = (this.mouseXCanvas / rect.width) * 2 - 1;
		this.mouse.y = -(mouseYCanvas / rect.height) * 2 + 1;
	}

	addSphereModelToHolder = () => {
		this.holder.add(this.sphere.model);
	}

	// For tilting graph based on left-right position of mouse cursor
	tiltInteractionBasedOnMouseXPosition = () => {
		const percent = Math.round(this.mouseXCanvas / this.canvas.getBoundingClientRect().width * 100);
		// Tilts graph by 4 degrees both directions based on mouse x position
		const newY = scale(percent, 0, 100, 0.06981317, -0.06981317);
		if (this.holder.rotation.y != newY) {
			this.holder.rotation.y = newY;
		}
	}

	calculateIntersections = () => {
		this.raycaster.setFromCamera(this.mouse, this.camera);
		// calculate objects intersecting the picking ray
		const intersects = this.raycaster.intersectObjects(this.holder.children);
		if (intersects.length == 1) {
			console.log("x: " + this.movementX);
			console.log("y: " + this.movementY);
		}
		this.renderer.render(this.scene, this.camera);
	}
}

class Sphere {
	color;
	loader;
	dracoLoader;
	model;
	name;
	value;

	constructor(canvas, data) {
		this.name = data.name;
		this.value = data.value;

		this.loader = new THREE.GLTFLoader();

		this.dracoLoader = new THREE.DRACOLoader();
		this.dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.142.0/examples/js/libs/draco/gltf/');
		this.loader.setDRACOLoader(this.dracoLoader);

		this.loader.load(
			'models/sphere.gltf',
			(gltf) => {
				this.model = gltf.scene;
				if (this.model.children[0].children[3] instanceof THREE.Mesh)
					this.model.children[0].children[3].material.color.setHex(0xe31c79);

				this.model.scale.x = 0.02;
				this.model.scale.y = 0.02;
				this.model.scale.z = 0.02;

				const event = new Event("sphereadded");
				canvas.dispatchEvent(event);
			},
			(xhr) => {
				// console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
			},
			(error) => {
				console.log(error)
			}
		);
	}
}

const spheresInteraction = new SpheresInteraction();

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

	// Interaction 3
	// spheresInteraction.tiltInteractionBasedOnMouseXPosition();
	spheresInteraction.calculateIntersections();
}
animate();