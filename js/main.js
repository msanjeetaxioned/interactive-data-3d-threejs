const wrapperInteractiveData = document.querySelector(".interactive-data-section > .wrapper");
const canvasContainer = wrapperInteractiveData.querySelector(".canvas-container");

const prevGraphButton = canvasContainer.querySelector(".previous-button");
const nextGraphButton = canvasContainer.querySelector(".next-button");

const graphNamesUl = canvasContainer.querySelector(".graph-names");
const graphNamesLis = graphNamesUl.querySelectorAll("li");
// const graphNameH3 = changeGraphButtonsDiv.querySelector(".graph-info > h3");
// const graphNumSpan = changeGraphButtonsDiv.querySelector(".graph-info > span");

let canvas;

// Setting up Scene, Camera & Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth * 0.85, window.innerHeight * 1.5);
canvasContainer.insertBefore(renderer.domElement, canvasContainer.children[0]);
canvas = wrapperInteractiveData.querySelector("canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, (window.innerWidth * 0.85) / (window.innerHeight * 1.5) , 1, 1000);

const holder = new THREE.Group();
scene.add(holder);

let movementX = 0,
	currentMovementX = 1,
	mouseXCanvas = 0,
	timer1,
	timer2,
	rotations = [-360, -180, -90, 90, 180, 360];

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

const options = {threshold: 0.5};

const handleIntersect = (entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			calculateBarsHeightAndAddThemInScene();
			observer.unobserve(entry.target);
		}
	});
}

const observer = new IntersectionObserver(handleIntersect, options);
observer.observe(canvas);

// const axesHelper = new THREE.AxesHelper(15);
// holder.add(axesHelper);

// const orbit = new THREE.OrbitControls(camera, renderer.domElement);

const light = new THREE.AmbientLight(0xffffff, 0.5); // dim white light
holder.add(light);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(1, 0, 0);
scene.add(directionalLight1);

const graphs = [
	[0.9, 7.8, 22.5, 50.3, 18.5],
	[2.4, 18, 31.4, 38, 10.4],
	[0.1, 10, 22.2, 48, 19.6],
	[1.1, 16.9, 30.4, 41, 10.6],
	[0.7, 10.5, 28.2, 48.4, 12.2],
	[0.4, 5.9, 17.8, 57.6, 18.3]
];
let firstTime = true;
let currentGraph = 3;

let bars = [];
let barsHeight = [];

let valuesAppended = false;

const calculateBarsHeightAndAddThemInScene = (prevGraphNum) => {
	// Cubes
	const graph = graphs[currentGraph - 1];
	const barColors = [0x7fff00, 0x8a2be2, 0x8b0000, 0xffd700, 0x008080];
	const barMaxHeight = 15;
	let xPos = -12;
	let maxValue = graph[0];

	for (let i = 1; i < graph.length; i++) {
		if (graph[i] > maxValue) {
			maxValue = graph[i];
		}
	}

	if (firstTime) {
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
			bars[i] = new THREE.Mesh(geometryBar, materialBar);
			bars[i].position.x = xPos;
			bars[i].rotation.y = Math.PI / 4;
			console.log(bars[i]);
			holder.add(bars[i]);
			xPos = xPos + 6;
		}
		const timer = setTimeout(() => {
			clearTimeout(timer);
			appendValuesToGraph();
		}, 500);
		firstTime = false;
	} else {
		for (let i = 0; i < graph.length; i++) {
			const currentBarHeight = graph[i] / maxValue * barMaxHeight;
			barsHeight[i] = currentBarHeight;
			let newY;

			if (prevGraphNum == undefined) {
				newY = barsHeight[i] / 0.1 * bars[i].scale.y;
				gsap.to(bars[i].scale, {y: newY, duration: 2, ease: "power2.out"});
			} else {
				const prevGraphArr = graphs[prevGraphNum - 1];
				newY = graph[i] / prevGraphArr[i] * bars[i].scale.y;
				gsap.to(bars[i].scale, {y: newY, duration: 1.5, ease: "power2.out"});
			}
		}
	}
}

const changeGraphNameWithSlideAnimation = (prevGraph) => {
	graphNamesLis[prevGraph - 1].classList.remove("active");
	graphNamesLis[currentGraph - 1].classList.add("active");
	let graphNamesX = [];
	for (let i = 0; i < graphNamesLis.length; i++) {
		if (i > 0) {
			graphNamesX[i] = graphNamesLis[i-1].offsetLeft - graphNamesLis[i].offsetLeft;
		}
	}
	let x = "-100%";
	for (let j = 0; j < graphNamesLis.length; j++) {
		if (j > 0) {
			x = graphNamesX[j];
		}
		const tween = gsap.to(graphNamesLis[j], {x: x, duration: 1});
		if (j == (graphNamesLis.length - 1)) {
			const timer = setTimeout(() => {
				clearTimeout(timer);
				graphNamesUl.append(graphNamesUl.children[0]);
			}, 1100)
		}
	}
}

const prevOrNextButtonClick = (prevOrNext) => {
	console.log("prevOrNextButtonClick");
	const prevGraph = currentGraph;
	if (currentGraph == graphs.length && prevOrNext == 1) {
		currentGraph = 1;
	} else if (currentGraph == 1 && prevOrNext == -1) {
		currentGraph = graphs.length;
	}
	else {
		currentGraph += prevOrNext;
	}
	if (prevOrNext == 1) {
		changeGraphNameWithSlideAnimation(prevGraph);
	}
	calculateBarsHeightAndAddThemInScene(prevGraph);
	// graphNameH3.innerText = graphNames[currentGraph - 1];
	// graphNumSpan.innerText = currentGraph + " of " + graphs.length;
}

prevGraphButton.addEventListener("click", prevOrNextButtonClick.bind(this, -1));
nextGraphButton.addEventListener("click", prevOrNextButtonClick.bind(this, 1));

calculateBarsHeightAndAddThemInScene();

camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.position.y = 0;
camera.position.z = 55;
// orbit.update();

let rotationTl = [], currentRotationSpeedAndDirectionOfBars = [];
for (let i = 0; i < bars.length; i++) {
	currentRotationSpeedAndDirectionOfBars[i] = 0;
	rotationTl[i] = gsap.timeline();
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

const scale = (number, inMin, inMax, outMin, outMax) => {
	return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

const canvasDistanceFromTop = window.pageYOffset + canvas.getBoundingClientRect().top;
const canvasVisibleMin =  canvasDistanceFromTop - window.innerHeight;
const canvasVisibleMax = canvasVisibleMin + canvas.getBoundingClientRect().height;
let currentWindowY = undefined;

// Sets Vertical rotation of bars based on scroll position 
const setRotationAngleOfBarsBasedOnScrollPosition = () => {
	let windowY;
	if (currentWindowY != undefined) {
		windowY = currentWindowY;
	} else {
		windowY = undefined;
	}
	currentWindowY = window.scrollY - canvasVisibleMin;

	if (currentWindowY != windowY && windowY != undefined) {
		if (currentWindowY >= 0 && currentWindowY <= canvasVisibleMax) {
			const percent = Math.round(currentWindowY / canvasVisibleMax * 100);
			if (percent >= 25 && percent <= 90) {
				camera.position.y = scale(percent, 25, 90, 18, -9);
				camera.lookAt(0, 0, 0);
			}
		}
	}
}

// For tilting graph based on left-right position of mouse cursor
const tiltGraphBasedOnMouseXPosition = () => {
	const percent = Math.round(mouseXCanvas / canvas.getBoundingClientRect().width * 100);
	// Tilts graph by 4 degrees both directions based on mouse x position
	holder.rotation.y = scale(percent, 0, 100, 0.06981317, -0.06981317);
}

function appendValuesToGraph() {
	if(!valuesAppended) {
		for (let i = 0; i < bars.length; i++) {
			valuesAppended = true;
			const vector = new THREE.Vector3(bars[i].position.x - bars[i].geometry.parameters.width / 2, bars[i].position.y + barsHeight[i], bars[i].position.z);
			vector.project(camera);
			vector.x = (vector.x + 1) * canvas.getBoundingClientRect().width / 2;
			vector.y =  - (vector.y - 1) * canvas.getBoundingClientRect().height / 2;
	
			let x = vector.x;
			let y = vector.y - 70;
	
			const span = document.createElement("span");
			span.classList.add("graph-value");
			span.innerText = graphs[currentGraph - 1][i] + "%";
			span.style.top = y + "px";
			span.style.left = x + "px";
			canvasContainer.append(span);
		}
	}
}

const animate = () => {
	requestAnimationFrame(animate);
	raycaster.setFromCamera(mouse, camera);

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects(holder.children);

	if (intersects.length == 2) {
		for (let i = 0; i < bars.length; i++) {
			if (bars[i].uuid == intersects[0].object.uuid) {
				rotateBar(bars[i], rotationTl[i], currentRotationSpeedAndDirectionOfBars[i]);
			}
		}
	}
	setRotationAngleOfBarsBasedOnScrollPosition();
	tiltGraphBasedOnMouseXPosition();
	renderer.render(scene, camera);
}
animate();